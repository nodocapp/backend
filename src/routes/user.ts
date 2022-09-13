import Router from "@koa/router";
import { subToId } from "../util/utilities.js";
import { auth } from "../util/middleware.js";
import type { AppContext, AppState } from "../util/typedefs.js";

const router = new Router<AppState, AppContext>({ prefix: "/user" });

router.get("getUserData", "/me", auth, async ctx => {
    try {
        ctx.status = 200;
        ctx.body = await ctx.prisma.user.findUnique({ where: { id: subToId(ctx.state.user.sub)}});
    } catch (err) {
        ctx.status = 500;
        ctx.body = err;
    }    
});

export default router;