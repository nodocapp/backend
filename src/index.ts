import "dotenv/config";
const port = process.env.PORT || 3000;

import Koa from "koa";

import { db } from "./util/middleware.js";
import type { AppContext, AppState } from "./util/typedefs";

import user from "./routes/user.js";

const server = new Koa<AppState, AppContext>();

server.use(db());

server.use(user.routes()).use(user.allowedMethods());

server
    .listen(port, () => console.log(`Listening on http://localhost:${port}`))
    .on("error", err => console.error(err));