import { resolve } from "path";
import { existsSync } from "fs";
import { execSync } from "child_process";

const repoPath = resolve("original");

const command = existsSync(repoPath)
  ? `cd original && git pull`
  : `git clone --depth=1 --single-branch --branch=master https://github.com/cncf/landscape ${repoPath}`;

execSync(command, { stdio: "inherit" });
