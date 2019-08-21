import React from "react";
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton, DialogType, DialogFooter } from "office-ui-fabric-react";
import { RouteComponentProps } from "react-router-dom";

import { routes } from "../routes";
import { Page } from "../components/page";
import { DivConfirm, DivField, DialogWidthSmall, ButtonTiny } from "../styles";
import { IWithAppStateProps, withAppState } from "../containers/with-app-state";
import { Grid } from "../components/grid";
import { is } from "../shared/is";
import { MAIN_CLOUD } from "../shared/types";

interface IState {
    titleId: string;
    cloud: string;
    isAnalyticsVisible: boolean;
}

type Props = RouteComponentProps & IWithAppStateProps;

class IndexPageBase extends React.Component<Props, IState> {
    constructor(props: Props) {
        super(props);

        const cloudParam = (props.match.params as any).cloud || MAIN_CLOUD;

        this.state = {
            titleId: "",
            cloud: cloudParam,
            isAnalyticsVisible: false,
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
                        </ul>
                        <h3>Analytics</h3>
                        <p><ButtonTiny text="About analytics" onClick={this.showAnalyticsPopup} /></p>
                    </div>
                </Grid>
                <DialogWidthSmall hidden={!this.state.isAnalyticsVisible} onDismiss={this.hideAnalyticsPopup}
                    dialogContentProps={{
                        type: DialogType.largeHeader,
                        title: "About analytics on this site",
                    }}
                >
                    <p>This site uses <a href="https://docs.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview">Azure Application Insights</a> to track usage. In addition to browser information, it sends an event when a user uploads data into their title, and when a new player logs in for the first time.</p>
                    <p>Information gathered via this method is only used to determine whether this website is being used. The title secret key is not tracked or stored.</p>
                    <p>If you do not wish to be tracked, <a href="https://github.com/jordan-playfab/playfab-liveops-game/">build this game from its source code</a> and run it locally. The <a href="https://github.com/jordan-playfab/playfab-liveops-game/blob/master/source/app/shared/is.ts#L144">IsAnalyticsEnabled()</a> function determines whether the tracking code activates. The tracking code is only enabled on the secure domain <code>vanguardoutrider.com</code>.</p>
                    {!is.analyticsEnabled() && (
                        <p><strong>Analytics has been disabled on this site.</strong></p>
                    )}
                    <DialogFooter>
                        <PrimaryButton onClick={this.hideAnalyticsPopup} text="Close" />
                    </DialogFooter>
                </DialogWidthSmall>
            </Page>
        );
    }

    private showAnalyticsPopup = (): void => {
        this.setState({
            isAnalyticsVisible: true,
        });
    }

    private hideAnalyticsPopup = (): void => {
        this.setState({
            isAnalyticsVisible: false,
        });
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
}

export const IndexPage = withAppState(IndexPageBase);