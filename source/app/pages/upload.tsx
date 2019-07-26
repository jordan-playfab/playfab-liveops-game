import React from "react";
import { RouteComponentProps, Redirect } from "react-router";
import { Page } from "../components/page";
import { is } from "../shared/is";
import { MessageBar, MessageBarType, TextField, PrimaryButton, ProgressIndicator } from "office-ui-fabric-react";
import { DivConfirm } from "../styles";
import { PlayFabHelper } from "../shared/playfab";
import { routes } from "../routes";
import { IStringDictionary, PROGRESS_STAGES, CATALOG_VERSION } from "../shared/types";

import VirtualCurrencies from "../../data/virtual-currency.json";
import Catalogs from "../../data/catalogs.json";
import Stores from "../../data/stores.json";
import TitleData from "../../data/title-data.json";
import CloudScript from "../../data/cloud-script.json";
import DropTables from "../../data/drop-tables.json";
import { IWithAppStateProps, withAppState } from "../containers/with-app-state";

interface IState {
    secretKey: string;
    hasSecretKey: boolean;
    error: string;
    uploadProgress: number;
    storeCounter: number;
    titleDataCounter: number;
}

type Props = RouteComponentProps & IWithAppStateProps;

class UploadPageBase extends React.Component<Props, IState> {
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

    public componentDidUpdate(_: Props, prevState: IState): void {
        if(this.state.uploadProgress !== prevState.uploadProgress) {
            this.runUpload();
        }
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
        return (
            <form onSubmit={this.setHasSecretKey}>
                <p>In order to play the game, you must populate it with game data. This page will create the title data, currencies, catalogs, stores, and Cloud Script for you.</p>
                <p>Get the <strong>secret key</strong> for your game by going to <strong>Settings &gt; Secret Keys</strong>.</p>
                <p>This page does not store nor transmit your secret key to anyone except PlayFab, but it's a good idea to make a new key just in case.</p>
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
        if(this.state.uploadProgress >= PROGRESS_STAGES.length - 1) {
            return (
                <React.Fragment>
                    <h2>All done!</h2>
                    <PrimaryButton text="Play game" onClick={this.goToPage.bind(this, routes.Player)} />
                </React.Fragment>
            );
        }

        return (
            <ProgressIndicator label={this.getProgressTitle()} percentComplete={Math.min(1, (this.state.uploadProgress / PROGRESS_STAGES.length) + 0.1)} />
        );
    }

    private getProgressTitle(): string {
        if(this.state.uploadProgress > PROGRESS_STAGES.length - 1) {
            return null;
        }

        return PROGRESS_STAGES[this.state.uploadProgress].title;
    }

    private runUpload(): void {
        if(!this.state.hasSecretKey || this.state.uploadProgress > PROGRESS_STAGES.length - 1) {
            return;
        }

        switch(PROGRESS_STAGES[this.state.uploadProgress].key) {
            case "currency":
                PlayFabHelper.adminAddVirtualCurrencies(this.state.secretKey, VirtualCurrencies.VirtualCurrencies, this.advanceUpload, this.loadError);
                break;
            case "catalog":
                PlayFabHelper.adminSetCatalogItems(this.state.secretKey, Catalogs.Catalog, CATALOG_VERSION, true, this.advanceUpload, this.loadError);
                break;
            case "droptable":
                PlayFabHelper.adminUpdateDropTables(this.state.secretKey, this.mapDropTable(DropTables as any), CATALOG_VERSION, this.advanceUpload, this.loadError);
                break;
            case "store":
                Stores.data.forEach((s, index) => {
                    window.setTimeout(() => {
                        PlayFabHelper.adminSetStoreItems(this.state.secretKey, s.StoreId, s.Store, s.MarketingData, CATALOG_VERSION, this.advanceStoreCounter, this.loadError);
                    }, index * 500);
                });
                break;
            case "titledata":
                Object.keys(TitleData.Data).forEach((key, index) => {
                    window.setTimeout(() => {
                        PlayFabHelper.adminSetTitleData(this.state.secretKey, key, (TitleData.Data as IStringDictionary)[key], this.advanceTitleDataCounter, this.loadError);
                    }, index * 500);
                });
                break;
            case "cloudscript":
                PlayFabHelper.adminUpdateCloudScript(this.state.secretKey, CloudScript.Files[0].FileContents, true, this.advanceUpload, this.loadError);
                break;
        }
    }

    private mapDropTable(tableData: PlayFabAdminModels.GetRandomResultTablesResult): PlayFabAdminModels.RandomResultTable[] {
        return Object.keys(tableData.Tables).map(key => {
            return {
                TableId: tableData.Tables[key].TableId,
                Nodes: tableData.Tables[key].Nodes,
            }
        });
    }

    private advanceUpload = (): void => {
        // Can't let the system go too fast
        window.setTimeout(() => {
            this.setState((prevState) => {
                return {
                    uploadProgress: prevState.uploadProgress + 1,
                    error: null,
                }
            });
        }, 500);
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
            if(this.state.titleDataCounter >= Object.keys(TitleData.Data).length) {
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
        return this.props.appState.hasTitleId;
    }
}

export const UploadPage = withAppState(UploadPageBase);