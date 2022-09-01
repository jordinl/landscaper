import { existsSync, copyFileSync } from "fs";
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
    generateBundle: function (options) {
      copyFileSync(faviconPath, resolve(options.dir, "favicon.png"));
    },
  };
}

export default injectFavicon;
