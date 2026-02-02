<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;
use App\Models\AdminUserModel;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Admin extends BaseController
{
    use ResponseTrait;

    /**
     * Get current admin profile
     */
    public function profile()
    {
        // Get authorization header
        $header = $this->request->getServer('HTTP_AUTHORIZATION');
        if (!$header) {
            return $this->failUnauthorized('No token provided');
        }

        $token = explode(' ', $header)[1];
        
        try {
            $key = getenv('JWT_SECRET');
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            $userId = $decoded->sub; // Assuming 'sub' holds the user ID
            
            $model = new AdminUserModel();
            $admin = $model->find($userId);
            
            if (!$admin) {
                return $this->failNotFound('Admin not found');
            }
            
            // Remove sensitive data
            unset($admin['password']);
            
            // Transform snake_case to camelCase
            $data = $this->transformToCamelCase($admin);
            
            return $this->respond([
                'success' => true,
                'data' => $data
            ]);
            
        } catch (\Exception $e) {
            return $this->failUnauthorized('Invalid token');
        }
    }
    
    /**
     * Update admin profile (name, email)
     */
    public function updateProfile()
    {
        // Get authorization header
        $header = $this->request->getServer('HTTP_AUTHORIZATION');
        if (!$header) {
            return $this->failUnauthorized('No token provided');
        }

        $token = explode(' ', $header)[1];
        
        try {
            $key = getenv('JWT_SECRET');
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            $userId = $decoded->sub;
            
            $rules = [
                'name' => 'permit_empty|max_length[255]',
                'email' => 'permit_empty|valid_email|max_length[255]'
            ];
    
            if (!$this->validate($rules)) {
                return $this->failValidationErrors($this->validator->getErrors());
            }
    
            $data = [];
            if ($this->request->getVar('name')) {
                $data['name'] = $this->request->getVar('name');
            }
            if ($this->request->getVar('email')) {
                $data['email'] = $this->request->getVar('email');
            }
            
            if (empty($data)) {
                return $this->fail('No data provided to update');
            }
            
            $model = new AdminUserModel();
            $model->update($userId, $data);
            
            // Get updated profile
            $admin = $model->find($userId);
            unset($admin['password']);
            
            return $this->respond([
                'success' => true,
                'data' => $this->transformToCamelCase($admin),
                'message' => 'Profile updated successfully'
            ]);
            
        } catch (\Exception $e) {
            return $this->failUnauthorized('Invalid token: ' . $e->getMessage());
        }
    }

    /**
     * Change admin password
     */
    public function changePassword()
    {
        // Get authorization header
        $header = $this->request->getServer('HTTP_AUTHORIZATION');
        if (!$header) {
            return $this->failUnauthorized('No token provided');
        }

        $token = explode(' ', $header)[1];
        
        try {
            $key = getenv('JWT_SECRET');
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            $userId = $decoded->sub;
            
            $rules = [
                'currentPassword' => 'required',
                'newPassword' => 'required|min_length[8]'
            ];
    
            if (!$this->validate($rules)) {
                return $this->failValidationErrors($this->validator->getErrors());
            }
    
            $currentPassword = $this->request->getVar('currentPassword');
            $newPassword = $this->request->getVar('newPassword');
            
            $model = new AdminUserModel();
            $admin = $model->find($userId);
            
            if (!$admin) {
                return $this->failNotFound('Admin not found');
            }
            
            if (!password_verify($currentPassword, $admin['password'])) {
                return $this->fail('Current password is incorrect');
            }
            
            // Update password
            $data = [
                'password' => password_hash($newPassword, PASSWORD_DEFAULT),
                'password_changed_at' => date('Y-m-d H:i:s')
            ];
            
            $model->update($userId, $data);
            
            return $this->respond([
                'success' => true,
                'message' => 'Password changed successfully'
            ]);
            
        } catch (\Exception $e) {
            return $this->failUnauthorized('Invalid token: ' . $e->getMessage());
        }
    }
    
    /**
     * Transform array keys from snake_case to camelCase
     */
    private function transformToCamelCase($data)
    {
        $transformed = [];
        foreach ($data as $key => $value) {
            // Convert snake_case to camelCase
            $camelKey = lcfirst(str_replace('_', '', ucwords($key, '_')));
            $transformed[$camelKey] = $value;
        }
        return $transformed;
    }
}
