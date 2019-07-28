import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { PrimaryButton, DefaultButton, Spinner } from "office-ui-fabric-react";

import { Page } from "../components/page";
import { IWithAppStateProps, withAppState } from "../containers/with-app-state";
import { UlInline } from "../styles";
import { routes } from "../routes";
import { is } from "../shared/is";

type Props = RouteComponentProps & IWithAppStateProps;

class GuidePageBase extends React.Component<Props> {
    public render(): React.ReactNode {
        if(!this.props.appState.hasTitleId || !this.props.appState.hasPlayerId) {
            return null;
        }

        return (
            <Page
                {...this.props}
                title="Guide"
            >
                {this.renderPlanetMenu()}
            </Page>
        );
    }

    private renderPlanetMenu(): React.ReactNode {
        if(is.null(this.props.appState.planets)) {
            return <Spinner label="Loading planets" />;
        }

        if(is.null(this.props.appState.equipment) || is.null(this.props.appState.equipment.weapon)) {
            return (
                <React.Fragment>
                    <p>You can't go into the field without a weapon! Buy one at home base.</p>
                    <UlInline>
                        <li key={"homebase"}><PrimaryButton text="Home base" onClick={this.sendToHomeBase} /></li>
                    </UlInline>
                </React.Fragment>
            );
        }

        return (
            <UlInline>
                <li key={"homebase"}><PrimaryButton text="Home base" onClick={this.sendToHomeBase} /></li>
                {this.props.appState.planets.map((planet) => (
                    <li key={planet.name}><PrimaryButton text={`Fly to ${planet.name}`} onClick={this.sendToPlanet.bind(this, planet.name)} /></li>
                ))}
            </UlInline>
        );
    }

    private sendToHomeBase = (): void => {
        this.props.history.push(routes.Headquarters(this.props.appState.titleId, this.props.appState.playerId));
    }

    private sendToPlanet = (name: string): void => {
        this.props.history.push(routes.Planet(this.props.appState.titleId, this.props.appState.playerId, name));
    }
}

export const GuidePage = withAppState(GuidePageBase);