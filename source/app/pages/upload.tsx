import * as React from "react";
import { RouteComponentProps, Redirect } from "react-router";
import { IRouterProps } from "../router";
import { Page } from "../components/page";
import { is } from "../shared/is";
import { MessageBar, MessageBarType, TextField, PrimaryButton, ProgressIndicator } from "office-ui-fabric-react";
import { DivConfirm } from "../styles";
import { PlayFabHelper } from "../shared/playfab";
import { routes } from "../routes";
import { IStringDictionary } from "../shared/types";

import VirtualCurrencies from "../../data/virtual-currency.json";
import Catalogs from "../../data/catalogs.json";
import Stores from "../../data/stores.json";
import TitleData from "../../data/title-data.json";
import CloudScript from "../../data/cloud-script.json";

type Props = IRouterProps & RouteComponentProps;

interface IState {
    secretKey: string;
    hasSecretKey: boolean;
    error: string;
    uploadProgress: number;
    storeCounter: number;
    titleDataCounter: number;
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

const catalogVersion = "Main";

export class UploadPage extends React.Component<Props, IState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            secretKey: null,
            hasSecretKey: false,
            error: null,
            uploadProgress: 0,
            storeCounter: 0,
            titleDataCounter: 0,
        };
    }

    public componentDidUpdate(): void {
        this.runUpload();
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
        }, this.runUpload);
    }

    private renderUpload(): React.ReactNode {
        return (
            <ProgressIndicator label={this.getProgressTitle()} percentComplete={Math.min(1, (this.state.uploadProgress / progressStages.length) + 0.1)} />
        );
    }

    private getProgressTitle(): string {
        return progressStages[this.state.uploadProgress].title;
    }

    private runUpload(): void {
        if(!this.state.hasSecretKey || this.state.uploadProgress > progressStages.length) {
            return;
        }

        switch(progressStages[this.state.uploadProgress].key) {
            case "currency":
                PlayFabHelper.adminAddVirtualCurrencies(this.state.secretKey, VirtualCurrencies.data, this.advanceUpload, this.loadError);
                break;
            case "catalog":
                PlayFabHelper.adminSetCatalogItems(this.state.secretKey, Catalogs.data, catalogVersion, this.advanceUpload, this.loadError);
                break;
            case "store":
                Stores.data.forEach(s => {
                    PlayFabHelper.adminSetStoreItems(this.state.secretKey, s.StoreId, s.Store, s.MarketingData, catalogVersion, this.advanceStoreCounter, this.loadError);
                })
                break;
            case "titledata":
                Object.keys(TitleData.data).forEach(key => {
                    PlayFabHelper.adminSetTitleData(this.state.secretKey, key, (TitleData.data as IStringDictionary)[key], this.advanceTitleDataCounter, this.loadError);
                })
                break;
            case "cloudscript":
                PlayFabHelper.adminUpdateCloudScript(this.state.secretKey, CloudScript.data.FileContents, true, this.advanceUpload, this.loadError);
                break;
        }
    }

    private advanceUpload = (): void => {
        this.setState((prevState) => {
            return {
                uploadProgress: prevState.uploadProgress + 1,
                error: null,
            }
        });
    }

    private advanceStoreCounter = (): void => {
        this.setState((prevState) => {
            return {
                storeCounter: prevState.storeCounter + 1,
            }
        }, () => {
            if(this.state.storeCounter >= Stores.data.length) {
                this.advanceUpload();
            }
        });
    }

    private advanceTitleDataCounter = (): void => {
        this.setState((prevState) => {
            return {
                titleDataCounter: prevState.titleDataCounter + 1,
            }
        }, () => {
            if(this.state.titleDataCounter >= Object.keys(TitleData.data).length) {
                this.advanceUpload();
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