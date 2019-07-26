import React from "react";
import { is } from "../shared/is";
import { PlayFabHelper } from "../shared/playfab";
import { RouteComponentProps, Redirect } from "react-router";
import { IPlanetData, TITLE_DATA_PLANETS } from "../shared/types";
import { routes } from "../routes";
import { Page, IBreadcrumbRoute } from "../components/page";
import { UlInline } from "../styles";
import { PrimaryButton } from "office-ui-fabric-react";
import { IWithAppStateProps, withAppState } from "../containers/with-app-state";
import { actionSetInventory, actionSetPlanetsFromTitleData } from "../store/actions";
import { IWithPageProps, withPage } from "../containers/with-page";
import { mathHelper } from "../shared/math-helper";
import { Combat } from "../components/combat";

interface IState {
    areaName: string;
    enemyGroupName: string;
    isLoading: boolean;
    itemGranted: string;
}

interface IPlanetPageRouteProps {
    name: string;
}

type Props = RouteComponentProps<IPlanetPageRouteProps> & IWithAppStateProps & IWithPageProps;

class PlanetPageBase extends React.Component<Props, IState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            isLoading: true,
            areaName: null,
            itemGranted: null,
            enemyGroupName: null,
        }
    }

    public componentDidMount(): void {
        if(!this.isValid()) {
            return;
        }

        this.props.clearErrorMessage();

        PlayFabHelper.getTitleData([TITLE_DATA_PLANETS], (data) => {
            this.props.dispatch(actionSetPlanetsFromTitleData(data));
            
            this.setState({
                isLoading: false,
            });
        }, this.props.onPlayFabError);

        PlayFabHelper.getInventory(inventory => this.props.dispatch(actionSetInventory(inventory)),
            this.props.onPlayFabError);
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

        if(is.null(this.state.areaName)) {
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
                {this.renderCombat()}
                {!is.null(this.state.itemGranted) && (
                    <p>You just got a {this.state.itemGranted}</p>
                )}
            </React.Fragment>
        );
    }

    private renderCombat(): React.ReactNode {
        const enemyGroup = this.props.appState.enemies.enemyGroups.find(g => g.name === this.state.enemyGroupName);
        const enemyData = this.props.appState.enemies.enemies.filter(e => enemyGroup.enemies.find(groupEnemy => groupEnemy === e.name));

        return (
            <Combat
                planet={this.getPlanetName()}
                area={this.state.areaName}
                enemyGroup={enemyGroup}
                enemies={enemyData}
                onFinished={this.setArea.bind(this, null)}
            />
        );
    }

    private setArea = (area: string): void => {
        if(is.null(area)) {
            this.setState({
                areaName: null,
                enemyGroupName: null,
            });

            return;
        }

        // Pick an enemy group to fight
        const thisArea = this.props.appState.planets
            .find(p => p.name === this.getPlanetName())
            .areas
            .find(a => a.name === area);

        if(is.null(thisArea)) {
            return this.props.onPlayFabError(`Area ${area} not found somehow`);
        }

        const enemyGroupIndex = mathHelper.getRandomInt(0, thisArea.enemyGroups.length - 1);

        this.setState({
            areaName: area,
            enemyGroupName: thisArea.enemyGroups[enemyGroupIndex]
        });
    }

    private isValid(): boolean {
        return this.props.appState.hasTitleId && this.props.appState.hasPlayerId;
    }

    private getPlanetData(): IPlanetData {
        const planetName = this.getPlanetName();

        return is.null(this.props.appState.planets)
            ? null
            : this.props.appState.planets.find(p => p.name === planetName);
    }

    private getPlanetName(): string {
        return this.props.match.params.name;
    }

    private getPageTitle(): string {
        if(this.state.isLoading) {
            return "Loading...";
        }

        if(!is.null(this.state.areaName)) {
            return `${this.state.areaName} Region`;
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
            onClick: is.null(this.state.areaName)
                ? null
                : () => {
                    this.setArea(null);
                }
        }];

        if(!is.null(this.state.areaName)) {
            breadcrumbs.push({
                text: this.state.areaName,
                href: ""
            });
        }

        return breadcrumbs;
    }
}

export const PlanetPage = withAppState(withPage(PlanetPageBase));