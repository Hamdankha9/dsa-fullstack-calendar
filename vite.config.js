import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/dsa-fullstack-calendar/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: false },
      manifest: {
        name: '60 Days DSA + Full-Stack',
        short_name: '60Days',
        description: 'Tracker for 60 Days DSA and Full-Stack Mastery',
        theme_color: '#08090E',
        background_color: '#08090E',
        display: 'standalone',
      }
    })
  ],
})
