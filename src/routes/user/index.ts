import Router from "@koa/router";
import registry from "./registry.js";
import { subToId } from "../../util/utilities.js";
import { auth } from "../../util/middleware.js";
import type { AppContext, AppState } from "types";

const router = new Router<AppState, AppContext>({ prefix: "/user" });

router.get("getUserData", "/me", auth, async ctx => {
    try {
        ctx.status = 200;
        ctx.body = await ctx.prisma.user.findUnique({ where: { id: subToId(ctx.state.user.sub) } });
    } catch (err) {
        ctx.status = 500;
        ctx.body = err;
    }    
});

router.use(registry.routes(), registry.allowedMethods());

export default router;