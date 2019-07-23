/// <reference path="../../../node_modules/playfab-web-sdk/src/Typings/PlayFab/PlayFabClientApi.d.ts" />
import "playfab-web-sdk/src/PlayFab/PlayFabClientApi.js";
import { IRouterProps } from "../router";
import { IStringDictionary } from "./types";

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
    })
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
    })
}

function uploadTitleData(titleDataKey: string, titleDataValue: string, success: (data: PlayFabAdminModels.SetTitleDataResult) => void, error: (message: string) => void) : void{
    PlayFab.AdminApi.SetTitleData({
        Key: titleDataKey,
        Value: titleDataValue
    }, (result) => {
        if (result.code === 200) {
            success(result.data);
        }
        else {
            error(result.errorMessage);
        }
    })
}


export const PlayFabHelper = {
    login,
    getTitleData,
    updateStatistic,
    uploadTitleData
};
