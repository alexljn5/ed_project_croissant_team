<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use App\Models\PageContent;

/*
|--------------------------------------------------------------------------
| API Routes (CSRF-vrij door Route::api())
|--------------------------------------------------------------------------
*/

// ADMIN LOGIN ENDPOINT
Route::post('/admin/login', function (Request $request) {
    $request->validate([
        'password' => 'required|string',
    ]);

    $providedPassword = $request->password;
    $hashedPassword = config('admin.password_hash');

    if (!$hashedPassword || !Hash::check($providedPassword, $hashedPassword)) {
        return response()->json(['error' => 'Invalid password'], 401);
    }

    // Generate a random token and store in cache
    $token = Str::random(80);
    $tokenLifetime = config('admin.token_lifetime', 24 * 60); // minutes
    Cache::put('admin_token:' . $token, true, now()->addMinutes($tokenLifetime));

    return response()->json([
        'token' => $token,
        'message' => 'Admin authenticated successfully'
    ], 200);
});

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

// NEW: Photo upload endpoint
Route::post('/upload-photo', function (Request $request) {
    $request->validate([
        'photo' => 'required|image|max:10240', // Max 10MB
    ]);

    try {
        // Store the file in the 'public' disk (usually storage/app/public/photos)
        $path = $request->file('photo')->store('photos', 'public');
        
        if (!$path) {
            throw new \Exception('File storage failed');
        }
        
        // Construct the public URL manually (using asset helper)
        $url = asset('storage/' . $path);
        
        return response()->json([
            'success' => true,
            'path' => $path,
            'url' => $url,
            'message' => 'Foto succesvol geüpload!'
        ]);
    } catch (\Exception $e) {
        \Log::error('Upload error: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Upload failed: ' . $e->getMessage()
        ], 400);
    }
});