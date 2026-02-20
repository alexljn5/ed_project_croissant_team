<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin requests are allowed on
    | your API. The "supports credentials" configuration is for allowing
    | requests to include cookies or authorization headers.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // Only allow the dev frontend origins explicitly to support credentials
    'allowed_origins' => [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000',  // Alternative dev port
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];
