import React from "react";
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton } from "office-ui-fabric-react";
import { RouteComponentProps } from "react-router-dom";

import { routes } from "../routes";
import { Page } from "../components/page";
import styled, { DivConfirm } from "../styles";
import { IWithAppStateProps, withAppState } from "../containers/with-app-state";
import backgroundSplash from "../../../static/img/background-splash.jpg";

const FormTag = styled.form`
    max-width: ${s => s.theme.breakpointUnits.large};
    border-radius: ${s => s.theme.size.spacerD2};
    margin: ${s => s.theme.size.spacer} auto;
    width: 100%;

    @media ${s => s.theme.breakpoint.small} {
        min-height: 50vh;
        background: url(${backgroundSplash});
        background-size: cover;
    }
`;

const DivInfo = styled.div`
    max-width: ${s => s.theme.breakpointUnits.small};
    background-color: ${s => s.theme.color.background000};
    margin: 0 auto;
    border-radius: ${s => s.theme.size.spacerD2};
    padding: ${s => s.theme.size.spacer};
    position: relative;

    @media ${s => s.theme.breakpoint.small} {
        top: 25vh;
    }
`;

const DivMarketingCopy = styled.div`
    text-align: center;
`;

const DivFieldWrapper = styled.div`
    margin-top: ${s => s.theme.size.spacer};
`;

const H1Tag = styled.h1`
    font-size: 1.8em;

    @media ${s => s.theme.breakpoint.medium} {
        font-size: ${s => s.theme.fontSize.h1};
    }
`;

interface IState {
    titleId: string;
}

type Props = RouteComponentProps & IWithAppStateProps;

class IndexPageBase extends React.Component<Props, IState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            titleId: null,
        }
    }

    public render(): React.ReactNode {
        return (
            <Page
                {...this.props}
            >
                <FormTag onSubmit={this.saveTitleID}>
                    <DivInfo>
                        <DivMarketingCopy>
                            <H1Tag>A PlayFab Demo Game</H1Tag>
                        </DivMarketingCopy>
                        <p><a href="https://playfab.com" target="_blank">PlayFab</a> is a backend platform as a service for all kinds of video games. This website shows how PlayFab can be used to run live games.</p>
                        <p><a href="https://developer.playfab.com" target="_blank">Sign up for a free account</a> and get your title ID (4+ alphanumeric characters). If you already have a PlayFab account, please make a new title.</p>
                        <DivFieldWrapper>
                            <TextField label="Title ID" onChange={this.onChangeTitleId} autoFocus />
                            <DivConfirm>
                                <PrimaryButton text="Set title ID" onClick={this.saveTitleID} />
                            </DivConfirm>
                        </DivFieldWrapper>
                    </DivInfo>
                </FormTag>
            </Page>
        );
    }

    private onChangeTitleId = (_: any, titleId: string): void => {
        this.setState({
            titleId,
        });
    }

    private saveTitleID = (): void => {
        PlayFab.settings.titleId = this.state.titleId;
        
        this.props.history.push(routes.MainMenu(this.state.titleId));
    }
}

export const IndexPage = withAppState(IndexPageBase);