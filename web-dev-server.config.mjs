import { esbuildPlugin } from "@web/dev-server-esbuild"
import bodyParser from "koa-bodyparser"
const postMiddleware = (ctx, next) => {
  if (ctx.url.match(/\/demo\/submit/) && ctx.method == "POST") {
    const body = ctx.request.body
    ctx.body = JSON.stringify({ headers: ctx.headers, body }, null, 2)
    ctx.type = "application/json"
    return next()
  } else {
    return next()
  }
}

export default {
  plugins: [esbuildPlugin({ ts: true, target: "auto" })],
  middleware: [bodyParser(), postMiddleware],
}
