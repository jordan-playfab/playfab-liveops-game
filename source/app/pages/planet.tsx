import * as React from "react";
import { IRouterProps } from "../router";
import { is } from "../shared/is";
import { PlayFabHelper } from "../shared/playfab";
import { RouteComponentProps, Redirect } from "react-router";
import { IPlanetData, IKilledEnemyResult } from "../shared/types";
import { routes } from "../routes";
import { Page, IBreadcrumbRoute } from "../components/page";
import { UlInline } from "../styles";
import { PrimaryButton, Spinner } from "office-ui-fabric-react";

interface IState {
    currentArea: string;
    isLoading: boolean;
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
            itemGranted: null,
        }
    }

    public componentDidMount(): void {
        if(!this.isValid()) {
            return;
        }

        this.props.refreshPlanets(() => {
            this.setState({
                isLoading: false,
            });
        });

        this.props.refreshInventory();
    }

    public render(): React.ReactNode {
        if(!this.isValid()) {
            return <Redirect to={routes.Home} />;
        }

        return (
            <Page
                {...this.props}
                title={this.getPageTitle()}
                breadcrumbs={this.getBreadcrumbs()}
            >
                {this.renderPlanet()}
            </Page>
        );
    }

    private renderPlanet(): React.ReactNode {
        if(this.state.isLoading) {
            return null;
        }

        return this.renderArea();
    }

    private renderArea(): React.ReactNode {
        const planet = this.getPlanetData();

        if(is.null(this.state.currentArea)) {
            return (
                <React.Fragment>
                    <h3>Choose a region to fight in:</h3>
                    <UlInline>
                        {planet.areas.map((area) => (
                            <li key={area.name}><PrimaryButton text={area.name} onClick={this.setArea.bind(this, area.name)} /></li>
                        ))}
                    </UlInline>
                </React.Fragment>
            );
        }

        return (
            <React.Fragment>
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
        if(this.state.isShooting) {
            return (
                <Spinner label="Firing!" />
            );
        }

        return (
            <PrimaryButton text="Shoot enemy" onClick={this.shootEnemy} />
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
                    totalKills: prevState.totalKills + 1,
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
        return !is.null(this.props.titleID) && !is.null(this.props.playerPlayFabID);
    }

    private getPlanetData(): IPlanetData {
        const planetName = this.getPlanetName();

        return is.null(this.props.planets)
            ? null
            : this.props.planets.find(p => p.name === planetName);
    }

    private getPlanetName(): string {
        return this.props.match.params.name;
    }

    private getPageTitle(): string {
        if(this.state.isLoading) {
            return "Loading...";
        }

        if(!is.null(this.state.currentArea)) {
            return `${this.state.currentArea} Region`;
        }

        return `Welcome to ${this.getPlanetName()}`;
    }

    private getBreadcrumbs(): IBreadcrumbRoute[] {
        const planetName = this.getPlanetName();

        if(is.null(planetName)) {
            return null;
        }

        const breadcrumbs: IBreadcrumbRoute[] = [{
            text: planetName,
            href: routes.Planet.replace(":name", planetName),
            onClick: is.null(this.state.currentArea)
                ? null
                : () => {
                    this.setArea(null);
                }
        }];

        if(!is.null(this.state.currentArea)) {
            breadcrumbs.push({
                text: this.state.currentArea,
                href: ""
            });
        }

        return breadcrumbs;
    }
}