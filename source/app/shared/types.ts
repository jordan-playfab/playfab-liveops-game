// ----- Title data ----- //

export interface ITitleDataPlanets {
    planets: IPlanetData[];
}

export interface IPlanetData {
    name: string;
    areas: IPlanetArea[];
}

export interface IPlanetArea {
    name: string;
    enemyGroups: string[];
}

export interface ITitleDataEnemies {
    enemies: ITitleDataEnemy[];
    enemyGroups: ITitleDataEnemyGroup[];
}

export interface ITitleDataEnemy {
    name: string;
    hp: number;
    damage: number;
}

export interface ITitleDataEnemyGroup {
    name: string;
    enemies: string[];
    droptable: string;
    dropchance: number;
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
export const TITLE_DATA_STORES = "Stores";