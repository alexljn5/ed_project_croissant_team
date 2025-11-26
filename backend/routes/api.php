<?php

use App\Http\Controllers\Api\ContentController;

Route::get('/hello', function () {
    return ['message' => 'CROISSANT TEAM WINS — FINAL VICTORY 2025!!!'];
});

Route::get('/', function () {
    return ['status' => 'API is running'];
});

// Fix: Match the exact path your frontend is requesting
Route::get('/content/{key}', [ContentController::class, 'show']);
Route::post('/content/{key}', [ContentController::class, 'update']);
