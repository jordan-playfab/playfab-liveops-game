import React from "react";
import { RouteComponentProps } from "react-router";
import { IWithAppStateProps, withAppState } from "../containers/with-app-state";
import { IWithPageProps, withPage } from "../containers/with-page";
import { Page } from "../components/page";
import { TextField } from "office-ui-fabric-react";
import { ITitleDataLevel } from "../shared/types";
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
    }
}

type Props = RouteComponentProps & IWithAppStateProps & IWithPageProps;

class GeneratorPageBase extends React.Component<Props, IState> {
    constructor(props: Props) {
        super(props);

        // TODO: Allow the user to tweak these values
        this.state = {
            levels: {
                max: 50,
                xpToLevel1: 100,
                xpToLevelMax: 10000,
                xpPerLevelMultiplier: 1.15,
                hpPerLevelMultiplier: 5.75,
            }
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
            </Page>
        );
    }

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
                        <DivField>
                            <TextField label="Maximum level" value={this.state.levels.max.toString()} onChange={this.onChangeLevelMax} />
                        </DivField>
                        <DivField>
                            <TextField label="XP to level 1" value={this.state.levels.xpToLevel1.toString()} onChange={this.onChangeLevelXPToLevel1} />
                        </DivField>
                        <DivField>
                            <TextField label="XP to level max" value={this.state.levels.xpToLevelMax.toString()} onChange={this.onChangeLevelXPToLevelMax} />
                        </DivField>
                        <DivField>
                            <TextField label="XP per level modifier" value={this.state.levels.xpPerLevelMultiplier.toString()} onChange={this.onChangeLevelXPPerLevelMultiplier} />
                        </DivField>
                        <DivField>
                            <TextField label="HP per level modifier" value={this.state.levels.hpPerLevelMultiplier.toString()} onChange={this.onChangeLevelHPPerLevelMultiplier} />
                        </DivField>
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
}

export const GeneratorPage = withAppState(withPage(GeneratorPageBase));