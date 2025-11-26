<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;
use App\Models\OfferingModel;
use App\Models\MemberModel;

class Offerings extends BaseController
{
    use ResponseTrait;

    public function index()
    {
        $model = new OfferingModel();
        
        $page = $this->request->getVar('page') ?? 1;
        $limit = $this->request->getVar('limit') ?? 20;
        $memberId = $this->request->getVar('memberId');
        $startDate = $this->request->getVar('startDate');
        $endDate = $this->request->getVar('endDate');
        $offerType = $this->request->getVar('offerType');
        $paymentMode = $this->request->getVar('paymentMode');
        $sortBy = $this->request->getVar('sortBy') ?? 'date';
        $sortOrder = $this->request->getVar('sortOrder') ?? 'desc';
        $search = $this->request->getVar('search');

        $builder = $model->builder();

        if ($search) {
            $builder->groupStart()
                ->like('member_name', $search)
                ->orLike('offer_type', $search)
                ->orLike('payment_mode', $search)
                ->orLike('amount', $search)
                ->groupEnd();
        }

        if ($memberId) {
            $builder->where('member_id', $memberId);
        }

        if ($startDate) {
            $builder->where('date >=', $startDate);
        }

        if ($endDate) {
            $builder->where('date <=', $endDate);
        }

        if ($offerType && $offerType !== 'all') {
            $builder->where('offer_type', $offerType);
        }

        if ($paymentMode && $paymentMode !== 'all') {
            $builder->where('payment_mode', $paymentMode);
        }

        $total = $builder->countAllResults(false);
        $totalAmount = $builder->selectSum('amount')->get()->getRow()->amount ?? 0;
        
        $builder = $model->builder();
        if ($memberId) $builder->where('member_id', $memberId);
        if ($startDate) $builder->where('date >=', $startDate);
        if ($endDate) $builder->where('date <=', $endDate);
        if ($offerType && $offerType !== 'all') $builder->where('offer_type', $offerType);
        if ($paymentMode && $paymentMode !== 'all') $builder->where('payment_mode', $paymentMode);

        $offerings = $builder
            ->orderBy($sortBy, $sortOrder)
            ->limit($limit, ($page - 1) * $limit)
            ->get()
            ->getResultArray();

        return $this->respond([
            'success' => true,
            'data' => [
                'offerings' => $offerings,
                'pagination' => [
                    'currentPage' => (int)$page,
                    'totalPages' => ceil($total / $limit),
                    'totalRecords' => $total,
                    'limit' => (int)$limit
                ],
                'summary' => [
                    'totalAmount' => (float)$totalAmount,
                    'totalOfferings' => $total
                ]
            ]
        ]);
    }

    public function create()
    {
        $model = new OfferingModel();
        $memberModel = new MemberModel();
        
        $data = $this->request->getJSON(true);
        unset($data['id']); // Let database trigger generate UUID
        
        // Get member details
        $member = $memberModel->find($data['memberId']);
        if (!$member) {
            return $this->failNotFound('Member not found');
        }

        $data['member_id'] = $data['memberId'];
        $data['member_name'] = $member['name'];
        $data['member_code'] = $member['member_code'];
        
        // Map frontend camelCase to backend snake_case
        if (isset($data['offerType'])) {
            $data['offer_type'] = $data['offerType'];
        }
        if (isset($data['paymentMode'])) {
            $data['payment_mode'] = $data['paymentMode'];
        }
        
        // Generate receipt number if not provided
        if (!isset($data['receipt_number'])) {
            $data['receipt_number'] = 'REC' . date('YmdHis');
        }
        
        // Set recorded_by (should come from JWT token in production)
        // For now, we'll use a placeholder
        $userId = $this->request->getHeaderLine('X-User-Id');
        $data['recorded_by'] = !empty($userId) ? $userId : 'a83bf033-c9cc-11f0-8918-5c879c7eebc7';
        
        if ($model->insert($data)) {
            $offering = $model->find($model->getInsertID());
            
            return $this->respondCreated([
                'success' => true,
                'data' => $offering,
                'message' => 'Offering recorded successfully'
            ]);
        }

        return $this->fail($model->errors());
    }

    public function update($id)
    {
        $model = new OfferingModel();
        $offering = $model->find($id);

        if (!$offering) {
            return $this->failNotFound('Offering not found');
        }

        $data = $this->request->getJSON(true);
        
        // Don't allow updating certain fields
        unset($data['id'], $data['member_id'], $data['member_name'], $data['member_code'], $data['recorded_by']);

        if ($model->update($id, $data)) {
            $updated = $model->find($id);
            
            return $this->respond([
                'success' => true,
                'data' => $updated,
                'message' => 'Offering updated successfully'
            ]);
        }

        return $this->fail($model->errors());
    }

    public function delete($id)
    {
        $model = new OfferingModel();
        $offering = $model->find($id);

        if (!$offering) {
            return $this->failNotFound('Offering not found');
        }

        if ($model->delete($id)) {
            return $this->respond([
                'success' => true,
                'message' => 'Offering deleted successfully'
            ]);
        }

        return $this->fail('Failed to delete offering');
    }

    public function memberOfferings($memberId)
    {
        $model = new OfferingModel();
        $memberModel = new MemberModel();
        
        $member = $memberModel->find($memberId);
        if (!$member) {
            return $this->failNotFound('Member not found');
        }

        $startDate = $this->request->getVar('startDate');
        $endDate = $this->request->getVar('endDate');
        $offerType = $this->request->getVar('offerType');

        $builder = $model->builder()->where('member_id', $memberId);

        if ($startDate) {
            $builder->where('date >=', $startDate);
        }

        if ($endDate) {
            $builder->where('date <=', $endDate);
        }

        if ($offerType) {
            $builder->where('offer_type', $offerType);
        }

        $offerings = $builder->orderBy('date', 'desc')->get()->getResultArray();

        // Calculate statistics
        $db = \Config\Database::connect();
        $query = $db->query("CALL sp_member_offering_stats(?)", [$memberId]);
        $stats = $query->getRowArray();
        $query->freeResult();
        
        $offeringsByType = $db->query("
            SELECT offer_type, SUM(amount) as total 
            FROM offerings 
            WHERE member_id = ? 
            GROUP BY offer_type
        ", [$memberId])->getResultArray();

        $offeringsByTypeMap = [];
        foreach ($offeringsByType as $item) {
            $offeringsByTypeMap[$item['offer_type']] = (float)$item['total'];
        }

        return $this->respond([
            'success' => true,
            'data' => [
                'offerings' => $offerings,
                'statistics' => [
                    'totalContributions' => (float)($stats['total_contributions'] ?? 0),
                    'averageContribution' => (float)($stats['average_contribution'] ?? 0),
                    'totalOfferings' => (int)($stats['total_offerings'] ?? 0),
                    'thisMonthTotal' => (float)($stats['this_month_total'] ?? 0),
                    'lastOfferingDate' => $stats['last_offering_date'] ?? null,
                    'offeringsByType' => $offeringsByTypeMap
                ]
            ]
        ]);
    }
}
