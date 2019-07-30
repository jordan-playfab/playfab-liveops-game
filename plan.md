# Tasks

- [x] Improve page design
- [x] Add logo
- [x] Favicon
- [x] Better instructions
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
- [x] Don't allow you to buy items you already have
- [ ] Why isn't HP being set when gaining a level?
- [ ] Add internationalization
- [ ] Title data at headquarters

# Notes with Jasmine

- Index page
    - PlayFab-friendly image
    - Game logo
    - PlayFab logo
    - Link to docs site
    - Link to public repository
    - Link to PlayFab Sign Up page
    - Better name?
    - List of non-existent features
    - Talk about actual timeline for this game
- Main menu
    1. Play game / login
    1. Load initial data
    1. More (dropdown?)
        - Download
        - Level curve
        - Tutorial
        - Reset title ID
- Load initial data
    - Image describing process
    - Boxes of title data, currencies, etc and a big arrow going into "your game"
    - Be explicit about what features the game uses so people know where to look for it. People might not know to look for planet names in title data
    - Add links to various areas
- Download data
    - Added context, reasons why one would do this
- Level curve
    - Show algorithm
    - Allow modification of numbers
    - Link to go to title data page
    - Back button
- Login
    - Case sensitive custom IDs
    - Link to players page
    - Link directly to current player in PlayFab
    - Show list of recently logged in player IDs from this machine
- Combat
    - Dragon Quest style
    - Minor animations on enemies to signify what's happening
- Player box
    - Inventory dropdown - have weapons and armor just be a dropdown that the player can use to change the current weapon or armor
- Global
    - PlayFab info box with technical details of current page/activity
    - Be explicit about what features each page is using
    - Get rid of the breadcrumbs, go back to buttons
    - Notify users to press F12 and open the developer toolbar, go to network tab

## New features

1. Title news viewable at HQ
1. Ideas of what to do with segmentation

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
1. Login
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
1. Level curve generator
1. Credits
    - Development: Jordan Roher
    - Design: Jasmine Aye
    - Initial data: Ashton Summers
    - Azure build: Julio Colon
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