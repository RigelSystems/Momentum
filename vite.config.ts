import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import vuetify from 'vite-plugin-vuetify';
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    vuetify(),
    VitePWA({
      registerType: 'autoUpdate', // Automatically updates the service worker
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'], // Files to cache
      },
      manifest: {
        start_url: '/#/dashboard',
        scope: '/',
        name: 'Momentum',
        short_name: 'Momentum',
        description: 'Your daily habits, tasks, and more',
        theme_color: '#42b883',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'icons/momentum-favicon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/momentum-favicon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  base: '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
