<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PageContent;

class ContentController extends Controller
{
    // GET /api/content/{key}
    public function show($key)
    {
        $content = PageContent::firstWhere('key', $key);

        // fallback to empty array if content not found
        if (!$content) {
            return response()->json(['value' => null]);
        }

        $value = $content->value;

        // Return the value as-is (can be string or array)
        // The controller should not force it into any particular format
        return response()->json(['value' => $value]);
    }

    // POST /api/content/{key}
    public function update(Request $request, $key)
    {
        $data = $request->input('value', []);

        // Helper function to recursively sanitize nested data
        $sanitize = function ($value) use (&$sanitize) {
            if (is_string($value)) {
                return trim(strip_tags($value));
            } elseif (is_array($value)) {
                // Check if it's a simple array or array of objects
                $isAssoc = !empty($value) && array_keys($value) !== range(0, count($value) - 1);

                if ($isAssoc) {
                    // It's an associative array (object-like), preserve structure
                    $result = [];
                    foreach ($value as $k => $v) {
                        $result[$k] = $sanitize($v);
                    }
                    return $result;
                } else {
                    // It's a numeric array, sanitize each item
                    return array_map(fn($item) => $sanitize($item), $value);
                }
            }
            return $value;
        };

        $clean = $sanitize($data);

        PageContent::updateOrCreate(
            ['key' => $key],
            ['value' => $clean]
        );

        return response()->json(['success' => true, 'value' => $clean]);
    }

    // POST /api/upload-photo
    public function uploadPhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,gif,webp|max:5120' // max 5MB
        ]);

        $file = $request->file('photo');

        // Store in storage/app/public/photos
        $path = $file->store('photos', 'public');

        // Return the URL
        return response()->json([
            'success' => true,
            'url' => asset('storage/' . $path),
            'path' => $path
        ]);
    }
}
