import * as React from "react";
import { Router } from "./router";
import { ITitleDataPlanets, IStringDictionary } from "./shared/types";
import { is } from "./shared/is";
import { PlayFabHelper } from "./shared/playfab";

interface IState {
    titleID: string;
    player: PlayFabClientModels.LoginResult;
    inventory: PlayFabClientModels.GetUserInventoryResult;
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
            inventory: null,
            titleData: {
                Planets: null,
            },
        };
    }

    public render(): React.ReactNode {
        return (
            <Router
                titleID={this.state.titleID}
                saveTitleID={this.saveTitleID}
                player={this.state.player}
                savePlayer={this.savePlayer}
                planets={this.state.titleData.Planets}
                refreshPlanets={this.refreshPlanets}
                inventory={this.state.inventory}
                refreshInventory={this.refreshInventory}
            />
        );
    }

    private saveTitleID = (titleID: string): void => {
        this.setState({
            titleID,
        });

        PlayFab.settings.titleId = titleID;
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
}