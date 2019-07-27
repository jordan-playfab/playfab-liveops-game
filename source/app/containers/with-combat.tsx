import React from "react";
import { ITitleDataEnemy, IWeaponItemCustomData } from "../shared/types";
import { utilities } from "../shared/utilities";
import { is } from "../shared/is";

export interface IWithCombatProps {
    readonly combatPlayerHP: number;
    readonly combatEnemies: ITitleDataEnemy[];
    readonly combatStage: CombatStage;
    readonly combatDamageTakenLastRound: number;
    readonly combatAttackedByIndexLastRound: number;

    readonly onCombatStart: (enemies: ITitleDataEnemy[], playerHP: number, weapon: PlayFabClientModels.CatalogItem) => void;
    readonly onCombatPlayerAttack: (enemyIndex: number) => void;
    readonly onCombatEnemyAttack: () => IEnemyAttackReport;
    readonly onCombatAdvanceStage: () => void;
}

interface IState {
    playerHP: number;
    enemies: ITitleDataEnemy[];
    stage: CombatStage;
    damageTakenLastRound: number;
    attackedByEnemyIndexLastRound: number;
    playerWeapon: PlayFabClientModels.CatalogItem;
    playerDamage: number;
}

export enum CombatStage {
    Introduction,
    Fighting,
    Dead,
    Victory
}

export interface IEnemyAttackReport {
    enemyIndex: number;
    damage: number;
}

export const withCombat = <P extends IWithCombatProps>(Component: React.ComponentType<P>) => {
    return class WithCombat extends React.Component<Omit<P, keyof IWithCombatProps>, IState> {
        public state: IState = {
            enemies: [],
            playerHP: 0,
            damageTakenLastRound: null,
            attackedByEnemyIndexLastRound: null,
            stage: CombatStage.Introduction,
            playerWeapon: null,
            playerDamage: 0,
        };

        public render(): React.ReactNode {
            return (
                <Component
                    {...this.props as P}
                    combatEnemies={this.state.enemies}
                    combatPlayerHP={this.state.playerHP}
                    combatStage={this.state.stage}
                    onCombatStart={this.start}
                    onCombatPlayerAttack={this.onPlayerAttack}
                    onCombatEnemyAttack={this.onEnemyAttack}
                    onCombatAdvanceStage={this.onAdvanceStage}
                    combatAttackedByIndexLastRound={this.state.attackedByEnemyIndexLastRound}
                    combatDamageTakenLastRound={this.state.damageTakenLastRound}
                />
            );
        }

        private start = (enemies: ITitleDataEnemy[], playerHP: number, weapon: PlayFabClientModels.CatalogItem): void => {
            this.setState({
                enemies,
                playerHP,
                stage: CombatStage.Introduction,
                playerWeapon: weapon,
                playerDamage: this.getPlayerDamage(weapon)
            });
        }

        private onEnemyAttack = (): void => {
            // Pick someone to attack
            const attackingEnemyIndex = utilities.getRandomInteger(0, this.state.enemies.length - 1);
            const damage = utilities.getRandomInteger(0, this.state.enemies[attackingEnemyIndex].damage); // TODO: Weigh against player stats
            const playerHP = this.state.playerHP - damage;

            this.setState(prevState => {
                if(playerHP <= 0) {
                    return {
                        ...prevState,
                        playerHP: 0,
                        stage: CombatStage.Dead
                    };
                }
                else {
                    return {
                        ...prevState,
                        attackedByEnemyIndexLastRound: attackingEnemyIndex,
                        damageTakenLastRound: damage,
                        playerHP
                    };
                }
            });
        }

        private onPlayerAttack = (enemyIndex: number): void => {
            this.setState(prevState => {
                if(enemyIndex < 0 || enemyIndex > prevState.enemies.length - 1) {
                    return prevState;
                }

                const enemyHP = prevState.enemies[enemyIndex].hp - this.state.playerDamage;
                
                if(enemyHP <= 0) {
                    // You killed an enemy
                    if(prevState.enemies.length === 1) {
                        // You killed the last enemy and it's victory time
                        return {
                            ...prevState,
                            enemies: [],
                            stage: CombatStage.Victory,
                        }
                    }

                    // More enemies remain
                    return {
                        ...prevState,
                        attackedByEnemyIndexLastRound: null,
                        damageTakenLastRound: null,
                        enemies: prevState.enemies.filter((_, index) => index !== enemyIndex),
                    };
                }
                else {
                    // You didn't kill all the enemies
                    return {
                        ...prevState,
                        attackedByEnemyIndexLastRound: null,
                        damageTakenLastRound: null,
                        enemies: prevState.enemies.map((e, index) => {
                            if(index !== enemyIndex) {
                                return e;
                            }

                            return {
                                ...e,
                                hp: enemyHP,
                            };
                        })
                    }
                }
            }, () => {
                // If the battle's not over, the enemy gets to attack
                if(this.state.stage === CombatStage.Fighting) {
                    this.onEnemyAttack();
                }
            });
        }

        private onAdvanceStage = (): void => {
            this.setState((prevState) => {
                let stage = prevState.stage;

                switch(this.state.stage) {
                    case CombatStage.Introduction:
                        stage = CombatStage.Fighting;
                        break;
                }

                return {
                    ...prevState,
                    stage,
                }
            });
        }

        private getPlayerDamage(weapon: PlayFabClientModels.CatalogItem): number {
            if(is.null(weapon)) {
                // Should not be possible!
                return 1;
            }

            const data = JSON.parse(weapon.CustomData) as IWeaponItemCustomData;

            if(is.null(data) || is.null(data.damage)) {
                // TODO: Alert?
                return 1;
            }

            return data.damage;
        }
    }
}