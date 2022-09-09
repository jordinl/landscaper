#!/usr/bin/env node

import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const args = process.argv.slice(2);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageDir = resolve(__dirname, "..");

try {
  const binPath = execSync("npm bin", { cwd: packageDir });
  process.env.PATH = `${binPath.toString().trim()}:${process.env.PATH}`;
} catch {}

execSync(`vite ${args.join(" ")} "${packageDir}"`, { stdio: "inherit" });
