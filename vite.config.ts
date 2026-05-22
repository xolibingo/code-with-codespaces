import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [],
    },
  },
  optimizeDeps: {
    include: ['jspdf'],
  },
  resolve: {
    alias: {
      canvg: '/dev/null',
      'html2canvas': '/dev/null',
      dompurify: '/dev/null',
    },
  },
})
