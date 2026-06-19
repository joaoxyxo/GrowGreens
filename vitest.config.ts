import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.ts', 'src/**/*.test.ts'],
    exclude: ['tests/e2e/**', 'node_modules/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      // Foco na lógica testável (utils/stores/repos); dados estáticos e UI ficam de fora.
      include: ['src/utils/**', 'src/stores/**', 'src/repositories/**'],
      // Mínimos abaixo do atual (linhas ~63%, branches ~85%) para travar regressões
      // sem falhar a build. Subir à medida que se adicionam testes.
      thresholds: {
        lines: 55,
        statements: 55,
        functions: 55,
        branches: 75,
      },
    },
  },
})
