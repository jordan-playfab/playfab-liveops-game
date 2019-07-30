import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { PrimaryButton, DefaultButton } from "office-ui-fabric-react";

import { Page } from "../components/page";
import { IWithAppStateProps, withAppState } from "../containers/with-app-state";
import styled, { UlInline } from "../styles";
import { routes } from "../routes";
import { Grid } from "../components/grid";

const DivAdvanced = styled.div`
    margin-top: ${s => s.theme.size.spacer5};
`;

const DivButton = styled.div`
    margin-top: ${s => s.theme.size.spacer};
`;

type Props = RouteComponentProps & IWithAppStateProps;

class MainMenuPageBase extends React.Component<Props> {
    public render(): React.ReactNode {
        const titleId = this.props.appState.titleId;

        return (
            <Page {...this.props} title="Main Menu">
                <Grid grid6x6>
                    <React.Fragment>
                        <h2>First time</h2>
                        <p>To play the game, you must <strong>load it with game data</strong>. This will make your title ready to play.</p>
                        <DivButton>
                            <DefaultButton text="Load data" onClick={this.goToPage.bind(this, routes.Upload(titleId))} />
                        </DivButton>
                    </React.Fragment>
                    <React.Fragment>
                        <h2>Ready to play</h2>
                        <p>If your title has data, select <strong>play game</strong> to create a new player or sign in as an existing player.</p>
                        <DivButton>
                            <PrimaryButton text="Play game" onClick={this.goToPage.bind(this, routes.Login(titleId))} />
                        </DivButton>
                    </React.Fragment>
                </Grid>

                <DivAdvanced>
                    <h3>Advanced</h3>
                    <UlInline>
                        <li><DefaultButton text="Download data" onClick={this.goToPage.bind(this, routes.Download(titleId))} /></li>
                        {/*<li><DefaultButton text="Level curve" onClick={this.goToPage.bind(this, routes.LevelCurve(titleId))} /></li>*/}
                    </UlInline>
                </DivAdvanced>
            </Page>
        );
    }

    private goToPage = (uri: string): void => {
        this.props.history.push(uri);
    }
}

export const MainMenuPage = withAppState(MainMenuPageBase);