import { utilities } from "./shared/utilities";

export const routeNames = {
    Index: "/:cloud?",
    MainMenu: "/:titleid/menu",
    Login: "/:titleid/login",
    Guide: "/:titleid/guide",
    Planet: "/:titleid/planet/:name",
    Headquarters: "/:titleid/headquarters",
    Upload: "/:titleid/upload",
    Download: "/:titleid/download",
    LevelCurve: "/:titleid/level-curve",
    Credits: "/:titleid/credits",
};

export const routes = {
    Index: (cloud: string) => utilities.formatRoute(routeNames.Index, cloud),
    MainMenu: (titleId: string) => utilities.formatRoute(routeNames.MainMenu, titleId),
    Login: (titleId: string) => utilities.formatRoute(routeNames.Login, titleId),
    Guide: (titleId: string) => utilities.formatRoute(routeNames.Guide, titleId),
    Planet: (titleId: string, planetName: string) => utilities.formatRoute(routeNames.Planet, titleId, planetName),
    Headquarters: (titleId: string) => utilities.formatRoute(routeNames.Headquarters, titleId),
    Upload: (titleId: string) => utilities.formatRoute(routeNames.Upload, titleId),
    Download: (titleId: string) => utilities.formatRoute(routeNames.Download, titleId),
    LevelCurve: (titleId: string) => utilities.formatRoute(routeNames.LevelCurve, titleId),
    Credits: (titleId: string) => utilities.formatRoute(routeNames.Credits, titleId),
};
