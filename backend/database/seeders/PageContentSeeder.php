<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PageContent;   // ← THIS LINE WAS MISSING! ♡

class PageContentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PageContent::updateOrCreate(
            ['key' => 'editable_section'],
            ['value' => 'Placeholder text! Edit me and watch the DOM change right away. ♡']
        );

        PageContent::updateOrCreate(
            ['key' => 'dynamic-list'],
            ['value' => ['Item 1 (click remove to zap me!)', 'Item 2']]
        );

        PageContent::updateOrCreate(
            ['key' => 'map-markers'],
            [
                'value' => [
                    ['lat' => 52.5205, 'lng' => 5.4790, 'label' => 'Amsterdam'],
                    ['lat' => 44.518, 'lng' => 5.471, 'label' => 'Provence'],
                    ['lat' => 53.518, 'lng' => 6.471, 'label' => 'Groningen']
                ]
            ]
        );
    }
}
