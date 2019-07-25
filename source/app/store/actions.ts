import { action } from "typesafe-actions";
import { ActionTypes } from "./types";

export const actionSetCatalog = (catalog: PlayFabClientModels.CatalogItem[]) => action(ActionTypes.SET_CATALOG, catalog);
export const actionSetTitleId = (titleId: string) => action(ActionTypes.SET_TITLE_ID, titleId);