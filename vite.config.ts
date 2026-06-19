import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  // Project site no GitHub Pages: https://joaoxyxo.github.io/GrowGreens/
  // Em dev mantemos a raiz; no build de produção servimos a partir do subdiretório.
  const base = command === 'build' ? '/GrowGreens/' : '/'

  return {
  base,
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: 'auto',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'GrowGreens',
        short_name: 'GrowGreens',
        description: 'Da semente à colheita — aprende a cultivar em casa.',
        lang: 'pt-PT',
        theme_color: '#3FA34D',
        background_color: '#FAFBFA',
        display: 'standalone',
        id: base,
        start_url: base,
        scope: base,
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        cleanupOutdatedCaches: true,
        navigateFallback: `${base}index.html`,
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.href.includes('api.ipma.pt'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'ipma-weather',
              expiration: { maxEntries: 20, maxAgeSeconds: 21600 },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Separa as dependências (raramente mudam) num chunk próprio: reduz o
        // chunk de entrada da app e melhora o cache do browser entre deploys.
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor'
        },
      },
    },
  },
  // Porta dedicada para não colidir com outras apps locais (ex.: a app de poker no 5173).
  server: { port: 5390, strictPort: true },
  preview: { port: 5390, strictPort: true },
  }
})
