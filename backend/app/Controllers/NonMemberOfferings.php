<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;
use App\Models\NonMemberOfferingModel;

class NonMemberOfferings extends BaseController
{
    use ResponseTrait;

    public function index()
    {
        $model = new NonMemberOfferingModel();
        
        $page = $this->request->getVar('page') ?? 1;
        $limit = $this->request->getVar('limit') ?? 20;
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
                ->like('donor_name', $search)
                ->orLike('donor_mobile', $search)
                ->orLike('donor_email', $search)
                ->orLike('offer_type', $search)
                ->orLike('payment_mode', $search)
                ->orLike('amount', $search)
                ->groupEnd();
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
        if ($search) {
            $builder->groupStart()
                ->like('donor_name', $search)
                ->orLike('donor_mobile', $search)
                ->orLike('donor_email', $search)
                ->orLike('offer_type', $search)
                ->orLike('payment_mode', $search)
                ->orLike('amount', $search)
                ->groupEnd();
        }
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
        $model = new NonMemberOfferingModel();
        
        $data = $this->request->getJSON(true);
        unset($data['id']); // Let database trigger generate UUID
        
        // Map frontend camelCase to backend snake_case
        if (isset($data['donorName'])) {
            $data['donor_name'] = $data['donorName'];
            unset($data['donorName']);
        }
        if (isset($data['donorMobile'])) {
            $data['donor_mobile'] = $data['donorMobile'];
            unset($data['donorMobile']);
        }
        if (isset($data['donorEmail'])) {
            $data['donor_email'] = $data['donorEmail'];
            unset($data['donorEmail']);
        }
        if (isset($data['donorAddress'])) {
            $data['donor_address'] = $data['donorAddress'];
            unset($data['donorAddress']);
        }
        if (isset($data['offerType'])) {
            $data['offer_type'] = $data['offerType'];
            unset($data['offerType']);
        }
        if (isset($data['paymentMode'])) {
            $data['payment_mode'] = $data['paymentMode'];
            unset($data['paymentMode']);
        }
        if (isset($data['chequeNumber'])) {
            $data['cheque_number'] = $data['chequeNumber'];
            unset($data['chequeNumber']);
        }
        if (isset($data['transactionId'])) {
            $data['transaction_id'] = $data['transactionId'];
            unset($data['transactionId']);
        }
        if (isset($data['receiptNumber'])) {
            $data['receipt_number'] = $data['receiptNumber'];
            unset($data['receiptNumber']);
        }
        
        // Generate receipt number if not provided
        if (!isset($data['receipt_number']) || empty($data['receipt_number'])) {
            $data['receipt_number'] = 'NM-REC' . date('YmdHis');
        }
        
        // Set recorded_by (should come from JWT token in production)
        $userId = $this->request->getHeaderLine('X-User-Id');
        $data['recorded_by'] = !empty($userId) ? $userId : 'a83bf033-c9cc-11f0-8918-5c879c7eebc7';
        
        if ($model->insert($data)) {
            $offering = $model->find($model->getInsertID());
            
            return $this->respondCreated([
                'success' => true,
                'data' => $offering,
                'message' => 'Non-member offering recorded successfully'
            ]);
        }

        return $this->fail($model->errors());
    }

    public function update($id)
    {
        $model = new NonMemberOfferingModel();
        $offering = $model->find($id);

        if (!$offering) {
            return $this->failNotFound('Non-member offering not found');
        }

        $data = $this->request->getJSON(true);
        
        // Don't allow updating certain fields
        unset($data['id'], $data['recorded_by'], $data['created_at']);
        
        // Map frontend camelCase to backend snake_case
        if (isset($data['donorName'])) {
            $data['donor_name'] = $data['donorName'];
            unset($data['donorName']);
        }
        if (isset($data['donorMobile'])) {
            $data['donor_mobile'] = $data['donorMobile'];
            unset($data['donorMobile']);
        }
        if (isset($data['donorEmail'])) {
            $data['donor_email'] = $data['donorEmail'];
            unset($data['donorEmail']);
        }
        if (isset($data['donorAddress'])) {
            $data['donor_address'] = $data['donorAddress'];
            unset($data['donorAddress']);
        }
        if (isset($data['offerType'])) {
            $data['offer_type'] = $data['offerType'];
            unset($data['offerType']);
        }
        if (isset($data['paymentMode'])) {
            $data['payment_mode'] = $data['paymentMode'];
            unset($data['paymentMode']);
        }
        if (isset($data['chequeNumber'])) {
            $data['cheque_number'] = $data['chequeNumber'];
            unset($data['chequeNumber']);
        }
        if (isset($data['transactionId'])) {
            $data['transaction_id'] = $data['transactionId'];
            unset($data['transactionId']);
        }
        if (isset($data['receiptNumber'])) {
            $data['receipt_number'] = $data['receiptNumber'];
            unset($data['receiptNumber']);
        }

        if ($model->update($id, $data)) {
            $updated = $model->find($id);
            
            return $this->respond([
                'success' => true,
                'data' => $updated,
                'message' => 'Non-member offering updated successfully'
            ]);
        }

        return $this->fail($model->errors());
    }

    public function delete($id)
    {
        $model = new NonMemberOfferingModel();
        $offering = $model->find($id);

        if (!$offering) {
            return $this->failNotFound('Non-member offering not found');
        }

        if ($model->delete($id)) {
            return $this->respond([
                'success' => true,
                'message' => 'Non-member offering deleted successfully'
            ]);
        }

        return $this->fail('Failed to delete non-member offering');
    }

    public function statistics()
    {
        $db = \Config\Database::connect();
        
        try {
            // Call stored procedure
            $query = $db->query("CALL sp_non_member_offering_stats()");
            
            // Get overall statistics (first result set)
            $overallStats = $query->getRowArray();
            
            // For CodeIgniter 4, we need to use mysqli directly for multiple result sets
            $mysqli = $db->connID;
            
            // Move to next result set
            if ($mysqli->more_results()) {
                $mysqli->next_result();
            }
            
            // Get breakdown by offer type (second result set)
            $query2 = $db->query("SELECT 1"); // Dummy query to get new result
            $offeringsByType = [];
            if ($mysqli->more_results()) {
                $mysqli->next_result();
                $result = $mysqli->store_result();
                if ($result) {
                    while ($row = $result->fetch_assoc()) {
                        $offeringsByType[] = $row;
                    }
                    $result->free();
                }
            }
            
            // Get breakdown by payment mode (third result set)
            $offeringsByPaymentMode = [];
            if ($mysqli->more_results()) {
                $mysqli->next_result();
                $result = $mysqli->store_result();
                if ($result) {
                    while ($row = $result->fetch_assoc()) {
                        $offeringsByPaymentMode[] = $row;
                    }
                    $result->free();
                }
            }
            
            // Clear any remaining results
            while ($mysqli->more_results()) {
                $mysqli->next_result();
                if ($result = $mysqli->store_result()) {
                    $result->free();
                }
            }
            
            // Transform data for frontend
            $offeringsByTypeMap = [];
            foreach ($offeringsByType as $item) {
                $offeringsByTypeMap[$item['offer_type']] = [
                    'count' => (int)$item['count'],
                    'totalAmount' => (float)$item['total_amount'],
                    'averageAmount' => (float)$item['average_amount']
                ];
            }
            
            $offeringsByPaymentModeMap = [];
            foreach ($offeringsByPaymentMode as $item) {
                $offeringsByPaymentModeMap[$item['payment_mode']] = [
                    'count' => (int)$item['count'],
                    'totalAmount' => (float)$item['total_amount']
                ];
            }

            return $this->respond([
                'success' => true,
                'data' => [
                    'totalOfferings' => (int)($overallStats['total_offerings'] ?? 0),
                    'totalAmount' => (float)($overallStats['total_amount'] ?? 0),
                    'averageAmount' => (float)($overallStats['average_amount'] ?? 0),
                    'thisYearTotal' => (float)($overallStats['this_year_total'] ?? 0),
                    'thisMonthTotal' => (float)($overallStats['this_month_total'] ?? 0),
                    'firstOfferingDate' => $overallStats['first_offering_date'] ?? null,
                    'lastOfferingDate' => $overallStats['last_offering_date'] ?? null,
                    'offeringsByType' => $offeringsByTypeMap,
                    'offeringsByPaymentMode' => $offeringsByPaymentModeMap
                ]
            ]);
        } catch (\Exception $e) {
            return $this->fail('Failed to retrieve statistics: ' . $e->getMessage());
        }
    }
}
