/// <reference path="../../../node_modules/playfab-web-sdk/src/Typings/PlayFab/PlayFabClientApi.d.ts" />
import "playfab-web-sdk/src/PlayFab/PlayFabClientApi.js";
import { IRouterProps } from "../router";

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

export const PlayFabHelper = {
    login,
};
