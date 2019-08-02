import React from "react";
import { IDropdownOption, TextField, Dropdown } from "office-ui-fabric-react";

import { Grid } from "../grid";
import { DamageFlavor, IAttackType } from "../../shared/types";
import styled from "../../styles";
import { ButtonRemove } from "./styles";

const DivAttackEditor = styled.div`
    margin-top: ${s => s.theme.size.spacer};
`;

const DivGridWrapper = DivAttackEditor;

interface IAttackEditorOtherProps {
    index: number;
    onChange: (attack: IAttackType, index: number) => void;
    onRemove: (index: number) => void;
}

type AttackEditorProps = IAttackType & IAttackEditorOtherProps;
type AttackEditorState = IAttackType;

export class AttackEditor extends React.PureComponent<AttackEditorProps, AttackEditorState> {
    constructor(props: AttackEditorProps) {
        super(props);

        this.state = {
            ...props
        };
    }

    public render(): React.ReactNode {
        const flavorOptions = Object.keys(DamageFlavor).map(f => ({
            key: f,
            text: (DamageFlavor as any)[f],
        } as IDropdownOption));

        return (
            <DivAttackEditor>
                <TextField label="Attack name" value={this.props.name} onChange={this.onChangeName} />
                <ButtonRemove text="Remove" onClick={this.onRemove} />
                <DivGridWrapper>
                    <Grid grid4x4x4>
                        <Dropdown label="Type" selectedKey={this.props.flavor} onChange={this.onChangeFlavor} options={flavorOptions} />
                        <TextField label="Damage" value={this.props.power.toString()} onChange={this.onChangePower} />
                        <TextField label="Chance to hit" value={this.props.probability.toString()} onChange={this.onChangeProbability} />
                        <TextField label="Variance" value={this.props.variance.toString()} onChange={this.onChangeVariance} />
                        <TextField label="Critical chance" value={this.props.critical.toString()} onChange={this.onChangeCritical} />
                        <TextField label="Reload speed" value={this.props.reload.toString()} onChange={this.onChangeReload} />
                    </Grid>
                </DivGridWrapper>
            </DivAttackEditor>
        );
    }

    private onChangeName = (_: any, name: string): void => {
        this.setState({
            name,
        }, this.onChange);
    }

    private onChangeProbability = (_: any, probability: string): void => {
        this.setState({
            probability: parseFloat(probability),
        }, this.onChange);
    }

    private onChangeVariance = (_: any, variance: string): void => {
        this.setState({
            variance: parseFloat(variance),
        }, this.onChange);
    }

    private onChangeCritical = (_: any, critical: string): void => {
        this.setState({
            critical: parseFloat(critical),
        }, this.onChange);
    }

    private onChangeReload = (_: any, reload: string): void => {
        this.setState({
            reload: parseInt(reload),
        }, this.onChange);
    }

    private onChangePower = (_: any, power: string): void => {
        this.setState({
            power: parseInt(power),
        }, this.onChange);
    }

    private onChangeFlavor = (_: any, option: IDropdownOption): void => {
        this.setState({
            flavor: option.key.toString(),
        }, this.onChange);
    }

    private onChange = (): void => {
        this.props.onChange(this.state, this.props.index);
    }

    private onRemove = (): void => {
        this.props.onRemove(this.props.index);
    }
}