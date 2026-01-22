import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue({
    template: {
      compilerOptions: {
        // Throw on all template errors instead of silently failing
        onError(error) {
          console.error('[Vue Template Error]:', error)
        },
        onWarn(warning) {
          console.warn('[Vue Template Warning]:', warning)
        }
      }
    }
  }), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    preserveSymlinks: true,
  },
  server: {
    port: 5173,
    host: true,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  define: {
    __VUE_PROD_DEVTOOLS__: false,
  },
})
