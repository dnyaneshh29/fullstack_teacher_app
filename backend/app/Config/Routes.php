<?php

namespace Config;

// Create a new instance of our RouteCollection class.
$routes = Services::routes();

/*
 * --------------------------------------------------------------------
 * Router Setup
 * --------------------------------------------------------------------
 */
$routes->setDefaultNamespace('App\Controllers');
$routes->setDefaultController('Home');
$routes->setDefaultMethod('index');
$routes->setTranslateURIDashes(false);
$routes->set404Override();
$routes->setAutoRoute(false);

/*
 * --------------------------------------------------------------------
 * Route Definitions
 * --------------------------------------------------------------------
 */

// We get a performance increase by specifying the default
// route since we don't have to scan directories.
$routes->get('/', 'Home::index');


// --- API Routes ---
$routes->group('api', function ($routes) {
    // Use match for routes that need to handle preflight OPTIONS requests from the browser
    $routes->match(['post', 'options'], 'login', 'Api\Auth::login');
    $routes->match(['post', 'options'], 'register', 'Api\Auth::register');

    // NEW: Separate routes for users and teachers data
    $routes->match(['get', 'options'], 'users', 'Api\Teacher::getUsers', ['filter' => 'auth']);
    $routes->match(['get', 'options'], 'teachers', 'Api\Teacher::getTeachers', ['filter' => 'auth']);
});


/*
 * --------------------------------------------------------------------
 * Additional Routing
 * --------------------------------------------------------------------
 */
if (is_file(APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php')) {
    require APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php';
}