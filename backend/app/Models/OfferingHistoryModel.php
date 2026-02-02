<?php

namespace App\Models;

use CodeIgniter\Model;
use App\Traits\UuidTrait;

class OfferingHistoryModel extends Model
{
    use UuidTrait;

    protected $table            = 'offering_history';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = false;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'id', 'offering_id', 'amount', 'offer_type', 'payment_mode', 
        'cheque_number', 'transaction_id', 'notes', 'receipt_number', 
        'date', 'edited_by', 'created_at'
    ];

    protected bool $allowEmptyInserts = false;
    protected bool $updateOnlyChanged = true;

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = ''; // No updated_at for history records
    protected $deletedField  = '';

    // Callbacks
    protected $allowCallbacks = true;
    protected $beforeInsert   = ['generateUuid'];
}
