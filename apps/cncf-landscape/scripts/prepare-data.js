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
  const subcategories = category.subcategories.map((subcategory) =>
    prepareSubcategory(subcategory, name)
  );
  return { name, subcategories };
};

const compareItems = (a, b) => {
  if (a.relation === b.relation) {
    return 0;
  } else if (a.relation === "graduated") {
    return -1;
  } else if (a.relation === "incubating") {
    return -1;
  }
  return 1;
};

const prepareSubcategory = (subcategory, categoryName) => {
  const { name } = subcategory;
  const items = subcategory.items
    .map((item) => prepareItem(item, categoryName))
    .sort(compareItems);
  console.log(items[0])
  return { name, items };
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
  const relation =
    item.project || (members.includes(item.crunchbase) ? "member" : "other");
  const country = (crunchbase_data || {}).country || "Unknown";
  const info = itemLinks(item);
  const relationText = ["graduated", "incubating"].includes(relation) && relation.replace(/^[a-z]/, x => x.toUpperCase())

  return {
    id,
    name,
    logo,
    license,
    relation,
    country,
    language,
    description,
    ...(not_open_source && { variant: "Gray" }),
    ...(relationText && { variant: relationText, label: `CNCF ${relationText}` }),
    info,
  };
};

const categories = landscape.landscape
  .filter(({ name }) => categoryNames.indexOf(name) >= 0)
  .map((category) => prepareCategory(category));

const title = "CNCF Cloud Native Landscape";

const header = [
  {
    type: "image",
    src: "logo.svg",
  },
  {
    type: "html",
    content: `<h1>${title}</h1>`,
  },
];

const footer = [
  {
    content:
      '<span>This landscape is just an example of changemyname and is not associated with the CNCF. The official CNCF Landscape can be found at <a href="https://landscape.cncf.io">landscape.cncf.io</a></span>',
  },
];

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
    label: "Country",
  },
  {
    name: "language",
    label: "Language",
  },
];

writeFileSync(
  destPath,
  JSON.stringify(
    { title, header, footer, filters, categories },
    undefined,
    4
  )
);
