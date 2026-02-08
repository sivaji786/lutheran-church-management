<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Config\Services;

class JWTAuth implements FilterInterface
{
    /**
     * Centralized JWT validation
     */
    public function before(RequestInterface $request, $arguments = null)
    {
        // Skip authentication for OPTIONS requests (CORS preflight)
        if (strtolower($request->getMethod()) === 'options') {
            return null;
        }

        $header = $request->getServer('HTTP_AUTHORIZATION');
        
        if (!$header) {
            return $this->addCorsHeaders(Services::response())
                ->setStatusCode(401)
                ->setJSON([
                    'success' => false,
                    'message' => 'Authorization header missing'
                ]);
        }

        $token = null;
        if (preg_match('/Bearer\s(\S+)/', $header, $matches)) {
            $token = $matches[1];
        }

        if (!$token) {
            return $this->addCorsHeaders(Services::response())
                ->setStatusCode(401)
                ->setJSON([
                    'success' => false,
                    'message' => 'Token not provided'
                ]);
        }

        try {
            $key = getenv('JWT_SECRET');
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            
            // Attach user data to request object for use in controllers
            $request->user = $decoded;
            
            return $request;
        } catch (\Exception $e) {
            return $this->addCorsHeaders(Services::response())
                ->setStatusCode(401)
                ->setJSON([
                    'success' => false,
                    'message' => 'Invalid or expired token',
                    'error' => $e->getMessage()
                ]);
        }
    }

    private function addCorsHeaders($response)
    {
        $request = Services::request();
        $origin = $request->getHeaderLine('Origin');
        
        // Determine allowed origin (similar to Cors.php)
        $allowedOrigin = '*';
        $envAllowedOrigins = getenv('CORS_ALLOWED_ORIGINS');
        $allowedOrigins = $envAllowedOrigins ? explode(',', $envAllowedOrigins) : [];

        if (ENVIRONMENT === 'development') {
            if (empty($origin) || preg_match('/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/', $origin)) {
                $allowedOrigin = $origin ?: '*';
            }
        } 
        
        if (in_array($origin, $allowedOrigins)) {
            $allowedOrigin = $origin;
        }

        // Return first allowed origin instead of '*' to stay compatible with credentials: true
        if ($allowedOrigin === '*' && !empty($allowedOrigins)) {
            $allowedOrigin = $allowedOrigins[0];
        } elseif ($allowedOrigin === '*' && ENVIRONMENT === 'development') {
            $allowedOrigin = $origin ?: '*';
        }

        return $response
            ->setHeader('Access-Control-Allow-Origin', $allowedOrigin)
            ->setHeader('Access-Control-Allow-Headers', 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization')
            ->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, PATCH')
            ->setHeader('Access-Control-Allow-Credentials', 'true');
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // No action needed after request
    }
}
