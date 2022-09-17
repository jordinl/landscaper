import { resolve } from "path";
import { prepareLandscape } from "@landscaper/core";
import loadTheme from "../utils/loadTheme.js";
import loadLandscape from "../utils/loadLandscape.js";

const themePath = resolve("theme.json");
const landscapePath = resolve("landscape.json");

export default function injectCss() {
  const virtualModuleId = "virtual:Landscape.css";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  return {
    name: "inject-css",
    buildStart() {
      this.addWatchFile(themePath);
      this.addWatchFile(landscapePath);
    },
    handleHotUpdate(ctx) {
      const { server, file } = ctx;
      const landscapeModules =
        file === landscapePath &&
        server.moduleGraph.getModulesByFile(landscapePath);

      if (landscapeModules) {
        landscapeModules.forEach((landscapeModule) => {
          server.moduleGraph.invalidateModule(landscapeModule);
        });
      }

      if (file === themePath || file === landscapePath) {
        const cssModule = server.moduleGraph.getModuleById(
          resolvedVirtualModuleId
        );
        server.moduleGraph.invalidateModule(cssModule);
        return [cssModule, ...landscapeModules];
      }
    },
    resolveId(id) {
      if (id.indexOf(virtualModuleId) >= 0) {
        return resolvedVirtualModuleId;
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        const theme = loadTheme();
        const landscape = loadLandscape();
        const { css } = prepareLandscape(theme, landscape);
        return { code: css };
      }
    },
  };
}
