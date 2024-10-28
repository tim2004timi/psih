import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true, // Открывает отчет в браузере после сборки
      filename: 'stats.html', // Имя файла отчета
      gzipSize: true, // Показывает размер сжатого бандла
    }),
  ],
  server: {
    host: 'localhost' 
  }
})