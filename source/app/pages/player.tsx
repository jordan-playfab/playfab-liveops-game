import * as React from "react";
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton } from 'office-ui-fabric-react';
import { IRouterProps } from "../router";
import { is } from "../shared/is";
import { Redirect } from "react-router";
import { routes } from "../routes";
import { PlayFabHelper } from "../shared/playfab";
import { RouteComponentProps } from "react-router";
import { Header } from "../components/header";

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
            <React.Fragment>
                <Header titleID={this.props.titleID} />
                {this.renderTitle()}
                {!is.null(this.state.error) && (
                    <p>There was an error: {this.state.error}</p>
                )}
                {is.null(this.props.player)
                    ? this.renderPlayerLogin()
                    : this.renderPlanetMenu()}
            </React.Fragment>
        );
    }

    private renderPlayerLogin(): React.ReactNode {
        return (
            <form onSubmit={this.login}>
                <p>Start by entering a player ID. This can be a name (e.g. "James"), a GUID, or any other string.</p>
                <p>Enter a new player ID to start a new game, or a previous one to load that player's data. This login happens using <a href="https://api.playfab.com/documentation/client/method/LoginWithCustomID">Custom ID</a>.</p>
                <fieldset>
                    <legend>Player</legend>
                    <TextField label="Player ID" onChange={this.setLocalPlayerID} autoFocus />
                    <PrimaryButton text="Login" onClick={this.login} />
                </fieldset>
            </form>
        );
    }

    private renderTitle(): React.ReactNode {
        return is.null(this.props.player)
            ? (
                <h1>Play Game</h1>
            )
            : (
                <h1>Welcome player {this.props.player.PlayFabId}</h1>
            );
    }

    private renderPlanetMenu(): React.ReactNode {
        if(is.null(this.props.planets)) {
            return (
                <p>Loading planets&hellip;</p>
            );
        }

        return (
            <ul>
                <li key={"homebase"}><button onClick={this.sendToHomeBase}>Home base</button></li>
                {Object.keys(this.props.planets).map((name) => (
                    <li key={name}><button onClick={this.sendToPlanet.bind(this, name)}>Fly to {name}</button></li>
                ))}
            </ul>
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
            this.props.savePlayer(player);
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