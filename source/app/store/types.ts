import { IPlanetData, ITitleDataEnemies } from "../shared/types";

export enum ActionTypes {
    SET_TITLE_ID = "SET_TITLE_ID",
    SET_PLAYER_ID = "SET_PLAYER_ID",
    SET_PLAYER_NAME = "SET_PLAYER_NAME",
    SET_CATALOG = "SET_CATALOG",
    SET_INVENTORY = "SET_INVENTORY",
    SET_PLAYER_HP = "SET_PLAYER_HP",
    SET_STORES = "SET_STORES",
    SET_STORE_NAMES = "SET_STORE_NAMES",
    SET_PLANETS = "SET_PLANETS",
    SET_ENEMIES = "SET_ENEMIES",
    SUBTRACT_PLAYER_HP = "SUBTRACT_PLAYER_HP",
    SET_EQUIPPED_WEAPON = "SET_EQUIPPED_WEAPON",
    SET_EQUIPPED_ARMOR = "SET_EQUIPPED_ARMOR",
}

export interface IApplicationState {
    titleId: string;
    hasTitleId: boolean;
    playerId: string;
    hasPlayerId: boolean;
    playerName: string;
    playerHP: number;
    catalog: PlayFabClientModels.CatalogItem[];
    inventory: PlayFabClientModels.GetUserInventoryResult;
    stores: PlayFabClientModels.GetStoreItemsResult[];
    planets: IPlanetData[];
    enemies: ITitleDataEnemies;
    storeNames: string[];
    equippedWeapon: PlayFabClientModels.CatalogItem;
    equippedArmor: PlayFabClientModels.CatalogItem;
}

export interface IAction<T> {
    type: string;
    payload?: T;
}