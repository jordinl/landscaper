import { load } from "js-yaml";
import { resolve } from "path";
import { readFileSync, writeFileSync } from "fs";

const landscapePath = resolve("original", "processed_landscape.yml");
const landscape = load(readFileSync(landscapePath));

const settingsPath = resolve("original", "settings.yml");
const settings = load(readFileSync(settingsPath));

const categories = settings.big_picture.main.elements
  .filter((category) => category.type.includes("Category"))
  .reduce((agg, category) => ({ ...agg, [category.category]: category }), {});

const categoryNames = Object.keys(categories);

const destPath = resolve("assets", "landscape.json");

const prepareCategory = (category) => {
  const { name } = category;
  const { width, height, top, left, color, fit_width, type } = categories[name];
  const layout = type.includes("Horizontal") ? "horizontal" : "vertical";
  const style = { layout, width, height, top, left, color, fit_width };
  const subcategories = category.subcategories.map((subcategory) =>
    prepareSubcategory(subcategory, name)
  );
  return { name, style, subcategories };
};

const prepareSubcategory = (subcategory, categoryName) => {
  const { name } = subcategory;
  const items = subcategory.items.map((item) => prepareItem(item, categoryName));
  return { name, items };
};

// TODO: add large
// const relationInfo = fields.relation.valuesMap[relation]
// const relationInfo = {}
// return !!categoryAttrs.isLarge || !!relationInfo.big_picture_order;

const prepareItem = (item, categoryName) => {
  const { name } = item;
  const logoName = item.image_data.fileName
  const logo = `logos/${logoName}`;
  const id = logoName.split('.')[0]
  return { name, logo, id };
};

const data = landscape.landscape
  .filter(({ name }) => categoryNames.indexOf(name) >= 0)
  .map((category) => prepareCategory(category));

writeFileSync(destPath, JSON.stringify(data, undefined, 4));
