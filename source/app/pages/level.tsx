import React from "react";
import { RouteComponentProps } from "react-router";
import { IWithAppStateProps, withAppState } from "../containers/with-app-state";
import { IWithPageProps, withPage } from "../containers/with-page";
import { Page } from "../components/page";
import { TextField } from "office-ui-fabric-react";

interface IState {
    maxLevel: number;
    xpToLevel1: number;
    xpToLevel50: number;
}

type Props = RouteComponentProps & IWithAppStateProps & IWithPageProps;

class LevelPageBase extends React.Component<Props, IState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            maxLevel: 50,
            xpToLevel1: 100,
            xpToLevel50: 10000,
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
        const xpPerLevel: number[] = [];

        for(let i = 0; i < this.state.maxLevel; i++) {
            let xp = this.calculateLevelCurve(i);

            if(i > 0) {
                xp += (xpPerLevel[i - 1] * 1.15);
            }

            xpPerLevel.push(Math.floor(xp));
        }
        
        return (
            <React.Fragment>
                <TextField
                    multiline
                    rows={20}
                    label="XP per level title data"
                    value={JSON.stringify(xpPerLevel, null, 0)}
                />
                
                <ul>
                    {xpPerLevel.map((xp, index) => (
                        <li key={index}>Level {index + 1}: {xp}</li>
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

export const LevelPage = withAppState(withPage(LevelPageBase));