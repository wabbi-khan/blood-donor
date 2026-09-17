import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  build: {
    // Raise warning threshold — Firebase SDK is inherently large
    chunkSizeWarningLimit: 700,

    rollupOptions: {
      output: {
        // Vite 8 / Rolldown requires manualChunks as a function
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            if (id.includes('react')) {
              return 'vendor-react';
            }
            if (id.includes('firebase/messaging')) {
              return 'vendor-firebase-msg';
            }
            if (id.includes('firebase/auth')) {
              return 'vendor-firebase-auth';
            }
            if (id.includes('firebase/firestore') || id.includes('firebase/database')) {
              return 'vendor-firebase-db';
            }
            if (id.includes('firebase')) {
              return 'vendor-firebase-app';
            }
            if (
              id.includes('react-hook-form') ||
              id.includes('@hookform') ||
              id.includes('/zod/')
            ) {
              return 'vendor-forms';
            }
            if (id.includes('leaflet') || id.includes('react-leaflet')) {
              return 'vendor-map';
            }
          }
        },
      },
    },
  },
})


