import * as React from "react";
import { RouteComponentProps, Redirect } from "react-router";
import { IRouterProps } from "../router";
import { Page } from "../components/page";
import { is } from "../shared/is";
import { MessageBar, MessageBarType, TextField, PrimaryButton, ProgressIndicator } from "office-ui-fabric-react";
import { DivConfirm } from "../styles";
import { PlayFabHelper } from "../shared/playfab";
import { routes } from "../routes";

import VirtualCurrencies from "../../data/virtual-currency.json";
import Catalogs from "../../data/catalogs.json";
import Stores from "../../data/stores.json";

type Props = IRouterProps & RouteComponentProps;

interface IState {
    secretKey: string;
    hasSecretKey: boolean;
    error: string;
    uploadProgress: number;
}

interface IProgressStage {
    key: string;
    title: string;
}

const progressStages: IProgressStage[] = [{
    key: "currency",
    title: "Currency",
},
{
    key: "catalog",
    title: "Catalog",
},
{
    key: "store",
    title: "Store",
},
{
    key: "titledata",
    title: "Title data"
},
{
    key: "cloudscript",
    title: "Cloud Script",
}];

export class UploadPage extends React.Component<Props, IState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            secretKey: null,
            hasSecretKey: false,
            error: null,
            uploadProgress: 0,
        };
    }

    public render(): React.ReactNode {
        if(!this.isValid()) {
            return <Redirect to={routes.Home} />;
        }

        return (
            <Page {...this.props} title="Upload Data">
                {!is.null(this.state.error) && (
                    <MessageBar messageBarType={MessageBarType.error}>{this.state.error}</MessageBar>
                )}
                {this.state.hasSecretKey
                    ? this.renderUpload()
                    : this.renderSecretKey()}
            </Page>
        );
    }

    private renderSecretKey(): React.ReactNode {
        if(this.state.uploadProgress === progressStages.length) {
            return (
                <React.Fragment>
                    <h2>All done!</h2>
                    <PrimaryButton text="Play game" onClick={this.goToPage.bind(this, routes.Player)} />
                </React.Fragment>
            );
        }

        return (
            <form>
                <p>In order to play the game, you must populate it with game data.</p>
                <p>This page will create the title data, currencies, catalogs, stores, and Cloud Script for you.</p>
                <p>Get the <strong>secret key</strong> for your game by going to Settings &gt; Secret Keys.</p>
                <p>This page does not store nor transmit your secret key to anyone, but it's a good idea to make a new key just in case.</p>
                <fieldset>
                    <legend>Secret key</legend>

                    <TextField label="Secret key" onChange={this.setSecretKey} autoFocus />
                    <DivConfirm>
                        <PrimaryButton text="Begin upload" onClick={this.setHasSecretKey} />
                    </DivConfirm>
                </fieldset>
            </form>
        );
    }

    private goToPage = (page: string): void => {
        this.props.history.push(page);
    }

    private setSecretKey = (_: any, newValue: string): void => {
        this.setState({
            secretKey: newValue,
        });
    }

    private setHasSecretKey = (): void => {
        this.setState({
            hasSecretKey: true,
        }, this.beginUpload);
    }

    private renderUpload(): React.ReactNode {
        return (
            <ProgressIndicator label={this.getProgressTitle()} percentComplete={Math.min(1, (this.state.uploadProgress / progressStages.length) + 0.1)} />
        );
    }

    private getProgressTitle(): string {
        return progressStages[this.state.uploadProgress].title;
    }

    private beginUpload(): void {
        switch(progressStages[this.state.uploadProgress].key) {
            case "currency":
                PlayFabHelper.adminAddVirtualCurrencies(this.state.secretKey, VirtualCurrencies.data, this.advanceUpload, this.loadError);
                break;
            case "catalog":

        }
    }

    private advanceUpload(): void {
        this.setState((prevState) => {
            return {
                uploadProgress: prevState.uploadProgress + 1,
                error: null,
            }
        });
    }

    private loadError = (error: string): void => {
        this.setState({
            error,
        });
    }

    private isValid(): boolean {
        return !is.null(this.props.titleID);
    }
}