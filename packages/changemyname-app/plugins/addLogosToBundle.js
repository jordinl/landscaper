import { resolve, basename } from "path";
import { readFileSync } from "fs";

// TODO: Add CNCF logo too
function addLogosToBundle(srcPath) {
  let refs = {};

  const landscape = JSON.parse(
    readFileSync(resolve(srcPath, "landscape.json"), "utf-8")
  );

  const logos = landscape.categories.flatMap((category) => {
    return category.subcategories.flatMap((subcategory) => {
      return subcategory.items.flatMap((item) => item.logo);
    });
  });

  const header = landscape.header || {};

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

      if (header.logo) {
        const logoRef = this.emitFile({
          type: "asset",
          name: basename(header.logo),
          source: readFileSync(`${srcPath}/${header.logo}`, "utf-8"),
        });

        refs[header.logo] = logoRef;
      }
    },
    generateBundle(options, bundle) {
      const landscapeChunk = Object.values(bundle).find(
        ({ name }) => name.indexOf("assets/landscape.json") >= 0
      );

      const categories = landscape.categories.map((category) => {
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

      const headerLogo = landscape.header && landscape.header.logo

      const header = {
        ...landscape.header,
        ...(headerLogo ? { logo: this.getFileName(refs[headerLogo]) } : null)
      }

      const newLandscape = { ...landscape, header, categories }

      // TODO: find way of updating chunk hash, rollup 3 should take care of this
      landscapeChunk.source = JSON.stringify(newLandscape);

      return bundle;
    },
  };
}

export default addLogosToBundle;
