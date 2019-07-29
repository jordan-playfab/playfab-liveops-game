import React from "react";
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton } from 'office-ui-fabric-react';
import { RouteComponentProps } from "react-router-dom";
import { routes } from "../routes";
import { Page } from "../components/page";
import { DivConfirm } from "../styles";
import { IWithAppStateProps, withAppState } from "../containers/with-app-state";

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
                title="Instructions"
            >
                <form onSubmit={this.saveTitleID}>
                    <p><a href="https://developer.playfab.com" target="_blank">Create a PlayFab account</a> and make an empty title. Then find its <strong>title ID</strong> (4+ alphanumeric characters) and enter it here.</p>
                    <fieldset>
                        <legend>PlayFab title ID</legend>
                        <TextField label="Title ID" onChange={this.onChangeTitleId} autoFocus />
                        <DivConfirm>
                            <PrimaryButton text="Set title ID" onClick={this.saveTitleID} />
                        </DivConfirm>
                    </fieldset>
                </form>
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