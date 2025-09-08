import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        const head = document.head;
        const fontPreconnect = document.createElement('link');
        fontPreconnect.rel = 'preconnect';
        fontPreconnect.href = 'https://fonts.bunny.net';
        head.appendChild(fontPreconnect);

        const fontLink = document.createElement('link');
        fontLink.href = 'https://fonts.bunny.net/css?family=instrument-sans:400,500,600';
        fontLink.rel = 'stylesheet';
        head.appendChild(fontLink);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
