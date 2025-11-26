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

        // fallback to empty array
        $items = $content->value ?? [];

        // Ensure array of plain strings
        if (!is_array($items)) {
            $items = [$items];
        }

        $items = array_map(fn($item) => trim(strip_tags((string) $item)), $items);

        return response()->json(['value' => $items]);
    }

    // POST /api/content/{key}
    public function update(Request $request, $key)
    {
        $data = $request->input('value', []);
        if (!is_array($data)) {
            $data = [$data];
        }

        // sanitize strings
        $clean = array_map(fn($item) => trim(strip_tags((string) $item)), $data);

        PageContent::updateOrCreate(
            ['key' => $key],
            ['value' => $clean]
        );

        return response()->json(['success' => true, 'value' => $clean]);
    }
}
