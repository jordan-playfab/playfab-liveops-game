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
    itemGranted: string;
}

// ----- App interfaces ----- //

export const VC_CREDITS = "CR";

export interface IStringDictionary {
    [key: string]: string;
}

export interface INumberDictionary {
    [key: string]: number;
}