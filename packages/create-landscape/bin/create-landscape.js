#!/usr/bin/env node
import { Command } from "commander";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { resolve } from "path";
import createLandscape from "../src/createLandscape.js";

const __filename = fileURLToPath(import.meta.url);
const packagePath = resolve(__filename, "..", "..", "package.json");
const { version } = JSON.parse(readFileSync(packagePath));

const program = new Command();

program
  .name("create-landscape")
  .version(version, "-v, --version")
  .argument("<directory>", "location")
  .option("-y, --yes", "confirm all prompts");

program.parse(process.argv);

await createLandscape(program.processedArgs[0], program.opts());
