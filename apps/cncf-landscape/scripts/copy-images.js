import { resolve } from "path";
import {
  symlinkSync,
  unlinkSync,
  mkdirSync,
  copyFileSync,
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

const logoUrl =
  "https://raw.githubusercontent.com/cncf/artwork/master/other/cncf/horizontal/color-whitetext/cncf-color-whitetext.svg";

fetch(logoUrl)
  .then((response) => response.text())
  .then((logo) => writeFileSync(resolve(destDir, "logo.svg"), logo));

copyFileSync(
  resolve(srcDir, "images", "favicon.png"),
  resolve(destDir, "favicon.png")
);
