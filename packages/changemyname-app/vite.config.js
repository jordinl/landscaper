import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

const srcPath = resolve("assets");
const distPath = resolve("dist");

export default defineConfig({
  plugins: [react()],
  publicDir: srcPath,
  clearScreen: false,
  server: {
    port: "3000",
    open: true
  },
  build: {
    outDir: distPath,
    emptyOutDir: true
  },
  preview: {
    port: 4000,
  },
  resolve: {
    alias: {
      "changemyname-base": "changemyname-base/src/index.js",
    },
  },
});
