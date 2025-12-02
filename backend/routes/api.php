<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::middleware('api')->group(function () {

    // === API Content Routes (using PageContent model) ===
    Route::get('/content/{key}', [\App\Http\Controllers\Api\ContentController::class, 'show']);
    Route::post('/content/{key}', [\App\Http\Controllers\Api\ContentController::class, 'update']);
    Route::post('/upload-photo', [\App\Http\Controllers\Api\ContentController::class, 'uploadPhoto']);

    // Simple health/handshake route for the frontend
    Route::get('/hello', function () {
        return response()->json(['message' => 'hello from backend']);
    });

});