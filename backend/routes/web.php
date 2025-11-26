<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Models\Content;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| We gebruiken web.php tijdelijk als fallback voor onze API
| omdat api.php om één of andere reden niet geladen wordt.
| Dit werkt perfect!
|
*/

Route::prefix('api')->name('api.')->group(function () {

    // Test route – moet altijd werken
    Route::get('/hello', fn() => [
        'message' => 'CROISSANT TEAM WINS — FINAL VICTORY 2025!!!'
    ])->name('hello');

    // Ophalen van opgeslagen content
    Route::get('/content/{key}', function (string $key) {
        $item = Content::where('key', $key)->first();
        return response()->json([
            'value' => $item?->value ?? null
        ]);
    });

    // Opslaan / updaten van content
    Route::post('/content/{key}', function (Request $request, string $key) {
        $value = $request->validate([
            'value' => 'required'
        ])['value'];

        Content::updateOrCreate(
            ['key' => $key],
            ['value' => $value]
        );

        return response()->json([
            'success' => true,
            'key' => $key,
            'saved_at' => now()->toDateTimeString()
        ]);
    });
});