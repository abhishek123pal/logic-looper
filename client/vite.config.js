import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-able-icon.svg'],
      manifest: {
        name: 'LogicLooper: Daily Puzzle',
        short_name: 'LogicLooper',
        description: 'Solve puzzles, build streaks, and climb the leaderboard!',
        theme_color: '#10b981', 
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) return 'vendor-fb';
            if (id.includes('framer-motion')) return 'vendor-fm';
            return 'vendor';
          }
        }
      }
    }
  }
});