# Tasks

## Completed

- [x] Improve page design
- [x] Add logo
- [x] Favicon
- [x] Better instructions
- [x] Enemy groups
- [x] Give new players something
- [x] Actual combat engine with reports at the end
- [x] Player HP and damage taking
- [x] Use Redux
- [x] Create page HOC to handle errors and maybe more later
- [x] Watch mode
- [x] Improve PlayFab helper
- [x] Leveling and increasing HP
- [x] Production build
- [x] Put title ID in URL
- [x] Player title data to equip weapons and armor
- [x] Improve equipping with multiple slots
- [x] Don't allow you to buy items you already have
- [x] Title data at headquarters
- [x] Be explicit about what features the game uses so people know where to look for it
- [x] Bug: enemies appear to be doing damage even when they aren't
- [x] Bug: why isn't HP being set when gaining a level?
- [x] Player sign out button

## Priority order (+ shirt time/difficulty)
- [x] Switch first login currency grant to use initial amount on currency (S)
- [x] Notify users about F12 monitoring (S)
- [x] Credits page (S)
- [ ] List of non-existent features (S)
- [x] More information on Login page, about case sensitivity (S)
- [ ] Improve player bar (M)
- [ ] Global box showing PlayFab API activity (L)
- [ ] Grant items on level ups (S)
- [ ] Rename weapons and enemies to something more benign (M)
- [ ] Actual loot in looter shooter (M)
- [ ] More graphical combat (M)
- [ ] Explanation of store segmentation (M)
- [ ] Add consumable health potions (M)
- [ ] Clean up all page code, reduce hackiness (XL)
- [ ] Full tutorial of how to use this game and PlayFab (XL)
    - Changing planet names and enemy stats in title data
    - Custom data on catalog items
    - Adding more stores
    - Adding title news
    - Other features one could add (A/B tests, containers as engrams, friends)
- [ ] Finish level curve page (M)
- [ ] Talk about actual timeline for this game (S)
- [ ] Add internationalization (L)
- [ ] Convert to new entity and other APIs (XXL)

## Design upgrades
- [ ] Guide page: rotating carousel with large art for each planet
- [ ] Planet page: smaller region graphics
- [ ] Combat component: graphical combat UI

# Enemy ideas

## Races
- Ultracruiser
    - Neophyte
    - Switchling
    - Dreadrat
    - Capper
- Cyberbirds
    - Eggsbawks
    - Coolbirdnetbees
    - Intendodo
- Moon Eaters
    - Crisium
    - Imbrium
    - Procellarum
    - Grimaldi
- Shrouded Ones
    - Slipher
    - Hubbler
    - Almagest

## Stats

HP
Damage and type
Special attacks
Chance to use special attack
Speed
Defense against damage type

## Sample definition

``` typescript
interface IEnemyData {
    hp: number;
    attacks: IEnemyDataAttack[];
    resistances: IDamageResistance[];
    speed: number;
    specialProperties: Enum[];
}

interface IEnemyDataAttack {
    name: string;
    probability: number;
    damageType: Enum;
    damageValue: number;
    damageVariance: number;
    criticalChance: number;
    reloadSpeed: number;
}

interface IDamageResistance {
    damageType: Enum;
    resistanceValue: number;
}
```

# Weapons

What things do weapons have?

- Damage
- Accuracy
- Reload speed
- Elemental type
- Status effects (slow, confuse, now I'm making it really complicated)
- Best against small/medium/large/shielded enemies

Okay, let's try making up some weapon categories. Or aliases for existing ones, why not.

- Pistol : Rivulet
- Sniper rifle : Bight
- Shotgun : Mere
- Rocket launcher: Basin

Those are good! Armor can be easier. I'd like to have different pieces for the head, torso, legs, etc. Maybe just those three.

Now, types of damage. Kinetic, Gamma, Neutron, Cosmic. Heh heh. Very cool. Weapons can deal more damage to those. Armor can resist them.

## Sample definition

``` typescript

interface IWeaponData {
    attack: IEnemyDataAttack;
    weaponType: Enum; // Rivulet, Bight, etc
    advantageAgainst: Enum[]; // Enemy special properties
}

interface IArmorData {
    slot: Enum;
    damageType: Enum;
    resistance: number;
    color?: string;
}

```

# Consumables

Don't want to forget that

# More

Now for the final thing, what else would there be to entice users to keep playing?

- Title news story updates that only display at certain levels
- New stores unlocking at various levels
- Rare or guaranteed (on conditions) boss encounters

A feedback loop, doy. I kind of have it? Kill monsters to get money to buy weapons to kill more monsters.

Oh, it'd be nice for the weapons to drop directly from the monsters, and then you can sell them to... something... other weapons.

Maybe add buffs to existing weapons using item instance data? Yes, that is a good idea and not insane at all.

Sure, but I also want something more tangible. Like how the end of Destiny 2's Red War campaign improves things for the Tower.

Something like a farming activity. I track your time since last login and give you bonuses for resting?

Oh, or maybe that's where you grow herbs that are used for consumable potions. You make your own. Grind up guns and armor into bone meal to... no, not literal farming. Futuristic cybernetic farming. The detrius goes into giant vats and is boiled down to these potions that your character... drinks. Eh, it'll do.

I'd love to grant abilities to users during level ups.

# Making the change

This added level of complexity gives me the occasion to redesign a bunch of components.

Weapons and armor should have a base component which displays either one. The store will have something that wraps around that and displays the buy button. Enemies then also need a real custom component showing their HP as a bar and what resistances they have. I'd like to have a timer in combat, even though it'll be turn-based.

The withCombat HOC needs some serious work. I know that.

Oh crap, I also need to massively expand the number of areas. And introduce a third, higher tier, heh heh heh.