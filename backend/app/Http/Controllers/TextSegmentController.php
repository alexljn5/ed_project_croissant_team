<?php

namespace App\Http\Controllers;

use App\Models\TextSegment;
use Illuminate\Http\Request;

class TextSegmentController extends Controller
{
    /**
     * GET /api/text-segments
     */
public function index()
{
    $segments = TextSegment::orderBy('order_index')->get();  // alle records, gesorteerd

    return response()->json($segments);  // retourneert altijd een array []
    // zelfs als leeg: []
}

    /**
     * PUT /api/text-segments
     */
public function update(Request $request)
{
    $validated = $request->validate([
        'segments' => 'required|array',
        'segments.*.id' => 'nullable|integer|exists:text_segments,id',
        'segments.*.title' => 'required|string|max:255',
        'segments.*.description' => 'nullable|string',
        'segments.*.image' => 'nullable|string|max:500',
        'segments.*.order_index' => 'required|integer|min:1',
    ]);

    foreach ($validated['segments'] as $item) {
        TextSegment::updateOrCreate(
            ['id' => $item['id'] ?? null],
            [
                'title'       => $item['title'],
                'description' => $item['description'],
                'image'       => $item['image'],
                'order_index' => $item['order_index'],
            ]
        );
    }

    // Optioneel: oude records die niet meer in de lijst zitten verwijderen
    // Maar voor nu: hou ze gewoon (of truncate eerst als je altijd exact 3 wilt)

    return response()->json(['message' => 'Opgeslagen']);
}
}
