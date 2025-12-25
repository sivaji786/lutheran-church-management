<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class Cors implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        // CORS headers are added in the after() method
        // OPTIONS requests are handled by routes in Routes.php
        return null;
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // Determine allowed origin based on environment
        $allowedOrigin = $this->getAllowedOrigin($request);
        
        // Add CORS headers to response
        $response->setHeader('Access-Control-Allow-Origin', $allowedOrigin);
        $response->setHeader('Access-Control-Allow-Headers', 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization');
        $response->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');
        $response->setHeader('Access-Control-Allow-Credentials', 'true');
        
        return $response;
    }
    
    private function getAllowedOrigin(RequestInterface $request): string
    {
        $origin = $request->getHeaderLine('Origin');
        
        // In development, allow localhost origins
        if (ENVIRONMENT === 'development') {
            if (preg_match('/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/', $origin)) {
                return $origin;
            }
        }
        
        // In production, only allow the production domain
        if ($origin === 'https://churchcrm.online-project.in') {
            return $origin;
        }
        
        // Default fallback for development
        if (ENVIRONMENT === 'development') {
            return '*';
        }
        
        // Default to production domain
        return 'https://churchcrm.online-project.in';
    }
}
