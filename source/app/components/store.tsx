import * as React from "react";
import { is } from "../shared/is";
import { VC_CREDITS } from "../shared/types";

interface IProps {
    store: PlayFabClientModels.GetStoreItemsResult;
    buyResult: string;
    onBuy: (itemID: string, currency: string, price: number) => void;
}

export class Store extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <h2>{this.props.store.MarketingData.DisplayName}</h2>
                {!is.null(this.props.buyResult) && (
                    <p>{this.props.buyResult}</p>
                )}
                <ul>
                    {this.props.store.Store.map((item, index) => (
                        <li key={index}>
                            <strong>{item.ItemId}</strong>
                            ({item.VirtualCurrencyPrices[VC_CREDITS]} credits)
                            <button onClick={this.props.onBuy.bind(this, item.ItemId, VC_CREDITS, item.VirtualCurrencyPrices[VC_CREDITS])}>Buy</button>
                        </li>
                    ))}
                </ul>
            </React.Fragment>
        )
    }
}