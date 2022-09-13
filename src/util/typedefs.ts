import type { PrismaClient } from "@prisma/client";

export interface JWTData {
    iss: string;
    sub: string;
    aud: string;
    iat: number;
    exp: number;
    azp: string;
    scope: string;
}

export interface AppState {
    user: JWTData;
}

export interface AppContext {
    prisma: PrismaClient;
}