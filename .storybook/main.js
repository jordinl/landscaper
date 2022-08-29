module.exports = {
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-controls",
    "@storybook/addon-viewport",
    "storybook-addon-react-router-v6"
  ],
  core: {
    builder: "@storybook/builder-vite",
  },
  framework: "@storybook/react",
  typescript: {
    reactDocgen: "react-docgen",
  },
  staticDirs: ['../stories'],
};
