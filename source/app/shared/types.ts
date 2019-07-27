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
}

// ----- Catalog item custom data ----- //

export interface IWeaponItemCustomData {
    damage: number;
}

// ----- App interfaces ----- //

export interface IStringDictionary {
    [key: string]: string;
}

export interface INumberDictionary {
    [key: string]: number;
}

interface IProgressStage {
    key: string;
    title: string;
    filename: string;
}

export const PROGRESS_STAGES: IProgressStage[] = [{
    key: "currency",
    title: "Currency",
    filename: "virtual-currency.json"
},
{
    key: "catalog",
    title: "Catalog",
    filename: "catalogs.json"
},
{
    key: "droptable",
    title: "Drop tables",
    filename: "drop-tables.json"
},
{
    key: "store",
    title: "Store",
    filename: "stores.json"
},
{
    key: "titledata",
    title: "Title data",
    filename: "title-data.json"
},
{
    key: "cloudscript",
    title: "Cloud Script",
    filename: "cloud-script.json"
}];

export enum CloudScriptFunctionNames {
    killedEnemyGroup = "killedEnemyGroup",
    playerLogin = "playerLogin",
}

export const VC_CREDITS = "CR";

export const CATALOG_VERSION = "Main";

export const TITLE_DATA_STORES = "Stores";
export const TITLE_DATA_PLANETS = "Planets";
export const TITLE_DATA_ENEMIES = "Enemies";

export const ITEM_CLASS_WEAPON = "weapon";
export const ITEM_CLASS_ARMOR = "armor";