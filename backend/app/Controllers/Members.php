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

        $builder = $model->builder();

        if ($search) {
            $builder->groupStart()
                ->like('name', $search)
                ->orLike('member_code', $search)
                ->orLike('mobile', $search)
                ->orLike('member_serial_num', $search)
                ->groupEnd();
        }

        if ($memberStatus) {
            $builder->where('member_status', $memberStatus);
        }

        $baptismStatus = $this->request->getVar('baptismStatus');
        if ($baptismStatus !== null && $baptismStatus !== 'all') {
            $builder->where('baptism_status', $baptismStatus === 'yes' ? 1 : 0);
        }

        $confirmationStatus = $this->request->getVar('confirmationStatus');
        if ($confirmationStatus !== null && $confirmationStatus !== 'all') {
            $builder->where('confirmation_status', $confirmationStatus === 'confirmed' ? 1 : 0);
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

        // Cast boolean fields
        foreach ($members as &$member) {
            $member['baptism_status'] = (bool)$member['baptism_status'];
            $member['confirmation_status'] = (bool)$member['confirmation_status'];
            $member['marital_status'] = (bool)$member['marital_status'];
            $member['residential_status'] = (bool)$member['residential_status'];
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

        // Fetch family members
        $familyMembers = [];
        if (!empty($member['member_serial_num'])) {
            $familyMembers = $model->where('member_serial_num', $member['member_serial_num'])
                                   ->orderBy('member_order', 'ASC')
                                   ->findAll();
            
            // Cast boolean fields for family members
            foreach ($familyMembers as &$fm) {
                unset($fm['password']);
                $fm['baptism_status'] = (bool)$fm['baptism_status'];
                $fm['confirmation_status'] = (bool)$fm['confirmation_status'];
                $fm['marital_status'] = (bool)$fm['marital_status'];
                $fm['residential_status'] = (bool)$fm['residential_status'];
            }
        }
        $member['family_members'] = $familyMembers;

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
        if (isset($data['dateOfBirth'])) $data['date_of_birth'] = $data['dateOfBirth'];
        if (isset($data['baptismStatus'])) $data['baptism_status'] = $data['baptismStatus'];
        if (isset($data['confirmationStatus'])) $data['confirmation_status'] = $data['confirmationStatus'];
        if (isset($data['maritalStatus'])) $data['marital_status'] = $data['maritalStatus'];
        if (isset($data['residentialStatus'])) $data['residential_status'] = $data['residentialStatus'];
        if (isset($data['aadharNumber'])) $data['aadhar_number'] = $data['aadharNumber'];
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
        if (isset($data['dateOfBirth'])) $data['date_of_birth'] = $data['dateOfBirth'];
        if (isset($data['baptismStatus'])) $data['baptism_status'] = $data['baptismStatus'];
        if (isset($data['confirmationStatus'])) $data['confirmation_status'] = $data['confirmationStatus'];
        if (isset($data['maritalStatus'])) $data['marital_status'] = $data['maritalStatus'];
        if (isset($data['residentialStatus'])) $data['residential_status'] = $data['residentialStatus'];
        if (isset($data['aadharNumber'])) $data['aadhar_number'] = $data['aadharNumber'];
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
}
