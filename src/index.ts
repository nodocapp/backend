import "dotenv/config";
const port = process.env.PORT || 3000;

import Koa from "koa";

import { db } from "./util/middleware.js";
import type { AppContext, AppState } from "./util/typedefs";

import user from "./routes/user/index.js";
import docs from "./routes/docs.js";

const server = new Koa<AppState, AppContext>();

server.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.status = 500;
        ctx.body = `The server encountered an error while handling your request.\n${err}`;
    }
});
server.use(db());

server.use(user.routes()).use(user.allowedMethods());
server.use(docs.routes()).use(docs.allowedMethods());

server
    .listen(port, () => console.log(`Listening on http://localhost:${port}`))
    .on("error", err => console.error(err));