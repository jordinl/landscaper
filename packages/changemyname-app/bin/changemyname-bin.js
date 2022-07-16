#!/usr/bin/env node

const { resolve } = require("path");
const http = require("http");
const {
  copyFileSync,
  copySync,
  readFileSync,
  existsSync,
  emptyDirSync,
} = require("fs-extra");
const { build: esbuild, serve } = require("esbuild");

const args = process.argv.slice(2);
const methodName = args[0];
const packageDir = resolve(__dirname, "..");
const srcPath = resolve();
const buildPath = resolve("build");

const start = () => {
  serve(
    {},
    {
      entryPoints: [resolve(packageDir, "dist", "index.js")],
      bundle: true,
      incremental: true,
      loader: { ".js": "jsx", ".html": "copy", ".svg": "copy", ".woff": "copy", ".ttf": "copy", ".eot": "copy" },
    }
  )
    .then((result) => {
      const { host, port } = result;

      http
        .createServer((req, res) => {
          const options = {
            hostname: host,
            port: port,
            path: req.url,
            method: req.method,
            headers: req.headers,
          };

          const { pathname } = new URL(req.url, "http://example.com");

          if (pathname === "/") {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(readFileSync(resolve(packageDir, "src", "index.html")));
            res.end();
            return;
          }
          if (pathname.indexOf("/assets") === 0) {
            const assetPath = resolve(srcPath, ...pathname.split("/"));
            if (existsSync(assetPath)) {
              res.write(readFileSync(assetPath));
            } else {
              res.writeHead(404, { "Content-Type": "text/html" });
            }
            res.end();
          }

          // Forward each incoming request to esbuild
          const proxyReq = http.request(options, (proxyRes) => {
            // If esbuild returns "not found", send a custom 404 page
            if (proxyRes.statusCode === 404) {
              res.writeHead(404, { "Content-Type": "text/html" });
              res.end("<h1>Not found</h1>");
              return;
            }

            // Otherwise, forward the response from esbuild to the client
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res, { end: true });
          });

          // Forward the body of the request to esbuild
          req.pipe(proxyReq, { end: true });
        })
        .listen(3000);
    })
    .catch((message) => {
      console.log(message);
      process.exit(1);
    });
};

const build = () => {
  emptyDirSync(buildPath);

  esbuild({
    entryPoints: [resolve(packageDir, "dist", "index.js")],
    bundle: true,
    minify: true,
    outdir: buildPath,
    loader: { ".js": "jsx", ".html": "copy" },
  })
    .catch((message) => {
      console.log(message);
      process.exit(1);
    })
    .then(() => {
      copyFileSync(
        resolve(packageDir, "src", "index.html"),
        resolve(buildPath, "index.html")
      );
      copySync(resolve(srcPath, "assets"), resolve(buildPath, "assets"), {});
    });
};

const scripts = {
  start: start,
  build: build,
};

const method = scripts[methodName];

if (method) {
  method();
} else {
  console.log(`Unknown script "${methodName}".`);
  process.exit(1);
}
