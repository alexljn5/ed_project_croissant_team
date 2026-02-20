<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Models\Content;

Route::get(uri: '/newEmpty', action: function (): View {
    return view(view: 'empty');
});

// Dev-only helper: serve files from storage/app/public when public/storage symlink isn't available.
// This should only be used in development. In production, use a proper public storage symlink or CDN.
Route::get('/storage/{path}', function ($path, Request $request) {
    $base = storage_path('app/public');
    $file = realpath($base . DIRECTORY_SEPARATOR . $path);

    // Prevent directory traversal
    if ($file === false || strpos($file, realpath($base)) !== 0) {
        abort(404);
    }

    if (!file_exists($file)) {
        abort(404);
    }

    return response()->file($file);
})->where('path', '.*');