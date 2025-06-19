// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: './', // <- cambia esto al nombre de tu carpeta en IIS
  plugins: [
    react(),
    tailwindcss()
  ],
})
