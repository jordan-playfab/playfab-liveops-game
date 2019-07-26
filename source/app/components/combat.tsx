import React from "react";
import { IWithCombatProps, withCombat } from "../containers/with-combat";

interface IProps {
    planet: string;
    area: string;
    enemyGroup: string;
}

type Props = IWithCombatProps;

class CombatBase extends React.PureComponent<Props> {
    public componentDidMount(): void {

    }

    public render(): React.ReactNode {
        // TODO: Get enemies
        return (
            <div>
                <p>Your health: {this.props.playerHP}</p>
            </div>
        );
    }
}

export const Combat = withCombat(CombatBase);