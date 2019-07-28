import { is } from "./is";

function getRandomInteger(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatRoute(original: string, ...args: string[]): string {
    if (is.null(original) || is.null(args)) {
        return "";
    }

    const replaceRegEx = new RegExp("((?:\:)[a-z]+)");

    let returnString = original;

    for (let i = 0; i < args.length; i++) {
        returnString = returnString.replace(replaceRegEx, args[i]);
    }

    return returnString;
}

export const utilities = {
    getRandomInteger,
    formatRoute
};