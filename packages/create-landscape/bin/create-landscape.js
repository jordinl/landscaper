#!/usr/bin/env node
import { Command } from "commander";
import createLandscape from "../src/createLandscape.js";

const program = new Command();

program.name("create-landscape").argument("<directory>", "location");

program.parse(process.argv);

await createLandscape(program.processedArgs[0]);
