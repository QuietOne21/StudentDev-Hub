// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwind()],
  server: {
    port: 5173,
    proxy: {
      // Anything starting with /api goes to your Node backend on 5000
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        ws: true,
        // secure: false, // uncomment if you ever use https with self-signed cert
      },
    },
  },
})
