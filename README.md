# Vanguard Outrider

A clicker simplification of a looter shooter similar to Destiny or The Division. Designed to be used to populate an empty [PlayFab title](https://playfab.com) and experiment with LiveOps techniques.

[![Build Status](https://code4clouds.visualstudio.com/PlayFab%20Hack/_apis/build/status/jordan-playfab.playfab-liveops-game?branchName=master)](https://code4clouds.visualstudio.com/PlayFab%20Hack/_build/latest?definitionId=44&branchName=master)

# Live demo

Try it online at [https://playfabhack.azurewebsites.net](https://playfabhack.azurewebsites.net)

# Try it

1. Clone this repository
1. Run the following commands:
    ``` bash
    npm install
    npm run build
    ```
1. Start a web browser
1. Open this file:
    ```
    <source path>/game/index.html
    ```

# Cloud Script

Compile the `main.ts` file in `/source/cloud-script` using this command:

``` bash
npm run cloudscript
```