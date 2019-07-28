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
import { actionSetInventory, actionSetStores, actionSetPlayerHP, actionSetEquipmentSingle } from "../store/actions";
import { CATALOG_VERSION } from "../shared/types";
import { IWithPageProps, withPage } from "../containers/with-page";
import { IReturnToHomeBaseResponse } from "../../cloud-script/main";
import { getSlotTypeFromItemClass, EquipmentSlotTypes } from "../store/types";
import { CloudScriptHelper } from "../shared/cloud-script";

interface IState {
    selectedStore: string;
}

type Props = RouteComponentProps & IWithAppStateProps & IWithPageProps;

class HomeBasePageBase extends React.Component<Props, IState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            selectedStore: null,
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
        if(!this.props.appState.hasTitleId) {
            return null;
        }
        
        if(!this.props.appState.hasPlayerId) {
            return (<Redirect to={routes.MainMenu(this.props.appState.titleId)} />);
        }

        const store = this.getStore();

        return (
            <Page
                {...this.props}
                breadcrumbs={this.getBreadcrumbs()}
                title={is.null(store)
                    ? "Welcome to Home Base"
                    : store.MarketingData.DisplayName}
                shouldShowPlayerInfo
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

                PlayFabHelper.GetUserInventory(inventory => {
                    this.props.dispatch(actionSetInventory(inventory));
                    this.checkForEquipItem(inventory, data.Items[0].ItemInstanceId);
                }, this.props.onPageError);
        }, this.props.onPageError);
    }

    private checkForEquipItem(inventory: PlayFabClientModels.GetUserInventoryResult, itemInstanceId: string): void {
        const item = inventory.Inventory.find(i => i.ItemInstanceId === itemInstanceId);

        if(is.null(item)) {
            // TODO: Should be impossible
            return;
        }

        const slot = getSlotTypeFromItemClass(item.ItemClass);

        if(is.null(slot)) {
            // No worries, it's not equippable.
            return;
        }

        // Do you have no equipment at all? If so, you're equipping this.
        if(is.null(this.props.appState.equipment)) {
            this.equipItem(item, slot);
            return;
        }

        // Do you already have something in this slot?
        if(!is.null(this.props.appState.equipment[slot])) {
            // You do! No worries.
            return;
        }

        // You don't! Equip this thing.
        this.equipItem(item, slot);
    }

    private equipItem(item: PlayFabClientModels.ItemInstance, slot: EquipmentSlotTypes): void {
        this.props.dispatch(actionSetEquipmentSingle(item, slot));

        CloudScriptHelper.equipItem([{
            itemInstanceId: item.ItemInstanceId,
            slot
        }], this.props.onPageNothing, this.props.onPageError);
    }

    private getBreadcrumbs(): IBreadcrumbRoute[] {
        const breadcrumbs: IBreadcrumbRoute[] = [{
            text: "Home Base",
            href: routes.Headquarters(this.props.appState.titleId),
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
        let stores: PlayFabClientModels.GetStoreItemsResult[] = [];

        this.props.appState.storeNames.forEach(storeId => {
            PlayFabHelper.GetStoreItems(CATALOG_VERSION, storeId, (data) => {
                stores.push(data);

                if(stores.length === this.props.appState.storeNames.length) {
                    stores = stores.sort((a, b) => {
                        if(a.MarketingData.DisplayName < b.MarketingData.DisplayName) {
                            return -1;
                        }
                        else if(a.MarketingData.DisplayName > b.MarketingData.DisplayName) {
                            return 1;
                        }
                        return 0;
                    })
                    this.props.dispatch(actionSetStores(stores));
                }
            }, this.props.onPageError)
        });
    }

    private restorePlayerHP(): void {
        CloudScriptHelper.returnToHomeBase((response) => {
            this.props.dispatch(actionSetPlayerHP(response.maxHP));
        }, this.props.onPageError);
    }
}

export const HomeBasePage = withAppState(withPage(HomeBasePageBase));
