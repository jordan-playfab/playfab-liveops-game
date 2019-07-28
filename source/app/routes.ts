import { utilities } from "./shared/utilities";

export const routeNames = {
    Index: "/",
    MainMenu: "/:titleid/menu",
    Login: "/:titleid/login",
    Guide: "/:titleid/:playerid/guide",
    Planet: "/:titleid/:playerid/planet/:name",
    Headquarters: "/:titleid/:playerid/headquarters",
    Upload: "/:titleid/upload",
    Download: "/:titleid/download",
    LevelCurve: "/:titleid/level-curve",
};

export const routes = {
    Index: () => routeNames.Index,
    MainMenu: (titleId: string) => utilities.formatRoute(routeNames.MainMenu, titleId),
    Login: (titleId: string) => utilities.formatRoute(routeNames.Login, titleId),
    Guide: (titleId: string, playerId: string) => utilities.formatRoute(routeNames.Guide, titleId, playerId),
    Planet: (titleId: string, playerId: string, planetName: string) => utilities.formatRoute(routeNames.Planet, titleId, playerId, planetName),
    Headquarters: (titleId: string, playerId: string) => utilities.formatRoute(routeNames.Headquarters, titleId, playerId),
    Upload: (titleId: string) => utilities.formatRoute(routeNames.Upload, titleId),
    Download: (titleId: string) => utilities.formatRoute(routeNames.Download, titleId),
    LevelCurve: (titleId: string) => utilities.formatRoute(routeNames.LevelCurve, titleId),
};
