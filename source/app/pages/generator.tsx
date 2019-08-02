import React from "react";
import { RouteComponentProps } from "react-router";
import { TextField, Dropdown, IDropdownOption } from "office-ui-fabric-react";

import { IWithAppStateProps, withAppState } from "../containers/with-app-state";
import { IWithPageProps, withPage } from "../containers/with-page";
import { Page } from "../components/page";
import { ITitleDataLevel, IEnemyData, EnemyGenusSpeciesLink, EnemySpecies, EnemyGenus, IAttackType, DamageFlavor, IResistanceType } from "../shared/types";
import { Grid } from "../components/grid";
import { BackLink } from "../components/back-link";
import { routes } from "../routes";
import { DivField, ButtonTiny } from "../styles";
import { is } from "../shared/is";

interface IState {
    levels: {
        max: number;
        xpToLevel1: number;
        xpToLevelMax: number;
        xpPerLevelMultiplier: number;
        hpPerLevelMultiplier: number;
    },
    enemies: IEnemyData[],
}

type Props = RouteComponentProps & IWithAppStateProps & IWithPageProps;

class GeneratorPageBase extends React.Component<Props, IState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            levels: {
                max: 50,
                xpToLevel1: 100,
                xpToLevelMax: 10000,
                xpPerLevelMultiplier: 1.15,
                hpPerLevelMultiplier: 5.75,
            },
            enemies: [],
        };
    }

    public render(): React.ReactNode {
        return (
            <Page
                {...this.props}
                title="Generator"
            >
                <BackLink to={routes.MainMenu(this.props.appState.titleId)} label="Back to main menu" />
                {this.renderLevelCurve()}
                {this.renderEnemies()}
            </Page>
        );
    }

    // ----- Levels ----- //

    private renderLevelCurve(): React.ReactNode {
        const xpPerLevel: ITitleDataLevel[] = [];

        for(let i = 0; i < this.state.levels.max; i++) {
            let xp = this.calculateLevelCurve(i);

            if(i > 0) {
                xp += (xpPerLevel[i - 1].xp * this.state.levels.xpPerLevelMultiplier);
            }

            xpPerLevel.push({
                level: i + 1,
                xp: Math.floor(xp),
                hpGranted: Math.floor(i * this.state.levels.hpPerLevelMultiplier),
                itemGranted: null,
            });
        }
        
        return (
            <React.Fragment>
                <h2>Level generator</h2>
                <Grid grid6x6>
                    <React.Fragment>
                        <Grid grid6x6>
                            <TextField label="Maximum level" value={this.state.levels.max.toString()} onChange={this.onChangeLevelMax} />
                            <TextField label="XP to level 1" value={this.state.levels.xpToLevel1.toString()} onChange={this.onChangeLevelXPToLevel1} />
                            <TextField label="XP to level max" value={this.state.levels.xpToLevelMax.toString()} onChange={this.onChangeLevelXPToLevelMax} />
                            <TextField label="XP per level modifier" value={this.state.levels.xpPerLevelMultiplier.toString()} onChange={this.onChangeLevelXPPerLevelMultiplier} />
                            <TextField label="HP per level modifier" value={this.state.levels.hpPerLevelMultiplier.toString()} onChange={this.onChangeLevelHPPerLevelMultiplier} />
                        </Grid>
                    </React.Fragment>
                    <DivField>
                        <TextField
                            multiline
                            rows={20}
                            label="Level title data"
                            value={JSON.stringify(xpPerLevel, null, 4)}
                        />
                    </DivField>
                </Grid>
            </React.Fragment>
        );
    }

    private onChangeLevelMax = (_: any, newValue: string): void => {
        this.onChangeLevelVariable("max", parseInt(newValue));
    }

    private onChangeLevelXPToLevel1 = (_: any, newValue: string): void => {
        this.onChangeLevelVariable("xpToLevel1", parseInt(newValue));
    }

    private onChangeLevelXPToLevelMax = (_: any, newValue: string): void => {
        this.onChangeLevelVariable("xpToLevelMax", parseInt(newValue));
    }

    private onChangeLevelXPPerLevelMultiplier = (_: any, newValue: string): void => {
        this.onChangeLevelVariable("xpPerLevelMultiplier", parseFloat(newValue));
    }

    private onChangeLevelHPPerLevelMultiplier = (_: any, newValue: string): void => {
        this.onChangeLevelVariable("hpPerLevelMultiplier", parseFloat(newValue));
    }

    private onChangeLevelVariable(name: string, variable: number): void {
        // TODO: Make a better experience for entering floating point numbers
        if(!is.numeric(variable)) {
            return;
        }

        this.setState(prevState => ({
            ...prevState,
            levels: {
                ...prevState.levels,
                [name]: variable,
            }
        }));
    }

    private calculateLevelCurve(position: number): number {
        const minp = 0;
        const maxp = this.state.levels.max - 1;
        
        // The result should be between 100 an 10000000
        const minv = Math.log(this.state.levels.xpToLevel1);
        const maxv = Math.log(this.state.levels.xpToLevelMax);
        
        // calculate adjustment factor
        const scale = (maxv-minv) / (maxp-minp);
        
        return Math.exp(minv + scale*(position-minp));
    }

    // ----- Enemies ----- //

    private renderEnemies(): React.ReactNode {
        return (
            <React.Fragment>
                <h2>Enemies</h2>
                <Grid grid6x6>
                    <React.Fragment>
                        {Object.keys(EnemyGenusSpeciesLink).map((genus, genusIndex) => {
                            const enemySpecies = EnemyGenusSpeciesLink[genus];

                            return (
                                <React.Fragment key={genusIndex}>
                                    {enemySpecies.map((species, speciesIndex) => this.renderEnemySpecies(genus, species, speciesIndex))}
                                </React.Fragment>
                            );
                        })}
                    </React.Fragment>
                    <DivField>
                        <TextField
                            multiline
                            rows={20}
                            label="Enemy title data"
                            value={JSON.stringify(this.state.enemies, null, 4)}
                            onChange={this.setEnemyData}
                        />
                    </DivField>
                </Grid>
            </React.Fragment>
        );
    }

    private setEnemyData = (_: any, newData: string): void => {
        this.setState({
            enemies: JSON.parse(newData),
        });
    }

    private renderEnemySpecies(genus: string, speciesName: string, index: number): React.ReactNode {
        let species = this.state.enemies.find(e => e.species === speciesName);

        if(is.null(species)) {
            species = {
                attacks: [],
                genus,
                hp: 1,
                name: "",
                resistances: [],
                species: speciesName,
                speed: 1,
                xp: 1,
            };
        }

        return (
            <EnemyEditor
                {...species}
                key={index}
                onChange={this.onChangeEnemyData}
            />
        );
    }

    private onChangeEnemyData = (enemy: IEnemyData): void => {
        this.setState(prevState => ({
            ...prevState,
            enemies: prevState.enemies
                .filter(e => e.species !== enemy.species)
                .concat([enemy])
        }));
    }
}

interface IEnemyEditorOtherProps {
    onChange: (enemy: IEnemyData) => void;
}

type EnemyEditorProps = IEnemyData & IEnemyEditorOtherProps;
type EnemyEditorState = IEnemyData;

class EnemyEditor extends React.Component<EnemyEditorProps, EnemyEditorState> {
    constructor(props: EnemyEditorProps) {
        super(props);

        this.state = {
            ...props,
        };
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <h3>{this.state.genus} {this.state.species}</h3>
                <DivField>
                    <TextField label="HP" value={this.props.hp.toString()} onChange={this.onChangeHP} />
                    <TextField label="XP" value={this.props.xp.toString()} onChange={this.onChangeXP} />
                    <TextField label="Unique name" value={this.props.name} onChange={this.onChangeName} />
                    <TextField label="Speed" value={this.props.speed.toString()} onChange={this.onChangeSpeed} />
                    <h4>Attacks <ButtonTiny text="Add attack" onClick={this.onAddAttack} /></h4>
                    {this.props.attacks.map((a, index) => (
                        <AttackEditor
                            {...a}
                            key={index}
                            index={index}
                            onChange={this.onChangeAttack}
                        />
                    ))}
                    <h4>Resistances <ButtonTiny text="Add resistance" onClick={this.onAddResistance} /></h4>
                    {this.props.resistances.map((r, index) => (
                        <ResistanceEditor
                            {...r}
                            key={index}
                            index={index}
                            onChange={this.onChangeResistance}
                        />
                    ))}
                </DivField>
            </React.Fragment>
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

    private onChange = (): void => {
        this.props.onChange(this.state);
    }
}

interface IAttackEditorOtherProps {
    index: number;
    onChange: (attack: IAttackType, index: number) => void;
}

type AttackEditorProps = IAttackType & IAttackEditorOtherProps;
type AttackEditorState = IAttackType;

class AttackEditor extends React.PureComponent<AttackEditorProps, AttackEditorState> {
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
            <React.Fragment>
                <Grid grid4x4x4>
                    <TextField label="Name" value={this.props.name} onChange={this.onChangeName} />
                    <Dropdown label="Type" selectedKey={this.props.flavor} onChange={this.onChangeFlavor} options={flavorOptions} />
                    <TextField label="Damage" value={this.props.power.toString()} onChange={this.onChangePower} />
                    <TextField label="Chance to hit" value={this.props.probability.toString()} onChange={this.onChangeProbability} />
                    <TextField label="Variance" value={this.props.variance.toString()} onChange={this.onChangeVariance} />
                    <TextField label="Critical chance" value={this.props.critical.toString()} onChange={this.onChangeCritical} />
                    <TextField label="Reload speed" value={this.props.reload.toString()} onChange={this.onChangeReload} />
                </Grid>
            </React.Fragment>
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
}

interface IResistanceEditorOtherProps {
    index: number;
    onChange: (resistance: IResistanceType, index: number) => void;
}

type ResistanceEditorProps = IResistanceType & IResistanceEditorOtherProps;
type ResistanceEditorState = IResistanceType;

class ResistanceEditor extends React.PureComponent<ResistanceEditorProps, ResistanceEditorState> {
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
            </React.Fragment>
        );
    }

    private onChangeResistance = (_: any, resistance: string): void => {
        this.setState({
            resistance: parseFloat(resistance),
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
}

export const GeneratorPage = withAppState(withPage(GeneratorPageBase));