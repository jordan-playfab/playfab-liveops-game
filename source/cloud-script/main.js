"use strict";
const App = {
    IsNull(data) {
        return typeof data === "undefined"
            || data === null
            || (typeof data === "string" && data.length === 0)
            || (data.constructor === Array && data.length === 0);
    },
    GetTitleData(keys) {
        return server.GetTitleData({
            Keys: keys
        }).Data;
    },
    EvaluateRandomResultTable(catalogVersion, tableId) {
        return server.EvaluateRandomResultTable({
            CatalogVersion: catalogVersion,
            TableId: tableId
        }).ResultItemId;
    },
    GetPlayerStatistics(statisticNames) {
        return server.GetPlayerStatistics({
            StatisticNames: statisticNames,
        }).Statistics;
    },
    UpdatePlayerStatistics(playerId, statistics) {
        server.UpdatePlayerStatistics({
            PlayFabId: playerId,
            Statistics: statistics,
        });
    },
    GrantItemsToUser(playerId, itemIds, catalogVersion = null) {
        server.GrantItemsToUser({
            PlayFabId: playerId,
            ItemIds: itemIds,
            CatalogVersion: catalogVersion
        });
    },
    Config: {
        unpackClassName: "unpack",
    },
    Statistics: {
        kills: "kills",
    }
};
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
handlers.killedEnemyGroup = function (args, context) {
    const planetsAndEnemies = App.GetTitleData(["Planets", "Enemies"]);
    const planetData = planetsAndEnemies.Planets.planets;
    const enemyData = planetsAndEnemies.Enemies;
    // Ensure the data submitted is valid
    const errorMessage = isKilledEnemyGroupValid(args, planetData, enemyData);
    if (!App.IsNull(errorMessage)) {
        return {
            isError: true,
            errorMessage,
        };
    }
    // Data is valid, continue
    const fullEnemyGroup = enemyData.enemyGroups.find(e => e.name === args.enemyGroup);
    // Update player statistics
    const statistics = App.GetPlayerStatistics([App.Statistics.kills]);
    const killStatistic = App.IsNull(statistics)
        ? 0
        : statistics[0].Value;
    App.UpdatePlayerStatistics(currentPlayerId, [{
            StatisticName: App.Statistics.kills,
            Value: killStatistic,
        }]);
    // Grant items if they're lucky
    let itemGranted = null;
    if (fullEnemyGroup.droptable && fullEnemyGroup.dropchance && Math.random() <= fullEnemyGroup.dropchance) {
        itemGranted = App.EvaluateRandomResultTable(undefined, fullEnemyGroup.droptable);
        App.GrantItemsToUser(currentPlayerId, [itemGranted]);
    }
    return {
        isError: false,
        itemGranted
    };
};
