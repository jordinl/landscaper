#!/usr/bin/env node

const { resolve } = require("path");
const { execSync } = require("child_process");
const { symlinkSync, mkdirSync, emptyDirSync, copySync } = require("fs-extra");

const args = process.argv.slice(2);
const methodName = args[0];

const setUpTmpFolder = () => {
  const templatesDir = resolve(__dirname, "..", "templates");

  const targetPath = resolve(".changemyname-tmp");

  mkdirSync(targetPath, { recursive: true });
  process.chdir(targetPath);

  emptyDirSync(targetPath);
  copySync(templatesDir, targetPath, {});
  symlinkSync(
      resolve(targetPath, "..", "assets"),
      resolve(targetPath, "public", "assets")
  );
}

const start = () => {
  setUpTmpFolder()

  execSync("react-scripts start", { stdio: "inherit" });
};

const build = () => {
  const buildPath = resolve('build');

  setUpTmpFolder()

  execSync(`BUILD_PATH="${buildPath}" react-scripts build`, { stdio: "inherit" });
};

const scripts = {
  start: start,
  build: build
};

const method = scripts[methodName];

if (method) {
  method();
} else {
  console.log(`Unknown script "${methodName}".`);
  process.exit(1);
}
