<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PageContent;
use Illuminate\Support\Facades\Storage;

class ContentController extends Controller
{
    public function show($key)
    {
        $content = PageContent::firstWhere('key', $key);

        if (!$content) {
            return response()->json(['value' => null]);
        }

        $value = $content->value;

        // SUPER IMPORTANT: Auto-decode JSON strings!
        $decoded = json_decode($value, true);
        return response()->json([
            'value' => (json_last_error() === JSON_ERROR_NONE) ? $decoded : $value
        ]);
    }

    public function update(Request $request, $key)
    {
        $input = $request->input('value');

        // If it's array/object → save as JSON string in DB
        $toStore = is_array($input) || is_object($input)
            ? json_encode($input, JSON_UNESCAPED_UNICODE)
            : $input;

        PageContent::updateOrCreate(
            ['key' => $key],
            ['value' => $toStore]
        );

        return response()->json(['success' => true, 'value' => $input]);
    }

    public function uploadPhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,gif,webp|max:10240'
        ]);

        $path = $request->file('photo')->store('photos', 'public');

        $url = asset('storage/' . $path);

        return response()->json([
            'success' => true,
            'url' => $url . '?t=' . time(), // cache bust
            'path' => $path
        ]);
    }
}
