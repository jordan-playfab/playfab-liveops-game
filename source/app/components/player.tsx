import React from "react";
import { DefaultButton, Dialog, DialogType, PrimaryButton } from "office-ui-fabric-react";

import { is } from "../shared/is";
import { VC_CREDITS, ITEM_CLASS_WEAPON, ITEM_CLASS_ARMOR } from "../shared/types";
import styled, { UlNull, ButtonTiny, DialogWidthSmall } from "../styles";
import { IWithAppStateProps, withAppState } from "../containers/with-app-state";
import { IWithPageProps, withPage } from "../containers/with-page";
import { actionSetEquipmentSingle, actionSetPlayerId } from "../store/actions";
import { getSlotTypeFromItemClass } from "../store/types";
import { CloudScriptHelper } from "../shared/cloud-script";
import { utilities } from "../shared/utilities";
import { Grid } from "./grid";

const DivPlayerWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    padding: 0 ${s => s.theme.size.spacer};
`;

const DivPlayerName = styled.div`
    flex-grow: 1;
`;

const DivPlayerInventory = styled.div`
    padding: 0 0.5em;
    flex-basis: 10em;
    text-align: right;
`;

const ButtonInventory = styled(ButtonTiny)`
    margin-top: ${s => s.theme.size.spacerD4};
`;

const UlInventory = styled(UlNull)`
    margin: ${s => s.theme.size.spacer} 0;
    
    > li {
        margin-top: ${s => s.theme.size.spacerD2};
        
        &:first-child {
            margin-top: 0;
        }
    }
`;

const ButtonUneqipped = styled(DefaultButton)`
    padding: ${s => s.theme.size.spacerD2} ${s => s.theme.size.spacer};
    min-width: none;
    height: auto;
`;

const ButtonEqipped = styled(PrimaryButton)`
    padding: ${s => s.theme.size.spacerD2} ${s => s.theme.size.spacer};
    min-width: none;
    height: auto;
`;

const ButtonLogOut = styled(ButtonTiny)`
    margin-top: ${s => s.theme.size.spacerD4};
`;

interface IProps {
    logOut: () => void;
}

interface IState {
    isInventoryVisible: boolean;
}

type Props = IWithAppStateProps & IWithPageProps & IProps;

class PlayerBase extends React.Component<Props, IState> {
    private menuButtonElement = React.createRef<HTMLDivElement>();

    constructor(props: Props) {
        super(props);

        this.state = {
            isInventoryVisible: false,
        };
    }

    public render(): React.ReactNode {
        if(is.null(this.props.appState.playerName)) {
            return null;
        }

        return (
            <DivPlayerWrapper>
                <DivPlayerName>
                    <h3>
                        <a href={utilities.createPlayFabLink(this.props.appState.titleId, `players/${this.props.appState.playerId}/overview`, false)} target="_blank">{this.props.appState.playerName}</a> ({this.props.appState.playerHP} HP)
                        <ButtonLogOut text="Log out" onClick={this.props.logOut} />
                    </h3>
                </DivPlayerName>
                {this.renderCredits()}
                {this.renderInventory()}
            </DivPlayerWrapper>
        );
    }

    private renderCredits(): React.ReactNode {
        let credits = 0;

        if(!is.null(this.props.appState.inventory) && !is.null(this.props.appState.inventory.VirtualCurrency)) {
            credits = this.props.appState.inventory.VirtualCurrency[VC_CREDITS] || 0;
        }

        return (
            <div>Credits: <strong>{credits}</strong> &middot; Level: <strong>{this.props.appState.playerLevel}</strong> &middot; XP: {this.props.appState.playerXP}</div>
        );
    }

    private renderInventory(): React.ReactNode {
        if(is.null(this.props.appState.inventory) || is.null(this.props.appState.inventory.Inventory)) {
            return null;
        }

        const buttonText = this.props.appState.inventory.Inventory.length === 1
            ? `1 item`
            : `${this.props.appState.inventory.Inventory.length} items`;

        const buttonEvent = this.state.isInventoryVisible
            ? this.hideInventory
            : this.showInventory;

        const equippedItemInstanceIds = is.null(this.props.appState.equipment)
                ? []
                : Object.keys(this.props.appState.equipment).map(key => {
                        // Ensure the instance ID actually exists
                        const equipmentItem = this.props.appState.equipment[key];

                        if(is.null(equipmentItem)) {
                            return "";
                        }
                        
                        return this.props.appState.equipment[key].ItemInstanceId;
                });

        const weapons = this.props.appState.inventory.Inventory.filter(i => !is.null(i.ItemClass) && i.ItemClass.indexOf(ITEM_CLASS_WEAPON) !== -1);
        const armor = this.props.appState.inventory.Inventory.filter(i => !is.null(i.ItemClass) && i.ItemClass.indexOf(ITEM_CLASS_ARMOR) !== -1);

        return (
            <DivPlayerInventory ref={this.menuButtonElement}>
                <ButtonInventory text={buttonText} onClick={buttonEvent} />
                <DialogWidthSmall
                    hidden={!this.state.isInventoryVisible}
                    onDismiss={this.hideInventory}
                    dialogContentProps={{
                        type: DialogType.largeHeader,
                        title: "Equipment"
                    }}
                >
                    <Grid grid6x6>
                        <React.Fragment>
                            <h3>Weapons</h3>
                            {this.renderItems(weapons, equippedItemInstanceIds)}
                        </React.Fragment>
                        <React.Fragment>
                            <h3>Armor</h3>
                            {this.renderItems(armor, equippedItemInstanceIds)}
                        </React.Fragment>
                    </Grid>
                </DialogWidthSmall>
            </DivPlayerInventory>
        );
    }

    private renderItems(items: PlayFabClientModels.ItemInstance[], equippedItemInstanceIds: string[]): React.ReactNode {
        if(is.null(items)) {
            return (
                <UlInventory>
                    <li>None</li>
                </UlInventory>
            )
        }

        return (
            <UlInventory>
                {items.map((item, index) => (
                    <li key={index}>
                        {is.inArray(equippedItemInstanceIds, item.ItemInstanceId)
                            ? (<ButtonEqipped text={item.DisplayName} disabled />)
                            : (<ButtonUneqipped onClick={this.equipItem.bind(this, item)} text={item.DisplayName} />)}
                    </li>
                ))}
            </UlInventory>
        )
    }

    private showInventory = (): void => {
        this.setState({
            isInventoryVisible: true,
        })
    }

    private hideInventory = (): void => {
        this.setState({
            isInventoryVisible: false,
        })
    }

    private equipItem = (item: PlayFabClientModels.ItemInstance): void => {
        if(is.null(item)) {
            // This shouldn't be possible
            return;
        }

        const slot = getSlotTypeFromItemClass(item.ItemClass);
        this.props.dispatch(actionSetEquipmentSingle(item, slot));

        CloudScriptHelper.equipItem([{
            itemInstanceId: item.ItemInstanceId,
            slot
        }], this.props.onPageNothing, this.props.onPageError);
    }
}

export const Player = withAppState(withPage(PlayerBase));