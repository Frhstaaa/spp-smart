import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Override Number.prototype.toLocaleString untuk memastikan format Rupiah selalu menggunakan titik (misal: 1.000.000)
// karena beberapa browser/OS mengabaikan format id-ID dan menggunakan koma atau spasi.
const originalToLocaleString = Number.prototype.toLocaleString;
Number.prototype.toLocaleString = function(locale, options) {
 if (locale === 'id-ID' && !options) {
 // Format integer dengan pemisah titik
 const numberString = Math.floor(this).toString();
 return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
 }
 return originalToLocaleString.call(this, locale, options);
};

createInertiaApp({
 title: (title) => `${title} - ${appName}`,
 resolve: (name) =>
 resolvePageComponent(
 `./Pages/${name}.jsx`,
 import.meta.glob('./Pages/**/*.jsx'),
 ),
 setup({ el, App, props }) {
 const root = createRoot(el);

 root.render(<App {...props} />);
 },
 progress: {
 color: '#4B5563',
 },
});
