import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    // Set base to repo name for GitHub Pages deployment
    // e.g. https://aidanmacc01-sketch.github.io/kuraplan-student-studio/
    base: '/kuraplan-student-studio/',
    server: {
        port: 3000,
        // Keep the proxy for local dev (when running with Express alongside)
        proxy: {
            '/api': {
                target: 'http://localhost:4000',
                changeOrigin: true,
            },
        },
    },
});
