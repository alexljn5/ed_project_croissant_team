<?php

use Illuminate\Support\Facades\Route;

Route::get('/hello', function () {
    return ['message' => 'CROISSANT TEAM WINS — FINAL VICTORY 2025!!!'];
});

Route::get('/', function () {
    return ['status' => 'API is running'];
});
