import { platform } from "process";
import type { Element, Registry } from "types";

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

export function getAllObjectValues(obj: object) {
    const result: string[] = [];

    for (const value of Object.values(obj)) {
        if (typeof value === "object") {
            getAllObjectValues(value).forEach(v => result.push(v));
        } else result.push(value);
    }

    return result;
}

export function checkForRegistryField(elem: Element, registry: Registry) {
    if (typeof elem === "object") {
        const values = getAllObjectValues(elem);
        const result: string[] = [];
        for (const value of values) {
            if (value.startsWith("$")) {
                result.push(checkForRegistryField(value, registry)[0]);
            }
        }
        return result.filter(v => v);
    } else {
        return Object.keys(registry).includes(docFieldtoField(elem))
            ? []
            : [docFieldtoField(elem)];
    }
}
