import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/v1/auth': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/api/stocks': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      '/api/recommendations': {
        target: 'http://localhost:8083',
        changeOrigin: true,
      },
    },
  },
});
