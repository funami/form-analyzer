const env = process.env.NODE_ENV
require("esbuild")
  .build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    outfile: "lib/index.js",
    minify: env == "production",
    sourcemap: env != "production",
    platform: "browser",
  })
  .catch(() => process.exit(1))
