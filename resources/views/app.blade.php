<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
        <link rel="manifest" href="/manifest.json">
        <meta name="theme-color" content="#0f172a">
        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

        <!-- Scripts -->
        <script>
            window.addEventListener('error', function(e) {
                document.body.innerHTML = '<div style="color:red; padding:20px; font-family:sans-serif; background:white; position:fixed; top:0; left:0; right:0; bottom:0; z-index:99999; overflow:auto;"><h1>JS Error</h1><p>' + e.message + '</p><pre>' + (e.error ? e.error.stack : '') + '</pre></div>';
            });
            window.addEventListener('unhandledrejection', function(e) {
                document.body.innerHTML = '<div style="color:red; padding:20px; font-family:sans-serif; background:white; position:fixed; top:0; left:0; right:0; bottom:0; z-index:99999; overflow:auto;"><h1>Unhandled Promise Rejection</h1><p>' + e.reason + '</p><pre>' + (e.reason && e.reason.stack ? e.reason.stack : '') + '</pre></div>';
            });
            const originalConsoleError = console.error;
            console.error = function() {
                if (arguments[0] && arguments[0].stack) {
                    document.body.innerHTML = '<div style="color:red; padding:20px; font-family:sans-serif; background:white; position:fixed; top:0; left:0; right:0; bottom:0; z-index:99999; overflow:auto;"><h1>React Error</h1><p>' + arguments[0].message + '</p><pre>' + arguments[0].stack + '</pre></div>';
                }
                originalConsoleError.apply(console, arguments);
            };
        </script>
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
        
        <script>
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/service-worker.js').then((registration) => {
                        console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    }).catch((err) => {
                        console.log('ServiceWorker registration failed: ', err);
                    });
                });
            }
        </script>
    </body>
</html>
