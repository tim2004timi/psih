// vite.config.js
import { defineConfig } from "file:///D:/it/%D0%B7%D0%B0%D0%BA%D0%B0%D0%B7%D1%8B/psih/frontend/psih/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///D:/it/%D0%B7%D0%B0%D0%BA%D0%B0%D0%B7%D1%8B/psih/frontend/psih/frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { visualizer } from "file:///D:/it/%D0%B7%D0%B0%D0%BA%D0%B0%D0%B7%D1%8B/psih/frontend/psih/frontend/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      // Открывает отчет в браузере после сборки
      filename: "stats.html",
      // Имя файла отчета
      gzipSize: true
      // Показывает размер сжатого бандла
    })
  ],
  server: {
    host: "localhost"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxpdFxcXFxcdTA0MzdcdTA0MzBcdTA0M0FcdTA0MzBcdTA0MzdcdTA0NEJcXFxccHNpaFxcXFxmcm9udGVuZFxcXFxwc2loXFxcXGZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxpdFxcXFxcdTA0MzdcdTA0MzBcdTA0M0FcdTA0MzBcdTA0MzdcdTA0NEJcXFxccHNpaFxcXFxmcm9udGVuZFxcXFxwc2loXFxcXGZyb250ZW5kXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9pdC8lRDAlQjclRDAlQjAlRDAlQkElRDAlQjAlRDAlQjclRDElOEIvcHNpaC9mcm9udGVuZC9wc2loL2Zyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xyXG5pbXBvcnQgeyB2aXN1YWxpemVyIH0gZnJvbSAncm9sbHVwLXBsdWdpbi12aXN1YWxpemVyJztcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW1xyXG4gICAgcmVhY3QoKSxcclxuICAgIHZpc3VhbGl6ZXIoe1xyXG4gICAgICBvcGVuOiB0cnVlLCAvLyBcdTA0MUVcdTA0NDJcdTA0M0FcdTA0NDBcdTA0NEJcdTA0MzJcdTA0MzBcdTA0MzVcdTA0NDIgXHUwNDNFXHUwNDQyXHUwNDQ3XHUwNDM1XHUwNDQyIFx1MDQzMiBcdTA0MzFcdTA0NDBcdTA0MzBcdTA0NDNcdTA0MzdcdTA0MzVcdTA0NDBcdTA0MzUgXHUwNDNGXHUwNDNFXHUwNDQxXHUwNDNCXHUwNDM1IFx1MDQ0MVx1MDQzMVx1MDQzRVx1MDQ0MFx1MDQzQVx1MDQzOFxyXG4gICAgICBmaWxlbmFtZTogJ3N0YXRzLmh0bWwnLCAvLyBcdTA0MThcdTA0M0NcdTA0NEYgXHUwNDQ0XHUwNDMwXHUwNDM5XHUwNDNCXHUwNDMwIFx1MDQzRVx1MDQ0Mlx1MDQ0N1x1MDQzNVx1MDQ0Mlx1MDQzMFxyXG4gICAgICBnemlwU2l6ZTogdHJ1ZSwgLy8gXHUwNDFGXHUwNDNFXHUwNDNBXHUwNDMwXHUwNDM3XHUwNDRCXHUwNDMyXHUwNDMwXHUwNDM1XHUwNDQyIFx1MDQ0MFx1MDQzMFx1MDQzN1x1MDQzQ1x1MDQzNVx1MDQ0MCBcdTA0NDFcdTA0MzZcdTA0MzBcdTA0NDJcdTA0M0VcdTA0MzNcdTA0M0UgXHUwNDMxXHUwNDMwXHUwNDNEXHUwNDM0XHUwNDNCXHUwNDMwXHJcbiAgICB9KSxcclxuICBdLFxyXG4gIHNlcnZlcjoge1xyXG4gICAgaG9zdDogJ2xvY2FsaG9zdCcgXHJcbiAgfVxyXG59KSJdLAogICJtYXBwaW5ncyI6ICI7QUFBc1YsU0FBUyxvQkFBb0I7QUFDblgsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsa0JBQWtCO0FBRzNCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFdBQVc7QUFBQSxNQUNULE1BQU07QUFBQTtBQUFBLE1BQ04sVUFBVTtBQUFBO0FBQUEsTUFDVixVQUFVO0FBQUE7QUFBQSxJQUNaLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==