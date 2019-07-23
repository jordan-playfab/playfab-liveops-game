// ----- Title data ----- //

export interface ITitleDataPlanets {
    [key: string]: IPlanetData;
}

export interface IPlanetData {
    Areas: string[];
    TreasureChestCount: number;
    EnemyCount: number;
}

// ----- Cloud Script results ----- //

export interface IKilledEnemyResult {
    kills: number;
    shouldUpdateInventory: boolean;
    itemGranted: string;
}

// ----- App interfaces ----- //

export interface IStringDictionary {
    [key: string]: string;
}