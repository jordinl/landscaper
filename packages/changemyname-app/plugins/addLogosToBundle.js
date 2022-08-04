import { basename } from "path";
import { readFileSync } from "fs";
import loadLandscape from "../utils/loadLandscape.js";
import expandLandscape from "../utils/expandLandscape.js";

function addLogosToBundle(srcPath) {
  let refs = {};

  const landscape = loadLandscape();

  const logos = landscape.categories.flatMap((category) => {
    return category.subcategories.flatMap((subcategory) => {
      return subcategory.items.flatMap((item) => item.logo);
    });
  });

  // TODO: consider if it's best to have everything in one file or break it up.
  const header = landscape.header || {};

  return {
    name: "add-logos-to-bundle",
    apply: "build",

    buildStart: function () {
      const emitAsset = (name) => {
        return this.emitFile({
          type: "asset",
          name: basename(name),
          source: readFileSync(`${srcPath}/${name}`, "utf-8"),
        });
      };

      logos.forEach((logo) => {
        refs[logo] = emitAsset(logo);
      });

      refs[header.logo] = header.logo && emitAsset(header.logo);
    },
    generateBundle(options, bundle) {
      const landscapeChunk = Object.values(bundle).find(
        ({ name }) => name.indexOf("assets/landscape.json") >= 0
      );

      const categories = landscape.categories.map((category) => {
        const subcategories = category.subcategories.map((subcategory) => {
          const items = subcategory.items.map((item) => {
            const logo = this.getFileName(refs[item.logo]);
            return { ...item, logo };
          });

          return { ...subcategory, items };
        });

        return { ...category, subcategories };
      });

      const headerLogo = landscape.header && landscape.header.logo;

      const header = {
        ...landscape.header,
        ...(headerLogo ? { logo: this.getFileName(refs[headerLogo]) } : null),
      };

      const newLandscape = expandLandscape({
        ...landscape,
        header,
        categories,
      });

      // TODO: find way of updating chunk hash, rollup 3 should take care of this
      landscapeChunk.source = JSON.stringify(newLandscape);

      return bundle;
    },
  };
}

export default addLogosToBundle;
