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
import { IWithPageProps, withPage } from "../containers/with-page";
import { Link } from "react-router-dom";

interface IState {
    secretKey: string;
    hasSecretKey: boolean;
    uploadProgress: number;
    storeCounter: number;
    titleDataCounter: number;
}

type Props = RouteComponentProps & IWithAppStateProps & IWithPageProps;

class UploadPageBase extends React.Component<Props, IState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            secretKey: null,
            hasSecretKey: false,
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
        if(!this.props.appState.hasTitleId) {
            return null;
        }

        return (
            <Page {...this.props} title="Upload Data">
                <p><Link to={routes.MainMenu(this.props.appState.titleId)}>&laquo; Back to main menu</Link></p>
                {!is.null(this.props.pageError) && (
                    <MessageBar messageBarType={MessageBarType.error}>{this.props.pageError}</MessageBar>
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
                    <PrimaryButton text="Play game" onClick={this.goToPage.bind(this, routes.Guide)} />
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
                PlayFabHelper.AdminAPIAddVirtualCurrencyTypes(this.state.secretKey, VirtualCurrencies.VirtualCurrencies, this.advanceUpload, this.props.onPageError);
                break;
            case "catalog":
                PlayFabHelper.AdminAPISetCatalogItems(this.state.secretKey, Catalogs.Catalog, CATALOG_VERSION, true, this.advanceUpload, this.props.onPageError);
                break;
            case "droptable":
                PlayFabHelper.AdminAPIUpdateRandomResultTables(this.state.secretKey, this.mapDropTable(DropTables as any), CATALOG_VERSION, this.advanceUpload, this.props.onPageError);
                break;
            case "store":
                Stores.data.forEach((s, index) => {
                    window.setTimeout(() => {
                        PlayFabHelper.AdminAPISetStoreItems(this.state.secretKey, s.StoreId, s.Store, s.MarketingData, CATALOG_VERSION, this.advanceStoreCounter, this.props.onPageError);
                    }, index * 500);
                });
                break;
            case "titledata":
                Object.keys(TitleData.Data).forEach((key, index) => {
                    window.setTimeout(() => {
                        PlayFabHelper.AdminAPISetTitleData(this.state.secretKey, key, (TitleData.Data as IStringDictionary)[key], this.advanceTitleDataCounter, this.props.onPageError);
                    }, index * 500);
                });
                break;
            case "cloudscript":
                PlayFabHelper.AdminAPIUpdateCloudScript(this.state.secretKey, CloudScript.Files[0].FileContents, true, this.advanceUpload, this.props.onPageError);
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
            this.props.onPageClearError();

            this.setState((prevState) => {
                return {
                    uploadProgress: prevState.uploadProgress + 1,
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
}

export const UploadPage = withAppState(withPage(UploadPageBase));