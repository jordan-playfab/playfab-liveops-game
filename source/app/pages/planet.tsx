import * as React from "react";
import { IRouterProps } from "../router";
import { is } from "../shared/is";
import { PlayFabHelper } from "../shared/playfab";
import { RouteComponentProps, Redirect } from "react-router";
import { IPlanetData, IKilledEnemyResult } from "../shared/types";
import { routes } from "../routes";
import { Player } from "../components/player";
import { Header } from "../components/header";
import { Link } from "react-router-dom";
import { Page } from "../components/page";

interface IState {
    currentArea: string;
    isLoading: boolean;
    totalKills: number;
    totalEnemies: number;
    isShooting: boolean;
    itemGranted: string;
}

interface IPlanetPageRouteProps {
    name: string;
}

type Props = IRouterProps & RouteComponentProps<IPlanetPageRouteProps>;

export class PlanetPage extends React.Component<Props, IState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            isLoading: true,
            isShooting: false,
            currentArea: null,
            totalKills: 0,
            totalEnemies: 0,
            itemGranted: null,
        }
    }

    public componentDidMount(): void {
        if(!this.isValid()) {
            return;
        }

        this.props.refreshPlanets(() => {
            const planet = this.getPlanetData();

            this.setState({
                isLoading: false,
                totalEnemies: planet.EnemyCount,
            });
        });

        PlayFabHelper.getStatistics(["kills"], (data) => {
            if(is.null(data)) {
                // No kills yet
                return;
            }

            this.setState({
                totalKills: data[0].Value,
            });
        }, (error) => {
            // TODO: Something
        });

        this.props.refreshInventory();
    }

    public render(): React.ReactNode {
        if(!this.isValid()) {
            return <Redirect to={routes.Home} />;
        }

        return (
            <Page {...this.props}>
                {this.renderPlanet()}
            </Page>
        );
    }

    private renderPlanet(): React.ReactNode {
        if(this.state.isLoading) {
            return (
                <p>Now loading&hellip;</p>
            );
        }

        return (
            <React.Fragment>
                <h1>Welcome to {this.getPlanetName()}</h1>
                <p><Link to={routes.Player}>Back to planet selection</Link></p>
                <Player
                    inventory={this.props.inventory}
                    player={this.props.player}
                />
                {this.renderArea()}
            </React.Fragment>
        )
    }

    private renderArea(): React.ReactNode {
        const planet = this.getPlanetData();

        if(is.null(this.state.currentArea)) {
            return (
                <React.Fragment>
                    <h2>Choose an area to fight in:</h2>
                    <ul>
                        {planet.Areas.map((areaName) => (
                            <li key={areaName}><button onClick={this.setArea.bind(this, areaName)}>{areaName}</button></li>
                        ))}
                    </ul>
                </React.Fragment>
            );
        }

        return (
            <React.Fragment>
                <h2>The {this.state.currentArea} area <button onClick={this.setArea.bind(this, null)}>(clear)</button></h2>
                <p>There are {this.state.totalEnemies} enemies here.</p>
                <p>Your total kills: {this.state.totalKills}.</p>
                {this.renderShootButton()}
                {!is.null(this.state.itemGranted) && (
                    <p>You just got a {this.state.itemGranted}</p>
                )}
            </React.Fragment>
        );
    }

    private renderShootButton(): React.ReactNode {
        if(this.state.totalEnemies === 0) {
            return (
                <p>No more enemies to shoot.</p>
            );
        }

        if(this.state.isShooting) {
            return (
                <p>Firing!</p>
            );
        }

        return (
            <div>
                <button onClick={this.shootEnemy}>Shoot enemy</button>
            </div>
        );
    }

    private setArea = (currentArea: string): void => {
        this.setState({
            currentArea,
        })
    }

    private shootEnemy = (): void => {
        this.setState({
            isShooting: true,
            itemGranted: null,
        });

        PlayFabHelper.executeCloudScript("killedEnemy", null, (data) => {
            const result = data.FunctionResult as IKilledEnemyResult;

            this.setState((prevState) => {
                return {
                    totalKills: result.kills,
                    totalEnemies: prevState.totalEnemies - 1,
                    isShooting: false,
                    itemGranted: result.itemGranted,
                };
            });

            if(!is.null(result.itemGranted)) {
                this.props.refreshInventory();
            }
        }, (error) => {
            // TODO: Something
            this.setState({
                isShooting: false,
            });
        })
    }

    private isValid(): boolean {
        return !is.null(this.props.titleID) && !is.null(this.props.player);
    }

    private getPlanetData(): IPlanetData {
        return is.null(this.props.planets)
            ? null
            : this.props.planets[this.getPlanetName()];
    }

    private getPlanetName(): string {
        return this.props.match.params.name;
    }
}