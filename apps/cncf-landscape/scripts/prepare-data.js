import { load } from "js-yaml";
import { resolve } from "path";
import { readFileSync, writeFileSync } from "fs";

const landscapePath = resolve("original", "processed_landscape.yml");
const landscape = load(readFileSync(landscapePath));

const settingsPath = resolve("original", "settings.yml");
const settings = load(readFileSync(settingsPath));

const categoriesHash = settings.big_picture.main.elements
  .filter((category) => category.type.includes("Category"))
  .reduce((agg, category) => ({ ...agg, [category.category]: category }), {});

const categoryNames = Object.keys(categoriesHash);

const members = landscape.landscape
  .find((category) => category.name === "CNCF Members")
  .subcategories.flatMap((subcategory) => {
    return subcategory.items.flatMap((item) => item.crunchbase);
  });

const destPath = resolve("assets", "landscape.json");

const prepareCategory = (category) => {
  const { name } = category;
  const { width, height, top, left, color, fit_width, type } =
    categoriesHash[name];
  const layout = type.includes("Horizontal") ? "horizontal" : "vertical";
  const style = { layout, width, height, top, left, color, fit_width };
  const subcategories = category.subcategories.map((subcategory) =>
    prepareSubcategory(subcategory, name)
  );
  return { name, style, subcategories };
};

const prepareSubcategory = (subcategory, categoryName) => {
  const { name } = subcategory;
  const items = subcategory.items.map((item) =>
    prepareItem(item, categoryName)
  );
  return { name, items };
};

// TODO: add large
// const relationInfo = fields.relation.valuesMap[relation]
// const relationInfo = {}
// return !!categoryAttrs.isLarge || !!relationInfo.big_picture_order;

const prepareItem = (item, categoryName) => {
  const { name, github_data, crunchbase_data } = item;
  const logoName = item.image_data.fileName;
  const logo = `logos/${logoName}`;
  const id = logoName.split(".")[0];
  const license = (github_data && github_data.license) || "Not Open Source";
  const relation =
    item.project || (members.includes(item.crunchbase) ? "member" : "other");
  const country = (crunchbase_data || {}).country || 'Unknown';
  return { id, name, logo, license, relation, country };
};

const categories = landscape.landscape
  .filter(({ name }) => categoryNames.indexOf(name) >= 0)
  .map((category) => prepareCategory(category));

const header = {
  title: "CNCF Cloud Native Landscape",
  logo: "left-logo.svg",
  rightLogo: "right-logo.svg",
};

const items = landscape.landscape.flatMap((category) => {
  return category.subcategories.flatMap((subcategory) => {
    return subcategory.items;
  });
});

const licenseNames = items.reduce((agg, item) => {
  const license = item && item.github_data && item.github_data.license;
  const extra = license ? { [license]: true } : {};
  return { ...agg, ...extra };
}, {});

const licenses = [
  {
    label: "Not Open Source",
  },
  {
    label: "Open Source",
    children: Object.keys(licenseNames).map((label) => ({ label })),
  },
];

const filters = [
  {
    name: "license",
    label: "License",
    options: licenses,
  },
  {
    name: "relation",
    label: "Relation",
    filterBy: "value",
    options: [
      {
        label: "CNCF Projects",
        value: "cncf",
        children: [
          {
            value: "graduated",
            label: "CNCF graduated",
          },
          {
            value: "incubating",
            label: "CNCF incubating",
          },
          {
            value: "sandbox",
            label: "CNCF sandbox",
          },
          {
            value: "archived",
            label: "CNCF archived",
          },
        ],
      },
      {
        label: "CNCF Member projects",
        value: "member",
      },
      {
        label: "Non-CNCF Member projects",
        value: "other",
      },
    ],
  },
  {
    name: "country",
    label: "Country"
  }
];

writeFileSync(
  destPath,
  JSON.stringify({ header, filters, categories }, undefined, 4)
);
