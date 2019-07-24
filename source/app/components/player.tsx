import * as React from "react";
import { is } from "../shared/is";
import { VC_CREDITS } from "../shared/types";
import styled, { UlNull } from "../styles";
import { Callout, DirectionalHint } from 'office-ui-fabric-react/lib/Callout';
import { DefaultButton } from "office-ui-fabric-react";

interface IProps {
    playerName: string;
    inventory: PlayFabClientModels.GetUserInventoryResult;
}

interface IState {
    isInventoryVisible: boolean;
}

const DivPlayerWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid ${s => s.theme.colorBorder200};
    padding: 0.5em 0;
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

export class Player extends React.Component<IProps, IState> {
    private menuButtonElement = React.createRef<HTMLDivElement>();

    constructor(props: IProps) {
        super(props);

        this.state = {
            isInventoryVisible: false,
        };
    }

    public render(): React.ReactNode {
        if(is.null(this.props.playerName)) {
            return null;
        }

        return (
            <DivPlayerWrapper>
                <DivPlayerName>
                    <h3>{this.props.playerName}</h3>
                </DivPlayerName>
                {this.renderCredits()}
                {this.renderInventory()}
            </DivPlayerWrapper>
        );
    }

    private renderCredits(): React.ReactNode {
        let credits = 0;

        if(!is.null(this.props.inventory) && !is.null(this.props.inventory.VirtualCurrency)) {
            credits = this.props.inventory.VirtualCurrency[VC_CREDITS] || 0;
        }

        return (
            <div>Credits: <strong>{credits}</strong></div>
        );
    }

    private renderInventory(): React.ReactNode {
        if(is.null(this.props.inventory) || is.null(this.props.inventory.Inventory)) {
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
                        {this.props.inventory.Inventory.map((i, index) => (
                            <li key={index}>{i.DisplayName}</li>
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
}