import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Proxy /api/* requests to Express backend (port 4000)
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:4000'
    }
  }
})
