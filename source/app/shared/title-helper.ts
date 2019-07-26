import { is } from "./is";

function get(): string {
    if(is.null(localStorage) || is.null(localStorage["titleID"])) {
        return null;
    }

    return localStorage["titleID"];
}

function set(titleId: string): void {
    if(is.null(localStorage)) {
        return;
    }

    if(is.null(titleId)) {
        titleId = "";
    }

    localStorage["titleID"] = titleId;
}

export const titleHelper = {
    get,
    set,
}
