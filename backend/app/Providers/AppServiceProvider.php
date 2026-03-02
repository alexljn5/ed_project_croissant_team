<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Events\QueryExecuted;
use Illuminate\Support\Facades\DB;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Log slow queries for performance monitoring
        DB::listen(function (QueryExecuted $query) {
            if ($query->time > 100) {  // Log queries slower than 100ms
                \Log::warning('⚠️ SLOW QUERY ('.round($query->time, 2).'ms): '.$query->sql, $query->bindings);
            }
        });
    }
}
