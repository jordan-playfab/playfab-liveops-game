import React from "react";
import { IWithCombatProps, withCombat, CombatStage } from "../containers/with-combat";
import { ITitleDataEnemy, ITitleDataEnemyGroup } from "../shared/types";
import { IWithAppStateProps, withAppState } from "../containers/with-app-state";
import { actionSetPlayerHP } from "../store/actions";
import { is } from "../shared/is";
import { PrimaryButton, MessageBar, MessageBarType, DefaultButton } from "office-ui-fabric-react";
import { UlInline } from "../styles";

interface IProps {
    planet: string;
    area: string;
    enemyGroup: ITitleDataEnemyGroup;
    enemies: ITitleDataEnemy[];
    onCombatFinished: () => void;
    onLeaveCombat: () => void;
}

type Props = IProps & IWithCombatProps & IWithAppStateProps;

class CombatBase extends React.PureComponent<Props> {
    public componentDidMount(): void {
        const weapon = this.props.appState.catalog.find(i => i.ItemId === this.props.appState.equipment.weapon.ItemId);

        let armor: PlayFabClientModels.CatalogItem = null;
        if(!is.null(this.props.appState.equipment.armor)) {
            armor = this.props.appState.catalog.find(i => i.ItemId === this.props.appState.equipment.armor.ItemId);
        }

        this.props.onCombatStart(this.props.enemies, this.props.appState.playerHP, weapon, armor);
    }

    public componentDidUpdate(prevProps: Props): void {
        if(this.props.combatPlayerHP !== this.props.appState.playerHP) {
            this.props.dispatch(actionSetPlayerHP(this.props.combatPlayerHP));
        }

        if(prevProps.combatStage !== CombatStage.Victory && this.props.combatStage === CombatStage.Victory) {
            this.props.onCombatFinished();
        }
    }

    public render(): React.ReactNode {
        if(this.props.combatPlayerHP <= 0 && this.props.combatStage !== CombatStage.Dead) {
            return (
                <MessageBar title="Dead people cannot fight" messageBarType={MessageBarType.blocked} />
            );
        }

        switch(this.props.combatStage) {
            case CombatStage.Introduction:
                return (
                    <React.Fragment>
                        <p>There are {this.props.combatEnemies.length} {this.props.combatEnemies.length === 1 ? "enemy" : "enemies"} ahead.</p>
                        <UlInline>
                            <li><PrimaryButton text="Fight" onClick={this.props.onCombatAdvanceStage} /></li>
                            <li><DefaultButton text="Retreat" onClick={this.props.onLeaveCombat} /></li>
                        </UlInline>
                    </React.Fragment>
                );
            case CombatStage.Dead:
                return (
                    <React.Fragment>
                        <p>You are dead. It happens sometimes!</p>
                        <p>Go back to headquarters to be revived.</p>
                        <PrimaryButton onClick={this.props.onLeaveCombat} text="Okay" />
                    </React.Fragment>
                );
            case CombatStage.Victory:
                return null;
            case CombatStage.Fighting:
            default:
                return (
                    <React.Fragment>
                        {this.renderEnemyAttackReport()}
                        <UlInline>
                            {this.props.combatEnemies.map((e, index) => (
                                <li key={index}><PrimaryButton onClick={this.props.onCombatPlayerAttack.bind(this, index)} text={`Shoot ${e.name} (${e.hp} HP)`} /></li>
                            ))}
                        </UlInline>
                    </React.Fragment>
                );
        }
    }

    private renderEnemyAttackReport(): React.ReactNode {
        if(is.null(this.props.combatAttackedByIndexLastRound)) {
            return null;
        }

        return (
            <p>The enemy {this.props.combatEnemies[this.props.combatAttackedByIndexLastRound].name} hit you for {this.props.combatDamageTakenLastRound} damage.</p>
        );
    }
}

export const Combat = withAppState(withCombat(CombatBase));