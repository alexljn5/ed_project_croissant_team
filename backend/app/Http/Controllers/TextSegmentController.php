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
    // Optimized: select only needed columns, use order_index index for sorting
    $segments = TextSegment::select(['id', 'title', 'description', 'image', 'order_index', 'created_at', 'updated_at'])
        ->orderBy('order_index')
        ->get();

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

    try {
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
        
        \Log::info('✓ Text segments updated: ' . count($validated['segments']) . ' items');
        return response()->json(['message' => 'Opgeslagen', 'success' => true]);
    } catch (\Exception $e) {
        \Log::error('❌ Text segments update error: ' . $e->getMessage());
        return response()->json([
            'error' => 'Failed to save text segments',
            'message' => $e->getMessage()
        ], 500);
    }
}
}
