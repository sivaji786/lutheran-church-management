<?php

namespace App\Models;

use CodeIgniter\Model;

use App\Traits\UuidTrait;

class OfferingModel extends Model
{
    use UuidTrait;

    protected $table            = 'offerings';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = false;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'id', 'member_id', 'member_name', 'member_code', 'date', 'amount',
        'offer_type', 'payment_mode', 'cheque_number', 'transaction_id',
        'notes', 'receipt_number', 'recorded_by'
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
        'member_id' => 'required',
        'date' => 'required|valid_date',
        'amount' => 'required|decimal|greater_than[0]',
        'offer_type' => 'required|max_length[50]',
        'payment_mode' => 'required|in_list[Cash,UPI,Bank Transfer,Cheque,Card,Cover]',
        'receipt_number' => 'permit_empty|max_length[50]|is_unique[offerings.receipt_number,id,{id}]',
        'recorded_by' => 'required'
    ];
    
    protected $validationMessages = [
        'payment_mode' => [
            'in_list' => 'Invalid payment mode'
        ]
    ];
    
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;

    // Callbacks
    protected $allowCallbacks = true;
    protected $beforeInsert   = ['generateUuid'];
    protected $afterInsert    = [];
    protected $beforeUpdate   = [];
    protected $afterUpdate    = [];
    protected $beforeFind     = [];
    protected $afterFind      = [];
    protected $beforeDelete   = [];
    protected $afterDelete    = [];


}
