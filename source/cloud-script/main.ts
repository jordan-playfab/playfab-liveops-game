/// <reference path="../../node_modules/playfab-web-sdk/src/Typings/PlayFab/PlayFabClientApi.d.ts" />
/// <reference path="../../node_modules/playfab-web-sdk/src/Typings/PlayFab/PlayFabAdminApi.d.ts" />
import { ITitleDataPlanets, ITitleDataEnemies, IPlanetData, IStringDictionary } from "../app/shared/types";

// PlayFab-supplied global variables
declare var currentPlayerId: string;
declare var server: any;
declare var handlers: any;

interface IKilledEnemyGroupRequest {
    planet: string;
    area: string;
    enemyGroup: string;
    damageTaken: number;
}

interface IKilledEnemyGroupResponse {
    isError: boolean;
    errorMessage?: string;
    itemGranted?: string;
}

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
    GetPlayerStatistics(statisticNames: string[]): PlayFabServerModels.StatisticValue[] {
        return server.GetPlayerStatistics({
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
        
        // Is this a bundle of credits we need to unpack?
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

handlers.killedEnemyGroup = function(args: IKilledEnemyGroupRequest, context: any): IKilledEnemyGroupResponse {
    const planetsAndEnemies = App.GetTitleData([App.TitleData.Planets, App.TitleData.Enemies]);
    const planetData = (planetsAndEnemies.Planets as ITitleDataPlanets).planets;
    const enemyData = (planetsAndEnemies.Enemies as ITitleDataEnemies);

    // Ensure the data submitted is valid
    const errorMessage = isKilledEnemyGroupValid(args, planetData, enemyData);

    if(!App.IsNull(errorMessage)) {
        return {
            isError: true,
            errorMessage,
        };
    }

    // Data is valid, continue
    const fullEnemyGroup = enemyData.enemyGroups.find(e => e.name === args.enemyGroup);

    // Update player statistics
    const statistics = App.GetPlayerStatistics([App.Statistics.Kills, App.Statistics.HP]);

    const statisticUpdates: PlayFabServerModels.StatisticUpdate[] = [];
    
    if(!App.IsNull(statistics)) {
        const killStatistic = statistics.find(s => s.StatisticName === App.Statistics.Kills);
        const hpStatistic = statistics.find(s => s.StatisticName === App.Statistics.HP);

        if(!App.IsNull(killStatistic)) {
            statisticUpdates.push({
                StatisticName: App.Statistics.Kills,
                Value: killStatistic.Value + fullEnemyGroup.enemies.length,
            });
        }

        if(!App.IsNull(hpStatistic)) {
            // Can't go below zero health
            statisticUpdates.push({
                StatisticName: App.Statistics.HP,
                Value: Math.max(0, hpStatistic.Value - args.damageTaken),
            });
        }
    }

    if(statisticUpdates.length !== 0) {
        App.UpdatePlayerStatistics(currentPlayerId, statisticUpdates);
    }

    // Grant items if they're lucky
    let itemGranted: string = null;

    if(fullEnemyGroup.droptable && fullEnemyGroup.dropchance && Math.random() <= fullEnemyGroup.dropchance) {
        itemGranted = App.EvaluateRandomResultTable(undefined, fullEnemyGroup.droptable);

        App.GrantItemsToUser(currentPlayerId, [itemGranted]);
    }

    return {
        isError: false,
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
        response.playerHP = App.Config.StartingHP;

        userData.Data[App.UserData.HP] = {
            Value: App.Config.StartingHP.toString(),
            LastUpdated: new Date().toString(),
            Permission: App.Config.PermissionPublic
        };

        // Turn this UserDataRecordDictionary into a plain IStringDictionary
        const userDataStringDictionary = Object.keys(userData.Data).reduce((dictionary: IStringDictionary, key: string) => {
            dictionary[key] = userData.Data[key].Value;

            return dictionary;
        }, {} as IStringDictionary);

        App.UpdateUserData(currentPlayerId, userDataStringDictionary, null, true);
    }
    else {
        response.playerHP = parseInt(userData.Data[App.UserData.HP].Value);
    }

    return response;
}
