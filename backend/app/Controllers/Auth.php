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
            // Log failed attempt - user not found
            $security = new \App\Libraries\SecurityMonitor();
            $security->logFailedLogin($username, 'admin');
            return $this->failNotFound('User not found');
        }

        if (!password_verify($password, $user['password'])) {
            // Log failed attempt - wrong password
            $security = new \App\Libraries\SecurityMonitor();
            $security->logFailedLogin($username, 'admin');
            return $this->fail('Invalid password');
        }

        // Generate 2FA code
        $twoFactorCode = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $expiresAt = date('Y-m-d H:i:s', strtotime('+10 minutes'));

        $model->update($user['id'], [
            'two_factor_code' => $twoFactorCode,
            'two_factor_expires_at' => $expiresAt
        ]);

        $emailConfig = new \Config\Email();
        $email = \Config\Services::email();
        
        $fromEmail = !empty($emailConfig->fromEmail) ? $emailConfig->fromEmail : 'noreply@' . ($_SERVER['HTTP_HOST'] ?? 'localhost');
        $fromName = !empty($emailConfig->fromName) ? $emailConfig->fromName : 'AELC Church App';
        
        $email->setFrom($fromEmail, $fromName);
        $email->setTo($user['email']);
        $email->setSubject('Your 2-Factor Authentication Code');
        $email->setMessage("Your authentication code is: <strong>$twoFactorCode</strong>. This code will expire in 10 minutes.");
        
        // Log the code for local development/debugging
        log_message('info', "2FA Code for {$user['username']}: $twoFactorCode");
        
        if (!$email->send()) {
            $debugger = $email->printDebugger(['headers', 'subject', 'body']);
            log_message('error', "2FA Code email failed for {$user['username']} using primary protocol. Debug: " . $debugger);
            
            // Fallback to 'mail' protocol
            $email->initialize(['protocol' => 'mail']);
            $email->setFrom($fromEmail, $fromName); // Re-set From for fallback
            if (!$email->send()) {
                $debuggerFallback = $email->printDebugger(['headers', 'subject', 'body']);
                log_message('error', "2FA Code email fallback to 'mail' failed for {$user['username']}. Debug: " . $debuggerFallback);
            } else {
                log_message('info', "2FA Code email sent via fallback for {$user['username']}.");
            }
        }

        return $this->respond([
            'success' => true,
            'data' => [
                'requires2FA' => true,
                'userId' => $user['id'],
                'username' => $user['username'],
                'message' => 'A 6-digit verification code has been sent to your registered email.'
            ]
        ]);
    }

    public function verifyAdmin2FA()
    {
        $rules = [
            'userId' => 'required',
            'code' => 'required|min_length[6]|max_length[6]'
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $userId = $this->request->getVar('userId');
        $code = $this->request->getVar('code');

        $model = new AdminUserModel();
        $user = $model->find($userId);

        if (!$user) {
            return $this->failNotFound('User not found');
        }

        if (!$user['two_factor_code'] || $user['two_factor_code'] !== $code) {
            return $this->fail('Invalid verification code');
        }

        if (strtotime($user['two_factor_expires_at']) < time()) {
            return $this->fail('Verification code has expired');
        }

        // Clear 2FA code after successful verification
        $model->update($user['id'], [
            'two_factor_code' => null,
            'two_factor_expires_at' => null,
            'last_login' => date('Y-m-d H:i:s')
        ]);

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
                'isSuperadmin' => $user['is_superadmin'],
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

        // Enforce member code only login
        if ($identifierType === 'mobile') {
            return $this->fail('Mobile number login is no longer supported. Please use your member code to sign in.', 400);
        }

        $model = new MemberModel();
        
        // Only allow member code login
        $user = $model->where('member_code', $identifier)->first();

        if (!$user) {
            // Log failed attempt - member not found
            $security = new \App\Libraries\SecurityMonitor();
            $security->logFailedLogin($identifier, 'member');
            return $this->failNotFound('Member not found');
        }

        if (!password_verify($password, $user['password'])) {
            // Log failed attempt - wrong password
            $security = new \App\Libraries\SecurityMonitor();
            $security->logFailedLogin($identifier, 'member');
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
