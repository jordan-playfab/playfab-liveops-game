import { Reducer } from "redux";
import { IApplicationState, IAction, ActionTypes } from "./types";
import { ITitleDataEnemies, IPlanetData } from "../shared/types";
import { is } from "../shared/is";

const initialState: IApplicationState = {
    catalog: null,
    enemies: null,
    inventory: null,
    planets: null,
    playerId: null,
    playerName: null,
    playerHP: 0,
    stores: null,
    titleId: null,
    hasPlayerId: false,
    hasTitleId: false,
    storeNames: null,
};

export const mainReducer: Reducer<IApplicationState, IAction<any>> = (state = initialState, action): IApplicationState => {
    switch(action.type) {
        case ActionTypes.SET_CATALOG:
            return {
                ...state,
                catalog: action.payload as PlayFabClientModels.CatalogItem[],
            };
        case ActionTypes.SET_ENEMIES:
            return {
                ...state,
                enemies: action.payload as ITitleDataEnemies,
            };
        case ActionTypes.SET_INVENTORY:
            return {
                ...state,
                inventory: action.payload as PlayFabClientModels.GetUserInventoryResult,
            };
        case ActionTypes.SET_PLANETS:
            return {
                ...state,
                planets: action.payload as IPlanetData[],
            };
        case ActionTypes.SET_PLAYER_ID:
            return {
                ...state,
                playerId: action.payload as string,
                hasPlayerId: !is.null(action.payload),
            };
        case ActionTypes.SET_PLAYER_NAME:
            return {
                ...state,
                playerName: action.payload as string,
            };
        case ActionTypes.SET_STORES:
            return {
                ...state,
                stores: action.payload as PlayFabClientModels.GetStoreItemsResult[],
            };
        case ActionTypes.SET_STORE_NAMES:
            return {
                ...state,
                storeNames: action.payload as string[],
            };
        case ActionTypes.SET_TITLE_ID:
            return {
                ...state,
                titleId: action.payload as string,
                hasTitleId: !is.null(action.payload),
            };
        case ActionTypes.SET_PLAYER_HP:
            return {
                ...state,
                playerHP: action.payload as number,
            };
        case ActionTypes.SUBTRACT_PLAYER_HP:
            return {
                ...state,
                playerHP: Math.max(0, state.playerHP - action.payload as number),
            };
        default:
            return state;
    }
}
