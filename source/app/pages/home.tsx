import React from "react";
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react';
import { RouteComponentProps } from "react-router-dom";
import { routes } from "../routes";
import { Page } from "../components/page";
import { DivConfirm, UlInline } from "../styles";
import { IWithAppStateProps, withAppState } from "../containers/with-app-state";
import { actionSetTitleId } from "../store/actions";

interface IState {
    titleID: string;
}

type Props = RouteComponentProps & IWithAppStateProps;

class HomePageBase extends React.Component<Props, IState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            titleID: null,
        }
    }

    public render(): React.ReactNode {
        return (
            <Page
                {...this.props}
                title={this.props.appState.hasTitleId
                    ? "Ready To Go"
                    : "Instructions"}
            >
                {this.props.appState.hasTitleId
                    ? this.renderShowTitleID()
                    : this.renderAskForTitleID()}
            </Page>
        );
    }

    private renderAskForTitleID(): React.ReactNode {
        return (
            <form onSubmit={this.saveTitleID}>
                <p><a href="https://developer.playfab.com" target="_blank">Create a PlayFab account</a> and make an empty title. Then find its <strong>title ID</strong> (4+ alphanumeric characters) and enter it here.</p>
                <fieldset>
                    <legend>PlayFab title ID</legend>
                    <TextField label="Title ID" onChange={this.setLocalTitleID} autoFocus />
                    <DivConfirm>
                        <PrimaryButton text="Set title ID" onClick={this.saveTitleID} />
                    </DivConfirm>
                </fieldset>
            </form>
        );
    }

    private renderShowTitleID(): React.ReactNode {
        return (
            <React.Fragment>
                <p>Your first step should be to <strong>load initial data</strong> into your title.</p>
                <p>If you've already done that, select <strong>Play game</strong> to login as a player and start the game.</p>
                <UlInline>
                    <li><PrimaryButton text="Play game" onClick={this.goToPage.bind(this, routes.Player)} /></li>
                    <li><DefaultButton text="Load initial data" onClick={this.goToPage.bind(this, routes.Upload)} /></li>
                    <li><DefaultButton text="Download data from title" onClick={this.goToPage.bind(this, routes.Download)} /></li>
                </UlInline>
            </React.Fragment>
        );
    }

    private goToPage = (page: string): void => {
        this.props.history.push(page);
    }

    private setLocalTitleID = (_: any, newValue: string): void => {
        this.setState({
            titleID: newValue,
        });
    }

    private saveTitleID = (): void => {
        this.props.dispatch(actionSetTitleId(this.state.titleID));
    }
}

export const HomePage = withAppState(HomePageBase);