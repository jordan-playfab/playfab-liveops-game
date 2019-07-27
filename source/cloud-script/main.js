"use strict";
const App = {
    IsNull(data) {
        return typeof data === "undefined"
            || data === null
            || (typeof data === "string" && data.length === 0)
            || (data.constructor === Array && data.length === 0);
    },
    GetTitleData(keys, isJSON) {
        const data = server.GetTitleData({
            Keys: keys
        }).Data;
        if (!isJSON) {
            return data;
        }
        return Object.keys(data).reduce((dictionary, key) => {
            dictionary[key] = JSON.parse(data[key]);
            return dictionary;
        }, {});
    },
    EvaluateRandomResultTable(catalogVersion, tableId) {
        return server.EvaluateRandomResultTable({
            CatalogVersion: catalogVersion,
            TableId: tableId
        }).ResultItemId;
    },
    GetPlayerStatistics(playerId, statisticNames) {
        return server.GetPlayerStatistics({
            PlayFabId: playerId,
            StatisticNames: statisticNames,
        }).Statistics;
    },
    UpdatePlayerStatistics(playerId, statistics) {
        return server.UpdatePlayerStatistics({
            PlayFabId: playerId,
            Statistics: statistics,
        });
    },
    ConsumeItem(playerId, itemInstanceId, count) {
        return server.ConsumeItem({
            PlayFabId: playerId,
            ItemInstanceId: itemInstanceId,
            ConsumeCount: count
        });
    },
    GrantItemsToUser(playerId, itemIds, catalogVersion = null) {
        const grantResult = server.GrantItemsToUser({
            PlayFabId: playerId,
            ItemIds: itemIds,
            CatalogVersion: catalogVersion
        });
        // Is this a bundle of something we need to unpack?
        grantResult.ItemGrantResults.forEach(item => {
            if (item.ItemClass.indexOf(App.CatalogItems.UnpackClassName) !== -1) {
                App.ConsumeItem(playerId, item.ItemInstanceId, item.RemainingUses);
            }
        });
    },
    GetUserInventory(playerId) {
        return server.GetUserInventory({
            PlayFabId: playerId,
        });
    },
    GetUserData(playerId, keys) {
        return server.GetUserData({
            PlayFabId: playerId,
            Keys: keys,
        });
    },
    UpdateUserData(playerId, data, keysToRemove, isPublic = false) {
        return server.UpdateUserData({
            PlayFabId: playerId,
            Data: data,
            KeysToRemove: keysToRemove,
            Permission: isPublic
                ? App.Config.PermissionPublic
                : App.Config.PermissionPrivate
        });
    },
    UpdateUserDataExisting(dictionary, isPublic) {
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
        const userDataStringDictionary = Object.keys(userData.Data).reduce((dictionary, key) => {
            dictionary[key] = userData.Data[key].Value;
            return dictionary;
        }, {});
        return App.UpdateUserData(currentPlayerId, userDataStringDictionary, null, true);
    },
    WritePlayerEvent(playerId, eventName, body) {
        server.WritePlayerEvent({
            PlayFabId: playerId,
            EventName: eventName,
            Body: body,
        });
    },
    Statistics: {
        Kills: "kills",
        Level: "level",
        XP: "xp"
    },
    TitleData: {
        Planets: "Planets",
        Enemies: "Enemies",
    },
    UserData: {
        HP: "hp",
        MaxHP: "maxHP",
        Equipment: "equipment"
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
handlers.killedEnemyGroup = function (args, context) {
    const planetsAndEnemies = App.GetTitleData([App.TitleData.Planets, App.TitleData.Enemies], true);
    const planetData = planetsAndEnemies[App.TitleData.Planets].planets;
    const enemyData = planetsAndEnemies[App.TitleData.Enemies];
    // Ensure the data submitted is valid
    const errorMessage = isKilledEnemyGroupValid(args, planetData, enemyData);
    if (!App.IsNull(errorMessage)) {
        return {
            errorMessage,
        };
    }
    // Data is valid, continue
    const fullEnemyGroup = enemyData.enemyGroups.find(e => e.name === args.enemyGroup);
    // Update player statistics
    const statistics = App.GetPlayerStatistics(currentPlayerId, [App.Statistics.Kills]);
    const statisticUpdates = [];
    if (!App.IsNull(statistics)) {
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
    let itemGranted = null;
    if (!App.IsNull(fullEnemyGroup.droptable)) {
        itemGranted = App.EvaluateRandomResultTable(null, fullEnemyGroup.droptable);
        App.GrantItemsToUser(currentPlayerId, [itemGranted]);
    }
    return {
        itemGranted
    };
};
handlers.playerLogin = function (args, context) {
    // If you're a new player with no money nor items, give you some cash and set your HP
    const response = {
        didGrantStartingPack: false,
        playerHP: 0,
        equipment: {},
        xp: 0,
        level: 1,
    };
    // Give new players their starting items
    const inventory = App.GetUserInventory(currentPlayerId);
    if (App.IsNull(inventory.Inventory) && inventory.VirtualCurrency[App.VirtualCurrency.Credits] === 0) {
        response.didGrantStartingPack = true;
        App.GrantItemsToUser(currentPlayerId, [App.CatalogItems.StartingPack]);
    }
    // Give new players some HP using title data
    const userData = App.GetUserData(currentPlayerId, [App.UserData.HP, App.UserData.Equipment]);
    if (App.IsNull(userData.Data[App.UserData.HP])) {
        App.UpdateUserDataExisting({
            [App.UserData.HP]: App.Config.StartingHP.toString(),
            [App.UserData.MaxHP]: App.Config.StartingHP.toString(),
        }, true);
        response.playerHP = App.Config.StartingHP;
    }
    else {
        response.playerHP = parseInt(userData.Data[App.UserData.HP].Value);
    }
    // We also need to know your current XP and level
    const statistics = App.GetPlayerStatistics(currentPlayerId, [App.Statistics.Level, App.Statistics.XP]);
    const statisticXP = statistics.find(s => s.StatisticName === App.Statistics.XP);
    if (!App.IsNull(statisticXP)) {
        response.xp = statisticXP.Value;
    }
    const statisticLevel = statistics.find(s => s.StatisticName === App.Statistics.Level);
    if (!App.IsNull(statisticLevel)) {
        response.level = statisticLevel.Value;
    }
    // And return any equipment which existing users might have
    if (!App.IsNull(userData.Data[App.UserData.Equipment])) {
        response.equipment = JSON.parse(userData.Data[App.UserData.Equipment].Value);
    }
    return response;
};
handlers.returnToHomeBase = function (args, context) {
    const hpAndMaxHP = App.GetUserData(currentPlayerId, [App.UserData.HP, App.UserData.MaxHP]);
    const maxHP = parseInt(hpAndMaxHP.Data[App.UserData.MaxHP].Value);
    if (hpAndMaxHP.Data[App.UserData.HP].Value === hpAndMaxHP.Data[App.UserData.MaxHP].Value) {
        App.WritePlayerEvent(currentPlayerId, "travel_to_home_base", null);
        return {
            maxHP
        };
    }
    App.UpdateUserData(currentPlayerId, {
        [App.UserData.HP]: hpAndMaxHP.Data[App.UserData.MaxHP].Value,
    }, null, true);
    App.WritePlayerEvent(currentPlayerId, "travel_to_home_base_restore_hp", null);
    return {
        maxHP
    };
};
handlers.equipItem = function (args, context) {
    const currentEquipment = App.GetUserData(currentPlayerId, [App.UserData.Equipment]).Data;
    let returnResult = null;
    const equipmentDictionary = App.IsNull(args.multiple)
        ? { [args.single.slot]: args.single.itemInstanceId }
        : args.multiple.reduce((dictionary, request) => {
            dictionary[request.slot] = request.itemInstanceId;
            return dictionary;
        }, {});
    if (App.IsNull(currentEquipment[App.UserData.Equipment])) {
        returnResult = App.UpdateUserData(currentPlayerId, {
            [App.UserData.Equipment]: JSON.stringify(equipmentDictionary)
        }, null, true);
    }
    else {
        returnResult = App.UpdateUserData(currentPlayerId, {
            [App.UserData.Equipment]: JSON.stringify(Object.assign({}, JSON.parse(currentEquipment[App.UserData.Equipment].Value), equipmentDictionary))
        }, null, true);
    }
    App.WritePlayerEvent(currentPlayerId, "equipped_item", args);
    return returnResult;
};
// ----- Helpers ----- //
const isKilledEnemyGroupValid = function (args, planetData, enemyData) {
    const planet = planetData.find(p => p.name === args.planet);
    if (planet === undefined) {
        return `Planet ${args.planet} not found.`;
    }
    const area = planet.areas.find(a => a.name === args.area);
    if (area === undefined) {
        return `Area ${args.area} not found on planet ${args.planet}.`;
    }
    const enemyGroup = area.enemyGroups.find(e => e === args.enemyGroup);
    if (enemyGroup === undefined) {
        return `Enemy group ${args.enemyGroup} not found in area ${args.area} on planet ${args.planet}.`;
    }
    const fullEnemyGroup = enemyData.enemyGroups.find(e => e.name === args.enemyGroup);
    if (fullEnemyGroup === undefined) {
        return `Enemy group ${args.enemyGroup} not found.`;
    }
    return undefined;
};
