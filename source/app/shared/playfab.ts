/// <reference path="../../../node_modules/playfab-web-sdk/src/Typings/PlayFab/PlayFabClientApi.d.ts" />
import "playfab-web-sdk/src/PlayFab/PlayFabClientApi.js";
import { IRouterProps } from "../router";
import { IStringDictionary } from "./types";
import { is } from "./is";

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

export const PlayFabHelper = {
    login,
    getTitleData,
    updateStatistic,
    executeCloudScript,
    getStatistics
};
