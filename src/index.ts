import "dotenv/config";
const port = process.env.PORT || 3000;

import Koa from "koa";

const server = new Koa();

server
    .listen(port, () => console.log(`Listening on http://localhost:${port}`))
    .on("error", err => console.error(err));