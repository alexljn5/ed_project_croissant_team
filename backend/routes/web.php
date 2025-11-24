<?php

use Illuminate\Support\Facades\Route;

Route::get('/api/hello', function () {
    return response()->json(['message' => 'Hello from web routes!']);
});