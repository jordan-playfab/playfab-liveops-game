/// <reference path="../../node_modules/playfab-web-sdk/src/Typings/PlayFab/PlayFabClientApi.d.ts" />
/// <reference path="../../node_modules/playfab-web-sdk/src/Typings/PlayFab/PlayFabAdminApi.d.ts" />
import { ITitleDataPlanets, ITitleDataEnemies, IPlanetData, IStringDictionary } from "../app/shared/types";

// PlayFab-supplied global variables
declare var currentPlayerId: string;
declare var server: any;
declare var handlers: any;

"use strict";
const App = {
    IsNull(data: any): boolean {
        return typeof data === "undefined"
            || data === null
            || (typeof data === "string" && data.length === 0)
            || (data.constructor === Array && data.length === 0);
    },
    GetTitleData(keys: string[]): any {
        return server.GetTitleData({
            Keys: keys
        }).Data;
    },
    EvaluateRandomResultTable(catalogVersion: string, tableId: string): string {
        return server.EvaluateRandomResultTable({
            CatalogVersion: catalogVersion,
            TableId: tableId
        }).ResultItemId;
    },
    GetPlayerStatistics(playerId: string, statisticNames: string[]): PlayFabServerModels.StatisticValue[] {
        return server.GetPlayerStatistics({
            PlayFabId: playerId,
            StatisticNames: statisticNames,
        }).Statistics;
    },
    UpdatePlayerStatistics(playerId: string, statistics: PlayFabServerModels.StatisticUpdate[]): PlayFabServerModels.UpdatePlayerStatisticsResult {
        return server.UpdatePlayerStatistics({
            PlayFabId: playerId,
            Statistics: statistics,
        });
    },
    ConsumeItem(playerId: string, itemInstanceId: string, count: number): PlayFabServerModels.ConsumeItemResult {
        return server.ConsumeItem({
            PlayFabId: playerId,
            ItemInstanceId: itemInstanceId,
            ConsumeCount: count
        });
    },
    GrantItemsToUser(playerId: string, itemIds: string[], catalogVersion: string = null): void {
        const grantResult: PlayFabServerModels.GrantItemsToUserResult = server.GrantItemsToUser({
            PlayFabId: playerId,
            ItemIds: itemIds,
            CatalogVersion: catalogVersion
        });
        
        // Is this a bundle of something we need to unpack?
        grantResult.ItemGrantResults.forEach(item => {
            if(item.ItemClass.indexOf(App.CatalogItems.UnpackClassName) !== -1) {
                App.ConsumeItem(playerId, item.ItemInstanceId, item.RemainingUses);
            }
        })
    },
    GetUserInventory(playerId: string): PlayFabServerModels.GetUserInventoryResult {
        return server.GetUserInventory({
            PlayFabId: playerId,
        });
    },
    GetUserData(playerId: string, keys: string[]): PlayFabServerModels.GetUserDataResult {
        return server.GetUserData({
            PlayFabId: playerId,
            Keys: keys,
        });
    },
    UpdateUserData(playerId: string, data: IStringDictionary, keysToRemove: string[], isPublic = false): PlayFabServerModels.UpdateUserDataResult {
        return server.UpdateUserData({
            PlayFabId: playerId,
            Data: data,
            KeysToRemove: keysToRemove,
            Permission: isPublic
                ? App.Config.PermissionPublic
                : App.Config.PermissionPrivate
        });
    },
    UpdateUserDataExisting(dictionary: IStringDictionary, isPublic: boolean): PlayFabServerModels.UpdateUserDataResult {
        const userData = App.GetUserData(currentPlayerId, Object.keys(dictionary));
    
        Object.keys(dictionary).forEach(key => {
            userData.Data[key] = {
                Value: dictionary[key],
                LastUpdated: new Date().toString(),
                Permission: isPublic
                    ? App.Config.PermissionPublic
                    : App.Config.PermissionPrivate
            };
        });
    
        // Turn this UserDataRecordDictionary into a plain IStringDictionary
        const userDataStringDictionary = Object.keys(userData.Data).reduce((dictionary: IStringDictionary, key: string) => {
            dictionary[key] = userData.Data[key].Value;
    
            return dictionary;
        }, {} as IStringDictionary);
    
        return App.UpdateUserData(currentPlayerId, userDataStringDictionary, null, true);
    },
    Statistics: {
        Kills: "kills",
        HP: "hp"
    },
    TitleData: {
        Planets: "Planets",
        Enemies: "Enemies",
    },
    UserData: {
        HP: "hp",
    },
    CatalogItems: {
        StartingPack: "StartingPack",
        UnpackClassName: "unpack",
    },
    VirtualCurrency: {
        Credits: "CR"
    },
    Config: {
        StartingHP: 100,
        PermissionPublic: "Public",
        PermissionPrivate: "Private"
    }
};

// ----- Callable functions ----- //

export interface IKilledEnemyGroupRequest {
    planet: string;
    area: string;
    enemyGroup: string;
    playerHP: number;
}

export interface IKilledEnemyGroupResponse {
    errorMessage?: string;
    itemGranted?: string;
}

handlers.killedEnemyGroup = function(args: IKilledEnemyGroupRequest, context: any): IKilledEnemyGroupResponse {
    const planetsAndEnemies = App.GetTitleData([App.TitleData.Planets, App.TitleData.Enemies]);
    const planetData = (JSON.parse(planetsAndEnemies[App.TitleData.Planets]) as ITitleDataPlanets).planets;
    const enemyData = (JSON.parse(planetsAndEnemies[App.TitleData.Enemies]) as ITitleDataEnemies);

    // Ensure the data submitted is valid
    const errorMessage = isKilledEnemyGroupValid(args, planetData, enemyData);

    if(!App.IsNull(errorMessage)) {
        return {
            errorMessage,
        };
    }

    // Data is valid, continue
    const fullEnemyGroup = enemyData.enemyGroups.find(e => e.name === args.enemyGroup);

    // Update player statistics
    const statistics = App.GetPlayerStatistics(currentPlayerId, [App.Statistics.Kills]);
    const statisticUpdates: PlayFabServerModels.StatisticUpdate[] = [];
    
    if(!App.IsNull(statistics)) {
        const killStatistic = statistics.find(s => s.StatisticName === App.Statistics.Kills);
        const startingKills = App.IsNull(killStatistic)
            ? 0
            : killStatistic.Value;

        statisticUpdates.push({
            StatisticName: App.Statistics.Kills,
            Value: startingKills + fullEnemyGroup.enemies.length,
        });

        App.UpdatePlayerStatistics(currentPlayerId, statisticUpdates);
    }

    // Also update your HP, which is stored in user data
    App.UpdateUserDataExisting({
        [App.UserData.HP]: args.playerHP.toString()
    }, true);

    // Grant items
    let itemGranted: string = null;

    if(!App.IsNull(fullEnemyGroup.droptable)) {
        itemGranted = App.EvaluateRandomResultTable(null, fullEnemyGroup.droptable);

        App.GrantItemsToUser(currentPlayerId, [itemGranted]);
    }

    return {
        itemGranted
    };
};

export interface IPlayerLoginResponse {
    didGrantStartingPack: boolean;
    playerHP: number;
}

handlers.playerLogin = function(args: any, context: any): IPlayerLoginResponse {
    // If you're a new player with no money nor items, give you some cash and set your HP
    const response: IPlayerLoginResponse = {
        didGrantStartingPack: false,
        playerHP: 0,
    }

    // Give new players their starting items
    const inventory = App.GetUserInventory(currentPlayerId);

    if(App.IsNull(inventory.Inventory) && inventory.VirtualCurrency[App.VirtualCurrency.Credits] === 0) {
        response.didGrantStartingPack = true;
        App.GrantItemsToUser(currentPlayerId, [App.CatalogItems.StartingPack]);
    }

    // Give new players some HP through title data
    const userData = App.GetUserData(currentPlayerId, [App.UserData.HP]);

    if(App.IsNull(userData.Data[App.UserData.HP])) {
        App.UpdateUserDataExisting({
            [App.UserData.HP]: App.Config.StartingHP.toString()
        }, true);
    }
    else {
        response.playerHP = parseInt(userData.Data[App.UserData.HP].Value);
    }

    return response;
};

// ----- Helpers ----- //

const isKilledEnemyGroupValid = function(args: IKilledEnemyGroupRequest, planetData: IPlanetData[], enemyData: ITitleDataEnemies): string {
    const planet = planetData.find(p => p.name === args.planet);
    
    if(planet === undefined) {
        return `Planet ${args.planet} not found.`;
    }

    const area = planet.areas.find(a => a.name === args.area);

    if(area === undefined) {
        return `Area ${args.area} not found on planet ${args.planet}.`;
    }

    const enemyGroup = area.enemyGroups.find(e => e === args.enemyGroup);

    if(enemyGroup === undefined) {
        return `Enemy group ${args.enemyGroup} not found in area ${args.area} on planet ${args.planet}.`;
    }

    const fullEnemyGroup = enemyData.enemyGroups.find(e => e.name === args.enemyGroup);

    if(fullEnemyGroup === undefined) {
        return `Enemy group ${args.enemyGroup} not found.`;
    }

    return undefined;
};