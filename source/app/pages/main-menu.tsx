import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Page } from "../components/page";
import { IWithAppStateProps, withAppState } from "../containers/with-app-state";

type Props = RouteComponentProps & IWithAppStateProps;

class MainMenuPageBase extends React.Component<Props> {
    public render(): React.ReactNode {
        return (
            <Page
                {...this.props}
                title="Main Menu"
            >
                <p>Your titleId is {this.props.appState.titleId}</p>
            </Page>
        );
    }
}

export const MainMenuPage = withAppState(MainMenuPageBase);