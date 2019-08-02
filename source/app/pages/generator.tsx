import React from "react";
import { RouteComponentProps } from "react-router";
import { TextField } from "office-ui-fabric-react";

import { IWithAppStateProps, withAppState } from "../containers/with-app-state";
import { IWithPageProps, withPage } from "../containers/with-page";
import { Page } from "../components/page";
import { IEnemyData, EnemyGenusSpeciesLink } from "../shared/types";
import { Grid } from "../components/grid";
import { BackLink } from "../components/back-link";
import { routes } from "../routes";
import { DivField } from "../styles";
import { is } from "../shared/is";
import { IGeneratorLevelProps, LevelEditor } from "../components/generator/level-editor";
import { EnemyEditor } from "../components/generator/enemy-editor";

interface IState {
    levels: IGeneratorLevelProps;
    enemies: IEnemyData[];
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
                <LevelEditor
                    {...this.state.levels}
                    onChange={this.onChangeLevelData}
                />
                {this.renderEnemies()}
            </Page>
        );
    }

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

    private onChangeLevelData = (data: IGeneratorLevelProps): void => {
        this.setState({
            levels: data,
        });
    }
}

export const GeneratorPage = withAppState(withPage(GeneratorPageBase));