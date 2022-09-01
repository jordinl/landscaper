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

  const headerLogos = (landscape.header || [])
    .filter((item) => item.type === "image")
    .map((item) => item.src);

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
    async generateBundle(options, bundle) {
      const landscapeChunk = Object.values(bundle).find(
        ({ name }) => name && name.indexOf("assets/landscape.json") >= 0
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

      const header = landscape.header
        ? landscape.header.map((item) => {
            if (item.type !== "image") {
              return item;
            }

            return { ...item, src: this.getFileName(refs[item.src]) };
          })
        : null;

      const newLandscape = await expandLandscape({
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
