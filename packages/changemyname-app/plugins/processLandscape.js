import loadLandscape from "../utils/loadLandscape.js";

const transformOptions = (options) => {
  return options
    .map((option) => {
      const children = option.children && transformOptions(option.children);
      const childrenHash = children ? { children } : {};
      const id = option.label.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      return {
        ...option,
        id,
        ...childrenHash,
      };
    })
    .sort((a, b) => (a.id <= b.id ? -1 : 1));
};

const processLandscape = () => ({
  name: "process-landscape",
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url.match(/landscape\.json$/)) {
        const landscape = loadLandscape();
        res.setHeader("Content-Type", "application/json");
        const filters =
          landscape.filters &&
          landscape.filters.map((filter) => {
            const options = transformOptions(filter.options);
            return { ...filter, options };
          });
        const filtersHash = filters ? { filters } : {};
        res.write(JSON.stringify({ ...landscape, ...filtersHash }));
        res.end();
      } else {
        next();
      }
    });
  },
});

export default processLandscape;
