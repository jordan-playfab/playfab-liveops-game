import * as React from "react";
import { Router } from "./router";
import { ITitleDataPlanets } from "./shared/types";
import { is } from "./shared/is";
import { PlayFabHelper } from "./shared/playfab";
import { titleHelper } from "./shared/title-helper";
import { GlobalStyle, defaultTheme, ThemeProvider } from "./styles";

interface IState {
    titleID: string;
    player: PlayFabClientModels.LoginResult;
    catalog: PlayFabClientModels.CatalogItem[];
    inventory: PlayFabClientModels.GetUserInventoryResult;
    stores: PlayFabClientModels.GetStoreItemsResult[];
    titleData: {
        Planets: ITitleDataPlanets,
    };
}

export default class App extends React.Component<{}, IState> {
    constructor() {
        super(undefined);

        this.state = {
            titleID: null,
            player: null,
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
                        player={this.state.player}
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
        this.setState({
            titleID,
        });

        PlayFab.settings.titleId = titleID;

        titleHelper.set(titleID);
    }

    private savePlayer = (player: PlayFabClientModels.LoginResult): void => {
        this.setState({
            player,
        });
    }

    private refreshPlanets = (callback?: () => void): void => {
        PlayFabHelper.getTitleData(["Planets"], (data) => {
            this.setState((prevState) => {
                return {
                    titleData: {
                        ...prevState.titleData,
                        Planets: JSON.parse(data["Planets"]),
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