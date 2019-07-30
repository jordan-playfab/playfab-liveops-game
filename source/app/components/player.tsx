import React from "react";
import { is } from "../shared/is";
import { VC_CREDITS } from "../shared/types";
import styled, { UlNull } from "../styles";
import { Callout, DirectionalHint } from 'office-ui-fabric-react/lib/Callout';
import { DefaultButton } from "office-ui-fabric-react";
import { IWithAppStateProps, withAppState } from "../containers/with-app-state";
import { IWithPageProps, withPage } from "../containers/with-page";
import { actionSetEquipmentSingle } from "../store/actions";
import { getSlotTypeFromItemClass } from "../store/types";
import { CloudScriptHelper } from "../shared/cloud-script";

interface IState {
    isInventoryVisible: boolean;
}

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

const ButtonInventory = styled(DefaultButton)`
    font-size: 0.8em;
    padding: 0.2em;
    min-width: none;
    height: auto;
    margin-top: 0.2em;
`;

const UlInventory = styled(UlNull)`
    margin: 1em;
    
    > li {
        margin-top: 0.25em;
        
        &:first-child {
            margin-top: 0;
        }
    }
`;

type Props = IWithAppStateProps & IWithPageProps;

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
                    <h3>{this.props.appState.playerName} ({this.props.appState.playerHP} HP)</h3>
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
        if(is.null(this.props.appState.inventory) || is.null(this.props.appState.inventory.Inventory) || is.null(this.props.appState.equipment)) {
            return (
                <DivPlayerInventory>
                    <ButtonInventory text="No inventory" />
                </DivPlayerInventory>
            );
        }

        const buttonText = this.state.isInventoryVisible
            ? "Hide inventory"
            : "Show inventory";

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

        return (
            <DivPlayerInventory ref={this.menuButtonElement}>
                <ButtonInventory text={buttonText} onClick={buttonEvent} />
                <Callout
                    onDismiss={this.hideInventory}
                    setInitialFocus
                    hidden={!this.state.isInventoryVisible}
                    target={this.menuButtonElement.current}
                    directionalHint={DirectionalHint.bottomRightEdge}
                >
                    <UlInventory>
                        {this.props.appState.inventory.Inventory.map((item, index) => (
                            <li key={index}>
                                {is.inArray(equippedItemInstanceIds, item.ItemInstanceId)
                                    ? (<React.Fragment>{item.DisplayName} (equipped)</React.Fragment>)
                                    : (<button onClick={this.equipItem.bind(this, item)}>{item.DisplayName}</button>)}
                            </li>
                        ))}
                    </UlInventory>
                </Callout>
            </DivPlayerInventory>
        );
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