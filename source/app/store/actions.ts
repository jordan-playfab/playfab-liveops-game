import { action } from "typesafe-actions";
import { ActionTypes } from "./types";
import { ITitleDataEnemies, IPlanetData, TITLE_DATA_PLANETS, ITitleDataPlanets, IStringDictionary } from "../shared/types";

export const actionSetCatalog = (catalog: PlayFabClientModels.CatalogItem[]) => action(ActionTypes.SET_CATALOG, catalog);
export const actionSetEnemies = (enemies: ITitleDataEnemies) => action(ActionTypes.SET_ENEMIES, enemies);
export const actionSetInventory = (inventory: PlayFabClientModels.GetUserInventoryResult) => action(ActionTypes.SET_INVENTORY, inventory);
export const actionSetPlanets = (planets: IPlanetData[]) => action(ActionTypes.SET_PLANETS, planets);
export const actionSetPlanetsFromTitleData = (data: IStringDictionary) => {
    const planetData = JSON.parse(data[TITLE_DATA_PLANETS]) as ITitleDataPlanets;
    return action(ActionTypes.SET_PLANETS, planetData)
};
export const actionSetPlayerId = (id: string) => action(ActionTypes.SET_PLAYER_ID, id);
export const actionSetPlayerName = (name: string) => action(ActionTypes.SET_PLAYER_NAME, name);
export const actionSetStores = (stores: PlayFabClientModels.GetStoreItemsResult[]) => action(ActionTypes.SET_STORES, stores);
export const actionSetTitleId = (titleId: string) => action(ActionTypes.SET_TITLE_ID, titleId);