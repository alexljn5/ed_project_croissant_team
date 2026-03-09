<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations - ADD PERFORMANCE INDEXES
     */
    public function up(): void
    {
        Schema::table('content', function (Blueprint $table) {
            // Index for filtering/sorting by date
            if (!Schema::hasColumn('content', 'created_at')) {
                $table->index('created_at');
            }
        });

        Schema::table('text_segments', function (Blueprint $table) {
            // Index for sorting by order (frequently used in queries)
            if (!Schema::hasColumn('text_segments', 'order_index')) {
                $table->index('order_index');
            }
            // Index for date-based queries
            if (!Schema::hasColumn('text_segments', 'created_at')) {
                $table->index('created_at');
            }
        });
    }

    /**
     * Reverse the migrations
     */
    public function down(): void
    {
        Schema::table('content', function (Blueprint $table) {
            $table->dropIndex(['created_at']);
        });

        Schema::table('text_segments', function (Blueprint $table) {
            $table->dropIndex(['order_index']);
            $table->dropIndex(['created_at']);
        });
    }
};
