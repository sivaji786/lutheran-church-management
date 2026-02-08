<?php

namespace App\Models;

use CodeIgniter\Model;

class ActivityLogModel extends Model
{
    protected $table = 'activity_logs';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $allowedFields = [
        'admin_id',
        'admin_name',
        'module',
        'action',
        'target_id',
        'details',
        'ip_address',
        'created_at'
    ];

    protected $useTimestamps = false; // We set created_at manually or let DB definition handle it if default CURRENT_TIMESTAMP

    public function logActivity($adminId, $adminName, $module, $action, $targetId = null, $details = null)
    {
        $data = [
            'admin_id'   => $adminId,
            'admin_name' => $adminName,
            'module'     => $module,
            'action'     => $action,
            'target_id'  => $targetId,
            'details'    => $details,
            // 'ip_address' => service('request')->getIPAddress(), // Can capture IP here
            'created_at' => date('Y-m-d H:i:s')
        ];

        return $this->insert($data);
    }
}
