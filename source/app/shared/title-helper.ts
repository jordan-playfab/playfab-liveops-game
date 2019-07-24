import { is } from "./is";

function get(): string {
    if(is.null(localStorage) || is.null(localStorage["titleID"])) {
        return null;
    }

    return localStorage["titleID"];
}

function set(titleID: string): void {
    if(is.null(localStorage)) {
        return;
    }

    localStorage["titleID"] = titleID;
}

export const titleHelper = {
    get,
    set,
}
