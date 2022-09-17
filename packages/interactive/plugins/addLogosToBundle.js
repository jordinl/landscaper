import { basename } from "path";
import { readFileSync } from "fs";
import loadLandscape from "../utils/loadLandscape.js";
import expandLandscape from "../utils/expandLandscape.js";

function addLogosToBundle(srcPath) {
  let refs = {};

  const landscape = loadLandscape();

  const logos = landscape.categories.flatMap((category) => {
    if ((category.items || []).length > 0) {
      return category.items.flatMap((item) => item.logo);
    }
    return category.subcategories.flatMap((subcategory) => {
      return subcategory.items.flatMap((item) => item.logo);
    });
  });

  const headerLogos = ["left", "center", "right"].reduce((agg, key) => {
    const item = (landscape.header || {})[key] || {};
    return [...agg, ...(item.type === "image" ? [item.src] : [])];
  }, []);

  return {
    name: "add-logos-to-bundle",
    apply: "build",

    buildStart: function () {
      [...logos, ...headerLogos].forEach((logo) => {
        refs[logo] = this.emitFile({
          type: "asset",
          name: basename(logo),
          source: readFileSync(`${srcPath}/${logo}`, "utf-8"),
        });
      });
    },
    generateBundle(options, bundle) {
      const landscapeChunk = Object.values(bundle).find(
        ({ name }) => name && name.indexOf("landscape.json") >= 0
      );

      const replaceLogos = (items) => {
        return items.map((item) => {
          const logo = this.getFileName(refs[item.logo]);
          return { ...item, logo };
        });
      };

      const categories = landscape.categories.map((category) => {
        if ((category.items || []).length > 0) {
          return { ...category, items: replaceLogos(category.items) };
        }
        const subcategories = category.subcategories.map((subcategory) => {
          const items = replaceLogos(subcategory.items);

          return { ...subcategory, items };
        });

        return { ...category, subcategories };
      });

      const header = ["left", "center", "right"].reduce((agg, key) => {
        const item = (landscape.header || {})[key] || {};
        const src =
          item && item.type === "image" && this.getFileName(refs[item.src]);
        return { ...agg, [key]: { ...item, ...(src && { src }) } };
      }, {});

      const newLandscape = expandLandscape({
        ...landscape,
        header,
        categories,
      });

      landscapeChunk.source = JSON.stringify(newLandscape);

      return bundle;
    },
  };
}

export default addLogosToBundle;
