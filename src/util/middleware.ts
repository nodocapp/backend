import jwt from "koa-jwt";
import { koaJwtSecret } from "jwks-rsa";
import { Middleware } from "koa";
import { PrismaClient } from "@prisma/client";

export const auth = jwt({
    secret: koaJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${process.env.AUTH_ISSUER}.well-known/jwks.json`,
    }),
    audience: process.env.AUTH_AUDIENCE,
    issuer: process.env.AUTH_ISSUER,
    algorithms: ["RS256"],
});

export function db(): Middleware {
    const prisma = new PrismaClient();

    return async (ctx, next) => {
        ctx.prisma = prisma;
        await next();
    };
}
