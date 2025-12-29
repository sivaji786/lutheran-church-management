<?php

namespace App\Models;

use CodeIgniter\Model;

use App\Traits\UuidTrait;

class MemberModel extends Model
{
    use UuidTrait;

    protected $table            = 'members';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = false;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'id', 'member_code', 'name', 'occupation', 'date_of_birth', 
        'baptism_status', 'confirmation_status', 'marital_status', 'residential_status',
        'aadhar_number', 'mobile', 'address', 'area', 'ward', 'remarks',
        'member_status', 'password', 'registration_date', 'last_login',
        'failed_login_attempts', 'locked_until', 'created_by',
        'family_id', 'member_serial_num', 'member_order', 'head_of_family'
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
    protected $validationRules      = [];
    protected $validationMessages   = [];
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
