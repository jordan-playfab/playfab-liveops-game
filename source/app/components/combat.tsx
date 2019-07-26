import React from "react";

interface IProps {
    playerHP: number;
    enemyGroup: string;
    onPlayerDied: () => void;
}

interface IState {
    playerHP: number;
}

type Props = IProps;

export class Combat extends React.PureComponent<Props, IState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            playerHP: props.playerHP,
        };
    }

    public render(): React.ReactNode {
        // TODO: Get enemies
        return (
            <div>
                <p>Your health: {this.state.playerHP}</p>
            </div>
        );
    }
}