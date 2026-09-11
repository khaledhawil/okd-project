import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Defines the port for local development
    port: 3000,
    // Ensures the server binds to all interfaces (useful for Docker)
    host: true
  }
})
