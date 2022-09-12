import "dotenv/config";
const port = process.env.PORT || 3000;

import Koa, { type DefaultState } from "koa";

import { db } from "./util/middleware.js";
import type { AppContext } from "./util/typedefs.js";

const server = new Koa<DefaultState, AppContext>();

server.use(db());

server
    .listen(port, () => console.log(`Listening on http://localhost:${port}`))
    .on("error", err => console.error(err));