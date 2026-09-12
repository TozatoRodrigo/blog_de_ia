import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/arena/',
  plugins: [react()],
  build: {
    outDir: '../public/arena',
    emptyOutDir: true,
  },
})
