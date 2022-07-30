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

const originalLeftLogo = readFileSync(resolve(srcDir, "images", "left-logo.svg"), 'utf-8');
const modifiedLeftLogo = originalLeftLogo.replace('#333333', 'white');
writeFileSync(resolve(destDir, "left-logo.svg"), modifiedLeftLogo);
