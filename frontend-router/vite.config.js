import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  plugins: [reactRouter()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app'),
    },
    tsconfigPaths: true,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
