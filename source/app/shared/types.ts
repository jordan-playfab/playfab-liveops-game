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

interface IProgressStage {
    key: string;
    title: string;
}

export const PROGRESS_STAGES: IProgressStage[] = [{
    key: "currency",
    title: "Currency",
},
{
    key: "catalog",
    title: "Catalog",
},
{
    key: "droptable",
    title: "Drop tables",
},
{
    key: "store",
    title: "Store",
},
{
    key: "titledata",
    title: "Title data"
},
{
    key: "cloudscript",
    title: "Cloud Script",
}];

export const CATALOG_VERSION = "Main";