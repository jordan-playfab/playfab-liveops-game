import React from "react";
import { is } from "../shared/is";
import { VC_CREDITS, INumberDictionary, ITEM_CLASS_WEAPON, IWeaponItemCustomData, ITEM_CLASS_ARMOR, IArmorItemCustomData } from "../shared/types";
import { DocumentCard, PrimaryButton, DefaultButton } from "office-ui-fabric-react";
import { BackLink } from "./back-link";
import styled from "../styles";
import { Grid } from "./grid";

const DivItemGrid = styled.div`
    margin-top: ${s => s.theme.size.spacer};
`;

const DivCardInterior = styled.div`
    padding: ${s => s.theme.size.spacer};
`;

const DlStats = styled.dl`
    dt {
        font-weight: bold;
        margin-top: ${s => s.theme.size.spacerD2};

        &:first-child {
            margin-top: 0;
        }
    }

    dd {
        margin-left: ${s => s.theme.size.spacerD2};
    }
`;

interface IStoreProps {
    titleId: string;
    storeName: string;
    store: PlayFabClientModels.GetStoreItemsResult;
    catalogItems: PlayFabClientModels.CatalogItem[];
    inventory: PlayFabClientModels.ItemInstance[];
    playerWallet: INumberDictionary;
    onBuy: (itemID: string, currency: string, price: number) => void;
    onLeaveStore: () => void;
}

export class Store extends React.PureComponent<IStoreProps> {
    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <BackLink onClick={this.props.onLeaveStore} label="Leave store" />
                <h2>{this.props.storeName}</h2>
                <DivItemGrid>
                    <Grid grid4x4x4 reduce>
                        {this.props.store.Store.map((item, index) => {
                            const catalogItem = this.props.catalogItems.find(c => c.ItemId === item.ItemId);

                            const title = is.null(catalogItem.DisplayName)
                                ? catalogItem.ItemId
                                : catalogItem.DisplayName;

                            const price = item.VirtualCurrencyPrices[VC_CREDITS];
                            const priceLabel = `${price} credits`;
                            const canBuy = !is.null(this.props.playerWallet) && !is.null(this.props.playerWallet[VC_CREDITS])
                                && this.props.playerWallet[VC_CREDITS] >= price;
                            const hasAlready = !is.null(this.props.inventory) && !is.null(this.props.inventory.find(i => i.ItemId === item.ItemId));

                            return (
                                <DocumentCard key={index}>
                                    <DivCardInterior>
                                        <h3>{title}</h3>
                                        {this.renderItemStats(catalogItem)}
                                        {hasAlready
                                            ? <DefaultButton text="Owned" disabled />
                                            : canBuy
                                                ? <PrimaryButton onClick={this.props.onBuy.bind(this, item.ItemId, VC_CREDITS, price)} text={priceLabel} />
                                                : <DefaultButton text={priceLabel} disabled />}
                                    </DivCardInterior>
                                </DocumentCard>
                            );
                        })}
                    </Grid>
                </DivItemGrid>
            </React.Fragment>
        );
    }

    private renderItemStats(catalogItem: PlayFabClientModels.CatalogItem): React.ReactNode {
        if(is.null(catalogItem.CustomData)) {
            return null;
        }

        const isWeapon = !is.null(catalogItem.ItemClass) && catalogItem.ItemClass === ITEM_CLASS_WEAPON;
        const isArmor = !is.null(catalogItem.ItemClass) && catalogItem.ItemClass === ITEM_CLASS_ARMOR;

        if(isWeapon) {
            const customData = JSON.parse(catalogItem.CustomData) as IWeaponItemCustomData;

            if(is.null(customData.damage)) {
                return null;
            }

            return (
                <DlStats>
                    <dt>Damage</dt>
                    <dd>{customData.damage}</dd>
                </DlStats>
            );
        }

        if(isArmor) {
            const customData = JSON.parse(catalogItem.CustomData) as IArmorItemCustomData;

            if(is.null(customData.block) || is.null(customData.reduce)) {
                return null;
            }

            return (
                <DlStats>
                    <dt>Block damage</dt>
                    <dd>&lt; {customData.block}</dd>
                    <dt>Reduces damage</dt>
                    <dd>{customData.reduce}%</dd>
                </DlStats>
            );
        }

        return null;
    }
}
