<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

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
        if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
            \Illuminate\Support\Facades\URL::forceScheme('https');
            if (isset($_SERVER['HTTP_X_FORWARDED_HOST'])) {
                \Illuminate\Support\Facades\URL::forceRootUrl('https://' . $_SERVER['HTTP_X_FORWARDED_HOST']);
            }
        } elseif (request()->header('x-forwarded-proto') === 'https') {
            \Illuminate\Support\Facades\URL::forceScheme('https');
            if (request()->header('x-forwarded-host')) {
                \Illuminate\Support\Facades\URL::forceRootUrl('https://' . request()->header('x-forwarded-host'));
            }
        }
        
        Vite::prefetch(concurrency: 3);
    }
}
