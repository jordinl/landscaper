import { resolve, basename } from "path";
import { readFileSync } from "fs";

// TODO: Add CNCF logo too
function addLogosToBundle(srcPath) {
  let refs = {};

  const landscape = JSON.parse(
    readFileSync(resolve(srcPath, "landscape.json"), "utf-8")
  );

  const logos = landscape.flatMap((category) => {
    return category.subcategories.flatMap((subcategory) => {
      return subcategory.items.flatMap((item) => item.logo);
    });
  });

  return {
    name: "add-logos-to-bundle",
    apply: "build",

    buildStart() {
      logos.forEach((logo) => {
        const ref = this.emitFile({
          type: "asset",
          name: basename(logo),
          source: readFileSync(`${srcPath}/${logo}`, "utf-8"),
        });

        refs[logo] = ref;
      });
    },
    generateBundle(options, bundle) {
      const landscapeChunk = Object.values(bundle).find(
        ({ name }) => name.indexOf("assets/landscape.json") >= 0
      );

      const newLandscape = landscape.map((category) => {
        const subcategories = category.subcategories.map((subcategory) => {
          const items = subcategory.items.map((item) => {
            const logo = refs[item.logo]
              ? this.getFileName(refs[item.logo])
              : item.logo;
            return { ...item, logo };
          });

          return { ...subcategory, items };
        });

        return { ...category, subcategories };
      });

      // TODO: find way of updating chunk hash, rollup 3 should take care of this
      landscapeChunk.source = JSON.stringify(newLandscape);

      return bundle;
    },
  };
}

export default addLogosToBundle;
