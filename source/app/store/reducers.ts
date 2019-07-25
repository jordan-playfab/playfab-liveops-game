import { Reducer } from "redux";
import { IApplicationState, IAction, ActionTypes } from "./types";

const initialState: IApplicationState = {
    catalog: null,
    enemies: null,
    inventory: null,
    planets: null,
    playerId: null,
    playerName: null,
    stores: null,
    titleId: null,
};

export const mainReducer: Reducer<IApplicationState, IAction<any>> = (state = initialState, action): IApplicationState => {
    switch(action.type) {
        case ActionTypes.SET_CATALOG:
            const model = action.payload as PlayFabClientModels.CatalogItem[];
            
            return {
                ...state,
                catalog: model,
            };
        default:
            return state;
    }
}
