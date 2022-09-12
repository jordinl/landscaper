import { mkdirSync, writeFileSync } from "fs";
import { resolve } from "path";
import { execSync } from "child_process";

import detectPackageManager from "./detectPackageManager.js";

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
  header: [
    {
      type: "html",
      content: "<h1>Demo Landscape</h1>",
    },
  ],
  footer: [
    {
      content: "Footer goes here",
    },
  ],
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

const createLandscape = async (directory) => {
  const assetsPath = resolve(directory, "assets");
  const logosPath = resolve(assetsPath, "logos");
  mkdirSync(logosPath, { recursive: true });
  const name = directory.split("/").pop();
  writeFileSync(
    resolve(directory, "package.json"),
    JSON.stringify({ name, ...defaultPackage }, null, 4)
  );
  if (process.env.MONOREPO) {
    writeFileSync(resolve(directory, ".npmrc"), "lockfile=false");
  }
  writeFileSync(
    resolve(directory, "landscape.json"),
    JSON.stringify(defaultLandscape, null, 4)
  );
  writeFileSync(resolve(logosPath, "logo.svg"), svg);
  const { installCommand } = detectPackageManager();
  process.chdir(directory);
  execSync(`${installCommand} @landscaper/interactive`, {
    stdio: "inherit",
  });
};

export default createLandscape;
