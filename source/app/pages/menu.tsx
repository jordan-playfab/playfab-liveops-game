import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { PrimaryButton, DefaultButton } from "office-ui-fabric-react";

import { Page } from "../components/page";
import { IWithAppStateProps, withAppState } from "../containers/with-app-state";
import styled, { UlInline } from "../styles";
import { routes } from "../routes";
import { Grid } from "../components/grid";
import { utilities } from "../shared/utilities";

const DivAdvanced = styled.div`
    margin-top: ${s => s.theme.size.spacer5};
`;

const DivButton = styled.div`
    margin-top: ${s => s.theme.size.spacer};
`;

const DivPlayFab = styled.div`
    margin-top: ${s => s.theme.size.spacer2};
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
                        <p>To play the game, you must <strong>upload game data</strong>. This will make your title ready to play.</p>
                        <DivButton>
                            <DefaultButton text="Upload data" onClick={this.goToPage.bind(this, routes.Upload(titleId))} />
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
                <DivPlayFab>
                    <h3>Watch PlayFab work</h3>
                    <Grid grid6x6>
                        <React.Fragment>
                            <p><strong>In browser:</strong> Open the developer tools in your browser and navigate to the network tab. All requests to PlayFab will be visible.</p>
                            <ul>
                                <li><strong>Windows:</strong> Press F12</li>
                                <li><strong>Macintosh:</strong> Press Command-Option-i</li>
                            </ul>
                        </React.Fragment>
                        <React.Fragment>
                            <p><strong>PlayStream Monitor:</strong> Keep the <strong><a href={utilities.createPlayFabLink(this.props.appState.titleId, "dashboard/monitoring/playstream", false)} target="_blank">Dashboard &gt; PlayStream Monitor</a></strong> page open to see all game activity as it happens.</p>
                        </React.Fragment>
                    </Grid>
                </DivPlayFab>
            </Page>
        );
    }

    private goToPage = (uri: string): void => {
        this.props.history.push(uri);
    }
}

export const MainMenuPage = withAppState(MainMenuPageBase);