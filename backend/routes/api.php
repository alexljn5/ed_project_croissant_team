<?php

use Illuminate\Support\Facades\Route;

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
