<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::middleware('api')->group(function () {

    // === 1. Tekst/content opslaan en ophalen (jouw bestaande systeem) ===
    Route::get('/content/{key}', function ($key) {
        $row = DB::table('content')->where('key', $key)->first();

        return response()->json([
            'value' => $row?->value ?? null
        ]);
    });

    Route::post('/content/{key}', function (Request $request, $key) {
        $value = $request->input('value');

        DB::table('content')->updateOrInsert(
            ['key' => $key],
            ['value' => $value, 'updated_at' => now()]
        );

        return response()->json(['success' => true, 'saved' => $value]);
    });

    // === 2. Foto uploaden (vervangt altijd de vorige) ===
    Route::post('/upload-photo', function (Request $request) {

        // Validatie
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:10240' // max 10MB
        ]);

        // 1. Haal oude foto op (indien aanwezig)
        $oldUrl = DB::table('content')
            ->where('key', 'homepage_photo')
            ->value('value');

        // 2. Verwijder oude bestand van de schijf (alleen als het een public storage pad is)
        if ($oldUrl && Str::startsWith($oldUrl, asset('storage/'))) {
            $oldPath = Str::after($oldUrl, 'storage/');
            Storage::disk('public')->delete($oldPath);
        }

        // 3. Nieuwe foto opslaan in storage/app/public/photos
        $path = $request->file('photo')->store('photos', 'public');

        // 4. Publiek bereikbare URL genereren
        $url = asset('storage/' . $path); // → http://127.0.0.1:8000/storage/photos/xyz.jpg

        // 5. URL opslaan in dezelfde content-tabel (onder key homepage_photo)
        DB::table('content')->updateOrInsert(
            ['key' => 'homepage_photo'],
            ['value' => $url, 'updated_at' => now()]
        );

        // 6. Teruggeven aan Vue
        return response()->json([
            'url' => $url,
            'message' => 'Foto succesvol geüpload en opgeslagen!'
        ]);
    });
});