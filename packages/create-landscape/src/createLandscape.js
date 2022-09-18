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

const defaultLandscape = {
  header: {
    center: {
      type: "html",
      content: "<h1>My Landscape</h1>",
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

const itemLinks = (item) => {
  const { crunchbase_data, github_data, github_start_commit_data } = item;
  const website = { label: "Website", url: item.homepage_url };
  const repo = item.repo_url && { label: "Repository", url: item.repo_url };
  const crunchbase = item.crunchbase && {
    label: "Crunchbase",
    url: item.crunchbase,
  };
  const twitter = item.hasOwnProperty("twitter")
    ? item.twitter
    : crunchbase_data && crunchbase_data.twitter;
  const twitterUrl = twitter && {
    label: "Twitter",
    url: twitter,
    text: `@${twitter.split("/").pop()}`,
  };
  const country = crunchbase_data && {
    label: "Country",
    text: crunchbase_data.country,
  };
  const firstCommitDate =
    github_start_commit_data && github_start_commit_data.start_date;

  const firstCommit = firstCommitDate && {
    label: "First Commit",
    text: firstCommitDate,
    format: "date",
  };

  const latestCommitDate = github_data && github_data.latest_commit_date;

  const latestCommit = latestCommitDate && {
    label: "Latest Commit",
    text: latestCommitDate,
    format: "date",
  };

  return [
    website,
    repo,
    crunchbase,
    twitterUrl,
    country,
    firstCommit,
    latestCommit,
  ].filter((_) => _);
};

const prepareItem = (item, relations) => {
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
  const relation = relations[item.project] || {};
  const label = relation.order && relation.label;
  const variant = relation.order && relation.name;
  const info = itemLinks(item);

  return {
    id,
    name,
    logo,
    license,
    country,
    language,
    description,
    ...(not_open_source && { variant: "Gray" }),
    ...(label && { label }),
    ...(variant && { variant }),
    info,
  };
};

const prepareSubcategory = (subcategory, relations) => {
  const sortOrder = (item) => (relations[item.project] || {}).order || Infinity;
  const { name } = subcategory;
  const items = subcategory.items
    .sort((a, b) => sortOrder(a) - sortOrder(b))
    .map((item) => prepareItem(item, relations));
  return { name, items };
};

const prepareCategory = (category, relations) => {
  const { name } = category;
  const subcategories = category.subcategories.map((subcategory) =>
    prepareSubcategory(subcategory, relations)
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

  const relations = ((settings.relation || {}).values || [])
    .flatMap((relation) => {
      return [relation, ...(relation.children || [])];
    })
    .reduce((agg, relation) => {
      const {
        id,
        big_picture_order: order,
        big_picture_label: label,
        big_picture_color: color,
      } = relation;
      const name = id.toString().replace(/^[a-z]/, (x) => x.toUpperCase());
      return { ...agg, [relation.id]: { id, order, name, label, color } };
    }, {});

  const categories = landscape
    .filter(({ name }) => categoryNames.indexOf(name) >= 0)
    .map((category) => prepareCategory(category, relations));

  const title = settings.global.name;

  const header = {
    left: {
      type: "image",
      src: "logo.svg",
    },
    center: {
      type: "html",
      content: `<h1>${title}</h1>`,
    },
  };

  writeFileSync(
    resolve(directory, "landscape.json"),
    JSON.stringify({ title, header, categories }, null, 2)
  );

  return Object.values(relations).filter((relation) => relation.order);
};

const createDefaultLandscape = (directory) => {
  const assetsPath = resolve(directory, "assets");
  const logosPath = resolve(assetsPath, "logos");
  mkdirSync(logosPath, { recursive: true });

  const title = basename(directory);
  const landscape = { ...defaultLandscape, title };

  writeFileSync(
    resolve(directory, "landscape.json"),
    JSON.stringify(landscape, null, 2)
  );
  writeFileSync(resolve(logosPath, "logo.svg"), svg);
};

const createLandscape = async (directory, options) => {
  const confirmPrompt = async (message) => {
    if (options.yes) {
      return true;
    }

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

  const fullPath = resolve(directory);
  const name = basename(fullPath);
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

  const variants = migrate
    ? migrateLandscape(fullPath)
    : createDefaultLandscape(fullPath);

  const includeDefaultTheme = await confirmPrompt(
    "Would you like to include the default theme?"
  );

  if (includeDefaultTheme) {
    const theme = JSON.parse(
      readFileSync(resolve(__filename, "..", "defaultTheme.json"), "utf-8")
    );

    const layoutVariants = (variants || []).reduce((agg, variant) => {
      return { ...agg, [variant.name]: { extend: "Large" } };
    }, {});

    const styleVariants = (variants || []).reduce((agg, variant) => {
      const variantStyle = {
        extend: "Large",
        borderColor: variant.color,
        Label: {
          backgroundColor: variant.color,
        },
      };
      return { ...agg, [variant.name]: variantStyle };
    }, {});

    const finalTheme = {
      Layout: {
        ...theme.Layout,
        Item: {
          ...theme.Layout.Item,
          ...(layoutVariants && { Variants: layoutVariants }),
        },
      },
      Style: {
        ...theme.Style,
        Item: {
          ...theme.Style.Item,
          Variants: {
            ...theme.Style.Item.Variants,
            ...styleVariants,
          },
        },
      },
    };

    writeFileSync(
      resolve(fullPath, "theme.json"),
      JSON.stringify(finalTheme, null, 2)
    );
  }

  writeFileSync(
    resolve(directory, "package.json"),
    JSON.stringify({ name, ...defaultPackage }, null, 4)
  );
  if (process.env.MONOREPO) {
    writeFileSync(resolve(directory, ".npmrc"), "lockfile=false");
  }
  const { installCommand, name: pkgName } = detectPackageManager();
  execSync(`${installCommand} @landscaper/interactive`, {
    cwd: fullPath,
    stdio: "inherit",
  });

  console.log("\nLandscape created!! To open it execute:");
  console.log(`    cd ${directory} && ${pkgName} run dev\n`);
};

export default createLandscape;
