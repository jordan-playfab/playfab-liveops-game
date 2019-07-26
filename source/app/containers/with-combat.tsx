import React from "react";
import { ITitleDataEnemy } from "../shared/types";
import { mathHelper } from "../shared/math-helper";

export interface IWithCombatProps {
    readonly playerHP: number;
    readonly enemies: ITitleDataEnemy[];
    readonly stage: CombatStage;

    readonly start: (enemies: ITitleDataEnemy[], playerHP: number) => void;
    readonly onPlayerAttack: (enemyIndex: number) => void;
    readonly onEnemyAttack: () => void;
}

interface IState {
    playerHP: number;
    enemies: ITitleDataEnemy[];
    stage: CombatStage;
}

export enum CombatStage {
    Introduction,
    Player,
    Enemy,
    Dead,
    Victory
}

export const withCombat = <P extends IWithCombatProps>(Component: React.ComponentType<P>) => {
    return class WithCombat extends React.Component<Omit<P, keyof IWithCombatProps>, IState> {
        public state: IState = {
            enemies: [],
            playerHP: 0,
            stage: CombatStage.Introduction,
        };
        
        // TODO: Get from weapon later
        private readonly playerDamage = 10;

        public render(): React.ReactNode {
            return (
                <Component
                    {...this.props as P}
                    enemies={this.state.enemies}
                    playerHP={this.state.playerHP}
                    stage={this.state.stage}
                    start={this.start}
                    onPlayerAttack={this.onPlayerAttack}
                    onEnemyAttack={this.onEnemyAttack}
                />
            );
        }

        private start = (enemies: ITitleDataEnemy[], playerHP: number): void => {
            this.setState({
                enemies,
                playerHP,
                stage: CombatStage.Introduction,
            });
        }

        private onEnemyAttack = (): void => {
            this.setState(prevState => {
                // Pick someone to attack
                const attackingEnemyIndex = mathHelper.getRandomInt(0, prevState.enemies.length - 1);
                const damage = prevState.enemies[attackingEnemyIndex].damage;
                const playerHP = prevState.playerHP - damage;

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
                        playerHP: 0
                    };
                }
            })
        }

        private onPlayerAttack = (enemyIndex: number): void => {
            this.setState(prevState => {
                if(enemyIndex < 0 || enemyIndex > prevState.enemies.length - 1) {
                    return prevState;
                }

                const enemyHP = prevState.enemies[enemyIndex].hp - this.playerDamage;
                
                if(enemyHP <= 0) {
                    // Is this the last enemy?
                    if(prevState.enemies.length === 1) {
                        return {
                            ...prevState,
                            enemies: [],
                            stage: CombatStage.Victory,
                        }
                    }

                    return {
                        ...prevState,
                        enemies: prevState.enemies.filter((e, index) => index !== enemyIndex),
                    };
                }
                else {
                    return {
                        ...prevState,
                        enemies: prevState.enemies.map((e, index) => {
                            if(index === enemyIndex) {
                                return {
                                    ...e,
                                    hp: enemyHP,
                                };
                            }
                            
                            return e;
                        })
                    }
                }
            })
        }
    }
}