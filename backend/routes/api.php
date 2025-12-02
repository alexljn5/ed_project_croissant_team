<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\PageContent;

/*
|--------------------------------------------------------------------------
| API Routes (CSRF-vrij door Route::api())
|--------------------------------------------------------------------------
*/

Route::get('/hello', fn() => [
    'message' => 'CROISSANT TEAM WINS — FINAL VICTORY 2025!!!',
    'time' => now()->toIso8601String(),
]);

<<<<<<< HEAD
    // === Health Check ===
    Route::get('/hello', function () {
        return response()->json(['message' => 'Hello from API!']);
    });

    // === API Content Routes (using PageContent model) ===
    Route::get('/content/{key}', [\App\Http\Controllers\Api\ContentController::class, 'show']);
    Route::post('/content/{key}', [\App\Http\Controllers\Api\ContentController::class, 'update']);
    Route::post('/upload-photo', [\App\Http\Controllers\Api\ContentController::class, 'uploadPhoto']);

    // Simple health/handshake route for the frontend
    Route::get('/hello', function () {
        return response()->json(['message' => 'hello from backend']);
    });

=======
// GET content
Route::get('/content/{key}', function ($key) {
    $content = PageContent::firstWhere('key', $key);
    return response()->json(['value' => $content?->value ?? null]);
});

// POST content (opslaan)
Route::post('/content/{key}', function (Request $request, $key) {
    $value = $request->input('value');
    PageContent::updateOrCreate(['key' => $key], ['value' => $value]);
    return response()->json(['success' => true, 'value' => $value]);
>>>>>>> debug
});