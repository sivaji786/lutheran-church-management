<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;
use App\Models\MemberModel;

class Members extends BaseController
{
    use ResponseTrait;

    public function index()
    {
        $model = new MemberModel();
        
        $page = $this->request->getVar('page') ?? 1;
        $limit = $this->request->getVar('limit') ?? 20;
        $search = $this->request->getVar('search');
        $memberStatus = $this->request->getVar('memberStatus');
        $sortBy = $this->request->getVar('sortBy') ?? 'created_at';
        $sortOrder = $this->request->getVar('sortOrder') ?? 'desc';

        // file_put_contents(WRITEPATH . 'logs/debug_filters.log', json_encode($this->request->getGet()) . "\n", FILE_APPEND);

        $builder = $model->builder();

        if ($search) {
            $builder->groupStart()
                ->like('name', $search)
                ->orLike('member_code', $search)
                ->orLike('mobile', $search)
                ->orLike('member_serial_num', $search)
                ->groupEnd();
        }

        if ($memberStatus && $memberStatus !== 'all') {
            $builder->where('member_status', $memberStatus);
        }

        $baptismStatus = $this->request->getVar('baptismStatus');
        if ($baptismStatus !== null && $baptismStatus !== 'all') {
            $builder->where('baptism_status', $baptismStatus === 'yes' ? 1 : 0);
        }

        $confirmationStatus = $this->request->getVar('confirmationStatus');
        if ($confirmationStatus !== null && $confirmationStatus !== 'all') {
            $builder->where('confirmation_status', $confirmationStatus === 'confirmed' ? 1 : 0);
            // When filtering by confirmation, exclude suspended members unless specifically requested
            if ($memberStatus !== 'suspended') {
                $builder->groupStart()
                        ->where('member_status !=', 'suspended')
                        ->orWhere('member_status', null)
                        ->groupEnd();
            }
        }

        $maritalStatus = $this->request->getVar('maritalStatus');
        if ($maritalStatus !== null && $maritalStatus !== 'all') {
            $builder->where('marital_status', $maritalStatus === 'married' ? 1 : 0);
        }

        $residentialStatus = $this->request->getVar('residentialStatus');
        if ($residentialStatus !== null && $residentialStatus !== 'all') {
            $builder->where('residential_status', $residentialStatus === 'resident' ? 1 : 0);
        }

        $occupation = $this->request->getVar('occupation');
        if ($occupation !== null && $occupation !== 'all') {
            if ($occupation === 'no_data') {
                $builder->groupStart()
                        ->where('occupation', null)
                        ->orWhere('occupation', '')
                        ->groupEnd();
            } else {
                $builder->where('occupation', $occupation);
            }
        }

        $ward = $this->request->getVar('ward');
        if ($ward !== null && $ward !== 'all') {
            if ($ward === 'no_data') {
                $builder->groupStart()
                        ->where('ward', null)
                        ->orWhere('ward', '')
                        ->groupEnd();
            } else {
                $builder->where('ward', $ward);
            }
        }

        $birthday = $this->request->getVar('birthday');
        if ($birthday === 'true' || $birthday === 'yes') {
            $builder->where('MONTH(date_of_birth)', date('m'))
                    ->where('DAY(date_of_birth)', date('d'));
        }

        $total = $builder->countAllResults(false);
        
        $members = $builder
            ->orderBy($sortBy, $sortOrder)
            ->limit($limit, ($page - 1) * $limit)
            ->get()
            ->getResultArray();

        // Cast boolean fields and transform to camelCase
        foreach ($members as &$member) {
            $member['baptism_status'] = (bool)$member['baptism_status'];
            $member['confirmation_status'] = (bool)$member['confirmation_status'];
            $member['marital_status'] = (bool)$member['marital_status'];
            $member['residential_status'] = (bool)$member['residential_status'];
            // Cast numeric fields to integers
            if (isset($member['member_order'])) $member['member_order'] = (int)$member['member_order'];
            if (isset($member['member_serial_num'])) $member['member_serial_num'] = (int)$member['member_serial_num'];
            if (isset($member['family_id'])) $member['family_id'] = (int)$member['family_id'];
            $member = $this->transformToCamelCase($member);
        }

        return $this->respond([
            'success' => true,
            'data' => [
                'members' => $members,
                'pagination' => [
                    'currentPage' => (int)$page,
                    'totalPages' => ceil($total / $limit),
                    'totalRecords' => $total,
                    'limit' => (int)$limit
                ]
            ]
        ]);
    }

    public function show($id)
    {
        $model = new MemberModel();
        $member = $model->find($id);

        if (!$member) {
            return $this->failNotFound('Member not found');
        }

        unset($member['password']);

        // Cast boolean fields
        $member['baptism_status'] = (bool)$member['baptism_status'];
        $member['confirmation_status'] = (bool)$member['confirmation_status'];
        $member['marital_status'] = (bool)$member['marital_status'];
        $member['residential_status'] = (bool)$member['residential_status'];

        // Transform to camelCase
        $member = $this->transformToCamelCase($member);

        // Fetch family members
        $familyMembers = [];
        if (!empty($member['memberSerialNum'])) {
            $familyMembersRaw = $model->where('member_serial_num', $member['memberSerialNum'])
                                   ->orderBy('member_order', 'ASC')
                                   ->findAll();
            
            // Cast boolean fields and transform for family members
            foreach ($familyMembersRaw as &$fm) {
                unset($fm['password']);
                $fm['baptism_status'] = (bool)$fm['baptism_status'];
                $fm['confirmation_status'] = (bool)$fm['confirmation_status'];
                $fm['marital_status'] = (bool)$fm['marital_status'];
                $fm['residential_status'] = (bool)$fm['residential_status'];
                $familyMembers[] = $this->transformToCamelCase($fm);
            }
        }
        $member['familyMembers'] = $familyMembers;

        return $this->respond([
            'success' => true,
            'data' => $member
        ]);
    }

    public function create()
    {
        $model = new MemberModel();
        
        $data = $this->request->getJSON(true);
        unset($data['id']); // Let database trigger generate UUID

        // Map camelCase to snake_case for create
        if (isset($data['dateOfBirth'])) $data['date_of_birth'] = empty($data['dateOfBirth']) ? null : $data['dateOfBirth'];
        if (isset($data['baptismStatus'])) $data['baptism_status'] = $data['baptismStatus'];
        if (isset($data['confirmationStatus'])) $data['confirmation_status'] = $data['confirmationStatus'];
        if (isset($data['maritalStatus'])) $data['marital_status'] = $data['maritalStatus'];
        if (isset($data['residentialStatus'])) $data['residential_status'] = $data['residentialStatus'];
        if (isset($data['aadharNumber'])) $data['aadhar_number'] = empty($data['aadharNumber']) ? null : $data['aadharNumber'];
        if (isset($data['memberStatus'])) $data['member_status'] = $data['memberStatus'];
        if (isset($data['memberSerialNum'])) $data['member_serial_num'] = $data['memberSerialNum'];
        
        // Generate member code
        // Formula: "LCH" + "-" + "member_serial_number" + "-" +"family_id" (member_order)
        if (isset($data['member_serial_num'])) {
            $serialNum = $data['member_serial_num'];
            
            // Calculate member_order
            $db = \Config\Database::connect();
            $query = $db->query("SELECT MAX(member_order) as max_order FROM members WHERE member_serial_num = ?", [$serialNum]);
            $result = $query->getRow();
            $nextOrder = ($result && $result->max_order) ? (int)$result->max_order + 1 : 1;
            
            $data['member_order'] = $nextOrder;
            
            $serial = str_pad($serialNum, 4, '0', STR_PAD_LEFT);
            $data['member_code'] = "LCH-{$serial}-{$nextOrder}";
            
            // Set head_of_family
            if ($nextOrder === 1) {
                // This is the first member, they are the head of family
                $data['head_of_family'] = $data['member_code'];
            } else {
                // Get the head of family for this serial number
                $data['head_of_family'] = $this->getHeadOfFamilyCode($serialNum);
            }
        } else {
            // Fallback: Generate next serial number if missing
            $db = \Config\Database::connect();
            // Get highest serial number currently in use
            $query = $db->query("
                SELECT COALESCE(MAX(CAST(SUBSTRING(member_code, 5, 4) AS UNSIGNED)), 0) as last_serial 
                FROM members 
                WHERE member_code LIKE 'LCH%'
            ");
            $lastSerial = $query->getRow()->last_serial;
            $nextSerial = $lastSerial + 1;
            
            // Since it's a new serial, order is 1
            $nextOrder = 1;
            $data['member_order'] = $nextOrder;
            $data['member_serial_num'] = $nextSerial;
            
            $serialStr = str_pad($nextSerial, 4, '0', STR_PAD_LEFT);
            $data['member_code'] = "LCH-{$serialStr}-{$nextOrder}";
            
            // This is the first member of a new family, they are the head
            $data['head_of_family'] = $data['member_code'];
        }
        
        // Hash password
        if (isset($data['password'])) {
            $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT);
        }
        
        // Set defaults
        if (!isset($data['member_status'])) {
            $data['member_status'] = 'unconfirmed';
        }
        $data['registration_date'] = date('Y-m-d');
        
        if ($model->insert($data)) {
            $member = $model->find($model->getInsertID());
            unset($member['password']);
            
            return $this->respondCreated([
                'success' => true,
                'data' => $member,
                'message' => 'Member registered successfully'
            ]);
        }

        return $this->fail($model->errors());
    }

    public function update($id)
    {
        $model = new MemberModel();
        $member = $model->find($id);

        if (!$member) {
            return $this->failNotFound('Member not found');
        }

        $data = $this->request->getJSON(true);

        // Map camelCase to snake_case for update
        if (isset($data['dateOfBirth'])) $data['date_of_birth'] = empty($data['dateOfBirth']) ? null : $data['dateOfBirth'];
        if (isset($data['baptismStatus'])) $data['baptism_status'] = $data['baptismStatus'];
        if (isset($data['confirmationStatus'])) $data['confirmation_status'] = $data['confirmationStatus'];
        if (isset($data['maritalStatus'])) $data['marital_status'] = $data['maritalStatus'];
        if (isset($data['residentialStatus'])) $data['residential_status'] = $data['residentialStatus'];
        if (isset($data['aadharNumber'])) $data['aadhar_number'] = empty($data['aadharNumber']) ? null : $data['aadharNumber'];
        if (isset($data['memberStatus'])) $data['member_status'] = $data['memberStatus'];
        
        // Don't allow updating certain fields
        unset($data['id'], $data['member_code'], $data['password'], $data['registration_date']);

        // Handle member_serial_num update
        if (isset($data['memberSerialNum'])) {
            $newSerial = $data['memberSerialNum'];
            
            // Only proceed if serial number is actually changing
            if ($newSerial != $member['member_serial_num']) {
                $data['member_serial_num'] = $newSerial;
                
                // Calculate new member_order for the new serial number
                $db = \Config\Database::connect();
                $query = $db->query("SELECT MAX(member_order) as max_order FROM members WHERE member_serial_num = ?", [$newSerial]);
                $result = $query->getRow();
                $nextOrder = ($result && $result->max_order) ? (int)$result->max_order + 1 : 1;
                
                $data['member_order'] = $nextOrder;
                
                // Generate new member_code
                $serial = str_pad($newSerial, 4, '0', STR_PAD_LEFT);
                $data['member_code'] = "LCH-{$serial}-{$nextOrder}";
                
                // Update head_of_family for the new family
                if ($nextOrder === 1) {
                    // This member is now the first in the new family
                    $data['head_of_family'] = $data['member_code'];
                } else {
                    // Get the head of family for the new serial number
                    $data['head_of_family'] = $this->getHeadOfFamilyCode($newSerial);
                }
            }
        }

        if ($model->update($id, $data)) {
            $updated = $model->find($id);
            unset($updated['password']);
            
            return $this->respond([
                'success' => true,
                'data' => $updated,
                'message' => 'Member profile updated successfully'
            ]);
        }

        return $this->fail($model->errors());
    }

    public function updateStatus($id)
    {
        $model = new MemberModel();
        $member = $model->find($id);

        if (!$member) {
            return $this->failNotFound('Member not found');
        }

        $data = $this->request->getJSON(true);
        
        if (!isset($data['memberStatus'])) {
            return $this->fail('memberStatus is required');
        }

        if ($model->update($id, ['member_status' => $data['memberStatus']])) {
            $updated = $model->find($id);
            unset($updated['password']);
            
            return $this->respond([
                'success' => true,
                'data' => [
                    'id' => $updated['id'],
                    'memberCode' => $updated['member_code'],
                    'name' => $updated['name'],
                    'memberStatus' => $updated['member_status'],
                    'updatedAt' => $updated['updated_at']
                ],
                'message' => 'Member status updated successfully'
            ]);
        }

        return $this->fail($model->errors());
    }

    public function resetPassword($id)
    {
        $model = new MemberModel();
        $member = $model->find($id);

        if (!$member) {
            return $this->failNotFound('Member not found');
        }

        $data = $this->request->getJSON(true);
        
        if (!isset($data['newPassword']) || !isset($data['confirmPassword'])) {
            return $this->fail('newPassword and confirmPassword are required');
        }

        if ($data['newPassword'] !== $data['confirmPassword']) {
            return $this->fail('Passwords do not match');
        }

        $hashedPassword = password_hash($data['newPassword'], PASSWORD_BCRYPT);

        if ($model->update($id, ['password' => $hashedPassword])) {
            return $this->respond([
                'success' => true,
                'message' => 'Password reset successfully. Member has been notified.',
                'data' => [
                    'memberId' => $member['id'],
                    'memberCode' => $member['member_code'],
                    'name' => $member['name'],
                    'resetAt' => date('Y-m-d\TH:i:s\Z')
                ]
            ]);
        }

        return $this->fail('Failed to reset password');
    }

    /**
     * Get the member_code of the head of family for a given member_serial_num
     * 
     * @param int $memberSerialNum The family serial number
     * @return string|null The member_code of the head of family, or null if not found
     */
    private function getHeadOfFamilyCode($memberSerialNum)
    {
        $db = \Config\Database::connect();
        
        // Try to get the member with member_order = 1
        $query = $db->query(
            "SELECT member_code FROM members WHERE member_serial_num = ? AND member_order = 1 LIMIT 1",
            [$memberSerialNum]
        );
        $result = $query->getRow();
        
        if ($result && isset($result->member_code)) {
            return $result->member_code;
        }
        
        // Fallback: get the earliest created member in this family
        $query = $db->query(
            "SELECT member_code FROM members WHERE member_serial_num = ? ORDER BY created_at ASC LIMIT 1",
            [$memberSerialNum]
        );
        $result = $query->getRow();
        
        return $result && isset($result->member_code) ? $result->member_code : null;
    }

    /**
     * Lookup member by member_code only (for public member lookup page)
     * This endpoint restricts search to member_code only for security
     * 
     * @return Response JSON response with member details and family members
     */
    public function lookup()
    {
        $model = new MemberModel();
        
        $memberCode = $this->request->getVar('memberCode');
        
        if (!$memberCode) {
            return $this->fail('memberCode is required', 400);
        }

        // Search only by member_code (exact match)
        $member = $model->where('member_code', $memberCode)->first();

        if (!$member) {
            return $this->failNotFound('Member not found with the provided member code');
        }

        unset($member['password']);

        // Cast boolean fields
        $member['baptism_status'] = (bool)$member['baptism_status'];
        $member['confirmation_status'] = (bool)$member['confirmation_status'];
        $member['marital_status'] = (bool)$member['marital_status'];
        $member['residential_status'] = (bool)$member['residential_status'];

        // Transform to camelCase
        $member = $this->transformToCamelCase($member);

        // Fetch family members
        $familyMembers = [];
        if (!empty($member['memberSerialNum'])) {
            $familyMembersRaw = $model->where('member_serial_num', $member['memberSerialNum'])
                                   ->orderBy('member_order', 'ASC')
                                   ->findAll();
            
            // Cast boolean fields and transform for family members
            foreach ($familyMembersRaw as &$fm) {
                unset($fm['password']);
                $fm['baptism_status'] = (bool)$fm['baptism_status'];
                $fm['confirmation_status'] = (bool)$fm['confirmation_status'];
                $fm['marital_status'] = (bool)$fm['marital_status'];
                $fm['residential_status'] = (bool)$fm['residential_status'];
                $fm['is_head_of_family'] = (bool)$fm['is_head_of_family'];
                $familyMembers[] = $this->transformToCamelCase($fm);
            }
        }
        $member['familyMembers'] = $familyMembers;

        return $this->respond([
            'success' => true,
            'data' => $member
        ]);
    }


    /**
     * Transform array keys from snake_case to camelCase
     * 
     * @param array $data The data array to transform
     * @return array The transformed array with camelCase keys
     */
    private function transformToCamelCase($data)
    {
        $transformed = [];
        foreach ($data as $key => $value) {
            // Convert snake_case to camelCase
            $camelKey = lcfirst(str_replace('_', '', ucwords($key, '_')));
            $transformed[$camelKey] = $value;
        }
        return $transformed;
    }

    /**
     * Set a member as the head of their family
     */
    public function setFamilyHead($id)
    {
        $model = new MemberModel();
        $member = $model->find($id);

        if (!$member) {
            return $this->failNotFound('Member not found');
        }

        // Get all family members with the same member_serial_num
        $familyMembers = $model->where('member_serial_num', $member['member_serial_num'])->findAll();

        if (empty($familyMembers)) {
            return $this->fail('No family members found');
        }

        // Set all family members' is_head_of_family to false
        foreach ($familyMembers as $familyMember) {
            $model->update($familyMember['id'], ['is_head_of_family' => false]);
        }

        // Set the selected member as head of family
        $model->update($id, ['is_head_of_family' => true]);

        // Return updated family data with proper transformation
        $updatedFamilyRaw = $model->where('member_serial_num', $member['member_serial_num'])->findAll();
        
        $updatedFamily = [];
        foreach ($updatedFamilyRaw as $fm) {
            unset($fm['password']);
            $fm['baptism_status'] = (bool)$fm['baptism_status'];
            $fm['confirmation_status'] = (bool)$fm['confirmation_status'];
            $fm['marital_status'] = (bool)$fm['marital_status'];
            $fm['residential_status'] = (bool)$fm['residential_status'];
            $fm['is_head_of_family'] = (bool)$fm['is_head_of_family'];
            $updatedFamily[] = $this->transformToCamelCase($fm);
        }

        return $this->respond([
            'success' => true,
            'message' => 'Family head updated successfully',
            'data' => $updatedFamily
        ]);
    }

    /**
     * Delete a member
     */
    public function delete($id)
    {
        $model = new MemberModel();
        $member = $model->find($id);

        if (!$member) {
            return $this->failNotFound('Member not found');
        }

        // Delete the member
        if ($model->delete($id)) {
            return $this->respond([
                'success' => true,
                'message' => 'Member deleted successfully'
            ]);
        } else {
            return $this->fail('Failed to delete member');
        }
    }
}
