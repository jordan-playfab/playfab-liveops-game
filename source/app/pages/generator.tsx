import React from "react";
import { RouteComponentProps } from "react-router";
import { TextField } from "office-ui-fabric-react";

import { IWithAppStateProps, withAppState } from "../containers/with-app-state";
import { IWithPageProps, withPage } from "../containers/with-page";
import { Page } from "../components/page";
import { ITitleDataLevel, IEnemyData, EnemyGenusSpeciesLink, EnemySpecies, EnemyGenus } from "../shared/types";
import { Grid } from "../components/grid";
import { BackLink } from "../components/back-link";
import { routes } from "../routes";
import { DivField } from "../styles";
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
                    <TextField label="Base HP" value={this.state.hp.toString()} onChange={this.onChangeHP} />
                    <TextField label="Unique name" value={this.state.name} onChange={this.onChangeName} />
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

    private onChange = (): void => {
        this.props.onChange(this.state);
    }
}

export const GeneratorPage = withAppState(withPage(GeneratorPageBase));