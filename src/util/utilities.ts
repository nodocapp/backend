import { platform } from "process";
import type { Element } from "types";

export function subToId(sub: string) {
    return sub.replace("auth0|", "");
}

export function escapeNewline(str: string) {
    return str.replace(/\n/g, "\\n");
}

export function escapedPath(path: string) {
    return `${platform === "win32" ? escapeNewline(path) : path}`;
}

export function docFieldtoField(field: string) {
    return field.replace("$", "");
}

export function checkForRegistryField(elem: Element, registry: Record<string, string>) {
    if (typeof elem === "object") {
        const result: string[] = [];
        for (const value of Object.values(elem)) {
            if (typeof value === "object") {
                checkForRegistryField(value, registry).forEach(v => result.push(v));
            } else if (typeof value === "string" && value.startsWith("$")) {
                result.push(checkForRegistryField(value, registry)[0]);
            }
        }
        return result;
    } else {
        return Object.keys(registry).includes(docFieldtoField(elem)) ? [] : [docFieldtoField(elem)];
    }
}