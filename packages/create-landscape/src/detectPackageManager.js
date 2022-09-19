const { npm_config_user_agent } = process.env;

const userAgent = (npm_config_user_agent || "")
  .split(" ")
  .reduce((agg, str) => {
    const [key, value] = str.split("/");
    return { ...agg, [key]: value || true };
  }, {});

const npm = {
  name: "npm",
  installCommand: "npm add --legacy-peer-deps -D",
};

const packageManagers = [
  {
    name: "yarn",
    installCommand: "yarn add --dev",
  },
  {
    name: "pnpm",
    installCommand: "pnpm add -D",
  },
  npm,
];

const lockFiles = {
  npm: ["package-lock.json", "npm-shrinkwrap.json"],
  yarn: ["yarn.lock"],
  pnpm: ["pnpm-lock.yaml"],
};

const detectPackageManager = () => {
  const packageManager = packageManagers.find(({ name }) => userAgent[name]);
  if (packageManager) {
    return packageManager;
  }
  return npm;
};

export default detectPackageManager;
