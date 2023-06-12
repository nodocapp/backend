import type { PrismaClient } from "@prisma/client";

export type Element = string | { [key: string]: Element };
export type Registry = Record<string, string>;

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
