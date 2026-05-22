import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/code-with-codespaces/',
  build: {
    outDir: 'dist',
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
