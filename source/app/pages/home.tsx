import * as React from "react";
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton } from 'office-ui-fabric-react';
import { IRouterProps } from "../router";
import { is } from "../shared/is";
import { Link } from "react-router-dom";
import { routes } from "../routes";
import { Header } from "../components/header";
import { titleHelper } from "../shared/title-helper";
import { Page } from "../components/page";

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

    public componentDidMount(): void {
        if(!is.null(titleHelper.get())) {
            this.props.saveTitleID(titleHelper.get());
        }
    }

    public render(): React.ReactNode {
        return (
            <Page {...this.props}>
                {is.null(this.props.titleID)
                    ? this.renderAskForTitleID()
                    : this.renderShowTitleID()}
            </Page>
        );
    }

    private renderAskForTitleID(): React.ReactNode {
        return (
            <form onSubmit={this.saveTitleID}>
                <p><a href="https://developer.playfab.com">Create your own PlayFab account</a> and make an empty title. Then find its <strong>title ID</strong> and come back here.</p>
                <fieldset>
                    <legend>Title ID</legend>
                    <TextField label="PlayFab title ID" onChange={this.setLocalTitleID} autoFocus />
                    <PrimaryButton text="Save" onClick={this.saveTitleID} />
                </fieldset>
            </form>
        );
    }

    private renderShowTitleID(): React.ReactNode {
        return (
            <React.Fragment>
                <div><button onClick={this.clearTitleId}>Reset title ID</button></div>
                
                <p>Now that you have a title ID, your first step should be to <strong>load game data</strong> into your title.</p>
                <p>If you've already done that, select <strong>Play game!</strong> to login as a player and start the game.</p>
                <ul>
                    <li><Link to={routes.TitleData}>Load game data</Link></li>
                    <li><Link to={routes.Player}>Play game!</Link></li>
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

    private clearTitleId = (): void => {
        this.props.saveTitleID("");
    }
}