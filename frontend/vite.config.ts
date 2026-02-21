import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 3000,
        host: true, // Listen on all addresses, important for Docker
        strictPort: true,
        watch: {
            usePolling: true, // Enable polling for Docker
        },
    },
    preview: {
        port: 3000,
        host: true,
        strictPort: true,
    },
    build: {
        outDir: 'dist',
        sourcemap: false,
        chunkSizeWarningLimit: 1600,
    },
})
