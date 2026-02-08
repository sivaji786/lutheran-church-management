<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\ActivityLogModel;

class ActivityLogs extends ResourceController
{
    protected $activityLogModel;

    public function __construct()
    {
        $this->activityLogModel = new ActivityLogModel();
    }

    public function index()
    {
        $limit = $this->request->getVar('limit') ?? 50;
        $page = $this->request->getVar('page') ?? 1;
        $search = $this->request->getVar('search');
        $module = $this->request->getVar('module');
        $adminId = $this->request->getVar('admin_id');

        $this->activityLogModel->orderBy('created_at', 'DESC');

        if ($search) {
            $this->activityLogModel->groupStart()
                ->like('admin_name', $search)
                ->orLike('details', $search)
                ->orLike('action', $search)
                ->groupEnd();
        }

        if ($module && $module !== 'all') {
            $this->activityLogModel->where('module', $module);
        }

        if ($adminId && $adminId !== 'all') {
            $this->activityLogModel->where('admin_id', $adminId);
        }

        $logs = $this->activityLogModel->paginate($limit, 'default', $page);
        $pager = $this->activityLogModel->pager;

        return $this->respond([
            'status' => 200,
            'error' => null,
            'messages' => [
                'success' => 'Activity logs retrieved successfully'
            ],
            'data' => [
                'logs' => $logs,
                'pagination' => [
                    'currentPage' => $pager->getCurrentPage(),
                    'totalPages' => $pager->getPageCount(),
                    'totalRecords' => $pager->getTotal(),
                    'perPage' => $limit
                ]
            ]
        ]);
    }
}
