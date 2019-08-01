import React from "react";
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton } from "office-ui-fabric-react";
import { RouteComponentProps } from "react-router-dom";

import { routes } from "../routes";
import { Page } from "../components/page";
import styled, { DivConfirm, DivField } from "../styles";
import { IWithAppStateProps, withAppState } from "../containers/with-app-state";
import { Grid } from "../components/grid";
import { is } from "../shared/is";

const TextFieldTitleId = styled(TextField)`
    max-width: 20em;
`;

interface IState {
    titleId: string;
    cloud: string;
}

type Props = RouteComponentProps & IWithAppStateProps;

class IndexPageBase extends React.Component<Props, IState> {
    constructor(props: Props) {
        super(props);

        const cloud = (props.match.params as any).cloud || "";

        this.state = {
            titleId: "",
            cloud,
        }
    }

    public render(): React.ReactNode {
        const shouldShowCloud = !is.null((this.props.match.params as any).cloud);

        return (
            <Page {...this.props} title="PlayFab Demo Game">
                <Grid grid8x4>
                    <form onSubmit={this.continue}>
                        <h2>About</h2>
                        <p>This is a demo game to show how PlayFab can be used to run live games.</p>
                        <p>PlayFab is a backend platform for all kinds of video games.</p>
                        <p><a href="https://developer.playfab.com" target="_blank">Sign up for a free account</a> and return to this website with your title ID (4+ alphanumeric characters).</p>
                        <DivField>
                            <TextFieldTitleId label="Title ID" onChange={this.onChangeTitleId} value={this.state.titleId} autoFocus />
                        </DivField>
                        {shouldShowCloud && (
                            <DivField>
                                <TextField label="Cloud" onChange={this.onChangeCloud} value={this.state.cloud} />
                            </DivField>
                        )}
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

    private continue = (e: React.SyntheticEvent<any>): void => {
        if(!is.null(e)) {
            e.preventDefault();
        }

        PlayFab.settings.titleId = this.state.titleId;
        
        this.props.history.push(routes.MainMenu(this.state.titleId));
    }
}

export const IndexPage = withAppState(IndexPageBase);