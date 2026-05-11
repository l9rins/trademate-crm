import { fileURLToPath } from "url";
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: [
      {
        find: /^@\/components\/ui\/(.*)$/,
        replacement: path.resolve(__dirname, "./src/shared/ui/$1"),
      },
      {
        find: /^@\/lib\/(.*)$/,
        replacement: path.resolve(__dirname, "./src/shared/lib/$1"),
      },
      {
        find: /^@\/context\/(.*)$/,
        replacement: path.resolve(__dirname, "./src/features/auth/$1"),
      },
      { find: "@", replacement: path.resolve(__dirname, "./src") },
    ],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
  },
})
