import React from "react";
import { RouteComponentProps, Redirect } from "react-router";
import { Page } from "../components/page";
import { is } from "../shared/is";
import { MessageBar, MessageBarType, TextField, PrimaryButton, ProgressIndicator } from "office-ui-fabric-react";
import { DivConfirm, DivField } from "../styles";
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
import { Grid } from "../components/grid";
import { BackLink } from "../components/back-link";

interface IState {
    secretKey: string;
    hasSecretKey: boolean;
    uploadProgress: number;
    storeCounter: number;
    titleDataCounter: number;
}

type Props = RouteComponentProps & IWithAppStateProps & IWithPageProps;

class UploadPageBase extends React.Component<Props, IState> {
    private readonly uploadDelayMilliseconds = 500;

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
            <Page {...this.props} title="Load Data">
                {!is.null(this.props.pageError) && (
                    <MessageBar messageBarType={MessageBarType.error}>{this.props.pageError}</MessageBar>
                )}
                <Grid grid8x4>
                {this.state.hasSecretKey
                    ? this.renderUpload()
                    : this.renderForm()}
                    <React.Fragment>
                        <h2>What this creates</h2>
                        <ul>
                            <li><a href={this.createPlayFabLink("economy/currency", true)} target="_blank">Currencies</a></li>
                            <li><a href={this.createPlayFabLink("economy/catalogs/TWFpbg%3d%3d/items", false)} target="_blank">Catalog items</a></li>
                            <li><a href={this.createPlayFabLink("economy/catalogs/TWFpbg%3d%3d/drop-tables", false)} target="_blank">Drop tables</a></li>
                            <li><a href={this.createPlayFabLink("economy/catalogs/TWFpbg%3d%3d/stores", false)} target="_blank">Stores</a></li>
                            <li><a href={this.createPlayFabLink("content/title-data", true)} target="_blank">Title data</a></li>
                            <li><a href={this.createPlayFabLink("automation/cloud-script/revisions", true)} target="_blank">Cloud Script</a></li>
                        </ul>
                    </React.Fragment>
                </Grid>
            </Page>
        );
    }

    private renderForm(): React.ReactNode {
        return (
            <React.Fragment>
                <h2>About</h2>
                <BackLink to={routes.MainMenu(this.props.appState.titleId)} label="Back to main menu" />
                <p>In order to play the game, you must populate it with game data. This page will create everything you need to play.</p>
                <p>Get the secret key for your game from <a href={this.createPlayFabLink("settings/secret-keys", true)} target="_blank">Settings &gt; Secret Keys</a>.</p>
                <p>This page does not store nor transmit your secret key to anyone except PlayFab.</p>
                <form onSubmit={this.startUpload}>
                    <DivField>
                        <TextField label="Secret key" onChange={this.onChangeSecretKey} autoFocus />
                    </DivField>
                    <DivConfirm>
                        <PrimaryButton text="Begin upload" onClick={this.startUpload} />
                    </DivConfirm>
                </form>
            </React.Fragment>
        );
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

    private createPlayFabLink(uri: string, isReact: boolean): string {
        return `https://developer.playfab.com/en-US/${isReact ? `r/t/` : ``}${this.props.appState.titleId}/${uri}`;
    }

    private goToPage = (page: string): void => {
        this.props.history.push(page);
    }

    private onChangeSecretKey = (_: any, newValue: string): void => {
        this.setState({
            secretKey: newValue,
        });
    }

    private startUpload = (): void => {
        this.setState({
            hasSecretKey: true,
        }, this.runUpload);
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
                    }, index * this.uploadDelayMilliseconds);
                });
                break;
            case "titledata":
                Object.keys(TitleData.Data).forEach((key, index) => {
                    window.setTimeout(() => {
                        PlayFabHelper.AdminAPISetTitleData(this.state.secretKey, key, (TitleData.Data as IStringDictionary)[key], this.advanceTitleDataCounter, this.props.onPageError);
                    }, index * this.uploadDelayMilliseconds);
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
        }, this.uploadDelayMilliseconds);
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