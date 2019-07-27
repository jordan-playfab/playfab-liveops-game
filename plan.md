# Tasks

- [ ] Improve page design
- [ ] Add logo
- [ ] Favicon
- [ ] Better instructions
- [ ] How to go further
- [x] Enemy groups
- [x] Give new players something
- [x] Actual combat engine with reports at the end
- [x] Player HP and damage taking
- [x] Use Redux
- [x] Create page HOC to handle errors and maybe more later
- [x] Watch mode
- [x] Improve PlayFab helper
- [ ] Actual loot in looter shooter
- [ ] Leveling and increasing HP
- [x] Production build
- [ ] Put player ID in URL
- [ ] Put everything in URL, make page refreshable
- [ ] Credits page
- [x] Player title data to equip weapons and armor
- [ ] Improve equipping with multiple slots
- [ ] Don't allow you to buy items you already have

# Pages

1. Introduction / what is this
1. Main menu
    1. Play
    1. Load initial data
    1. Download data
    1. Credits
    1. Tutorial
    1. LiveOps techniques
1. Game
    1. Director / select destination
    1. Home base / Tower
        1. Shop
    1. Character status (popup?)
    1. Inventory (popup?)
    1. Planet
        1. Area
            1. Combat
1. Load initial data
1. Download data
1. Credits
1. Tutorial
1. LiveOps techniques

# Combat

When you go to a planet and pick an area, the game selects a random enemy group for you to face.

The player clicks on an enemy to shoot them with the equipped weapon. That counts as a turn.

Every (random number) turns, the enemy fires and has a (random number) chance to do damage.

Armor has a defense stat which, when divided by 100, indicates how much damage it blocks from the enemy.

- Enemies have HP and damage
- Player has HP
- Player has guns
- Guns have damage