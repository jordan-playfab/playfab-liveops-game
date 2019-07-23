import * as React from "react";
import { is } from "../shared/is";
import { VC_CREDITS, IStringDictionary, INumberDictionary } from "../shared/types";

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
                <h2>{this.props.store.MarketingData.DisplayName}</h2>
                {!is.null(this.props.buyResult) && (
                    <p>{this.props.buyResult}</p>
                )}
                <ul>
                    {this.props.store.Store.map((item, index) => (
                        <StoreItem
                            key={index}
                            storeItem={item}
                            catalogItem={this.props.catalogItems.find(c => c.ItemId === item.ItemId)}
                            playerWallet={this.props.playerWallet}
                            onBuy={this.props.onBuy}
                        />
                    ))}
                </ul>
            </React.Fragment>
        );
    }
}

interface IStoreItemProps {
    storeItem: PlayFabClientModels.StoreItem;
    catalogItem: PlayFabClientModels.CatalogItem;
    playerWallet: INumberDictionary;
    onBuy: (itemID: string, currency: string, price: number) => void;
}

class StoreItem extends React.Component<IStoreItemProps> {
    public render(): React.ReactNode {
        const price = this.props.storeItem.VirtualCurrencyPrices[VC_CREDITS];
        const displayName = is.null(this.props.catalogItem.DisplayName)
            ? this.props.catalogItem.ItemId
            : this.props.catalogItem.DisplayName;
        const canBuy = !is.null(this.props.playerWallet) && !is.null(this.props.playerWallet[VC_CREDITS])
            && this.props.playerWallet[VC_CREDITS] >= price;

        return (
            <li>
                <strong>{displayName}</strong>
                ({price} credits)
                {canBuy && (
                    <button onClick={this.props.onBuy.bind(this, this.props.storeItem.ItemId, VC_CREDITS, price)}>Buy</button>
                )}
            </li>
        )
    }
}