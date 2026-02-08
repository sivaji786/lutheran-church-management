<?php

namespace App\Traits;

use App\Models\ActivityLogModel;
use CodeIgniter\API\ResponseTrait;

trait LoggableTrait
{
    /**
     * Log an activity
     *
     * @param string $action Action performed (e.g., 'Create', 'Update')
     * @param string $module Module affected (e.g., 'Members', 'Offerings')
     * @param string|int|null $targetId ID of the affected record
     * @param string|null $details Description of the action
     * @return void
     */
    protected function logActivity($action, $module, $targetId = null, $details = null)
    {
        try {
            $activityLogModel = new ActivityLogModel();
            
            // Get admin details from JWT token or request
            // Assuming the Auth filter sets the user info in the request or we decode token here
            // For now, we will try to get it from the 'user' attribute set by authentication filter
            $user = $this->request->getHeaderLine('X-Admin-ID'); // Fallback or if passed by gateway
            
            // Better approach: Use the authenticated user from the controller instance if available
            // This depends on how your BaseController or Auth Middleware handles user context.
            // Assuming 'request->user' is populated by the Auth Filter.
            
            $adminId = null;
            $adminName = 'System/Unknown';
            
            // Check if we have user info attached to request (common pattern)
            if (isset($this->request->user)) {
                $adminId = $this->request->user->id;
                $adminName = $this->request->user->name ?? $this->request->user->email;
            } 
            // Fallback: Try decoding JWT manually if needed, or rely on what's passed
            // For this implementation, let's assume the AuthFilter isn't globally setting $this->request->user yet
            // So we might need to decode the token again or rely on what's available.
            
            // SIMPLIFICATION:
            // Since we are inside controllers that usually have access to the current session or token
            // We will do a quick check. If not found, we log as 'System'.
            
            // If the controller has specific user property
            if (property_exists($this, 'currentUser') && $this->currentUser) {
                $adminId = $this->currentUser['id'];
                $adminName = $this->currentUser['name'];
            }

            // Capture IP
            $ip = $this->request->getIPAddress();
            
            $activityLogModel->insert([
                'admin_id'   => $adminId,
                'admin_name' => $adminName,
                'module'     => $module,
                'action'     => $action,
                'target_id'  => $targetId,
                'details'    => $details,
                'ip_address' => $ip,
                'created_at' => date('Y-m-d H:i:s')
            ]);
            
        } catch (\Exception $e) {
            // Do not break the app if logging fails, just log to error file
            log_message('error', 'Activity Logging Failed: ' . $e->getMessage());
        }
    }
}
