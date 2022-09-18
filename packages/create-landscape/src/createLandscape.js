import {
  mkdirSync,
  writeFileSync,
  readdirSync,
  existsSync,
  readFileSync,
  copyFileSync,
} from "fs";
import fse from "fs-extra";
import { resolve, basename } from "path";
import { execSync } from "child_process";
import Enquirer from "enquirer";
import { load } from "js-yaml";
import detectPackageManager from "./detectPackageManager.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const defaultPackage = {
  version: "0.1.0",
  private: true,
  scripts: {
    dev: "landscaper",
    build: "landscaper build",
    preview: "landscaper preview",
  },
};

const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100">
  <rect width="100" height="100" style="fill:rgb(255,0,0);" />
</svg>`;

const confirmPrompt = async (message) => {
  const result = await Enquirer.select({
    message: message,
    choices: [
      {
        title: "Yes",
        value: true,
      },
      {
        title: "No",
        value: false,
      },
    ],
  });

  return result === "Yes";
};

const defaultLandscape = {
  header: {
    center: {
      type: "html",
      content: "<h1>Demo Landscape</h1>",
    },
  },
  footer: {
    center: {
      content: "Footer goes here",
    },
  },
  categories: [
    {
      name: "Category 1",
      items: [
        {
          id: "item-1",
          name: "Item 1",
          logo: "logos/logo.svg",
        },
      ],
    },
    {
      name: "Category 2",
      items: [
        {
          id: "item-2",
          name: "Item 2",
          logo: "logos/logo.svg",
        },
      ],
    },
  ],
};

const prepareItem = (item, categoryName) => {
  const { name, github_data, crunchbase_data, open_source } = item;
  const logoName = item.image_data.fileName;
  const logo = `logos/${logoName}`;
  const id = logoName.split(".")[0];
  const not_open_source = open_source === false || !github_data;
  const license =
    (!not_open_source && github_data && github_data.license) ||
    "Not Open Source";
  const description =
    item.description ||
    (github_data && github_data.description) ||
    (crunchbase_data && crunchbase_data.description);
  const language =
    github_data && github_data.languages[0] && github_data.languages[0].name;
  const country = (crunchbase_data || {}).country || "Unknown";

  return {
    id,
    name,
    logo,
    license,
    country,
    language,
    description,
    ...(not_open_source && { variant: "Gray" }),
  };
};

const prepareSubcategory = (subcategory, categoryName) => {
  const { name } = subcategory;
  const items = subcategory.items.map((item) =>
    prepareItem(item, categoryName)
  );
  return { name, items };
};

const prepareCategory = (category) => {
  const { name } = category;
  const subcategories = category.subcategories.map((subcategory) =>
    prepareSubcategory(subcategory, name)
  );
  return { name, subcategories };
};

const migrateLandscape = (directory) => {
  const assetsDir = resolve(directory, "assets");
  const logosDir = resolve(assetsDir, "logos");

  if (!existsSync(assetsDir)) {
    mkdirSync(assetsDir, { recursive: true });
  }

  fse.copySync(resolve(directory, "cached_logos"), logosDir);
  copyFileSync(
    resolve(directory, "images", "left-logo.svg"),
    resolve(assetsDir, "logo.svg")
  );

  const landscapePath = resolve(directory, "processed_landscape.yml");
  const { landscape } = load(readFileSync(landscapePath));

  const settingsPath = resolve(directory, "settings.yml");
  const settings = load(readFileSync(settingsPath));

  const categoriesHash = settings.big_picture.main.elements
    .filter((category) => category.type.includes("Category"))
    .reduce((agg, category) => ({ ...agg, [category.category]: category }), {});

  const categoryNames = Object.keys(categoriesHash);

  const categories = landscape
    .filter(({ name }) => categoryNames.indexOf(name) >= 0)
    .map((category) => prepareCategory(category));

  const header = {
    left: {
      type: "image",
      src: "logo.svg",
    },
    center: {
      type: "html",
      content: `<h1>${settings.global.name}</h1>`,
    },
  };

  writeFileSync(
    resolve(directory, "landscape.json"),
    JSON.stringify({ header, categories }, null, 2)
  );
};

const createDefaultLandscape = (directory) => {
  const assetsPath = resolve(directory, "assets");
  const logosPath = resolve(assetsPath, "logos");
  mkdirSync(logosPath, { recursive: true });

  writeFileSync(
    resolve(directory, "landscape.json"),
    JSON.stringify(defaultLandscape, null, 4)
  );
  writeFileSync(resolve(logosPath, "logo.svg"), svg);
};

const createLandscape = async (directory) => {
  const name = basename(directory);
  const fullPath = resolve(directory);
  if (existsSync(fullPath) && readdirSync(fullPath).length > 0) {
    const overwriteDir = await confirmPrompt(
      "Directory is not empty, do you wish to continue?"
    );

    if (!overwriteDir) {
      process.exit(0);
    }
  }

  let migrate = false;

  if (existsSync(resolve(fullPath, "landscape.yml"))) {
    migrate = await confirmPrompt(
      "landscape.yml detected, would you like the landscape to be migrated to the Landscaper format automatically?"
    );
  }

  migrate ? migrateLandscape(fullPath) : createDefaultLandscape(fullPath);

  const includeDefaultTheme = await confirmPrompt(
    "Would you like to include the default theme?"
  );

  if (includeDefaultTheme) {
    copyFileSync(
      resolve(__filename, "..", "defaultTheme.json"),
      resolve(fullPath, "theme.json")
    );
  }

  writeFileSync(
    resolve(directory, "package.json"),
    JSON.stringify({ name, ...defaultPackage }, null, 4)
  );
  if (process.env.MONOREPO) {
    writeFileSync(resolve(directory, ".npmrc"), "lockfile=false");
  }

  const { installCommand } = detectPackageManager();
  process.chdir(fullPath);
  execSync(`${installCommand} @landscaper/interactive`, {
    stdio: "inherit",
  });
};

export default createLandscape;
