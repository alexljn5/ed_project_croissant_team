<?php

return [
    'password_hash' => env('ADMIN_PASSWORD_HASH', ''),
    'token_lifetime' => env('ADMIN_TOKEN_LIFETIME', 24 * 60), // 24 hours in minutes
];
