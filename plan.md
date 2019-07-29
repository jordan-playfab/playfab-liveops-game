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
- [x] Leveling and increasing HP
- [x] Production build
- [x] Put title ID in URL
- [ ] Credits page
- [x] Player title data to equip weapons and armor
- [x] Improve equipping with multiple slots
- [ ] Don't allow you to buy items you already have
- [ ] Why isn't HP being set when gaining a level?
- [ ] Add internationalization

# Pages

1. Introduction / what is this
    - This is a demo game to show how PlayFab can be used to run live games.
    - PlayFab is a backend platform for all kinds of video games.
    - Sign up for a free account and return to this website with your title ID.
    - (user enters title ID)
1. Main menu
    - First time here
        - If this is your first time here, select LOAD INITIAL DATA to populate your game with currencies, catalogs, stores, and more.
    - Already loaded initial data
        - Click Play to create a new player or sign in as an existing player
    - More features
        - Download data from your title for easy use in our open source repository
        - Tweak the algorithm used in (game name)'s leveling curve
    1. Play
        - Enter your player name to login. This page will create a player with that name for you.
        - PlayFab supports many types of logins, such as email and password, Facebook, Google, Apple, Steam, and more.
    1. Load initial data
        - In order to play the game, you must populate it with game data. This page will create the title data, currencies, catalogs, stores, and Cloud Script for you.
        - Get the secret key for your game by signing into PlayFab, then going to Settings > Secret Keys.
        - This page does not store nor transmit your secret key to anyone except PlayFab, but it's a good idea to make a new key just in case.
    1. Download data
        - Want to download your game changes? You can easily create the JSON files for this game's repository here.
        - In order to download all the data from your game, this page needs your secret key.
        - Get the secret key for your game by signing into PlayFab, then going to Settings > Secret Keys.
        - This page does not store nor transmit your secret key to anyone except PlayFab, but it's a good idea to make a new key just in case.
    1. Credits
        - Development: Jordan Roher
        - Initial data: Ashton Summers
        - PM & Azure build: Julio Colon
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