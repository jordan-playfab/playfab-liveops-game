import React from "react";
import { RouteComponentProps } from "react-router";
import { IWithAppStateProps, withAppState } from "../containers/with-app-state";
import { IWithPageProps, withPage } from "../containers/with-page";
import { Page } from "../components/page";
import { TextField } from "office-ui-fabric-react";
import { ITitleDataLevel } from "../shared/types";

interface IState {
    maxLevel: number;
    xpToLevel1: number;
    xpToLevel50: number;
    xpPerLevelMultiplier: number;
    hpPerLevelMultiplier: number;
}

type Props = RouteComponentProps & IWithAppStateProps & IWithPageProps;

class GeneratorPageBase extends React.Component<Props, IState> {
    constructor(props: Props) {
        super(props);

        // TODO: Allow the user to tweak these values
        this.state = {
            maxLevel: 50,
            xpToLevel1: 100,
            xpToLevel50: 10000,
            xpPerLevelMultiplier: 1.15,
            hpPerLevelMultiplier: 5.75,
        };
    }

    public render(): React.ReactNode {
        return (
            <Page
                {...this.props}
                title="Level curve generator"
            >
                <p>Assuming a max level of {this.state.maxLevel}.</p>
                {this.renderLevelCurve()}
            </Page>
        )
    }

    private renderLevelCurve(): React.ReactNode {
        const xpPerLevel: ITitleDataLevel[] = [];

        for(let i = 0; i < this.state.maxLevel; i++) {
            let xp = this.calculateLevelCurve(i);

            if(i > 0) {
                xp += (xpPerLevel[i - 1].xp * this.state.xpPerLevelMultiplier);
            }

            xpPerLevel.push({
                level: i + 1,
                xp: Math.floor(xp),
                hpGranted: Math.floor(i * this.state.hpPerLevelMultiplier),
                itemGranted: null,
            });
        }
        
        return (
            <React.Fragment>
                <TextField
                    multiline
                    rows={20}
                    label="XP per level title data"
                    value={JSON.stringify(xpPerLevel, null, 4)}
                />
                
                <ul>
                    {xpPerLevel.map((xp, index) => (
                        <li key={index}>Level {index + 1}: {xp.xp}</li>
                    ))}
                </ul>
            </React.Fragment>
        );
    }

    private calculateLevelCurve(position: number): number {
        const minp = 0;
        const maxp = this.state.maxLevel - 1;
        
        // The result should be between 100 an 10000000
        const minv = Math.log(this.state.xpToLevel1);
        const maxv = Math.log(this.state.xpToLevel50);
        
        // calculate adjustment factor
        const scale = (maxv-minv) / (maxp-minp);
        
        return Math.exp(minv + scale*(position-minp));
    }
}

export const GeneratorPage = withAppState(withPage(GeneratorPageBase));