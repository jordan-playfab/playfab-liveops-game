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
    xp: number;
}

export interface ITitleDataEnemyGroup {
    name: string;
    enemies: string[];
    droptable: string;
}

export interface ITitleDataLevel {
    level: number;
    xp: number;
    itemGranted: string;
    hpGranted: number;
}

// ----- Catalog item custom data ----- //

export interface IWeaponItemCustomData {
    damage: number;
}

export interface IArmorItemCustomData {
    block: number;
    reduce: number;
}

// ----- Title news ----- //

export interface ITitleNewsData {
    html: string;
}

// ----- App interfaces ----- //

export interface IStringDictionary {
    [key: string]: string;
}

export interface INumberDictionary {
    [key: string]: number;
}

export interface IAnyDictionary {
    [key: string]: any;
}

export interface ILeaderboardDictionary {
    [key: string]: PlayFabClientModels.PlayerLeaderboardEntry[];
}

interface IProgressStage {
    key: string;
    title: string;
    filename: string;
}

export const PROGRESS_STAGES: IProgressStage[] = [{
    key: "currency",
    title: "Currencies",
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
    title: "Stores",
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

export const VC_CREDITS = "CR";

export const CATALOG_VERSION = "1";

export const TITLE_DATA_STORES = "Stores";
export const TITLE_DATA_PLANETS = "Planets";
export const TITLE_DATA_ENEMIES = "Enemies";

export const ITEM_CLASS_WEAPON = "weapon";
export const ITEM_CLASS_ARMOR = "armor";

export const STATISTIC_KILLS = "kills";
export const STATISTIC_LEVEL = "level";
export const STATISTIC_XP = "xp";

// ----- New hotness ----- //

export const WEAPON_CUSTOM_DATA_STATS = "stats";
export const ARMOR_CUSTOM_DATA_STATS = "stats";

export interface IEnemyData {
    name?: string;
    genus: string;
    species: string;
    hp: number;
    attacks: IAttackType[];
    resistances: IResistanceType[];
    speed: number; // in milliseconds
    xp: number;
}

interface IAnyItemData {
    name: string;
    rarity: WeaponRarity;
    isUnique: boolean;
}

export interface IWeaponData extends IAnyItemData {
    attacks: IAttackType[];
    category: WeaponCategory;
}

export interface IArmorData extends IAnyItemData {
    resistances: IResistanceType[];
    slot: ArmorSlot;
}

export interface IAttackType {
    name: string;
    probability: number; // chance to hit, 0-1
    flavor: string; // DamageFlavor
    power: number; // big numbers
    variance: number; // 0-1
    critical: number; // 0-1
    reload: number; // in milliseconds
}

export interface IResistanceType {
    flavor: string; // DamageFlavor
    resistance: number; // 0-1
}

export enum DamageFlavor {
    Kinetic = "Kinetic",
    Gamma = "Gamma",
    Neutron = "Neutron",
    Cosmic = "Cosmic"
}

export enum WeaponCategory {
    Rivulet = "Rivulet",
    Bight = "Bight",
    Mere = "Mere",
    Basin = "Basin"
}

export enum ArmorSlot {
    Head = "Head",
    Chest = "Chest",
    Legs = "Legs",
    Boots = "Boots"
}

export enum WeaponRarity {
    Uncommon = "Uncommon",
    Common = "Common",
    Rare = "Rare",
    Legendary = "Legendary"
}

export enum EnemyGenus {
    Ultracruiser = "Ultracruiser",
    Cyberbird = "Cyberbird",
    MoonEater = "Moon Eater",
    ShroudedOne = "Shrouded One"
}

export enum EnemySpecies {
    // Ultracruiser
    Neophyte = "Neophyte",
    Switchling = "Switchling",
    Dreadrat = "Dreadrat",
    Capper = "Capper",
    // Cyberbirds
    Eggsbawks = "Eggsbawks",
    Coolbirdnetbees = "Coolbirdnetbees",
    Intendodo = "Intendodo",
    // Moon Eaters
    Crisium = "Crisium",
    Imbrium = "Imbrium",
    Procellarum = "Procellarum",
    Grimaldi = "Grimaldi",
    // Shrouded Ones
    Slipher = "Slipher",
    Hubbler = "Hubbler",
    Almagest = "Almagest",
}

interface IEnemyGenusSpeciesDictionary {
    [key: string]: EnemySpecies[];
}

export const EnemyGenusSpeciesLink: IEnemyGenusSpeciesDictionary = {
    [EnemyGenus.Ultracruiser]: [EnemySpecies.Neophyte, EnemySpecies.Switchling, EnemySpecies.Dreadrat, EnemySpecies.Capper],
    [EnemyGenus.Cyberbird]: [EnemySpecies.Eggsbawks, EnemySpecies.Coolbirdnetbees, EnemySpecies.Intendodo],
    [EnemyGenus.MoonEater]: [EnemySpecies.Crisium, EnemySpecies.Imbrium, EnemySpecies.Procellarum, EnemySpecies.Grimaldi],
    [EnemyGenus.ShroudedOne]: [EnemySpecies.Slipher, EnemySpecies.Hubbler, EnemySpecies.Almagest]
};