/// <reference path="../../../node_modules/playfab-web-sdk/src/Typings/PlayFab/PlayFabClientApi.d.ts" />
/// <reference path="../../../node_modules/playfab-web-sdk/src/Typings/PlayFab/PlayFabAdminApi.d.ts" />
import "playfab-web-sdk/src/PlayFab/PlayFabClientApi.js";
import "playfab-web-sdk/src/PlayFab/PlayFabAdminApi.js";
import { IRouterProps } from "../router";
import { IStringDictionary } from "./types";
import { is } from "./is";

const CatalogVersion = "Main";
const TitleDataStores = "Stores";

function login(props: IRouterProps, customID: string, success: (data: PlayFabClientModels.LoginResult) => void, error: (message: string) => void): void {
    PlayFab.ClientApi.LoginWithCustomID({
        TitleId: props.titleID,
        CustomId: customID,
        CreateAccount: true,
    }, (result) => {
        if(result.code === 200) {
            success(result.data);
        }
        else {
            error(result.errorMessage);
        }
    });
}

function getInventory(success: (data: PlayFabClientModels.GetUserInventoryResult) => void, error: (message: string) => void) {
    PlayFab.ClientApi.GetUserInventory({},
        (result) => {
            if(result.code === 200) {
                success(result.data);
            }
            else {
                error(result.errorMessage);
            }
        }
    );
}

function getTitleData(keys: string[], success: (data: IStringDictionary) => void, error: (message: string) => void): void {
    PlayFab.ClientApi.GetTitleData({
        Keys: keys,
    }, (result) => {
        if(result.code === 200) {
            success(result.data.Data);
        }
        else {
            error(result.errorMessage);
        }
    });
}

function getStatistics(keys: string[], success: (data: PlayFabClientModels.StatisticValue[]) => void, error: (message: string) => void): void {
    PlayFab.ClientApi.GetPlayerStatistics({
        StatisticNames: keys,
    }, (result) => {
        if(result.code === 200) {
            success(result.data.Statistics);
        }
        else {
            error(result.errorMessage);
        }
    });
}

function updateStatistic(statistic: string, amount: number, success: (data: PlayFabClientModels.UpdatePlayerStatisticsResult) => void, error: (message: string) => void): void {
    PlayFab.ClientApi.UpdatePlayerStatistics({
        Statistics: [{
            StatisticName: statistic,
            Value: amount,
        }],
    }, (result) => {
        if(result.code === 200) {
            success(result.data);
        }
        else {
            error(result.errorMessage);
        }
    });
}

function executeCloudScript(functionName: string, args: any, success: (data: PlayFabClientModels.ExecuteCloudScriptResult) => void, error: (message: string) => void): void {
    PlayFab.ClientApi.ExecuteCloudScript({
        FunctionName: functionName,
        FunctionParameter: args,
    }, (result) => {
        if(result.code === 200 && is.null(result.data.Error)) {
            success(result.data);
        }
        else {
            if(is.null(result.data.Error)) {
                error(result.errorMessage);
            }
            else {
                error(result.data.Error.Error);
            }
        }
    })
}

function getStores(success: (data: PlayFabClientModels.GetStoreItemsResult[]) => void, error: (message: string) => void): void {
    const stores: PlayFabClientModels.GetStoreItemsResult[] = [];

    getTitleData([TitleDataStores], (data) => {
        const storeNames = JSON.parse(data[TitleDataStores]) as string[];

        storeNames.forEach((storeName) => {
            PlayFab.ClientApi.GetStoreItems({
                CatalogVersion,
                StoreId: storeName,
            }, (result) => {
                if(result.code === 200) {
                    stores.push(result.data);

                    if(stores.length === storeNames.length) {
                        success(stores);
                    }
                }
                else {
                    error(result.errorMessage);
                }
            });
        })
    }, (error) => {
        // TODO: Nothing
    });
}

function buyFromStore(storeID: string, itemID: string, currency: string, price: number, success: (data: PlayFabClientModels.PurchaseItemResult) => void, error: (message: string) => void): void {
    PlayFab.ClientApi.PurchaseItem({
        CatalogVersion,
        ItemId: itemID,
        Price: price,
        StoreId: storeID,
        VirtualCurrency: currency,
    }, (result, errorResult) => {
        if(is.null(result)) {
            error(errorResult.errorMessage);
            return;
        }

        if(result.code === 200) {
            success(result.data);
        }
        else {
            error(result.errorMessage);
        }
    })
}

function getCatalog(success: (data: PlayFabClientModels.CatalogItem[]) => void, error: (message: string) => void): void {
    PlayFab.ClientApi.GetCatalogItems({
        CatalogVersion,
    }, (result) => {
        if(result.code === 200) {
            success(result.data.Catalog);
        }
        else {
            error(result.errorMessage);
        }
    })
}

function uploadTitleData(titleDataKey: string, titleDataValue: string, success: (data: PlayFabAdminModels.SetTitleDataResult) => void, error: (message: string) => void) : void{
    console.log("uploading title data");

    // This should probably be set from a config somewhere.
    PlayFab.settings.developerSecretKey = "QQAUQREGUQ5P5AC89JO4RRGHSWMJ1TG9WGJAS1YKO9GG1XBCEE";
    PlayFab.AdminApi.SetTitleData({
        Key: titleDataKey,
        Value: titleDataValue
    }, (result) => {
        if (result.code === 200) {
            alert("success upload");
            success(result.data);
        }
        else {
            alert("there was an error uploading");
            error(result.errorMessage);
        }
    });
}


export const PlayFabHelper = {
    login,
    getTitleData,
    updateStatistic,
    uploadTitleData,
    executeCloudScript,
    getStatistics,
    getInventory,
    getStores,
    buyFromStore,
    getCatalog
};
