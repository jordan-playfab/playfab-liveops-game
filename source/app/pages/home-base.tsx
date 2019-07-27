import React from "react";
import { is } from "../shared/is";
import { Redirect, RouteComponentProps } from "react-router";
import { routes } from "../routes";
import { Store } from "../components/store";
import { PlayFabHelper } from "../shared/playfab";
import { Page, IBreadcrumbRoute } from "../components/page";
import { UlInline } from "../styles";
import { PrimaryButton, Spinner } from "office-ui-fabric-react";
import { IWithAppStateProps, withAppState } from "../containers/with-app-state";
import { actionSetInventory, actionSetStores, actionSetPlayerHP, actionSetEquippedWeapon } from "../store/actions";
import { CATALOG_VERSION, CloudScriptFunctionNames, ITEM_CLASS_WEAPON } from "../shared/types";
import { IWithPageProps, withPage } from "../containers/with-page";
import { IReturnToHomeBaseResponse, IEquipItemRequest } from "../../cloud-script/main";

interface IState {
    selectedStore: string;
    buyResult: string;
}

type Props = RouteComponentProps & IWithAppStateProps & IWithPageProps;

class HomeBasePageBase extends React.Component<Props, IState> {
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

        this.loadStores();
        this.restorePlayerHP();
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
        if(is.null(this.props.appState.stores)) {
            return (
                <Spinner label="Loading stores" />
            );
        }

        if(is.null(this.state.selectedStore)) {
            return (
                <React.Fragment>
                    <p>Your health has been restored.</p>
                    <h3>Stores</h3>
                    <UlInline>
                        {this.props.appState.stores.map((store, index) => (
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
                catalogItems={this.props.appState.catalog}
                playerWallet={this.props.appState.inventory.VirtualCurrency}
            />
        )
    }

    private openStore = (selectedStore: string): void => {
        this.setState({
            selectedStore,
        });
    }

    private onBuyFromStore = (itemId: string, currency: string, price: number): void => {
        PlayFabHelper.PurchaseItem(CATALOG_VERSION, this.state.selectedStore, itemId, currency, price,
            (data) => {
                if(!is.null(data.errorMessage)) {
                    this.props.onPageError(data.errorMessage);
                    return;
                }

                this.setState({
                    buyResult: `Bought a ${data.Items[0].DisplayName}`,
                }, () => {
                    PlayFabHelper.GetUserInventory(inventory => this.props.dispatch(actionSetInventory(inventory)), null);
                });

                // If you just bought a weapon and it's your only weapon, equip it immediately
                // TODO: Handle armor
                if(is.null(this.props.appState.equippedWeapon) && is.null(this.props.appState.inventory.Inventory.filter(i => i.ItemClass === ITEM_CLASS_WEAPON))) {
                    this.props.dispatch(actionSetEquippedWeapon(this.props.appState.catalog.find(i => i.ItemId === itemId)));
                    this.checkForEquipItem(itemId, true);
                }
        }, this.props.onPageError);
    }

    private checkForEquipItem(itemId: string, isWeapon: boolean): void {
        PlayFabHelper.ExecuteCloudScript(
            CloudScriptFunctionNames.equipItem,
            {
                itemId: itemId,
                isWeapon
            } as IEquipItemRequest, 
            this.props.onPageNothing,
            this.props.onPageError);
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
        return this.props.appState.hasTitleId && this.props.appState.hasPlayerId;
    }

    private getStore(): PlayFabClientModels.GetStoreItemsResult {
        return is.null(this.state.selectedStore)
            ? null
            : this.props.appState.stores.find(s => s.StoreId === this.state.selectedStore);
    }

    private loadStores(): void {
        const stores: PlayFabClientModels.GetStoreItemsResult[] = [];

        this.props.appState.storeNames.forEach(storeId => {
            PlayFabHelper.GetStoreItems(CATALOG_VERSION, storeId, (data) => {
                stores.push(data);

                if(stores.length === this.props.appState.storeNames.length) {
                    this.props.dispatch(actionSetStores(stores));
                }
            }, this.props.onPageError)
        });
    }

    private restorePlayerHP(): void {
        PlayFabHelper.ExecuteCloudScript(CloudScriptFunctionNames.returnToHomeBase, null, (data) => {
            const response = data.FunctionResult as IReturnToHomeBaseResponse;

            this.props.dispatch(actionSetPlayerHP(response.maxHP));
        }, this.props.onPageError);
    }
}

export const HomeBasePage = withAppState(withPage(HomeBasePageBase));
