import * as React from "react";
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton } from 'office-ui-fabric-react';
import { IRouterProps } from "../router";
import { is } from "../shared/is";

interface IState {
    titleID: string;
}

type Props = IRouterProps;

export default class Home extends React.Component<Props, IState> {
    constructor() {
        super(undefined);

        this.state = {
            titleID: null,
        }
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <h1>Home page</h1>
                {is.null(this.props.titleID)
                    ? this.renderAskForTitleID()
                    : this.renderShowTitleID()}
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
                    <strong>Your title ID is:</strong> {this.props.titleID}
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
        this.props.saveTitleID(this.state.titleID);
    }

    private changeTitleId = (): void => {
        this.props.saveTitleID(null);
    }
}