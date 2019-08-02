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

    const replaceRegEx = new RegExp("((?:\:)[a-z?]+)");

    let returnString = original;

    for (let i = 0; i < args.length; i++) {
        returnString = returnString.replace(replaceRegEx, args[i]);
    }

    return returnString;
}

function createPlayFabLink(titleId: string, uri: string, isReact: boolean): string {
    const playFabMainProdUrl = ".playfabapi.com";

    let urlRoot : string;

    // TODO when cloud moves to URI, use that value instead of pulling from productionServerUrl
    if(((PlayFab as any)._internalSettings.productionServerUrl === playFabMainProdUrl))
    {
        urlRoot = "https://developer.playfab.com";
    }
    else
    {
        const prodUrl = ((PlayFab as any)._internalSettings.productionServerUrl as string);
        const cloudEndIndex = prodUrl.indexOf(playFabMainProdUrl);
        const cloud = (PlayFab as any)._internalSettings.productionServerUrl.substring(1, cloudEndIndex);

        urlRoot = `https://${cloud}.${cloud}.playfab.com`;
    }

    return `${urlRoot}/en-US/${isReact ? `r/t/` : ``}${titleId}/${uri}`;
}


function setPrivateCloud(cloud: string): void {
    (PlayFab as any)._internalSettings.productionServerUrl = `.${cloud}.playfabapi.com`;
}

function htmlDecode(input: string): string {
    const e = document.createElement("div");
    e.innerHTML = input;
    return e.childNodes[0].nodeValue;
}

function parseTitleNewsDate(dateString: string): string {
    let dateTime = dateString;

    try {
        const trueDate = new Date(dateTime);
        dateTime = trueDate.toLocaleDateString();
    }
    catch {
        // Nothing to do
    }

    return dateTime;
}

export const utilities = {
    getRandomInteger,
    formatRoute,
    createPlayFabLink,
    setPrivateCloud,
    htmlDecode,
    parseTitleNewsDate
};