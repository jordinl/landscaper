import { resolve } from "path";
import { existsSync } from "fs";

const loadTheme = async () => {
  const themePath = resolve("theme.config.js");
  const { default: theme } = existsSync(themePath)
    ? await import(`${themePath}?v=${Date.now()}`)
    : {};

  return theme;
};

export default loadTheme;
