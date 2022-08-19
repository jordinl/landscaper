import { resolve } from "path";
import { readFileSync } from "fs";

const compareItems = (a, b) => {
  if ((a.large && b.large) || (!a.large && !b.large)) {
    return 0;
  } else if (a.large) {
    return -1;
  }
  return 1;
};

const loadLandscape = () => {
  const { itemTypes, ...landscape } = JSON.parse(
    readFileSync(resolve("assets", "landscape.json"), "utf-8")
  );

  const categories = landscape.categories.map((category) => {
    const subcategories = category.subcategories.map((subcategory) => {
      const items = subcategory.items
        .map((item) => {
          const itemType = item.type && itemTypes && itemTypes[item.type];
          return { ...item, ...itemType };
        })
        .sort(compareItems);
      return { ...subcategory, items };
    });
    return { ...category, subcategories };
  });

  return { ...landscape, categories };
};

export default loadLandscape;
