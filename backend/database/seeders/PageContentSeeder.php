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
            ['key' => 'dynamic_list'],
            ['value' => ['Item 1 (click remove to zap me!)', 'Item 2']]
            // → Laravel automatically saves arrays as JSON in json columns! No need for json_encode ♡
        );
    }
}