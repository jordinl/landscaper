import { resolve } from "path";
import { symlinkSync, mkdirSync, copyFileSync, existsSync } from "fs";

const srcDir = resolve("original");
const destDir = resolve("assets");

if (!existsSync(destDir)) {
  mkdirSync(destDir, { recursive: true });
  symlinkSync(resolve(srcDir, "hosted_logos"), resolve(destDir, "logos"));
}

copyFileSync(
  resolve(srcDir, "images", "cncf-logo.svg"),
  resolve(destDir, "cncf-logo.svg")
);
