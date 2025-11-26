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
}
