import { resolve } from "path";
import { readFileSync } from "fs";

function injectTitle(srcPath) {
  const landscape = JSON.parse(
    readFileSync(resolve(srcPath, "landscape.json"), "utf-8")
  );

  const title = (landscape.header && landscape.header.title) || "Landscape";

  return {
    name: 'html-transform',
    transformIndexHtml(html) {
      return html.replace("%APP_TITLE%", title)
    },
  };
}

export default injectTitle;
