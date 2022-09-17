import { resolve } from "path";
import { existsSync, readFileSync } from "fs";

const loadTheme = () => {
  const themePath = resolve("theme.json");
  return existsSync(themePath)
    ? JSON.parse(readFileSync(themePath, "utf-8"))
    : {};
};

export default loadTheme;
