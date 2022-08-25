import { resolve } from "path";
import { generateCss } from "changemyname-react/src/utils/landscapeCalculations.js";
import loadTheme from "../utils/loadTheme.js";
import loadLandscape from "../utils/loadLandscape.js";

const landscape = loadLandscape();
const themePath = resolve("theme.config.js");

export default function injectCss() {
  const virtualModuleId = "virtual:Landscape.css";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  return {
    name: "inject-css",
    buildStart() {
      this.addWatchFile(themePath);
    },
    handleHotUpdate(ctx) {
      const { server, file } = ctx;
      if (file === themePath) {
        const mod = server.moduleGraph.getModuleById(resolvedVirtualModuleId);
        server.moduleGraph.invalidateModule(mod);
        return [mod];
      }
    },
    resolveId(id) {
      if (id.indexOf(virtualModuleId) >= 0) {
        return resolvedVirtualModuleId;
      }
    },
    async load(id) {
      if (id === resolvedVirtualModuleId) {
        const theme = await loadTheme();
        return { code: generateCss(theme, landscape) };
      }
    },
  };
}
