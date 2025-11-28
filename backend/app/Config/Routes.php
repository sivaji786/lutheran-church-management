<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

// Handle OPTIONS requests for CORS preflight
$routes->options('(:any)', function() {
    $response = service('response');
    $response->setStatusCode(200);
    $response->setHeader('Access-Control-Allow-Origin', '*');
    $response->setHeader('Access-Control-Allow-Headers', 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization');
    $response->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');
    $response->setHeader('Access-Control-Max-Age', '86400');
    return $response;
});

$routes->group('api', function($routes) {
    // Authentication
    $routes->group('auth', function($routes) {
        $routes->post('admin/login', 'Auth::adminLogin');
        $routes->post('member/login', 'Auth::memberLogin');
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
});
