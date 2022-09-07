const env = process.env.NODE_ENV
const dotenv = require("dotenv")
dotenv.config()
console.log({
  global: "window",
  "process.env.API_URL": `"${process.env.API_URL}"`,
  "process.env.API_KEY": `"${process.env.API_KEY}"`,
})
require("esbuild")
  .build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    outfile: "lib/index.js",
    minify: env == "production",
    sourcemap: env != "production",
    platform: "browser",
    define: {
      global: "window",
      "process.env.API_URL": `"${process.env.API_URL}"`,
      "process.env.API_KEY": `"${process.env.API_KEY}"`,
    },
  })
  .catch(() => process.exit(1))
