const { mergeConfig } = require("vite");
const { resolve } = require("path");

module.exports = {
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-controls",
    "@storybook/addon-viewport",
    "storybook-addon-react-router-v6",
  ],
  core: {
    builder: "@storybook/builder-vite",
  },
  framework: "@storybook/react",
  typescript: {
    reactDocgen: "react-docgen",
  },
  staticDirs: ["../stories"],
  async viteFinal(config, { configType }) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          "@landscaper/core": resolve(__dirname, "../packages/core/src"),
          "@landscaper/react": resolve(__dirname, "../packages/react/src"),
          "@landscaper/interactive": resolve(
            __dirname,
            "../packages/interactive"
          ),
        },
      },
    });
  },
};
