import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import addLogosToBundle from "./plugins/addLogosToBundle.js";

const extraAlias = process.env.MONOREPO
  ? {
      "changemyname-base": "changemyname-base/src/index.js",
    }
  : {};

const srcPath = resolve("assets");
const distPath = resolve("dist");

export default defineConfig(({ command }) => ({
  plugins: [react(), addLogosToBundle(srcPath)],
  publicDir: command !== "build" && srcPath,
  clearScreen: false,
  server: {
    port: "3000",
    open: true,
  },
  build: {
    outDir: distPath,
    emptyOutDir: true,
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
