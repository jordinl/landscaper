const { npm_config_user_agent } = process.env;

const userAgent = (npm_config_user_agent || "")
  .split(" ")
  .reduce((agg, str) => {
    const [key, value] = str.split("/");
    return { ...agg, [key]: value || true };
  }, {});

const packageManagers = ["yarn", "pnpm", "npm"];

const lockFiles = {
  npm: ["package-lock.json", "npm-shrinkwrap.json"],
  yarn: ["yarn.lock"],
  pnpm: ["pnpm-lock.yaml"],
};

const detectPackageManager = () => {
  const packageManager = packageManagers.find(
    (packageManager) => userAgent[packageManager]
  );
  if (packageManager) {
    console.log("Package manager detected: ", packageManager);
    return packageManager;
  }
  console.log("No package manager detected, using npm");
  return "npm";
};

export default detectPackageManager;
