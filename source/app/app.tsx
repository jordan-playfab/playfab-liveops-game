import * as React from "react";
import { Router } from "./router";
import { ITitleDataPlanets, IStringDictionary } from "./shared/types";
import { is } from "./shared/is";

interface IState {
    titleID: string;
    player: PlayFabClientModels.LoginResult;
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
                updatePlanets={this.updatePlanets}
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

    private updatePlanets = (data: IStringDictionary, callback?: () => void): void => {
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
    }
}