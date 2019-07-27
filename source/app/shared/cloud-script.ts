import { IEquipItemInstanceRequest, IEquipItemRequest } from "../../cloud-script/main";
import { PlayFabHelper } from "./playfab";
import { CloudScriptFunctionNames } from "./types";

function equipItem(items: IEquipItemInstanceRequest[], success: (data: PlayFabClientModels.ExecuteCloudScriptResult) => void, error: (message: string) => void): void {
    PlayFabHelper.ExecuteCloudScript(CloudScriptFunctionNames.equipItem,
        {
            single: items.length === 1
                ? items[0]
                : null,
            multiple: items.length > 1
                ? items
                : null,
        } as IEquipItemRequest, 
        success,
        error);
}

export const CloudScriptHelper = {
    equipItem,
};
