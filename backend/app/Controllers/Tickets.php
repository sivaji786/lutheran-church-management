<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;
use App\Models\TicketModel;
use App\Models\MemberModel;

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
        $query = $db->query("CALL sp_generate_ticket_number(@next_ticket)");
        $result = $db->query("SELECT @next_ticket as ticket_number")->getRow();
        
        $data['ticket_number'] = $result->ticket_number;
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
        $ticket = $model->find($id);

        if (!$ticket) {
            return $this->failNotFound('Ticket not found');
        }

        $data = $this->request->getJSON(true);
        
        // Don't allow updating certain fields
        unset($data['id'], $data['ticket_number'], $data['member_id'], $data['member_name'], $data['member_code'], $data['created_date']);
        
        $data['updated_date'] = date('Y-m-d');

        if ($model->update($id, $data)) {
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
        $ticket = $model->find($id);

        if (!$ticket) {
            return $this->failNotFound('Ticket not found');
        }

        $data = $this->request->getJSON(true);
        
        if (!isset($data['status'])) {
            return $this->fail('status is required');
        }

        $updateData = [
            'status' => $data['status'],
            'updated_date' => date('Y-m-d')
        ];

        if ($data['status'] === 'Resolved') {
            $updateData['resolved_date'] = date('Y-m-d');
        } elseif ($data['status'] === 'Closed') {
            $updateData['closed_date'] = date('Y-m-d');
        }

        if ($model->update($id, $updateData)) {
            $updated = $model->find($id);
            
            return $this->respond([
                'success' => true,
                'data' => $updated,
                'message' => 'Ticket status updated successfully'
            ]);
        }

        return $this->fail($model->errors());
    }
}
