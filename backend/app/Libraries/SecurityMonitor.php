<?php

namespace App\Libraries;

use CodeIgniter\Email\Email;

class SecurityMonitor
{
    protected $email;
    protected $securityEmail;
    protected $appName = 'Lutheran Church Management System';
    
    public function __construct()
    {
        $this->email = \Config\Services::email();
        $this->securityEmail = getenv('SECURITY_ALERT_EMAIL') ?: 'sivaji@digitalks.in';
    }
    
    /**
     * Send security incident email
     */
    protected function sendSecurityAlert(string $subject, string $message, array $details = [])
    {
        try {
            $config = config('Email');
            $fromEmail = $config->fromEmail ?? 'noreply@lutheranchurch.org';
            $fromName = $config->fromName ?? ($this->appName . ' Security');

            $this->email->setFrom($fromEmail, $fromName);
            $this->email->setTo($this->securityEmail);
            $this->email->setSubject('[SECURITY ALERT] ' . $subject);
            
            // Build comprehensive email body
            $body = $this->buildEmailBody($subject, $message, $details);
            
            $this->email->setMessage($body);
            
            // Send email
            if ($this->email->send()) {
                log_message('info', 'Security alert email sent: ' . $subject);
                return true;
            } else {
                log_message('error', 'Failed to send security alert: ' . $this->email->printDebugger());
                return false;
            }
        } catch (\Exception $e) {
            log_message('error', 'Security email exception: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Build detailed email body
     */
    protected function buildEmailBody(string $subject, string $message, array $details): string
    {
        $timestamp = date('Y-m-d H:i:s');
        $serverInfo = [
            'Server IP' => $_SERVER['SERVER_ADDR'] ?? 'Unknown',
            'Server Name' => $_SERVER['SERVER_NAME'] ?? 'Unknown',
            'Environment' => ENVIRONMENT,
        ];
        
        $body = "<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #dc3545; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .alert-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .details-table th, .details-table td { padding: 10px; border: 1px solid #ddd; text-align: left; }
        .details-table th { background: #f8f9fa; font-weight: bold; }
        .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; }
        .severity-high { color: #dc3545; font-weight: bold; }
        .severity-medium { color: #ffc107; font-weight: bold; }
    </style>
</head>
<body>
    <div class='header'>
        <h1>🚨 SECURITY INCIDENT DETECTED</h1>
        <p>{$this->appName}</p>
    </div>
    
    <div class='content'>
        <div class='alert-box'>
            <h2>{$subject}</h2>
            <p><strong>Time:</strong> {$timestamp}</p>
            <p><strong>Message:</strong> {$message}</p>
        </div>
        
        <h3>Incident Details</h3>
        <table class='details-table'>
            <thead>
                <tr>
                    <th>Parameter</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>";
        
        // Add custom details
        foreach ($details as $key => $value) {
            $body .= "<tr><td>{$key}</td><td>" . htmlspecialchars($value) . "</td></tr>";
        }
        
        // Add server info
        foreach ($serverInfo as $key => $value) {
            $body .= "<tr><td>{$key}</td><td>{$value}</td></tr>";
        }
        
        $body .= "
            </tbody>
        </table>
        
        <h3>Recommended Actions</h3>
        <ul>
            <li>Review the incident details above</li>
            <li>Check application logs for additional context</li>
            <li>Verify if this is a legitimate security threat</li>
            <li>Take appropriate action (block IP, disable account, etc.)</li>
            <li>Monitor for similar incidents</li>
        </ul>
        
        <h3>Quick Access</h3>
        <p>
            <a href='https://your-domain.com/admin' style='background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>
                Go to Admin Dashboard
            </a>
        </p>
    </div>
    
    <div class='footer'>
        <p>This is an automated security alert from {$this->appName}</p>
        <p>Do not reply to this email. For support, contact your system administrator.</p>
    </div>
</body>
</html>";
        
        return $body;
    }
    
    /**
     * Log failed login attempt
     */
    public function logFailedLogin(string $identifier, string $type = 'admin', string $ip = null)
    {
        $ip = $ip ?? service('request')->getIPAddress();
        
        // Log to file
        log_message('warning', "Failed {$type} login attempt - Identifier: {$identifier}, IP: {$ip}");
        
        // Check if this IP has multiple failed attempts
        $cache = \Config\Services::cache();
        $key = 'failed_login_' . md5($ip);
        $attempts = $cache->get($key) ?? 0;
        $attempts++;
        $cache->save($key, $attempts, 3600); // Track for 1 hour
        
        // Send email alert after 3 failed attempts
        if ($attempts >= 3) {
            $this->sendSecurityAlert(
                'Multiple Failed Login Attempts Detected',
                "There have been {$attempts} failed login attempts from the same IP address in the last hour.",
                [
                    'Login Type' => ucfirst($type),
                    'Identifier Used' => $identifier,
                    'IP Address' => $ip,
                    'Failed Attempts' => $attempts,
                    'Time Window' => 'Last 1 hour',
                    'User Agent' => service('request')->getUserAgent()->getAgentString(),
                    'Severity' => 'HIGH'
                ]
            );
        }
        
        return $attempts;
    }
    
    /**
     * Log rate limit violation
     */
    public function logRateLimitViolation(string $route, string $ip = null)
    {
        $ip = $ip ?? service('request')->getIPAddress();
        
        log_message('warning', "Rate limit exceeded - Route: {$route}, IP: {$ip}");
        
        $this->sendSecurityAlert(
            'Rate Limit Violation Detected',
            "An IP address has exceeded the rate limit for API requests.",
            [
                'Route' => $route,
                'IP Address' => $ip,
                'User Agent' => service('request')->getUserAgent()->getAgentString(),
                'Timestamp' => date('Y-m-d H:i:s'),
                'Severity' => 'MEDIUM'
            ]
        );
    }
    
    /**
     * Log unauthorized access attempt
     */
    public function logUnauthorizedAccess(string $resource, string $userId = null, string $ip = null)
    {
        $ip = $ip ?? service('request')->getIPAddress();
        
        log_message('warning', "Unauthorized access attempt - Resource: {$resource}, User: {$userId}, IP: {$ip}");
        
        $this->sendSecurityAlert(
            'Unauthorized Access Attempt',
            "A user attempted to access a resource without proper authorization.",
            [
                'Resource' => $resource,
                'User ID' => $userId ?? 'Anonymous',
                'IP Address' => $ip,
                'Request Method' => service('request')->getMethod(),
                'User Agent' => service('request')->getUserAgent()->getAgentString(),
                'Severity' => 'HIGH'
            ]
        );
    }
    
    /**
     * Log suspicious activity
     */
    public function logSuspiciousActivity(string $activity, array $details = [])
    {
        $ip = service('request')->getIPAddress();
        
        log_message('warning', "Suspicious activity detected - Activity: {$activity}, IP: {$ip}");
        
        $details['IP Address'] = $ip;
        $details['User Agent'] = service('request')->getUserAgent()->getAgentString();
        $details['Timestamp'] = date('Y-m-d H:i:s');
        $details['Severity'] = $details['Severity'] ?? 'MEDIUM';
        
        $this->sendSecurityAlert(
            'Suspicious Activity Detected',
            $activity,
            $details
        );
    }
    
    /**
     * Log SQL injection attempt
     */
    public function logSQLInjectionAttempt(string $input, string $field = null)
    {
        $ip = service('request')->getIPAddress();
        
        log_message('warning', "Possible SQL injection attempt - Field: {$field}, IP: {$ip}");
        
        $this->sendSecurityAlert(
            'Possible SQL Injection Attempt',
            "A request contained patterns commonly associated with SQL injection attacks.",
            [
                'Field' => $field ?? 'Unknown',
                'Suspicious Input' => substr($input, 0, 200), // First 200 chars
                'IP Address' => $ip,
                'Request URI' => service('request')->getUri()->getPath(),
                'User Agent' => service('request')->getUserAgent()->getAgentString(),
                'Severity' => 'CRITICAL'
            ]
        );
    }
    
    /**
     * Log XSS attempt
     */
    public function logXSSAttempt(string $input, string $field = null)
    {
        $ip = service('request')->getIPAddress();
        
        log_message('warning', "Possible XSS attempt - Field: {$field}, IP: {$ip}");
        
        $this->sendSecurityAlert(
            'Possible XSS Attack Attempt',
            "A request contained patterns commonly associated with Cross-Site Scripting attacks.",
            [
                'Field' => $field ?? 'Unknown',
                'Suspicious Input' => substr($input, 0, 200),
                'IP Address' => $ip,
                'Request URI' => service('request')->getUri()->getPath(),
                'User Agent' => service('request')->getUserAgent()->getAgentString(),
                'Severity' => 'HIGH'
            ]
        );
    }
    
    /**
     * Log password change
     */
    public function logPasswordChange(string $userId, string $userType = 'member')
    {
        $ip = service('request')->getIPAddress();
        
        log_message('info', "Password changed - User: {$userId}, Type: {$userType}, IP: {$ip}");
        
        $this->sendSecurityAlert(
            'Password Changed',
            "A user password has been changed.",
            [
                'User ID' => $userId,
                'User Type' => ucfirst($userType),
                'IP Address' => $ip,
                'Timestamp' => date('Y-m-d H:i:s'),
                'Severity' => 'INFO'
            ]
        );
    }
    
    /**
     * Log account lockout
     */
    public function logAccountLockout(string $identifier, int $failedAttempts)
    {
        $ip = service('request')->getIPAddress();
        
        log_message('warning', "Account locked - Identifier: {$identifier}, Attempts: {$failedAttempts}, IP: {$ip}");
        
        $this->sendSecurityAlert(
            'Account Locked Due to Failed Login Attempts',
            "An account has been automatically locked after multiple failed login attempts.",
            [
                'Account Identifier' => $identifier,
                'Failed Attempts' => $failedAttempts,
                'IP Address' => $ip,
                'Locked At' => date('Y-m-d H:i:s'),
                'Action Required' => 'Admin must manually unlock the account',
                'Severity' => 'HIGH'
            ]
        );
    }
    
    /**
     * Log data export
     */
    public function logDataExport(string $dataType, int $recordCount, string $userId)
    {
        $ip = service('request')->getIPAddress();
        
        log_message('info', "Data exported - Type: {$dataType}, Records: {$recordCount}, User: {$userId}, IP: {$ip}");
        
        // Only alert for large exports
        if ($recordCount > 100) {
            $this->sendSecurityAlert(
                'Large Data Export Detected',
                "A user has exported a large amount of data from the system.",
                [
                    'Data Type' => $dataType,
                    'Record Count' => $recordCount,
                    'User ID' => $userId,
                    'IP Address' => $ip,
                    'Export Time' => date('Y-m-d H:i:s'),
                    'Severity' => 'MEDIUM'
                ]
            );
        }
    }
}
