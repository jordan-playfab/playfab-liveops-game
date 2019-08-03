import React from "react";
import { RouteComponentProps } from "react-router";
import { IDropdownOption, Dropdown, PrimaryButton, DialogType, DialogFooter, TextField, DefaultButton } from "office-ui-fabric-react";

import { IWithAppStateProps, withAppState } from "../containers/with-app-state";
import { IWithPageProps, withPage } from "../containers/with-page";
import { Page } from "../components/page";
import { IEnemyData, EnemyGenusSpeciesLink, EnemyGenus } from "../shared/types";
import { Grid } from "../components/grid";
import { BackLink } from "../components/back-link";
import { routes } from "../routes";
import styled, { UlNull, ButtonTiny, DialogWidthSmall } from "../styles";
import { IGeneratorLevelProps, LevelEditor } from "../components/generator/level-editor";
import { EnemyEditor } from "../components/generator/enemy-editor";
import { Enemy } from "../components/enemy";

const DivCreateEnemyWrapper = styled.div`
    display: flex;
    height: 100%;
    align-items: flex-end;
`;

const DivGetTitleData = styled.div`
    margin-top: ${s => s.theme.size.spacer};
`;

interface IState {
    levels: IGeneratorLevelProps;

    enemies: IEnemyData[];
    enemyGenus: string;
    enemySpecies: string;
    shouldShowEnemyPopup: boolean;
    enemyEditIndex: number;
    enemyDataParsed: string;
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
            enemyGenus: EnemyGenus.Ultracruiser,
            enemySpecies: EnemyGenusSpeciesLink[EnemyGenus.Ultracruiser][0],
            shouldShowEnemyPopup: false,
            enemyEditIndex: 0,
            enemyDataParsed: "",
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
        const genusOptions = Object.keys(EnemyGenus).map(f => ({
            key: (EnemyGenus as any)[f],
            text: (EnemyGenus as any)[f],
        } as IDropdownOption));

        const speciesOptions = EnemyGenusSpeciesLink[this.state.enemyGenus].map(species => ({
            key: species,
            text: species,
        } as IDropdownOption));

        const dialogTitle = this.state.enemies.length - 1 < this.state.enemyEditIndex
            ? null
            : `${this.state.enemies[this.state.enemyEditIndex].genus} ${this.state.enemies[this.state.enemyEditIndex].species}`;

        return (
            <React.Fragment>
                <h2>Enemies</h2>
                <Grid grid6x6>
                    <React.Fragment>
                        <Grid grid4x4x4>
                            <Dropdown label="Genus" selectedKey={this.state.enemyGenus} onChange={this.onChangeEnemyGenus} options={genusOptions} />
                            <Dropdown label="Species" selectedKey={this.state.enemySpecies} onChange={this.onChangeEnemySpecies} options={speciesOptions} />
                            <DivCreateEnemyWrapper>
                                <PrimaryButton text="Create enemy" onClick={this.addEnemySpecies} />
                            </DivCreateEnemyWrapper>
                        </Grid>
                        <UlNull>
                            {this.state.enemies.map((enemy, index) => (
                                <li key={index}>
                                    <Enemy
                                        {...enemy}
                                    />
                                    <ButtonTiny text="Edit" onClick={this.editEnemyData.bind(this, index)} />
                                </li>
                            ))}
                        </UlNull>
                    </React.Fragment>
                    <React.Fragment>
                        <TextField
                            multiline
                            rows={20}
                            label="Enemy title data"
                            value={this.state.enemyDataParsed}
                            onChange={this.setEnemyData}
                        />
                        <DivGetTitleData>
                            <DefaultButton text="Get title data" onClick={this.getEnemyData} />
                        </DivGetTitleData>
                    </React.Fragment>
                </Grid>
                <DialogWidthSmall
                    hidden={!this.state.shouldShowEnemyPopup}
                    onDismiss={this.closeEnemyData}
                    dialogContentProps={{
                        type: DialogType.largeHeader,
                        title: dialogTitle,
                      }}
                >
                    <EnemyEditor
                        {...this.state.enemies[this.state.enemyEditIndex]}
                        index={this.state.enemyEditIndex}
                        onChange={this.onChangeEnemyData}
                        shouldHideTitle
                    />
                    <DialogFooter>
                        <PrimaryButton onClick={this.closeEnemyData} text="Done" />
                    </DialogFooter>
                </DialogWidthSmall>
                
            </React.Fragment>
        );
    }

    private onChangeLevelData = (data: IGeneratorLevelProps): void => {
        this.setState({
            levels: data,
        });
    }

    private onChangeEnemyGenus = (_: any, option: IDropdownOption): void => {
        this.setState({
            enemyGenus: option.key.toString(),
            enemySpecies: EnemyGenusSpeciesLink[option.key.toString()][0]
        });
    }

    private onChangeEnemySpecies = (_: any, option: IDropdownOption): void => {
        this.setState({
            enemySpecies: option.key.toString(),
        });
    }

    private editEnemyData = (index: number): void => {
        this.setState({
            shouldShowEnemyPopup: true,
            enemyEditIndex: index,
        });
    }

    private closeEnemyData = (): void => {
        this.setState({
            shouldShowEnemyPopup: false,
            enemyEditIndex: 0,
        });
    }

    private addEnemySpecies = (): void => {
        this.setState(prevState => ({
            ...prevState,
            shouldShowEnemyPopup: true,
            enemyEditIndex: prevState.enemies.length,
            enemies: prevState.enemies.concat([{
                attacks: [],
                genus: this.state.enemyGenus,
                hp: 1,
                name: "",
                resistances: [],
                species: this.state.enemySpecies,
                speed: 1,
                xp: 1,
            }]),
        }));
    }

    private onChangeEnemyData = (enemy: IEnemyData, index: number): void => {
        this.setState(prevState => ({
            ...prevState,
            enemies: prevState.enemies
                .map((e, eIndex) => {
                    return index === eIndex
                        ? {
                            attacks: enemy.attacks,
                            genus: enemy.genus,
                            hp: enemy.hp,
                            name: enemy.name,
                            resistances: enemy.resistances,
                            species: enemy.species,
                            speed: enemy.speed,
                            xp: enemy.xp,
                        } as IEnemyData
                        : e;
                }),
        }));
    }
    
    private setEnemyData = (_: any, newData: string): void => {
        this.setState({
            enemies: JSON.parse(newData),
            enemyDataParsed: newData,
        });
    }

    private getEnemyData = (): void => {
        this.setState({
            enemyDataParsed: JSON.stringify(this.state.enemies, null, 4)
        });
    }
}

export const GeneratorPage = withAppState(withPage(GeneratorPageBase));