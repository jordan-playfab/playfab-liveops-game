import React from "react";
import { IDropdownOption, TextField, Dropdown } from "office-ui-fabric-react";

import { IResistanceType, DamageFlavor } from "../../shared/types";
import { Grid } from "../grid";
import { ButtonRemove } from "./styles";

interface IResistanceEditorOtherProps {
    index: number;
    onChange: (resistance: IResistanceType, index: number) => void;
    onRemove: (index: number) => void;
}

type ResistanceEditorProps = IResistanceType & IResistanceEditorOtherProps;
type ResistanceEditorState = IResistanceType;

export class ResistanceEditor extends React.PureComponent<ResistanceEditorProps, ResistanceEditorState> {
    constructor(props: ResistanceEditorProps) {
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
            <React.Fragment>
                <Grid grid6x6>
                    <TextField label="Amount" value={this.props.resistance.toString()} onChange={this.onChangeResistance} />
                    <Dropdown label="Type" selectedKey={this.props.flavor} onChange={this.onChangeFlavor} options={flavorOptions} />
                </Grid>
                <ButtonRemove text="Remove" onClick={this.onRemove} />
            </React.Fragment>
        );
    }

    private onChangeResistance = (_: any, resistance: string): void => {
        this.setState({
            resistance: resistance as any,
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