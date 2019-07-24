import * as React from "react";
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton } from 'office-ui-fabric-react';
import { IRouterProps } from "../router";
import { is } from "../shared/is";
import { Redirect } from "react-router";
import { routes } from "../routes";
import { PlayFabHelper } from "../shared/playfab";
import { RouteComponentProps } from "react-router";
import { Page } from "../components/page";
import { DivConfirm, UlInline } from "../styles";

type Props = IRouterProps & RouteComponentProps;

interface IState {
    playerID: string;
    error: string;
}

export class PlayerPage extends React.Component<Props, IState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            playerID: null,
            error: null
        };
    }

    public render(): React.ReactNode {
        if(is.null(this.props.titleID)) {
            return <Redirect to={routes.Home} />;
        }

        return (
            <Page {...this.props}>
                <h2>
                    {is.null(this.props.playerName)
                        ? "Play Game"
                        : "Choose Your Destination"}
                </h2>
                {!is.null(this.state.error) && (
                    <p>There was an error: {this.state.error}</p>
                )}
                {is.null(this.props.player)
                    ? this.renderPlayerLogin()
                    : this.renderPlanetMenu()}
            </Page>
        );
    }

    private renderPlayerLogin(): React.ReactNode {
        return (
            <form onSubmit={this.login}>
                <p>Start by entering a player ID. This can be a name (e.g. "James"), a GUID, or any other string.</p>
                <p>Type a player ID you've used before to load that player's data, or enter a new one to start over.</p>
                <p>This login happens using <a href="https://api.playfab.com/documentation/client/method/LoginWithCustomID">Custom ID</a>.</p>
                <fieldset>
                    <legend>Player</legend>
                    <TextField label="Player ID" onChange={this.setLocalPlayerID} autoFocus />
                    <DivConfirm>
                        <PrimaryButton text="Login" onClick={this.login} />
                    </DivConfirm>
                </fieldset>
            </form>
        );
    }

    private renderPlanetMenu(): React.ReactNode {
        if(is.null(this.props.planets)) {
            return (
                <p>Loading planets&hellip;</p>
            );
        }

        return (
            <UlInline>
                <li key={"homebase"}><PrimaryButton text="Home base" onClick={this.sendToHomeBase} /></li>
                {Object.keys(this.props.planets).map((name) => (
                    <li key={name}><PrimaryButton text={`Fly to ${name}`} onClick={this.sendToPlanet.bind(this, name)} /></li>
                ))}
            </UlInline>
        )
    }

    private sendToHomeBase = (): void => {
        this.props.history.push(routes.HomeBase);
    }

    private sendToPlanet = (name: string): void => {
        this.props.history.push(routes.Planet.replace(":name", name));
    }

    private setLocalPlayerID = (_: any, newValue: string): void => {
        this.setState({
            playerID: newValue,
        });
    }

    private login = (): void => {
        this.setState({
            error: null,
        });

        PlayFabHelper.login(this.props, this.state.playerID, (player) => {
            this.props.savePlayer(player, this.state.playerID);
            this.props.refreshPlanets();
            this.props.refreshInventory();
            this.props.refreshCatalog();
        }, (message) => {
            this.setState({
                error: message,
            })
        });
    }
}