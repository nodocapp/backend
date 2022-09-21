import Router from "@koa/router";
import koaBody from "koa-body";
import { randomBytes } from "crypto";
import { sep } from "path";
import { createWriteStream } from "fs";
import { Readable } from "stream";
import { auth } from "../util/middleware.js";
import type { AppContext, AppState } from "types";
import { checkForRegistryField, docFieldtoField, escapedPath, getAllObjectValues, subToId } from "../util/utilities.js";
import { readdir, readFile } from "fs/promises";

const router = new Router<AppState, AppContext>({ prefix: "/docs" });

router.get("getDocumentIds", "/", auth, async (ctx, next) => {
    const dir = await readdir(`${escapedPath(process.env.DOCS_PATH as string)}${sep}${subToId(ctx.state.user.sub)}`);

    if (dir.length === 0) {
        ctx.status = 200;
        ctx.body = "No documents were found.";
        return await next();
    }

    ctx.status = 200;
    ctx.body = dir.map(f => f.replace(".json", ""));
});

router.post("createDocument", "/create", auth, koaBody(), async (ctx, next) => {
    if (!ctx.is("json")) {
        ctx.status = 400;
        ctx.body = "Request body must be a JSON object.";
        return await next();
    }

    const registry = (await ctx.prisma.user.findUnique({ where: { id: subToId(ctx.state.user.sub) } }))?.registry as Record<string, string>;
    const inexistentFields = checkForRegistryField(ctx.request.body, registry);

    if (inexistentFields.length > 0) {
        ctx.status = 400;
        ctx.body = `${inexistentFields.join(", ")} ${inexistentFields.length === 1 ? "doesn't" : "don't"} exist in your registry.`;
        return await next();
    }

    const id = randomBytes(16).toString("hex");
    const stream = createWriteStream(`${escapedPath(process.env.DOCS_PATH as string)}${sep}${subToId(ctx.state.user.sub)}${sep}${id}.json`, { encoding: "utf-8" });
    Readable.from(Buffer.from(JSON.stringify(ctx.request.body))).pipe(stream);

    return await new Promise((res, rej) => {
        stream.on("finish", () => {
            ctx.status = 201;
            ctx.body = `Document with ID ${id} has been created.`;
            res(next());
        });

        stream.on("error", err => {
            rej(err);
        });
    });
});

router.get("getDocument", "/:id", auth, async (ctx, next) => {
    if (ctx.params.id.length < 32) {
        ctx.status = 400;
        ctx.body = "A valid ID must be provided.";
        return await next();
    } 

    try {
        const file = await readFile(`${escapedPath(process.env.DOCS_PATH as string)}${sep}${subToId(ctx.state.user.sub)}${sep}${ctx.params.id}.json`, "utf-8");
        const fields = getAllObjectValues(JSON.parse(file)).filter(v => v.startsWith("$"));
        let returnFile = file;
        
        if (fields.length > 0) {
            const registry = (await ctx.prisma.user.findUnique({ where: { id: subToId(ctx.state.user.sub) } }))?.registry as Record<string, string>;

            fields.forEach(f => {
                returnFile = returnFile.replace(f, registry[docFieldtoField(f)]);
            });
        }
        
        ctx.status = 200;
        ctx.body = returnFile;
    } catch (err) {
        if (err instanceof Error && err.message.startsWith("ENOENT")) {
            ctx.status = 404;
            ctx.body = "A document with that ID wasn't found.";
            return await next();
        }

        throw err;
    }
});

export default router;