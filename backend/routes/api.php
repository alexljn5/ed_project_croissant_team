<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Content;

Route::get('/hello', fn() => ['message' => 'CROISSANT TEAM WINS — FINAL VICTORY 2025!!!']);

Route::get('/content/{key}', function (string $key) {
    $item = Content::where('key', $key)->first();
    return response()->json([
        'value' => $item?->value ?? null
    ]);
});

Route::post('/content/{key}', function (Request $request, string $key) {
    $value = $request->input('value');

    Content::updateOrCreate(
        ['key' => $key],
        ['value' => $value]
    );

    return response()->json([
        'success' => true,
        'key' => $key,
        'value' => $value
    ]);
});