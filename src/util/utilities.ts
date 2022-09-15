import { platform } from "process";

export function subToId(sub: string) {
    return sub.replace("auth0|", "");
}

export function escapeNewline(str: string) {
    return str.replace(/\n/g, "\\n");
}

export function escapedPath(path: string) {
    return `${platform === "win32" ? escapeNewline(path) : path}`;
}