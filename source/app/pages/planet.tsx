import * as React from "react";
import { IRouterProps } from "../router";
import { is } from "../shared/is";
import { PlayFabHelper } from "../shared/playfab";
import { RouteComponentProps, Redirect } from "react-router";
import { IPlanetData } from "../shared/types";
import { routes } from "../routes";

interface IState {
    name: string;
    currentArea: string;
    planet: IPlanetData;
}

interface IPlanetPageRouteProps {
    name: string;
}

type Props = IRouterProps & RouteComponentProps<IPlanetPageRouteProps>;

export class PlanetPage extends React.Component<Props, IState> {
    constructor(props: Props) {
        super(props);

        const planet = is.null(this.props.planets)
            ? null
            : this.props.planets[this.props.match.params.name];

        this.state = {
            name: this.props.match.params.name,
            currentArea: null,
            planet,
        }
    }

    public render(): React.ReactNode {
        if(is.null(this.props.titleID) || is.null(this.props.player)) {
            return <Redirect to={routes.Home} />;
        }

        return (
            <React.Fragment>
                <h1>Welcome to {this.state.name}</h1>
                {this.renderArea()}
            </React.Fragment>
        );
    }

    private renderArea(): React.ReactNode {
        if(is.null(this.state.currentArea)) {
            return (
                <React.Fragment>
                    <h2>Choose an area to fight in:</h2>
                    <ul>
                        {this.state.planet.Areas.map((areaName) => (
                            <li key={areaName}><button onClick={this.setArea.bind(this, areaName)}>{areaName}</button></li>
                        ))}
                    </ul>
                </React.Fragment>
            );
        }

        return (
            <React.Fragment>
                <h2>The {this.state.currentArea} area <button onClick={this.setArea.bind(this, null)}>(clear)</button></h2>
                <p>There are {this.state.planet.EnemyCount} enemies here.</p>
                {this.state.planet.EnemyCount > 0 && (
                    <div>
                        <button onClick={this.shootEnemy}>Shoot enemy</button>
                    </div>
                )}
            </React.Fragment>
        );
    }

    private setArea = (currentArea: string): void => {
        this.setState({
            currentArea,
        })
    }

    private shootEnemy = (): void => {
        this.setState((prevState) => {
            return {
                planet: {
                    ...prevState.planet,
                    EnemyCount: Math.max(0, prevState.planet.EnemyCount - 1),
                }
            }
        }, () => {
            PlayFabHelper.updateStatistic("kills", 1,
            (_) => {
                // Not interested yet
            },
            (error) => {
                console.log(error);
            })
        });
    }
}