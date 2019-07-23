import * as React from "react";
import { IRouterProps } from "../router";
import { Header } from "../components/header";
import { is } from "../shared/is";
import { Player } from "../components/player";
import { Redirect } from "react-router";
import { routes } from "../routes";
import { Store } from "../components/store";
import { PlayFabHelper } from "../shared/playfab";
import { Link } from "react-router-dom";
import { Page } from "../components/page";

type Props = IRouterProps;

interface IState {
    selectedStore: string;
    buyResult: string;
}

export class HomeBasePage extends React.Component<Props, IState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            selectedStore: null,
            buyResult: null,
        };
    }

    public componentDidMount(): void {
        if(!this.isValid()) {
            return;
        }

        this.props.refreshStores();
    }

    public render(): React.ReactNode {
        if(!this.isValid()) {
            return <Redirect to={routes.Home} />;
        }

        return (
            <Page {...this.props}>
                <h1>Welcome to Home Base</h1>
                <p><Link to={routes.Player}>Back to planet selection</Link></p>
                {this.renderStores()}
            </Page>
        );
    }

    public renderStores(): React.ReactNode {
        if(is.null(this.props.stores)) {
            return (
                <p>Loading stores&hellip;</p>
            );
        }

        if(is.null(this.state.selectedStore)) {
            return (
                <React.Fragment>
                    <h2>Stores</h2>
                    <ul>
                        {this.props.stores.map((store, index) => (
                            <li key={index}><button onClick={this.openStore.bind(this, store.StoreId)}>{store.MarketingData.DisplayName}</button></li>
                        ))}
                    </ul>
                </React.Fragment>
            );
        }

        const openedStore = this.props.stores.find(s => s.StoreId === this.state.selectedStore);

        return (
            <React.Fragment>
                <p><button onClick={this.openStore.bind(this, null)}>Leave store</button></p>
                <Store
                    store={openedStore}
                    onBuy={this.onBuyFromStore}
                    buyResult={this.state.buyResult}
                    catalogItems={this.props.catalog}
                    playerWallet={this.props.inventory.VirtualCurrency}
                />
            </React.Fragment>
        )
    }

    private openStore = (selectedStore: string): void => {
        this.setState({
            selectedStore,
        });
    }

    private onBuyFromStore = (itemID: string, currency: string, price: number): void => {
        PlayFabHelper.buyFromStore(this.state.selectedStore, itemID, currency, price,
            (data) => {
                if(!is.null(data.errorMessage)) {
                    this.setState({
                        buyResult: data.errorMessage,
                    });
                    return;
                }

                this.setState({
                    buyResult: `Bought a ${data.Items[0].DisplayName}`,
                }, () => {
                    this.props.refreshInventory();
                });
            }, (error) => {
                console.log("Got an error of " + error);
                this.setState({
                    buyResult: error,
                });
            }
        )
    }

    private isValid(): boolean {
        return !is.null(this.props.titleID) && !is.null(this.props.player);
    }
}