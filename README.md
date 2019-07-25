# Vanguard Outrider

A clicker simplification of a looter shooter similar to Destiny or The Division. Designed to be used to populate an empty [PlayFab title](https://playfab.com) and experiment with LiveOps techniques.

# Live demo

Try it online at [https://playfabhack.azurewebsites.net](https://playfabhack.azurewebsites.net)

[![Build Status](https://code4clouds.visualstudio.com/PlayFab%20Hack/_apis/build/status/jordan-playfab.playfab-liveops-game?branchName=master)](https://code4clouds.visualstudio.com/PlayFab%20Hack/_build/latest?definitionId=44&branchName=master)

# Try it

- Clone this repository
- On the shell run the following
``` bash
npm install
npm run build
```
- Open your browser and point it to the following location: 
```
file:///<source path>/game/index.html
```

# Cloud Script

Compile the `main.ts` file in `/source/cloud-script` using this command:

``` bash
tsc -p tsconfig.json
```