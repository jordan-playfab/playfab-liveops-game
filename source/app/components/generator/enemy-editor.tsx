import React from "react";
import { TextField } from "office-ui-fabric-react";

import { IEnemyData, DamageFlavor, IAttackType, IResistanceType } from "../../shared/types";
import styled, { DivField, ButtonTiny, UlAlternatingIndented } from "../../styles";
import { AttackEditor } from "./attack-editor";
import { ResistanceEditor } from "./resistance-editor";
import { Grid } from "../grid";
import { is } from "../../shared/is";

const DivEnemy = styled.div`
    margin-top: ${s => s.theme.size.spacer};
`;

const DivAddArea = DivEnemy;

const ButtonAdd = styled(ButtonTiny)`
    float: right;
`;

interface IEnemyEditorOtherProps {
    onChange: (enemy: IEnemyData) => void;
}

type EnemyEditorProps = IEnemyData & IEnemyEditorOtherProps;
type EnemyEditorState = IEnemyData;

export class EnemyEditor extends React.Component<EnemyEditorProps, EnemyEditorState> {
    constructor(props: EnemyEditorProps) {
        super(props);

        this.state = {
            ...props,
        };
    }

    public render(): React.ReactNode {
        return (
            <DivEnemy>
                <h3>{this.state.genus} {this.state.species}</h3>
                <DivField>
                    <TextField label="Unique name" value={this.props.name} onChange={this.onChangeName} />
                    <Grid grid4x4x4>
                        <TextField label="HP" value={this.props.hp.toString()} onChange={this.onChangeHP} />
                        <TextField label="XP" value={this.props.xp.toString()} onChange={this.onChangeXP} />
                        <TextField label="Speed" value={this.props.speed.toString()} onChange={this.onChangeSpeed} />
                    </Grid>
                    <DivAddArea>
                        <h4>Attacks <ButtonAdd text="Add attack" onClick={this.onAddAttack} /></h4>
                        {!is.null(this.props.attacks) && (
                            <UlAlternatingIndented>
                                {this.props.attacks.map((a, index) => (
                                    <li key={index}>
                                        <AttackEditor
                                            {...a}
                                            index={index}
                                            onChange={this.onChangeAttack}
                                            onRemove={this.onRemoveAttack}
                                        />
                                    </li>
                                ))}
                            </UlAlternatingIndented>
                        )}
                    </DivAddArea>
                    <DivAddArea>
                        <h4>Resistances <ButtonAdd text="Add resistance" onClick={this.onAddResistance} /></h4>
                        {!is.null(this.props.resistances) && (
                            <UlAlternatingIndented>
                                {this.props.resistances.map((r, index) => (
                                    <li key={index}>
                                        <ResistanceEditor
                                            {...r}
                                            index={index}
                                            onChange={this.onChangeResistance}
                                            onRemove={this.onRemoveResistance}
                                        />
                                    </li>
                                ))}
                            </UlAlternatingIndented>
                        )}
                    </DivAddArea>
                </DivField>
            </DivEnemy>
        );
    }

    private onChangeName = (_: any, name: string): void => {
        this.setState({
            name,
        }, this.onChange);
    }

    private onChangeHP = (_: any, hp: string): void => {
        this.setState({
            hp: parseInt(hp),
        }, this.onChange);
    }

    private onChangeXP = (_: any, xp: string): void => {
        this.setState({
            xp: parseInt(xp),
        }, this.onChange);
    }

    private onChangeSpeed = (_: any, speed: string): void => {
        this.setState({
            speed: parseInt(speed),
        }, this.onChange);
    }

    private onAddAttack = (): void => {
        this.setState(prevState => ({
            ...prevState,
            attacks: prevState.attacks.concat([{
                critical: 0,
                flavor: DamageFlavor.Kinetic,
                name: "",
                power: 1,
                probability: 0.5,
                reload: 250,
                variance: 1,
            } as IAttackType])
        }), this.onChange);
    }

    private onChangeAttack = (attack: IAttackType, attackIndex: number): void => {
        this.setState(prevState => ({
            ...prevState,
            attacks: prevState.attacks
                .map((a, index) => {
                    return index === attackIndex
                        ? attack
                        : a;
                })
        }), this.onChange);
    }

    private onAddResistance = (): void => {
        this.setState(prevState => ({
            ...prevState,
            resistances: prevState.resistances.concat([{
                resistance: 0.5,
                flavor: DamageFlavor.Kinetic,
            } as IResistanceType])
        }), this.onChange);
    }

    private onChangeResistance = (resistance: IResistanceType, resistanceIndex: number): void => {
        this.setState(prevState => ({
            ...prevState,
            resistances: prevState.resistances
                .map((r, index) => {
                    return index === resistanceIndex
                        ? resistance
                        : r;
                })
        }), this.onChange);
    }

    private onRemoveAttack = (index: number): void => {
        this.setState(prevState => ({
            ...prevState,
            attacks: prevState.attacks
                .filter((_, aIndex) => aIndex !== index)
        }), this.onChange);
    }

    private onRemoveResistance = (index: number): void => {
        this.setState(prevState => ({
            ...prevState,
            resistances: prevState.resistances
                .filter((_, rIndex) => rIndex !== index)
        }), this.onChange);
    }

    private onChange = (): void => {
        this.props.onChange(this.state);
    }
}