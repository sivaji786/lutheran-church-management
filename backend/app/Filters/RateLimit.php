<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class RateLimit implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $ip = $request->getIPAddress();
        $route = $request->getUri()->getPath();
        $key = 'rate_limit_' . md5($ip . $route);
        
        $cache = \Config\Services::cache();
        $attempts = $cache->get($key);
        
        if ($attempts === null) {
            $attempts = 0;
        }
        
        // Allow 10 requests per minute for auth endpoints
        $maxAttempts = 10;
        $ttl = 60; // 1 minute
        
        // Stricter limits for login endpoints
        if (strpos($route, '/auth/') !== false) {
            $maxAttempts = 5;
            $ttl = 300; // 5 minutes
        }
        
        if ($attempts >= $maxAttempts) {
            // Log rate limit violation
            $security = new \App\Libraries\SecurityMonitor();
            $security->logRateLimitViolation($route, $ip);
            
            return service('response')
                ->setStatusCode(429)
                ->setJSON([
                    'success' => false,
                    'message' => 'Too many requests. Please try again later.',
                    'retryAfter' => $ttl
                ]);
        }
        
        $cache->save($key, $attempts + 1, $ttl);
        
        return null;
    }
    
    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // Add rate limit headers
        $ip = $request->getIPAddress();
        $route = $request->getUri()->getPath();
        $key = 'rate_limit_' . md5($ip . $route);
        
        $cache = \Config\Services::cache();
        $attempts = $cache->get($key) ?? 0;
        
        $maxAttempts = strpos($route, '/auth/') !== false ? 5 : 10;
        
        $response->setHeader('X-RateLimit-Limit', (string)$maxAttempts);
        $response->setHeader('X-RateLimit-Remaining', (string)max(0, $maxAttempts - $attempts));
        
        return $response;
    }
}
