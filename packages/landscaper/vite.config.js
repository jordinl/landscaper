import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { dirname, resolve } from "path";
import addLogosToBundle from "./plugins/addLogosToBundle.js";
import injectTitle from "./plugins/injectTitle.js";
import processLandscape from "./plugins/processLandscape.js";
import injectFavicon from "./plugins/injectFavicon.js";
import injectCss from "./plugins/injectCss.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const extraAlias = process.env.MONOREPO
  ? {
      "@landscaper/react": resolve(__dirname, "../react/src"),
    }
  : {};

const srcPath = resolve();
const assetsPath = resolve("assets");
const distPath = resolve("dist");

const debugOptions = process.env.DEBUG ? { minify: false } : {};

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    addLogosToBundle(assetsPath),
    injectTitle(assetsPath),
    processLandscape(),
    injectFavicon(),
    injectCss(),
  ],
  publicDir: command !== "build" && assetsPath,
  clearScreen: false,
  server: {
    port: "3000",
    open: true,
  },
  build: {
    outDir: distPath,
    emptyOutDir: true,
    ...debugOptions,
  },
  preview: {
    port: 4000,
  },
  resolve: {
    alias: {
      ...extraAlias,
      project: srcPath,
    },
  },
  logLevel: process.env.MONOREPO ? "info" : "error",
}));
