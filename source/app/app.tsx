import * as React from "react";
import { Router } from "./router";

interface IState {
    titleID: string;
}

export default class App extends React.Component<{}, IState> {
    constructor() {
        super(undefined);

        this.state = {
            titleID: null,
        };
    }

    public render(): React.ReactNode {
        return (
            <Router
                titleID={this.state.titleID}
                saveTitleID={this.saveTitleID}
            />
        );
    }

    private saveTitleID = (titleID: string): void => {
        this.setState({
            titleID,
        });
    }
}