import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import path from 'path'; // <-- NEW IMPORT

export default defineConfig({
  plugins: [solidPlugin()],
  resolve: {
    alias: {
      // Set @ to resolve to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
