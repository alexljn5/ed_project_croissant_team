<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use App\Models\PageContent;
use App\Models\Review;

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
    return response()->json(['value' => $content?->value ?? null]);
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
        \Log::error("❌ Content save error: $e");
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

// REVIEWS ENDPOINTS
// GET all reviews (public)
Route::get('/reviews', function () {
    $reviews = Review::orderBy('created_at', 'desc')->get();
    return response()->json($reviews);
});

// POST a new review (public)
Route::post('/reviews', function (Request $request) {
    $request->validate([
        // text and stars are optional now so admin can seed images only
        'text' => 'nullable|string',
        'stars' => 'nullable|integer|between:0,5',
        'name' => 'nullable|string',
        'email' => 'nullable|email',
        'anonymous' => 'boolean',
        'image_url' => 'nullable|string',
        'pending' => 'boolean',
    ]);

    try {
        $review = Review::create([
            'text' => $request->input('text', ''),
            'stars' => $request->input('stars', 0),
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'anonymous' => $request->input('anonymous', true),
            'image_url' => $request->input('image_url'),
            'pending' => $request->input('pending', false),
        ]);

        return response()->json([
            'success' => true,
            'review' => $review,
            'message' => 'Review succesvol opgeslagen!'
        ], 201);
    } catch (\Exception $e) {
        \Log::error('Review save error: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'error' => 'Failed to save review',
            'message' => $e->getMessage()
        ], 500);
    }
});

// PATCH/update an existing review (used when someone "reviews" an admin-uploaded image)
Route::patch('/reviews/{id}', function (Request $request, $id) {
    $request->validate([
        'text' => 'nullable|string',
        'stars' => 'nullable|integer|between:0,5',
        'name' => 'nullable|string',
        'email' => 'nullable|email',
        'anonymous' => 'boolean',
        'image_url' => 'nullable|string',
    ]);

    try {
        $review = Review::findOrFail($id);

        $review->text = $request->input('text', $review->text);
        $review->stars = $request->input('stars', $review->stars);
        $review->name = $request->input('name', $review->name);
        $review->email = $request->input('email', $review->email);
        $review->anonymous = $request->input('anonymous', $review->anonymous);
        $review->image_url = $request->input('image_url', $review->image_url);

        // once edited, clear pending flag so it no longer shows up in the carousel
        $review->pending = false;

        $review->save();

        return response()->json([
            'success' => true,
            'review' => $review,
        ]);
    } catch (\Exception $e) {
        \Log::error('Review update error: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'error' => 'Failed to update review',
            'message' => $e->getMessage()
        ], 500);
    }
});

// DELETE a review (admin only)
Route::delete('/reviews/{id}', function ($id) {
    try {
        $review = Review::findOrFail($id);
        $review->delete();

        return response()->json([
            'success' => true,
            'message' => 'Review verwijderd!'
        ]);
    } catch (\Exception $e) {
        \Log::error('Review delete error: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'error' => 'Failed to delete review',
            'message' => $e->getMessage()
        ], 500);
    }
})->middleware('admin.token');