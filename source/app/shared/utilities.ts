import { is } from "./is";

function getTitleId(): string {
    if(is.null(localStorage) || is.null(localStorage["titleID"])) {
        return null;
    }

    return localStorage["titleID"];
}

function setTitleId(titleId: string): void {
    if(is.null(localStorage)) {
        return;
    }

    if(is.null(titleId)) {
        titleId = "";
    }

    localStorage["titleID"] = titleId;
}

function getRandomInteger(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const utilities = {
    getRandomInteger,
    getTitleId,
    setTitleId
};