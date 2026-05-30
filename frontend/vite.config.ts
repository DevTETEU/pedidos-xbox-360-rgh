import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Base fixa: app embeddado em /pedidos-xbox/ no mesmo dominio do site (ver scripts/embed-pedidos.mjs).
export default defineConfig({
  plugins: [react()],
  base: '/pedidos-xbox/',
  server: {
    port: 5174,
  },
})
