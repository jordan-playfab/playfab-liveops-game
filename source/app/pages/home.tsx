import * as React from "react";
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton } from 'office-ui-fabric-react';
import { IRouterProps } from "../router";
import { is } from "../shared/is";
import { Link } from "react-router-dom";
import { routes } from "../routes";

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
                    <TextField label="PlayFab title ID" onChange={this.setLocalTitleID} />
                    <PrimaryButton text="Save" onClick={this.saveTitleID} />
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
                <ul>
                    <li><Link to={routes.TitleData}>Load Title Data</Link></li>
                    <li><Link to={routes.Player}>Player selection</Link></li>
                </ul>
            </React.Fragment>
        );
    }

    private setLocalTitleID = (_: any, newValue: string): void => {
        this.setState({
            titleID: newValue,
        });
    }

    private saveTitleID = (): void => {
        this.props.saveTitleID(this.state.titleID);
    }

    private changeTitleId = (): void => {
        this.props.saveTitleID(null);
    }
}