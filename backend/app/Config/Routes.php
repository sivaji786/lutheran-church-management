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
$routes->options('auth/admin/verify-2fa', $corsResponse);
$routes->options('auth/member/login', $corsResponse);
$routes->options('auth/change-password', $corsResponse);
$routes->options('members', $corsResponse);
$routes->options('members/(:any)', $corsResponse);
$routes->options('members/(:any)/offerings', $corsResponse);
$routes->options('members/(:any)/status', $corsResponse);
$routes->options('members/(:any)/reset-password', $corsResponse);
$routes->options('members/(:any)/set-family-head', $corsResponse);
$routes->options('members/(:any)', $corsResponse);
$routes->options('members/lookup', $corsResponse);
$routes->options('offerings', $corsResponse);
$routes->options('offerings/(:any)', $corsResponse);
$routes->options('offerings/(:any)/history', $corsResponse);
$routes->options('tickets', $corsResponse);
$routes->options('tickets/(:any)', $corsResponse);
$routes->options('tickets/(:any)/status', $corsResponse);
$routes->options('tickets/(:any)/history', $corsResponse);
$routes->options('non-member-offerings', $corsResponse);
$routes->options('non-member-offerings/(:any)', $corsResponse);
$routes->options('non-member-offerings/statistics', $corsResponse);
$routes->options('dashboard/stats', $corsResponse);
$routes->options('admin/profile', $corsResponse);
$routes->options('admin/change-password', $corsResponse);
$routes->options('admin-users', $corsResponse);
$routes->options('admin-users/(:any)', $corsResponse);
$routes->options('admin-users/(:any)/reset-password', $corsResponse);

// Route configuration

// Authentication
$routes->group('auth', function($routes) {
    $routes->post('admin/login', 'Auth::adminLogin');
    $routes->post('admin/verify-2fa', 'Auth::verifyAdmin2FA');
    $routes->post('member/login', 'Auth::memberLogin');
    $routes->post('change-password', 'Auth::changePassword');
});

// Admin Profile
$routes->group('admin', function($routes) {
    $routes->get('profile', 'Admin::profile');
    $routes->put('profile', 'Admin::updateProfile');
    $routes->post('change-password', 'Admin::changePassword');
});

// Admin Users (Church Users)
$routes->group('admin-users', function($routes) {
    $routes->get('/', 'AdminUsers::index');
    $routes->post('/', 'AdminUsers::create');
    $routes->put('(:segment)', 'AdminUsers::update/$1');
    $routes->delete('(:segment)', 'AdminUsers::delete/$1');
    $routes->post('(:segment)/reset-password', 'AdminUsers::resetPassword/$1');
});


// Members
$routes->group('members', function($routes) {
    $routes->get('lookup', 'Members::lookup');
    $routes->get('/', 'Members::index');
    $routes->get('(:segment)', 'Members::show/$1');
    $routes->post('/', 'Members::create');
    $routes->put('(:segment)', 'Members::update/$1');
    $routes->patch('(:segment)/status', 'Members::updateStatus/$1');
    $routes->post('(:segment)/reset-password', 'Members::resetPassword/$1');
    $routes->post('(:segment)/set-family-head', 'Members::setFamilyHead/$1');
    $routes->delete('(:segment)', 'Members::delete/$1');
    $routes->get('(:segment)/offerings', 'Offerings::memberOfferings/$1');
});

// Offerings
$routes->group('offerings', function($routes) {
    $routes->get('/', 'Offerings::index');
    $routes->post('/', 'Offerings::create');
    $routes->put('(:segment)', 'Offerings::update/$1');
    $routes->get('(:segment)/history', 'Offerings::history/$1');
    $routes->delete('(:segment)', 'Offerings::delete/$1');
});

// Tickets
$routes->group('tickets', function($routes) {
    $routes->get('/', 'Tickets::index');
    $routes->get('(:segment)', 'Tickets::show/$1');
    $routes->post('/', 'Tickets::create');
    $routes->put('(:segment)', 'Tickets::update/$1');
    $routes->patch('(:segment)/status', 'Tickets::updateStatus/$1');
    $routes->get('(:segment)/history', 'Tickets::getHistory/$1');
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

// Email Debugging Tool
$routes->get('email-test', 'EmailTest::index');
