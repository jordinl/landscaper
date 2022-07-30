import { resolve } from "path";
import {
  symlinkSync,
  unlinkSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  existsSync,
  lstatSync,
} from "fs";
import fetch from "node-fetch";

const srcDir = resolve("original");
const destDir = resolve("assets");
const logosDir = resolve(destDir, "logos");

if (!existsSync(destDir)) {
  mkdirSync(destDir, { recursive: true });
}

if (lstatSync(logosDir, { throwIfNoEntry: false })) {
  unlinkSync(logosDir);
}

symlinkSync(resolve(srcDir, "cached_logos"), logosDir);

const originalLeftLogo = readFileSync(
  resolve(srcDir, "images", "left-logo.svg"),
  "utf-8"
);
const modifiedLeftLogo = originalLeftLogo.replace("#333333", "white");
writeFileSync(resolve(destDir, "left-logo.svg"), modifiedLeftLogo);

const rightLogoUrl =
  "https://raw.githubusercontent.com/cncf/artwork/master/other/cncf/horizontal/color-whitetext/cncf-color-whitetext.svg";

fetch(rightLogoUrl)
  .then((response) => response.text())
  .then((logo) => writeFileSync(resolve(destDir, "right-logo.svg"), logo));
