/// <reference path="../../../node_modules/playfab-web-sdk/src/Typings/PlayFab/PlayFabClientApi.d.ts" />
/// <reference path="../../../node_modules/playfab-web-sdk/src/Typings/PlayFab/PlayFabAdminApi.d.ts" />
import "playfab-web-sdk/src/PlayFab/PlayFabClientApi.js";
import "playfab-web-sdk/src/PlayFab/PlayFabAdminApi.js";
import { IRouterProps } from "../router";
import { IStringDictionary, CATALOG_VERSION, TITLE_DATA_STORES } from "./types";
import { is } from "./is";


function login(props: IRouterProps, customID: string, success: (data: PlayFabClientModels.LoginResult) => void, error: (message: string) => void): void {
    PlayFab.ClientApi.LoginWithCustomID({
        TitleId: props.titleID,
        CustomId: customID,
        CreateAccount: true,
    }, (result, problem) => {
        if(!is.null(problem)) {
            return error(problem.errorMessage);
        }

        if(result.code === 200) {
            if(result.data.NewlyCreated) {
                // Doesn't matter if it succeeds or fails
                updateDisplayName(customID, () => {}, () => {});
            }

            success(result.data);
        }
        else {
            error(result.errorMessage);
        }
    });
}

function updateDisplayName(customID: string, success: (data: PlayFabClientModels.UpdateUserTitleDisplayNameResult) => void, error: (message: string) => void): void {
    PlayFab.ClientApi.UpdateUserTitleDisplayName({
        DisplayName: customID,
    }, (result, problem) => {
        if(!is.null(problem)) {
            return error(problem.errorMessage);
        }

        if(result.code === 200) {
            success(result.data);
        }
        else {
            error(result.errorMessage);
        }
    })
}

function getInventory(success: (data: PlayFabClientModels.GetUserInventoryResult) => void, error: (message: string) => void) {
    PlayFab.ClientApi.GetUserInventory({},
        (result, problem) => {
            if(!is.null(problem)) {
                return error(problem.errorMessage);
            }

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
    }, (result, problem) => {
        if(!is.null(problem)) {
            return error(problem.errorMessage);
        }

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
    }, (result, problem) => {
        if(!is.null(problem)) {
            return error(problem.errorMessage);
        }

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
    }, (result, problem) => {
        if(!is.null(problem)) {
            return error(problem.errorMessage);
        }

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
    }, (result, problem) => {
        if(!is.null(problem)) {
            return error(problem.errorMessage);
        }

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

    getTitleData([TITLE_DATA_STORES], (data) => {
        const storeNames = JSON.parse(data[TITLE_DATA_STORES]) as string[];

        storeNames.forEach((storeName) => {
            PlayFab.ClientApi.GetStoreItems({
                CatalogVersion: CATALOG_VERSION,
                StoreId: storeName,
            }, (result, problem) => {
                if(!is.null(problem)) {
                    return error(problem.errorMessage);
                }

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
        CatalogVersion: CATALOG_VERSION,
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
        CatalogVersion: CATALOG_VERSION,
    }, (result, problem) => {
        if(!is.null(problem)) {
            return error(problem.errorMessage);
        }

        if(result.code === 200) {
            success(result.data.Catalog);
        }
        else {
            error(result.errorMessage);
        }
    })
}

function adminAddVirtualCurrencies(secretKey: string, currencies: PlayFabAdminModels.VirtualCurrencyData[], success: () => void, error: (message: string) => void): void {
    PlayFab.settings.developerSecretKey = secretKey;

    PlayFab.AdminApi.AddVirtualCurrencyTypes({
        VirtualCurrencies: currencies,
    }, (result, problem) => {
        PlayFab.settings.developerSecretKey = undefined;

        if(!is.null(problem)) {
            return error(problem.errorMessage);
        }

        if(result.code === 200) {
            success();
        }
        else {
            error(result.errorMessage);
        }
    });
}

function adminSetCatalogItems(secretKey: string, items: PlayFabAdminModels.CatalogItem[], catalogVersion: string, setAsDefault: boolean, success: () => void, error: (message: string) => void): void {
    PlayFab.settings.developerSecretKey = secretKey;

    PlayFab.AdminApi.SetCatalogItems({
        Catalog: items,
        CatalogVersion: catalogVersion,
        SetAsDefaultCatalog: setAsDefault,
    }, (result, problem) => {
        PlayFab.settings.developerSecretKey = undefined;

        if(!is.null(problem)) {
            return error(problem.errorMessage);
        }

        if(result.code === 200) {
            success();
        }
        else {
            error(result.errorMessage);
        }
    });
}

function adminSetStoreItems(secretKey: string, storeID: string, store: PlayFabAdminModels.StoreItem[], storeMarketing: PlayFabAdminModels.StoreMarketingModel, catalogVersion: string, success: () => void, error: (message: string) => void): void {
    PlayFab.settings.developerSecretKey = secretKey;

    PlayFab.AdminApi.SetStoreItems({
        Store: store,
        MarketingData: storeMarketing,
        StoreId: storeID,
        CatalogVersion: catalogVersion,
    }, (result, problem) => {
        PlayFab.settings.developerSecretKey = undefined;

        if(!is.null(problem)) {
            return error(problem.errorMessage);
        }

        if(result.code === 200) {
            success();
        }
        else {
            error(result.errorMessage);
        }
    });
}

function adminSetTitleData(secretKey: string, key: string, value: string, success: () => void, error: (message: string) => void): void {
    PlayFab.settings.developerSecretKey = secretKey;

    PlayFab.AdminApi.SetTitleData({
        Key: key,
        Value: value,
    }, (result, problem) => {
        PlayFab.settings.developerSecretKey = undefined;

        if(!is.null(problem)) {
            return error(problem.errorMessage);
        }

        if(result.code === 200) {
            success();
        }
        else {
            error(result.errorMessage);
        }
    });
}

function adminUpdateCloudScript(secretKey: string, file: string, publish: boolean, success: () => void, error: (message: string) => void): void {
    PlayFab.settings.developerSecretKey = secretKey;

    PlayFab.AdminApi.UpdateCloudScript({
        Files: [{
            FileContents: file,
            Filename: "main.js"
        }],
        Publish: publish,
    }, (result, problem) => {
        PlayFab.settings.developerSecretKey = undefined;

        if(!is.null(problem)) {
            return error(problem.errorMessage);
        }

        if(result.code === 200) {
            success();
        }
        else {
            error(result.errorMessage);
        }
    });
}

function adminUpdateDropTables(secretKey: string, tables: PlayFabAdminModels.RandomResultTable[], catalogVersion: string, success: () => void, error: (message: string) => void): void {
    PlayFab.settings.developerSecretKey = secretKey;

    PlayFab.AdminApi.UpdateRandomResultTables({
        CatalogVersion: catalogVersion,
        Tables: tables,
    }, (result, problem) => {
        PlayFab.settings.developerSecretKey = undefined;

        if(!is.null(problem)) {
            return error(problem.errorMessage);
        }

        if(result.code === 200) {
            success();
        }
        else {
            error(result.errorMessage);
        }
    });
}

function adminListVirtualCurrency(secretKey: string, success: (data: PlayFabAdminModels.ListVirtualCurrencyTypesResult) => void, error: (message: string) => void): void {
    PlayFab.settings.developerSecretKey = secretKey;

    PlayFab.AdminApi.ListVirtualCurrencyTypes({
    },
    (result, problem) => {
        PlayFab.settings.developerSecretKey = undefined;

        if(!is.null(problem)) {
            return error(problem.errorMessage);
        }

        if(result.code === 200) {
            success(result);
        }
        else {
            error(result.errorMessage);
        }
    });
}

function adminGetCatalogItems(secretKey: string, catalogVersion: string, success: (data: PlayFabAdminModels.GetCatalogItemsResult) => void, error: (message: string) => void): void {
    PlayFab.settings.developerSecretKey = secretKey;

    PlayFab.AdminApi.GetCatalogItems({
        CatalogVersion: catalogVersion,
    },
    (result, problem) => {
        PlayFab.settings.developerSecretKey = undefined;

        if(!is.null(problem)) {
            return error(problem.errorMessage);
        }

        if(result.code === 200) {
            success(result);
        }
        else {
            error(result.errorMessage);
        }
    });
}

function adminGetRandomResultTables(secretKey: string, catalogVersion: string, success: (data: PlayFabAdminModels.GetRandomResultTablesResult) => void, error: (message: string) => void): void {
    PlayFab.settings.developerSecretKey = secretKey;

    PlayFab.AdminApi.GetRandomResultTables({
        CatalogVersion: catalogVersion,
    },
    (result, problem) => {
        PlayFab.settings.developerSecretKey = undefined;

        if(!is.null(problem)) {
            return error(problem.errorMessage);
        }

        if(result.code === 200) {
            success(result);
        }
        else {
            error(result.errorMessage);
        }
    });
}

function adminGetStores(secretKey: string, catalogVersion: string, storeID: string, success: (data: PlayFabAdminModels.GetStoreItemsResult) => void, error: (message: string) => void): void {
    PlayFab.settings.developerSecretKey = secretKey;

    PlayFab.AdminApi.GetStoreItems({
        CatalogVersion: catalogVersion,
        StoreId: storeID,
    },
    (result, problem) => {
        PlayFab.settings.developerSecretKey = undefined;

        if(!is.null(problem)) {
            return error(problem.errorMessage);
        }

        if(result.code === 200) {
            success(result);
        }
        else {
            error(result.errorMessage);
        }
    });
}

function adminGetTitleData(secretKey: string, keys: string[], success: (data: PlayFabAdminModels.GetTitleDataResult) => void, error: (message: string) => void): void {
    PlayFab.settings.developerSecretKey = secretKey;

    PlayFab.AdminApi.GetTitleData({
        Keys: keys
    },
    (result, problem) => {
        PlayFab.settings.developerSecretKey = undefined;

        if(!is.null(problem)) {
            return error(problem.errorMessage);
        }

        if(result.code === 200) {
            success(result.data);
        }
        else {
            error(result.errorMessage);
        }
    });
}

export const PlayFabHelper = {
    login,
    getTitleData,
    updateStatistic,
    executeCloudScript,
    getStatistics,
    getInventory,
    getStores,
    buyFromStore,
    getCatalog,
    adminAddVirtualCurrencies,
    adminSetCatalogItems,
    adminSetStoreItems,
    adminSetTitleData,
    adminUpdateCloudScript,
    adminUpdateDropTables,
    adminListVirtualCurrency,
    adminGetCatalogItems,
    adminGetRandomResultTables,
    adminGetStores,
    adminGetTitleData
};
