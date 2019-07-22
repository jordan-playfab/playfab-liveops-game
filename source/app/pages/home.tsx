import * as React from "react";
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton } from 'office-ui-fabric-react';


interface IState {
    titleID: string;
    hasTitleId: boolean;
}

export default class Home extends React.Component<{}, IState> {
    constructor() {
        super(undefined);

        this.state = {
            titleID: null,
            hasTitleId: false,
        }
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <h1>Home page</h1>
                {this.state.hasTitleId
                    ? this.renderShowTitleID()
                    : this.renderAskForTitleID()}
            </React.Fragment>
        );
    }

    private renderAskForTitleID(): React.ReactNode {
        return (
            <form>
                <fieldset>
                    <legend>Title ID</legend>
                    <TextField label="PlayFab title ID" onChange={this.saveTitleId} />
                    <PrimaryButton text="Save" onClick={this.saveHasTitleId} />
                </fieldset>
            </form>
        );
    }

    private renderShowTitleID(): React.ReactNode {
        return (
            <React.Fragment>
                <p>
                    <strong>Your title ID is:</strong> {this.state.titleID}
                    <button onClick={this.changeTitleId}>Change</button>
                </p>
                <p>Next: load title data (optional), or player selection.</p>
            </React.Fragment>
        )
    }

    private saveTitleId = (_: any, newValue: string): void => {
        this.setState({
            titleID: newValue,
        });
    }

    private saveHasTitleId = (): void => {
        this.setState({
            hasTitleId: true,
        });
    }

    private changeTitleId = (): void => {
        this.setState({
            titleID: null,
            hasTitleId: false,
        });
    }
}