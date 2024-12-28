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
        name: 'My Vue App',
        short_name: 'VueApp',
        description: 'My awesome Vue app as a PWA',
        theme_color: '#42b883',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'icons/icons8-check-48.png',
            sizes: '48x48',
            type: 'image/png',
          },
          {
            src: 'icons/icons8-check-96.png',
            sizes: '96x96',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  base: '/daily-discipline/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
