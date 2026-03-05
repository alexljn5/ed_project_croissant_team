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

// GET content (public, no auth needed)
Route::get('/content/{key}', function ($key) {
    $content = PageContent::select(['id', 'key', 'value'])
        ->where('key', $key)
        ->first();
    
    if (!$content) {
        return response()->json(['value' => null]);
    }
    
    // Ensure the value is properly decoded from JSON
    $value = $content->value;
    
    // If it's a string (not yet decoded), decode it
    if (is_string($value)) {
        $decoded = json_decode($value, true);
        $value = (json_last_error() === JSON_ERROR_NONE) ? $decoded : $value;
    }
    
    return response()->json(['value' => $value]);
});

// POST content (admin only - opslaan)
Route::post('/content/{key}', function (Request $request, $key) {
    try {
        $value = $request->input('value');

        if ($value === null) {
            return response()->json(['error' => 'value field is required'], 400);
        }

        // Ensure value is properly stored as JSON if it's an array
        $toStore = is_array($value) ? json_encode($value, JSON_UNESCAPED_UNICODE) : $value;

        $content = PageContent::updateOrCreate(
            ['key' => $key],
            ['value' => $toStore]
        );

        \Log::info("✓ Content saved: key=$key");

        return response()->json([
            'success' => true,
            'message' => 'Content saved successfully',
            'value' => $value
        ], 200);
    } catch (\Exception $e) {
        \Log::error("Content save error: $e");
        return response()->json([
            'error' => 'Failed to save content',
            'message' => $e->getMessage()
        ], 500);
    }
})->middleware('admin.token');

// NEW: Photo upload endpoint (admin only)
Route::post('/upload-photo', function (Request $request) {
    $request->validate([
        'photo' => 'required|image|max:10240', // Max 10MB
    ]);

    try {
        $path = $request->file('photo')->store('photos', 'public');

        if (!$path) {
            throw new \Exception('File storage failed');
        }

        $url = asset('storage/' . $path);

        \Log::info("✓ Photo uploaded: $path");

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
            'error' => 'Upload failed',
            'message' => $e->getMessage()
        ], 400);
    }
})->middleware('admin.token');
