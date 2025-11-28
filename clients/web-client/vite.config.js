import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configuración de Vite
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      // Proxy para desarrollo - redirigir API calls al API Gateway local
      '/auth': {
        target: 'http://localhost:8003',
        changeOrigin: true,
        secure: false,
      },
      '/pets': {
        target: 'http://localhost:8003',
        changeOrigin: true,
        secure: false,
      },
      '/appointments': {
        target: 'http://localhost:8003',
        changeOrigin: true,
        secure: false,
      },
      '/rewards': {
        target: 'http://localhost:8003',
        changeOrigin: true,
        secure: false,
      },
      '/postconsult': {
        target: 'http://localhost:8003',
        changeOrigin: true,
        secure: false,
      },
      '/dashboard': {
        target: 'http://localhost:8003',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['axios']
        }
      }
    }
  },
  define: {
    // Asegurar que las variables de entorno estén disponibles
    __APP_ENV__: JSON.stringify(process.env.NODE_ENV),
  }
});
