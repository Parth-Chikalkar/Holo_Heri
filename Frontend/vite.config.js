// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
   server: { host: true },
  
  // 💡 FIX: Treat .glb (and .gltf) files as static assets, not JavaScript modules.
  // This resolves the "Failed to parse source for import analysis" error.
  assetsInclude: ['**/*.glb', '**/*.gltf'],
})