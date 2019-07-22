import * as React from "react";
import { Router } from "./router";

interface IState {
    titleID: string;
    player: PlayFabClientModels.LoginResult;
}

export default class App extends React.Component<{}, IState> {
    constructor() {
        super(undefined);

        this.state = {
            titleID: null,
            player: null,
        };
    }

    public render(): React.ReactNode {
        return (
            <Router
                titleID={this.state.titleID}
                saveTitleID={this.saveTitleID}
                player={this.state.player}
                savePlayer={this.savePlayer}
            />
        );
    }

    private saveTitleID = (titleID: string): void => {
        this.setState({
            titleID,
        });
    }

    private savePlayer = (player: PlayFabClientModels.LoginResult): void => {
        this.setState({
            player,
        });
    }
}