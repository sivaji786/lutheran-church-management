<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;
use App\Models\TicketModel;
use App\Models\MemberModel;
use App\Models\TicketHistoryModel;

class Tickets extends BaseController
{
    use ResponseTrait;

    public function index()
    {
        $model = new TicketModel();
        
        $page = $this->request->getVar('page') ?? 1;
        $limit = $this->request->getVar('limit') ?? 20;
        $memberId = $this->request->getVar('memberId');
        $status = $this->request->getVar('status');
        $category = $this->request->getVar('category');
        $priority = $this->request->getVar('priority');
        $sortBy = $this->request->getVar('sortBy') ?? 'created_date';
        $sortOrder = $this->request->getVar('sortOrder') ?? 'desc';
        $search = $this->request->getVar('search');

        $builder = $model->builder();

        if ($search) {
            $builder->groupStart()
                ->like('subject', $search)
                ->orLike('description', $search)
                ->orLike('ticket_number', $search)
                ->orLike('member_name', $search)
                ->groupEnd();
        }

        if ($memberId) {
            $builder->where('member_id', $memberId);
        }

        if ($status) {
            $builder->where('status', $status);
        }

        if ($category) {
            $builder->where('category', $category);
        }

        if ($priority) {
            $builder->where('priority', $priority);
        }

        $total = $builder->countAllResults(false);
        
        $tickets = $builder
            ->orderBy($sortBy, $sortOrder)
            ->limit($limit, ($page - 1) * $limit)
            ->get()
            ->getResultArray();

        return $this->respond([
            'success' => true,
            'data' => [
                'tickets' => $tickets,
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
        $model = new TicketModel();
        $ticket = $model->find($id);

        if (!$ticket) {
            return $this->failNotFound('Ticket not found');
        }

        return $this->respond([
            'success' => true,
            'data' => $ticket
        ]);
    }

    public function create()
    {
        $model = new TicketModel();
        $memberModel = new MemberModel();
        
        $data = $this->request->getJSON(true);
        unset($data['id']); // Let database trigger generate UUID
        
        // Handle both camelCase and snake_case for member_id
        $memberId = $data['memberId'] ?? $data['member_id'] ?? null;
        
        if (!$memberId) {
            return $this->fail('member_id is required');
        }
        
        // Get member details
        $member = $memberModel->find($memberId);
        if (!$member) {
            return $this->failNotFound('Member not found');
        }

        // Generate ticket number
        $db = \Config\Database::connect();
        $query = $db->query("SELECT COALESCE(MAX(CAST(SUBSTRING(ticket_number, 2) AS UNSIGNED)), 0) as last_num FROM tickets WHERE ticket_number LIKE 'T%'");
        $lastNum = $query->getRow()->last_num;
        $nextNum = $lastNum + 1;
        $ticketNumber = 'T' . str_pad($nextNum, 3, '0', STR_PAD_LEFT);
        
        $data['ticket_number'] = $ticketNumber;
        $data['member_id'] = $memberId;
        $data['member_name'] = $member['name'];
        $data['member_code'] = $member['member_code'];
        $data['status'] = 'Open';
        $data['created_date'] = date('Y-m-d');
        $data['updated_date'] = date('Y-m-d');
        
        if ($model->insert($data)) {
            $ticket = $model->find($model->getInsertID());
            
            return $this->respondCreated([
                'success' => true,
                'data' => $ticket,
                'message' => 'Ticket created successfully'
            ]);
        }

        return $this->fail($model->errors());
    }


    public function update($id)
    {
        $model = new TicketModel();
        $historyModel = new TicketHistoryModel();
        $ticket = $model->find($id);

        if (!$ticket) {
            return $this->failNotFound('Ticket not found');
        }

        $data = $this->request->getJSON(true);
        
        // DEBUG: Log incoming data
        log_message('debug', 'Ticket update request data: ' . json_encode($data));
        
        // Extract admin notes if provided
        $adminNotes = $data['admin_notes'] ?? null;
        
        // DEBUG: Log admin notes
        log_message('debug', 'Admin notes extracted: ' . ($adminNotes ?? 'NULL'));
        
        // Don't allow updating certain fields
        unset($data['id'], $data['ticket_number'], $data['member_id'], $data['member_name'], 
              $data['member_code'], $data['created_date'], $data['admin_notes']);
        
        $data['updated_date'] = date('Y-m-d');

        // Update the ticket
        if ($model->update($id, $data)) {
            // If admin notes provided, save to ticket history
            if ($adminNotes && !empty(trim($adminNotes))) {
                $session = session();
                $adminUser = $session->get('user');
                
                // DEBUG: Log session data
                log_message('debug', 'Admin user from session: ' . json_encode($adminUser));
                
                $historyData = [
                    'ticket_id' => $id,
                    'action' => 'Admin Response',
                    'notes' => $adminNotes,
                    'performed_by' => $adminUser['id'] ?? '00000000-0000-0000-0000-000000000000',
                    'performed_by_type' => 'admin',
                    'performed_by_name' => $adminUser['name'] ?? 'Admin'
                ];
                
                // DEBUG: Log history data before insert
                log_message('debug', 'Inserting history data: ' . json_encode($historyData));
                
                $result = $historyModel->insert($historyData);
                
                // DEBUG: Log insert result
                log_message('debug', 'History insert result: ' . ($result ? 'SUCCESS' : 'FAILED'));
                if (!$result) {
                    log_message('error', 'History insert errors: ' . json_encode($historyModel->errors()));
                }
            }
            
            $updated = $model->find($id);
            
            return $this->respond([
                'success' => true,
                'data' => $updated,
                'message' => 'Ticket updated successfully'
            ]);
        }

        return $this->fail($model->errors());
    }

    public function updateStatus($id)
    {
        $model = new TicketModel();
        $historyModel = new TicketHistoryModel();
        $ticket = $model->find($id);

        if (!$ticket) {
            return $this->failNotFound('Ticket not found');
        }

        $data = $this->request->getJSON(true);
        
        if (!isset($data['status'])) {
            return $this->fail('status is required');
        }

        $newStatus = $data['status'];
        $oldStatus = $ticket['status'];
        // Support both camelCase (JSON) and snake_case
        $adminNotes = $data['adminNotes'] ?? $data['admin_notes'] ?? null;

        $updateData = [
            'status' => $newStatus,
            'updated_date' => date('Y-m-d')
        ];

        if ($adminNotes) {
            $updateData['admin_notes'] = $adminNotes;
        }

        if ($newStatus === 'Resolved') {
            $updateData['resolved_date'] = date('Y-m-d');
        } elseif ($newStatus === 'Closed') {
            $updateData['closed_date'] = date('Y-m-d');
        }

        if ($model->update($id, $updateData)) {
            // Save to ticket history with admin notes if provided
            $session = session();
            $adminUser = $session->get('user');
            
            $action = 'Status Changed';
            if ($adminNotes && !empty(trim($adminNotes))) {
                $action = 'Status Changed with Response';
            }
            
            $historyData = [
                'ticket_id' => $id,
                'action' => $action,
                'old_status' => $oldStatus,
                'new_status' => $newStatus,
                'notes' => $adminNotes,
                'performed_by' => $adminUser['id'] ?? '00000000-0000-0000-0000-000000000000',
                'performed_by_type' => 'admin',
                'performed_by_name' => $adminUser['name'] ?? 'Admin'
            ];
            
            $historyModel->insert($historyData);
            
            $updated = $model->find($id);
            
            return $this->respond([
                'success' => true,
                'data' => $updated,
                'message' => 'Ticket status updated successfully'
            ]);
        }

        return $this->fail($model->errors());
    }

    public function getHistory($id)
    {
        $historyModel = new TicketHistoryModel();
        
        // Verify ticket exists
        $ticketModel = new TicketModel();
        $ticket = $ticketModel->find($id);
        
        if (!$ticket) {
            return $this->failNotFound('Ticket not found');
        }
        
        // Fetch all history entries for this ticket, ordered by newest first
        $history = $historyModel
            ->where('ticket_id', $id)
            ->orderBy('created_at', 'DESC')
            ->findAll();
        
        return $this->respond([
            'success' => true,
            'data' => $history
        ]);
    }
}
