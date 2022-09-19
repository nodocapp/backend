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

export function docFieldtoField(field: string) {
    return field.replace("$", "");
}

export function checkForRegistryField(elem: string | object, registry: object): string[] {
    if (typeof elem === "object") {
        const result: string[] = [];
        for (const value of Object.values(elem)) {
            if (value.startsWith("$")) checkForRegistryField(value, registry).forEach(c => result.push(c)); else continue;
        }
        return result;
    } else {
        return Object.keys(registry).includes(docFieldtoField(elem)) ? [] : [docFieldtoField(elem)];
    }
}