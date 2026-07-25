<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $settings = [];
        if (\Illuminate\Support\Facades\Schema::hasTable('settings')) {
            $settings = \App\Models\Setting::whereIn('key', ['school_name', 'school_logo', 'app_theme', 'dashboard_avatar', 'dashboard_avatar_2', 'dashboard_header_color_from', 'dashboard_header_color_to'])->pluck('value', 'key')->toArray();
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    'id'                => $request->user()->id,
                    'name'              => $request->user()->name,
                    'email'             => $request->user()->email,
                    'role'              => $request->user()->role,
                    'profile_photo_url' => $request->user()->profile_photo_url,
                    'notifications'     => \Illuminate\Support\Facades\Schema::hasTable('notifications') ? $request->user()->unreadNotifications()->take(5)->get() : [],
                    'unread_notifications_count' => \Illuminate\Support\Facades\Schema::hasTable('notifications') ? $request->user()->unreadNotifications()->count() : 0,
                ] : null,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
                'warning' => $request->session()->get('warning'),
                'info' => $request->session()->get('info'),
            ],
            'appName' => $settings['school_name'] ?? config('app.name'),
            'appLogo' => isset($settings['school_logo']) && $settings['school_logo'] ? asset('storage/' . $settings['school_logo']) : null,
            'appAvatar' => isset($settings['dashboard_avatar']) && $settings['dashboard_avatar'] ? asset('storage/' . $settings['dashboard_avatar']) : '/storage/logos/mentahan orang.png',
            'appAvatar2' => isset($settings['dashboard_avatar_2']) && $settings['dashboard_avatar_2'] ? asset('storage/' . $settings['dashboard_avatar_2']) : '/storage/logos/mentahan orang 2.png',
            'appTheme' => $settings['app_theme'] ?? 'indigo',
            'appHeaderColorFrom' => $settings['dashboard_header_color_from'] ?? '#8B5CF6',
            'appHeaderColorTo' => $settings['dashboard_header_color_to'] ?? '#6366F1',
        ];
    }
}
