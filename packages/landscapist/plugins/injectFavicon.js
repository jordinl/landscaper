import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

function injectFavicon() {
  const faviconPath = resolve("assets", "favicon.png");
  if (!existsSync(faviconPath)) {
    return null;
  }
  return {
    name: "inject-favicon",
    transformIndexHtml: function (html) {
      return html.replace(
        "</head>",
        '<link rel="icon" href="/favicon.png" />\n</head>'
      );
    },
    buildStart: function () {
      this.emitFile({
        type: "asset",
        fileName: "favicon.png",
        source: readFileSync(faviconPath),
      });
    },
  };
}

export default injectFavicon;
