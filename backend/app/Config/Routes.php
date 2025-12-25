<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

// Helper function for CORS OPTIONS responses
$corsResponse = function() {
    $response = service('response');
    $request = service('request');
    $origin = $request->getHeaderLine('Origin');
    
    // Allow localhost origins in development
    if (ENVIRONMENT === 'development' && preg_match('/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/', $origin)) {
        $allowedOrigin = $origin;
    } else {
        $allowedOrigin = '*';
    }
    
    $response->setHeader('Access-Control-Allow-Origin', $allowedOrigin);
    $response->setHeader('Access-Control-Allow-Headers', 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization');
    $response->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');
    $response->setHeader('Access-Control-Allow-Credentials', 'true');
    $response->setHeader('Access-Control-Max-Age', '86400');
    $response->setStatusCode(200);
    $response->setBody('');
    return $response;
};

// CORS preflight OPTIONS routes - must come before other routes
$routes->options('auth/admin/login', $corsResponse);
$routes->options('auth/member/login', $corsResponse);
$routes->options('auth/change-password', $corsResponse);
$routes->options('members', $corsResponse);
$routes->options('members/(:any)', $corsResponse);
$routes->options('members/(:any)/offerings', $corsResponse);
$routes->options('members/(:any)/status', $corsResponse);
$routes->options('members/(:any)/reset-password', $corsResponse);
$routes->options('offerings', $corsResponse);
$routes->options('offerings/(:any)', $corsResponse);
$routes->options('tickets', $corsResponse);
$routes->options('tickets/(:any)', $corsResponse);
$routes->options('tickets/(:any)/status', $corsResponse);
$routes->options('non-member-offerings', $corsResponse);
$routes->options('non-member-offerings/(:any)', $corsResponse);
$routes->options('non-member-offerings/statistics', $corsResponse);
$routes->options('dashboard/stats', $corsResponse);

// Route configuration

// Authentication
$routes->group('auth', function($routes) {
    $routes->post('admin/login', 'Auth::adminLogin');
    $routes->post('member/login', 'Auth::memberLogin');
    $routes->post('change-password', 'Auth::changePassword');
});

// Members
$routes->group('members', function($routes) {
    $routes->get('/', 'Members::index');
    $routes->get('(:segment)', 'Members::show/$1');
    $routes->post('/', 'Members::create');
    $routes->put('(:segment)', 'Members::update/$1');
    $routes->patch('(:segment)/status', 'Members::updateStatus/$1');
    $routes->post('(:segment)/reset-password', 'Members::resetPassword/$1');
    $routes->get('(:segment)/offerings', 'Offerings::memberOfferings/$1');
});

// Offerings
$routes->group('offerings', function($routes) {
    $routes->get('/', 'Offerings::index');
    $routes->post('/', 'Offerings::create');
    $routes->put('(:segment)', 'Offerings::update/$1');
    $routes->delete('(:segment)', 'Offerings::delete/$1');
});

// Tickets
$routes->group('tickets', function($routes) {
    $routes->get('/', 'Tickets::index');
    $routes->get('(:segment)', 'Tickets::show/$1');
    $routes->post('/', 'Tickets::create');
    $routes->put('(:segment)', 'Tickets::update/$1');
    $routes->patch('(:segment)/status', 'Tickets::updateStatus/$1');
});

// Non-Member Offerings
$routes->group('non-member-offerings', function($routes) {
    $routes->get('/', 'NonMemberOfferings::index');
    $routes->post('/', 'NonMemberOfferings::create');
    $routes->put('(:segment)', 'NonMemberOfferings::update/$1');
    $routes->delete('(:segment)', 'NonMemberOfferings::delete/$1');
    $routes->get('statistics', 'NonMemberOfferings::statistics');
});

// Dashboard
$routes->get('dashboard/stats', 'Dashboard::stats');
