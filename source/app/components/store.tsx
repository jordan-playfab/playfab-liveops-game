import * as React from "react";
import { is } from "../shared/is";
import { VC_CREDITS, INumberDictionary } from "../shared/types";
import { UlInline } from "../styles";
import { DefaultButton, DetailsList, IColumn } from "office-ui-fabric-react";

interface IStoreProps {
    store: PlayFabClientModels.GetStoreItemsResult;
    buyResult: string;
    catalogItems: PlayFabClientModels.CatalogItem[];
    playerWallet: INumberDictionary;
    onBuy: (itemID: string, currency: string, price: number) => void;
}

export class Store extends React.Component<IStoreProps> {
    public render(): React.ReactNode {
        return (
            <React.Fragment>
                {!is.null(this.props.buyResult) && (
                    <p>{this.props.buyResult}</p>
                )}
                <UlInline>
                    <DetailsList
                        items={this.props.store.Store}
                        columns={this.getColumns()}
                        disableSelectionZone
                    />
                </UlInline>
            </React.Fragment>
        );
    }

    private getColumns(): IColumn[] {
        return [
            {
                key: "name",
                name: "Name",
                minWidth: 100,
                onRender: (item: PlayFabClientModels.StoreItem) => {
                    const catalogItem = this.props.catalogItems.find(c => c.ItemId === item.ItemId);

                    return is.null(catalogItem.DisplayName)
                        ? catalogItem.ItemId
                        : catalogItem.DisplayName;
                }
            },
            {
                key: "credits",
                name: "Credits",
                minWidth: 100,
                onRender: (item: PlayFabClientModels.StoreItem) => {
                    return item.VirtualCurrencyPrices[VC_CREDITS];
                }
            },
            {
                key: "actions",
                name: "Actions",
                minWidth: 100,
                onRender: (item: PlayFabClientModels.StoreItem) => {
                    const price = item.VirtualCurrencyPrices[VC_CREDITS];
                    const canBuy = !is.null(this.props.playerWallet) && !is.null(this.props.playerWallet[VC_CREDITS])
                        && this.props.playerWallet[VC_CREDITS] >= price;

                    return canBuy
                        ? <DefaultButton text="Buy" onClick={this.props.onBuy.bind(this, item.ItemId, VC_CREDITS, price)} />
                        : null;
                }
            },
        ];
    }
}
