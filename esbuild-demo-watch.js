const env = process.env.NODE_ENV
const dotenv = require("dotenv")
dotenv.config()

const define_env = ["API_URL", "API_KEY"].reduce((ret, name) => {
  ret[`process.env.${name}`] = `"${process.env[name] || ""}"`
  return ret
}, {})

console.log(define_env)
require("esbuild")
  .build({
    entryPoints: ["src/app.ts"],
    bundle: true,
    outfile: "dist/app.js",
    minify: env == "production",
    sourcemap: env != "production",
    platform: "browser",
    define: {
      global: "window",
      ...define_env,
    },
    watch: true,
  })
  .catch(() => process.exit(1))
