<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;
use App\Models\AdminUserModel;

class AdminUsers extends BaseController
{
    use ResponseTrait;

    public function index()
    {
        $model = new AdminUserModel();
        $users = $model->findAll();

        // Remove passwords from response
        foreach ($users as &$user) {
            unset($user['password']);
        }

        return $this->respond([
            'success' => true,
            'data' => $users
        ]);
    }

    public function create()
    {
        $model = new AdminUserModel();
        $data = $this->request->getJSON(true);

        // Set default password if not provided
        $data['password'] = password_hash($data['password'] ?? 'admin123', PASSWORD_DEFAULT);
        
        // Map frontend camelCase to backend snake_case
        if (isset($data['isSuperadmin'])) {
            $data['is_superadmin'] = $data['isSuperadmin'];
        }
        if (isset($data['isActive'])) {
            $data['is_active'] = $data['isActive'] ? 1 : 0;
        }

        if ($model->insert($data)) {
            $id = $model->getInsertID();
            $user = $model->find($id);
            unset($user['password']);
            
            return $this->respondCreated([
                'success' => true,
                'data' => $user,
                'message' => 'User created successfully'
            ]);
        }

        return $this->fail($model->errors());
    }

    public function update($id)
    {
        $model = new AdminUserModel();
        $user = $model->find($id);

        if (!$user) {
            return $this->failNotFound('User not found');
        }

        $data = $this->request->getJSON(true);
        
        // Map frontend camelCase to backend snake_case
        if (isset($data['isSuperadmin'])) {
            $data['is_superadmin'] = $data['isSuperadmin'];
        }
        if (isset($data['isActive'])) {
            $data['is_active'] = $data['isActive'] ? 1 : 0;
        }

        // Don't update password here, use resetPassword
        unset($data['password']);

        if ($model->update($id, $data)) {
            $updated = $model->find($id);
            unset($updated['password']);
            
            return $this->respond([
                'success' => true,
                'data' => $updated,
                'message' => 'User updated successfully'
            ]);
        }

        return $this->fail($model->errors());
    }

    public function delete($id)
    {
        $model = new AdminUserModel();
        $user = $model->find($id);

        if (!$user) {
            return $this->failNotFound('User not found');
        }

        // Prevent deleting the main admin user (optional, but safe)
        if ($user['username'] === 'admin') {
            return $this->fail('Cannot delete primary admin user', 403);
        }

        if ($model->delete($id)) {
            return $this->respond([
                'success' => true,
                'message' => 'User deleted successfully'
            ]);
        }

        return $this->fail('Failed to delete user');
    }

    public function resetPassword($id)
    {
        $model = new AdminUserModel();
        $user = $model->find($id);

        if (!$user) {
            return $this->failNotFound('User not found');
        }

        $defaultPassword = 'admin123';
        $data = [
            'password' => password_hash($defaultPassword, PASSWORD_DEFAULT),
            'password_changed_at' => null // Force change on next login if we had that logic
        ];

        if ($model->update($id, $data)) {
            return $this->respond([
                'success' => true,
                'message' => 'Password reset to default (admin123) successfully'
            ]);
        }

        return $this->fail('Failed to reset password');
    }
}
