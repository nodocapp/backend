import Router from "@koa/router";
import koaBody from "koa-body";
import { Prisma } from "@prisma/client";
import type { AppContext, AppState } from "types";
import { auth } from "../../util/middleware.js";
import { subToId } from "../../util/utilities.js";

const router = new Router<AppState, AppContext>({ prefix: "/registry" });

router.get("getRegistry", "/", auth, async ctx => {
    const user = await ctx.prisma.user.findUnique({
        where: { id: subToId(ctx.state.user.sub) },
    });
    ctx.status = 200;
    ctx.body = user?.registry;
});

router.post("setRegistryField", "/set", auth, koaBody(), async (ctx, next) => {
    const user = await ctx.prisma.user.findUnique({
        where: { id: subToId(ctx.state.user.sub) },
    });
    const registry = user?.registry as Prisma.JsonObject;

    if (Object.values(ctx.request.body).length === 0) {
        ctx.status = 400;
        ctx.body = "Fields to set must be provided with a value.";
        return await next();
    }

    Object.keys(ctx.request.body).forEach(
        f => (registry[f] = ctx.request.body[f])
    );
    const updateClause = Prisma.validator<Prisma.UserUpdateInput>()({
        registry: registry,
    });

    await ctx.prisma.$transaction([
        ctx.prisma.user.update({
            where: { id: subToId(ctx.state.user.sub) },
            data: updateClause,
        }),
    ]);
    ctx.status = 200;
    ctx.body = `The fields ${Object.keys(ctx.request.body).join(
        ", "
    )} were updated.`;
});

router.get("getRegistryField", "/:field", auth, async ctx => {
    const user = await ctx.prisma.user.findUnique({
        where: { id: subToId(ctx.state.user.sub) },
    });
    const field = (user?.registry as Prisma.JsonObject)[ctx.params.field];
    if (field) {
        ctx.status = 200;
        ctx.body = field;
    } else {
        ctx.status = 404;
        ctx.body = "That field doesn't exist.";
    }
});

export default router;
