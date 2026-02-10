<?php

return [
    'password_hash' => env('ADMIN_PASSWORD_HASH', ''),
    'password_plain' => env('ADMIN_PASSWORD_PLAIN', ''),
    'token_lifetime' => env('ADMIN_TOKEN_LIFETIME', 24 * 60), // 24 hours in minutes
];
