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
});