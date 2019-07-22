// ----- Title data ----- //

export interface ITitleDataPlanets {
    [key: string]: IPlanetData;
}

export interface IPlanetData {
    Areas: string[];
    TreasureChestCount: number;
    EnemyCount: number;
}

// ----- App interfaces ----- //

export interface IStringDictionary {
    [key: string]: string;
}