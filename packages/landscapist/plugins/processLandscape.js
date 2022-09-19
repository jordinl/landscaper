import loadLandscape from "../utils/loadLandscape.js";
import expandLandscape from "../utils/expandLandscape.js";

const processLandscape = () => ({
  name: "process-landscape",
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url.match(/landscape\.json$/)) {
        const landscape = loadLandscape();
        const expandedLandscape = expandLandscape(landscape);
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify(expandedLandscape));
        res.end();
      } else {
        next();
      }
    });
  },
});

export default processLandscape;
