import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// Path base: serviamo l'admin da /gestione-contenuti-vra2024/
export default defineConfig({
    base: '/gestione-contenuti-vra2024/',
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 5174,
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
            },
        },
    },
});
