<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
public function up(): void
{
    Schema::create('text_segments', function (Blueprint $table) {
        $table->id();                      // ← Dit MOET er staan (auto-increment PK)
        $table->integer('order_index')->unsigned()->default(0);
        $table->string('title');
        $table->text('description')->nullable();
        $table->string('image')->nullable();
        $table->timestamps();
    });
}

    public function down(): void
    {
        Schema::dropIfExists('text_segments');
    }
};
