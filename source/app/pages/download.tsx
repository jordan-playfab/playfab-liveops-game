import * as React from "react";
import { RouteComponentProps, Redirect } from "react-router";
import { IRouterProps } from "../router";
import { Page } from "../components/page";
import { MessageBar, MessageBarType, TextField, PrimaryButton, ProgressIndicator } from "office-ui-fabric-react";
import { is } from "../shared/is";
import { DivConfirm, UlNull } from "../styles";
import { routes } from "../routes";
import { PROGRESS_STAGES, CATALOG_VERSION, TITLE_DATA_STORES } from "../shared/types";
import { PlayFabHelper } from "../shared/playfab";

type Props = IRouterProps & RouteComponentProps;

interface IState {
    secretKey: string;
    hasSecretKey: boolean;
    error: string;
    downloadProgress: number;
    storeCounter: number;
    titleDataCounter: number;
    downloadContent: IDownloadContent[];
}

interface IDownloadContent {
    title: string;
    content: string;
}

export class DownloadPage extends React.Component<Props, IState> {
    private storeCount = 0;
    private storeContent: any[] = [];

    constructor(props: Props) {
        super(props);

        this.state = {
            secretKey: null,
            hasSecretKey: false,
            error: null,
            downloadProgress: 0,
            storeCounter: 0,
            titleDataCounter: 0,
            downloadContent: [],
        };
    }

    public componentDidUpdate(_: Props, prevState: IState): void {
        if(this.state.downloadProgress !== prevState.downloadProgress) {
            this.runDownload();
        }
    }

    public render(): React.ReactNode {
        if(!this.isValid()) {
            return <Redirect to={routes.Home} />;
        }

        return (
            <Page {...this.props} title="Download Data">
                {!is.null(this.state.error) && (
                    <MessageBar messageBarType={MessageBarType.error}>{this.state.error}</MessageBar>
                )}
                {this.state.hasSecretKey
                    ? this.renderDownload()
                    : this.renderSecretKey()}
            </Page>
        );
    }

    private renderSecretKey(): React.ReactNode {
        return (
            <form onSubmit={this.setHasSecretKey}>
                <p>Want to download your game changes? This page makes it (sort of) easy.</p>
                <p>Get the <strong>secret key</strong> for your game by going to <strong>Settings &gt; Secret Keys</strong>.</p>
                <p>This page does not store nor transmit your secret key to anyone except PlayFab, but it's a good idea to make a new key just in case.</p>
                <fieldset>
                    <legend>Secret key</legend>

                    <TextField label="Secret key" onChange={this.setSecretKey} autoFocus />
                    <DivConfirm>
                        <PrimaryButton text="Begin download" onClick={this.setHasSecretKey} />
                    </DivConfirm>
                </fieldset>
            </form>
        );
    }

    private renderDownload(): React.ReactNode {
        const percentComplete = Math.min(1, (this.state.downloadProgress / PROGRESS_STAGES.length) + 0.1);
        return (
            <React.Fragment>
                {percentComplete < 1 && (
                    <ProgressIndicator label={this.getProgressTitle()} percentComplete={percentComplete} />
                )}
                {this.renderDownloadContent()}
            </React.Fragment>
        );
    }

    private renderDownloadContent(): React.ReactNode {
        if(is.null(this.state.downloadContent)) {
            return null;
        }

        return (
            <UlNull>
                {this.state.downloadContent.map((d, index) => (
                    <li key={index}>
                        <label>{d.title}</label>
                        <TextField multiline value={d.content} rows={10} />
                    </li>
                ))}
            </UlNull>
        )
    }

    private getProgressTitle(): string {
        if(this.state.downloadProgress > PROGRESS_STAGES.length - 1) {
            return null;
        }

        return PROGRESS_STAGES[this.state.downloadProgress].title;
    }

    private runDownload(): void {
        if(!this.state.hasSecretKey || this.state.downloadProgress > PROGRESS_STAGES.length - 1) {
            return;
        }

        const title = this.getProgressTitle();

        switch(PROGRESS_STAGES[this.state.downloadProgress].key) {
            case "currency":
                PlayFabHelper.adminListVirtualCurrency(this.state.secretKey, (data) => {
                    this.advanceDownload(title, data);
                }, this.loadError);
                break;
            case "catalog":
                PlayFabHelper.adminGetCatalogItems(this.state.secretKey, CATALOG_VERSION, (data) => {
                    this.advanceDownload(title, data);
                }, this.loadError);
                break;
            case "droptable":
                PlayFabHelper.adminGetRandomResultTables(this.state.secretKey, CATALOG_VERSION, (data) => {
                    this.advanceDownload(title, data);
                }, this.loadError);
                break;
            case "store":
                PlayFabHelper.adminGetTitleData(this.state.secretKey, [TITLE_DATA_STORES], (titleData) => {
                    const storeNames = (JSON.parse(titleData.Data[TITLE_DATA_STORES]) as string[]);
                    this.storeCount = storeNames.length;

                    storeNames.forEach(name => {
                        PlayFabHelper.adminGetStores(this.state.secretKey, CATALOG_VERSION, name, (storeData) => {
                            this.storeContent.push(storeData);
                            this.advanceStoreCounter();
                        }, this.loadError);
                    })
                }, () => {});
                break;
        }
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
        }, this.runDownload);
    }

    private loadError = (error: string): void => {
        this.setState({
            error,
        });
    }

    private isValid(): boolean {
        return !is.null(this.props.titleID);
    }

    private advanceDownload = (title: string, data: any): void => {
        this.setState((prevState) => {
            return {
                downloadProgress: prevState.downloadProgress + 1,
                downloadContent: prevState.downloadContent.concat([{
                    title,
                    content: JSON.stringify(data, null, 4),
                }]),
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
            if(this.state.storeCounter >= this.storeCount) {
                this.advanceDownload("Store", {
                    "data": this.storeContent
                });
            }
        });
    }
}