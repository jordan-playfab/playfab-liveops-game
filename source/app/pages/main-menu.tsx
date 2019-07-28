import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { PrimaryButton, DefaultButton } from "office-ui-fabric-react";

import { Page } from "../components/page";
import { IWithAppStateProps, withAppState } from "../containers/with-app-state";
import { UlInline } from "../styles";
import { routes } from "../routes";

type Props = RouteComponentProps & IWithAppStateProps;

class MainMenuPageBase extends React.Component<Props> {
    public render(): React.ReactNode {
        const titleId = this.props.appState.titleId;

        return (
            <Page
                {...this.props}
                title="Main Menu"
            >
                <p>Your titleId is {this.props.appState.titleId}</p>
                <p>Your first step should be to <strong>load initial data</strong> into your title.</p>
                <p>If you've already done that, select <strong>Play game</strong> to login as a player and start the game.</p>
                <UlInline>
                    <li><PrimaryButton text="Play game" onClick={this.goToPage.bind(this, routes.Login(titleId))} /></li>
                    <li><DefaultButton text="Load initial data" onClick={this.goToPage.bind(this, routes.Upload(titleId))} /></li>
                    <li><DefaultButton text="Download data from title" onClick={this.goToPage.bind(this, routes.Download(titleId))} /></li>
                    <li><DefaultButton text="Generate level curve" onClick={this.goToPage.bind(this, routes.LevelCurve(titleId))} /></li>
                </UlInline>
            </Page>
        );
    }

    private goToPage = (uri: string): void => {
        this.props.history.push(uri);
    }
}

export const MainMenuPage = withAppState(MainMenuPageBase);