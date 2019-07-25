import { IPlanetData, ITitleDataEnemies } from "../shared/types";

export enum ActionTypes {
    SET_TITLE_ID = "SET_TITLE_ID",
    SET_PLAYER_ID = "SET_PLAYER_ID",
    SET_PLAYER_NAME = "SET_PLAYER_NAME",
    SET_CATALOG = "SET_CATALOG",
    SET_INVENTORY = "SET_INVENTORY",
    SET_STORES = "SET_STORES",
    SET_PLANETS = "SET_PLANETS",
    SET_ENEMIES = "SET_ENEMIES",
}

export interface IApplicationState {
    titleId: string;
    playerId: string;
    playerName: string;
    catalog: PlayFabClientModels.CatalogItem[];
    inventory: PlayFabClientModels.GetUserInventoryResult;
    stores: PlayFabClientModels.GetStoreItemsResult[];
    planets: IPlanetData[];
    enemies: ITitleDataEnemies;
}

export interface IAction<T> {
    type: string;
    payload?: T;
}