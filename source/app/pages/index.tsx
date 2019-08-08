import React from "react";
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton } from "office-ui-fabric-react";
import { RouteComponentProps } from "react-router-dom";

import { routes } from "../routes";
import { Page } from "../components/page";
import { DivConfirm, DivField } from "../styles";
import { IWithAppStateProps, withAppState } from "../containers/with-app-state";
import { Grid } from "../components/grid";
import { is } from "../shared/is";
import { MAIN_CLOUD } from "../shared/types";

interface IState {
    titleId: string;
    cloud: string;
}

type Props = RouteComponentProps & IWithAppStateProps;

class IndexPageBase extends React.Component<Props, IState> {
    constructor(props: Props) {
        super(props);

        const cloudParam = (props.match.params as any).cloud || MAIN_CLOUD;

        this.state = {
            titleId: null,
            cloud: cloudParam,
        }
    }

    public render(): React.ReactNode {
        const shouldShowCloud = !is.null((this.props.match.params as any).cloud);

        return (
            <Page {...this.props} title="PlayFab Demo Game">
                <Grid grid8x4>
                    <form onSubmit={this.continue}>
                        <h2>About</h2>
                        <p>This is a demo game to show how PlayFab can be used to run live games. PlayFab is a backend platform for all kinds of video games.</p>
                        <p><a href="https://developer.playfab.com" target="_blank">Sign up for a free account</a> and return to this website with your title ID (4+ alphanumeric characters).</p>
                        <DivField>
                            <Grid grid6x6>
                                <TextField label="Title ID" onChange={this.onChangeTitleId} value={this.state.titleId} autoFocus />
                                {shouldShowCloud && (
                                    <TextField label="Cloud" onChange={this.onChangeCloud} value={this.state.cloud} />
                                )}
                            </Grid>
                        </DivField>
                        <DivConfirm>
                            <PrimaryButton text="Continue" onClick={this.continue} />
                        </DivConfirm>
                    </form>
                    <div>
                        <h2>Support</h2>
                        <ul>
                            <li><a href="https://api.playfab.com/">PlayFab Documentation</a></li>
                            <li><a href="https://community.playfab.com/index.html">PlayFab Forums</a></li>
                            <li><a href="https://playfab.com/support/contact/">Contact PlayFab</a></li>
                            <li><a href="https://github.com/jordan-playfab/playfab-liveops-game/">Source code on GitHub</a></li>
                            <li><a href="#" onClick={this.reload}>Reload this page</a></li>
                        </ul>
                    </div>
                </Grid>
            </Page>
        );
    }

    private onChangeTitleId = (_: any, titleId: string): void => {
        this.setState({
            titleId: titleId.trim(),
        });
    }

    private onChangeCloud = (_: any, cloud: string): void => {
        this.setState({
            cloud: cloud.trim(),
        });
    }

    private continue = (e: React.SyntheticEvent<any>): void => {
        if(!is.null(e)) {
            e.preventDefault();
        }

        if(is.null(this.state.titleId)) {
            return;
        }
        
        this.props.history.push(routes.MainMenu(this.state.cloud, this.state.titleId));
    }

    private reload = (): void => {
        window.location.reload();
    }
}

export const IndexPage = withAppState(IndexPageBase);