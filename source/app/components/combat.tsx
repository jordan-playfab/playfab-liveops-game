import React from "react";
import { IWithCombatProps, withCombat, CombatStage, IEnemyAttackReport } from "../containers/with-combat";
import { ITitleDataEnemy, ITitleDataEnemyGroup } from "../shared/types";
import { IWithAppStateProps, withAppState } from "../containers/with-app-state";

interface IProps {
    planet: string;
    area: string;
    enemyGroup: ITitleDataEnemyGroup;
    enemies: ITitleDataEnemy[];
    onFinished: () => void;
}

interface IState {
    enemyAttack: IEnemyAttackReport;
}

type Props = IProps & IWithCombatProps & IWithAppStateProps;

class CombatBase extends React.PureComponent<Props, IState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            enemyAttack: null,
        };
    }

    public componentDidMount(): void {
        this.props.onCombatStart(this.props.enemies, this.props.appState.playerHP);
    }

    public componentDidUpdate(prevProps: Props): void {
        if(prevProps.combatStage !== CombatStage.Enemy && this.props.combatStage === CombatStage.Enemy) {
            this.setState({
                enemyAttack: this.props.onCombatEnemyAttack(),
            });
        }
        else {
            this.setState({
                enemyAttack: null,
            });

            // TODO: Grant items? No, report to Cloud Script about the end of the battle and get its items there.
            // Maybe the HOC does that.
        }
    }

    public render(): React.ReactNode {
        switch(this.props.combatStage) {
            case CombatStage.Introduction:
                return (
                    <React.Fragment>
                        {this.renderPlayer()}
                        <p>Welcome to combat! You face {this.props.enemies.length} enemies.</p>
                        <button onClick={this.props.onCombatAdvanceStage}>Start</button>
                    </React.Fragment>
                );
            case CombatStage.Dead:
                return (
                    <React.Fragment>
                        {this.renderPlayer()}
                        <p>You are dead. Sorry about that!</p>
                        <button onClick={this.props.onFinished}>Okay</button>
                    </React.Fragment>
                );
            case CombatStage.Victory:
                return (
                    <React.Fragment>
                        {this.renderPlayer()}
                        <p>You won. Good job!</p>
                        <button onClick={this.props.onFinished}>Continue</button>
                    </React.Fragment>
                );
            case CombatStage.Enemy:
                return (
                    <React.Fragment>
                        {this.renderPlayer()}
                        <p>The enemy {this.props.combatEnemies[this.state.enemyAttack.enemyIndex].name} hit you for {this.state.enemyAttack.damage} damage.</p>
                        <button onClick={this.props.onCombatAdvanceStage}>Continue</button>
                    </React.Fragment>
                );
            default:
                return (
                    <React.Fragment>
                        {this.renderPlayer()}
                        <p>Enemies:</p>
                        <ul>
                            {this.props.combatEnemies.map((e, index) => (
                                <li key={index}><button onClick={this.props.onCombatPlayerAttack.bind(this, index)}>{e.name} ({e.hp} HP)</button></li>
                            ))}
                        </ul>
                    </React.Fragment>
                );
        }
    }

    private renderPlayer(): React.ReactNode {
        return (
            <p>Your health: {this.props.combatPlayerHP}</p>
        );
    }
}

export const Combat = withAppState(withCombat(CombatBase));