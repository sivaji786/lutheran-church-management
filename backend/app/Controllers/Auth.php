<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;
use App\Models\AdminUserModel;
use App\Models\MemberModel;
use App\Models\SessionModel;
use Firebase\JWT\JWT;

class Auth extends BaseController
{
    use ResponseTrait;

    public function adminLogin()
    {
        $rules = [
            'username' => 'required',
            'password' => 'required|min_length[6]'
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $username = $this->request->getVar('username');
        $password = $this->request->getVar('password');

        $model = new AdminUserModel();
        $user = $model->where('username', $username)->first();

        if (!$user) {
            return $this->failNotFound('User not found');
        }

        if (!password_verify($password, $user['password'])) {
            return $this->fail('Invalid password');
        }

        $key = getenv('JWT_SECRET');
        $iat = time();
        $exp = $iat + 3600;

        $payload = array(
            "iss" => "LutheranChurchApp",
            "aud" => "LutheranChurchApp",
            "sub" => $user['id'],
            "iat" => $iat,
            "exp" => $exp,
            "role" => $user['role']
        );

        $token = JWT::encode($payload, $key, 'HS256');

        $response = [
            'success' => true,
            'data' => [
                'userId' => $user['id'],
                'username' => $user['username'],
                'role' => $user['role'],
                'token' => $token,
                'expiresIn' => 3600
            ]
        ];

        return $this->respond($response);
    }

    public function memberLogin()
    {
        $rules = [
            'identifier' => 'required',
            'identifierType' => 'required|in_list[mobile,memberCode]',
            'password' => 'required'
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $identifier = $this->request->getVar('identifier');
        $identifierType = $this->request->getVar('identifierType');
        $password = $this->request->getVar('password');

        $model = new MemberModel();
        
        if ($identifierType === 'mobile') {
            $user = $model->where('mobile', $identifier)->first();
        } else {
            $user = $model->where('member_code', $identifier)->first();
        }

        if (!$user) {
            return $this->failNotFound('Member not found');
        }

        if (!password_verify($password, $user['password'])) {
            return $this->fail('Invalid password');
        }

        $key = getenv('JWT_SECRET');
        $iat = time();
        $exp = $iat + 3600;

        $payload = array(
            "iss" => "LutheranChurchApp",
            "aud" => "LutheranChurchApp",
            "sub" => $user['id'],
            "iat" => $iat,
            "exp" => $exp,
            "role" => 'member'
        );

        $token = JWT::encode($payload, $key, 'HS256');

        $response = [
            'success' => true,
            'data' => [
                'userId' => $user['id'],
                'memberId' => $user['id'],
                'memberCode' => $user['member_code'],
                'name' => $user['name'],
                'role' => 'member',
                'memberStatus' => $user['member_status'],
                'token' => $token,
                'expiresIn' => 3600
            ]
        ];

        return $this->respond($response);
    }
    public function changePassword()
    {
        $rules = [
            'currentPassword' => 'required',
            'newPassword' => 'required|min_length[8]'
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $currentPassword = $this->request->getVar('currentPassword');
        $newPassword = $this->request->getVar('newPassword');
        
        // Get user ID from JWT token (assuming middleware sets it or we decode it)
        // For now, we'll expect the memberCode to be passed or use the ID from token if available
        // Let's use the memberCode passed in request for simplicity as per current frontend flow, 
        // but ideally should be from token. 
        // Actually, the App.tsx passes memberCode. Let's use that to find the user.
        
        $memberCode = $this->request->getVar('memberCode');
        if (!$memberCode) {
             return $this->fail('Member code is required');
        }

        $model = new MemberModel();
        $user = $model->where('member_code', $memberCode)->first();

        if (!$user) {
            return $this->failNotFound('Member not found');
        }

        if (!password_verify($currentPassword, $user['password'])) {
            return $this->fail('Current password is incorrect');
        }

        // Update password
        $data = [
            'password' => password_hash($newPassword, PASSWORD_DEFAULT)
        ];

        $model->update($user['id'], $data);

        return $this->respond([
            'success' => true,
            'message' => 'Password changed successfully'
        ]);
    }
}
