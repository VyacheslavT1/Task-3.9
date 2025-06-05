import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      shared: path.resolve(__dirname, "src/shared"),
      features: path.resolve(__dirname, "src/features"),
      pages: path.resolve(__dirname, "src/pages"),
      icons: path.resolve(__dirname, "src/shared/icons"),
      hooks: path.resolve(__dirname, "src/shared/hooks"),
      widgets: path.resolve(__dirname, "src/widgets"),
      app: path.resolve(__dirname, "src/app"),
    },
  },
});
