import * as React from "react";
import { Router } from "./router";
import { ITitleDataPlanets, IPlanetData } from "./shared/types";
import { is } from "./shared/is";
import { PlayFabHelper } from "./shared/playfab";
import { titleHelper } from "./shared/title-helper";
import { GlobalStyle, defaultTheme, ThemeProvider } from "./styles";

interface IState {
    titleID: string;
    playerPlayFabID: string;
    playerName: string;
    catalog: PlayFabClientModels.CatalogItem[];
    inventory: PlayFabClientModels.GetUserInventoryResult;
    stores: PlayFabClientModels.GetStoreItemsResult[];
    titleData: {
        Planets: IPlanetData[],
    };
}

export default class App extends React.Component<{}, IState> {
    constructor() {
        super(undefined);

        this.state = {
            titleID: null,
            playerPlayFabID: null,
            playerName: null,
            catalog: null,
            inventory: null,
            stores: null,
            titleData: {
                Planets: null,
            },
        };
    }

    public render(): React.ReactNode {
        return (
            <ThemeProvider theme={defaultTheme}>
                <React.Fragment>
                    <GlobalStyle />
                    <Router
                        titleID={this.state.titleID}
                        saveTitleID={this.saveTitleID}
                        playerPlayFabID={this.state.playerPlayFabID}
                        playerName={this.state.playerName}
                        savePlayer={this.savePlayer}
                        planets={this.state.titleData.Planets}
                        refreshPlanets={this.refreshPlanets}
                        inventory={this.state.inventory}
                        refreshInventory={this.refreshInventory}
                        stores={this.state.stores}
                        refreshStores={this.refreshStores}
                        catalog={this.state.catalog}
                        refreshCatalog={this.refreshCatalog}
                    />
                </React.Fragment>
            </ThemeProvider>
        );
    }

    private saveTitleID = (titleID: string): void => {
        if(is.null(titleID)) {
            titleID = "";
            this.savePlayer(null, null);
        }

        this.setState({
            titleID,
        });

        PlayFab.settings.titleId = titleID;

        titleHelper.set(titleID);
    }

    private savePlayer = (player: PlayFabClientModels.LoginResult, playerName: string): void => {
        this.setState({
            playerPlayFabID: player.PlayFabId,
            playerName,
        });
    }

    private refreshPlanets = (callback?: () => void): void => {
        PlayFabHelper.getTitleData(["Planets"], (data) => {
            this.setState((prevState) => {
                const planetData = JSON.parse(data["Planets"]) as ITitleDataPlanets;

                return {
                    titleData: {
                        ...prevState.titleData,
                        Planets: planetData.planets,
                    }
                }
            }, () => {
                if(!is.null(callback)) {
                    callback();
                }
            });
        }, (error) => {
            // TODO: Something
        });
    }

    private refreshInventory = (): void => {
        PlayFabHelper.getInventory((inventory) => {
            this.setState({
                inventory
            });
        }, (error) => {
            // TODO: Something
        });
    }

    private refreshStores = (callback?: () => void): void => {
        PlayFabHelper.getStores((stores) => {
            this.setState({
                stores
            }, () => {
                if(!is.null(callback)) {
                    callback();
                }
            });
        }, (error) => {
            // TODO: Something
        });
    }

    private refreshCatalog = (callback?: () => void): void => {
        PlayFabHelper.getCatalog((catalog) => {
            this.setState({
                catalog
            }, () => {
                if(!is.null(callback)) {
                    callback();
                }
            });
        }, (error) => {
            // TODO: Something
        });
    }
}