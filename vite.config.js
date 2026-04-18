import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Split heavy deps into their own chunks so the initial download is leaner.
    // Firebase in particular ships ~150KB gzipped — keeping it separate means
    // friends on slow connections don't pay for it on the first paint.
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'motion': ['framer-motion'],
          'icons': ['lucide-react'],
        },
      },
    },
    // 600KB per chunk is a reasonable ceiling before a warning fires.
    chunkSizeWarningLimit: 600,
  },
})
