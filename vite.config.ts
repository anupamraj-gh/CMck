import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Served from the custom domain root (cravingmanager.com/CNAME), not a GitHub Pages subpath
  // — so base stays '/'. If the custom domain is ever removed, this needs to go back to
  // '/CMck/' (see git history) or the site reverts to the same blank-page bug.
  base: '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
