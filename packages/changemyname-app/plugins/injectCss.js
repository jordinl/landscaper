import { resolve } from "path";
import { existsSync } from "fs";
import { generateCss } from "changemyname-react/src/utils/landscapeCalculations.js";
import loadLandscape from "../utils/loadLandscape.js";

const landscape = loadLandscape();
const themePath = resolve("theme.config.js");
const { default: theme } = existsSync(themePath) ? await import(themePath) : {};

export default function injectCss() {
  const virtualModuleId = "virtual:Landscape.css";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  return {
    name: "inject-css",
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return { code: generateCss(theme, landscape) };
      }
    },
  };
}
