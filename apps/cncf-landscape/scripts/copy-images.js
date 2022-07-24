import { resolve } from "path";
import { symlinkSync, unlinkSync, mkdirSync, copyFileSync, existsSync } from "fs";

const srcDir = resolve("original");
const destDir = resolve("assets");
const logosDir = resolve(destDir, "logos")

if (!existsSync(destDir)) {
  mkdirSync(destDir, { recursive: true });
}

if (existsSync(logosDir)) {
  unlinkSync(logosDir);
}

symlinkSync(resolve(srcDir, "cached_logos"), logosDir);

copyFileSync(
  resolve(srcDir, "images", "cncf-logo.svg"),
  resolve(destDir, "cncf-logo.svg")
);
