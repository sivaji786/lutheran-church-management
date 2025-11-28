<?php

namespace App\Models;

use CodeIgniter\Model;

class NonMemberOfferingModel extends Model
{
    protected $table            = 'non_member_offerings';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = false;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'id', 'donor_name', 'donor_mobile', 'donor_email', 'donor_address',
        'date', 'amount', 'offer_type', 'payment_mode', 'cheque_number',
        'transaction_id', 'notes', 'receipt_number', 'recorded_by'
    ];

    protected bool $allowEmptyInserts = false;
    protected bool $updateOnlyChanged = true;

    protected array $casts = [];
    protected array $castHandlers = [];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules = [
        'donor_name' => 'required|max_length[100]',
        'donor_mobile' => 'permit_empty|max_length[15]',
        'donor_email' => 'permit_empty|valid_email|max_length[100]',
        'date' => 'required|valid_date',
        'amount' => 'required|decimal|greater_than[0]',
        'offer_type' => 'required|max_length[50]',
        'payment_mode' => 'required|in_list[Cash,UPI,Bank Transfer,Cheque,Card]',
        'cheque_number' => 'permit_empty|max_length[50]',
        'transaction_id' => 'permit_empty|max_length[100]',
        'receipt_number' => 'permit_empty|max_length[50]|is_unique[non_member_offerings.receipt_number,id,{id}]',
        'recorded_by' => 'required'
    ];
    
    protected $validationMessages = [
        'donor_name' => [
            'required' => 'Donor name is required'
        ],
        'amount' => [
            'required' => 'Amount is required',
            'decimal' => 'Amount must be a valid number',
            'greater_than' => 'Amount must be greater than 0'
        ],
        'payment_mode' => [
            'in_list' => 'Invalid payment mode'
        ]
    ];
    
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;

    // Callbacks
    protected $allowCallbacks = true;
    protected $beforeInsert   = ['generateID'];
    protected $afterInsert    = [];
    protected $beforeUpdate   = [];
    protected $afterUpdate    = [];
    protected $beforeFind     = [];
    protected $afterFind      = [];
    protected $beforeDelete   = [];
    protected $afterDelete    = [];

    protected function generateID(array $data)
    {
        if (!isset($data['data']['id'])) {
            $data['data']['id'] = $this->uuid();
        }
        return $data;
    }

    protected function uuid()
    {
        return sprintf(
            '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }
}
