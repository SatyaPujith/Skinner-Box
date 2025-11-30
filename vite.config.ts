import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'fs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-extension-files',
      closeBundle() {
        // Copy manifest and background script to dist
        copyFileSync('manifest.json', 'dist/manifest.json');
        copyFileSync('background.js', 'dist/background.js');
        
        // Copy icon if it exists
        if (existsSync('icon.png')) {
          copyFileSync('icon.png', 'dist/icon.png');
        }

        // Fix HTML for Chrome extension - remove type="module" and crossorigin
        const htmlPath = 'dist/index.html';
        if (existsSync(htmlPath)) {
          let html = readFileSync(htmlPath, 'utf-8');
          // Remove type="module" and crossorigin attributes
          html = html.replace(/type="module"\s*/g, '');
          html = html.replace(/crossorigin\s*/g, '');
          writeFileSync(htmlPath, html);
        }
      }
    }
  ],
  base: './', // Use relative paths for Chrome extension
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'index.html'),
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
        format: 'iife', // Use IIFE format instead of ES modules
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  }
});
