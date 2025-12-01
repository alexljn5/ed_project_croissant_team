<?php

use App\Http\Controllers\Api\ContentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::get('/hello', function () {
    return response()->json([
        'message' => 'CROISSANT TEAM WINS FOREVER!!!',
        'time' => now()->toIso8601String(),
    ]);
});

Route::get('/', function () {
    return response()->json(['status' => 'Laravel API is alive and kicking!']);
});

// Fix: Match the exact path your frontend is requesting
Route::get('/content/{key}', [ContentController::class, 'show']);
Route::post('/content/{key}', [ContentController::class, 'update']);
