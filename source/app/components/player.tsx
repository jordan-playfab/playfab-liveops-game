import * as React from "react";
import { is } from "../shared/is";

interface IProps {
    player: PlayFabClientModels.LoginResult;
    inventory: PlayFabClientModels.GetUserInventoryResult;
}

export class Player extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div>
                <h3>Player</h3>
                {this.renderCredits()}
                <p>Items:</p>
                {this.renderInventory()}
            </div>
        );
    }

    private renderCredits(): React.ReactNode {
        if(is.null(this.props.inventory) || is.null(this.props.inventory.VirtualCurrency)) {
            return <p>Credits: 0</p>
        }

        const credits = this.props.inventory.VirtualCurrency["credits"] || 0;

        return (
            <p>Credits: {credits}</p>
        );
    }

    private renderInventory(): React.ReactNode {
        if(is.null(this.props.inventory) || is.null(this.props.inventory.Inventory)) {
            return (<p>None</p>);
        }

        return (
            <ul>
                {this.props.inventory.Inventory.map((i, index) => (
                    <li key={index}>{i.DisplayName}</li>
                ))}
            </ul>
        );
    }
}