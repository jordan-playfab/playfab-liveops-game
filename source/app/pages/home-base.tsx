import * as React from "react";
import { IRouterProps } from "../router";
import { is } from "../shared/is";
import { Redirect, RouteComponentProps } from "react-router";
import { routes } from "../routes";
import { Store } from "../components/store";
import { PlayFabHelper } from "../shared/playfab";
import { Page, IBreadcrumbRoute } from "../components/page";
import { UlInline } from "../styles";
import { PrimaryButton } from "office-ui-fabric-react";

type Props = IRouterProps & RouteComponentProps;

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

        const store = this.getStore();

        return (
            <Page
                {...this.props}
                breadcrumbs={this.getBreadcrumbs()}
                title={is.null(store)
                    ? "Welcome to Home Base"
                    : store.MarketingData.DisplayName}
            >
                {this.renderStores()}
            </Page>
        );
    }

    public renderStores(): React.ReactNode {
        if(is.null(this.props.stores)) {
            return null;
        }

        if(is.null(this.state.selectedStore)) {
            return (
                <React.Fragment>
                    <h3>Stores</h3>
                    <UlInline>
                        {this.props.stores.map((store, index) => (
                            <li key={index}><PrimaryButton text={store.MarketingData.DisplayName} onClick={this.openStore.bind(this, store.StoreId)} /></li>
                        ))}
                    </UlInline>
                </React.Fragment>
            );
        }

        const store = this.getStore();

        return (
            <Store
                store={store}
                onBuy={this.onBuyFromStore}
                buyResult={this.state.buyResult}
                catalogItems={this.props.catalog}
                playerWallet={this.props.inventory.VirtualCurrency}
            />
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

    private getBreadcrumbs(): IBreadcrumbRoute[] {
        const breadcrumbs: IBreadcrumbRoute[] = [{
            text: "Home Base",
            href: routes.HomeBase,
            onClick: is.null(this.state.selectedStore)
                ? null
                : () => {
                    this.openStore(null);
                }
        }];

        const store = this.getStore();

        if(!is.null(store)) {
            breadcrumbs.push({
                text: store.MarketingData.DisplayName,
                href: ""
            });
        }

        return breadcrumbs;
    }

    private isValid(): boolean {
        return !is.null(this.props.titleID) && !is.null(this.props.player);
    }

    private getStore(): PlayFabClientModels.GetStoreItemsResult {
        return is.null(this.state.selectedStore)
            ? null
            : this.props.stores.find(s => s.StoreId === this.state.selectedStore);
    }
}