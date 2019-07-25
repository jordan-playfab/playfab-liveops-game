import * as React from "react";
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton, MessageBar, MessageBarType, Spinner } from 'office-ui-fabric-react';
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
    playerName: string;
    error: string;
    isLoggingIn: boolean;
}

export class PlayerPage extends React.Component<Props, IState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            playerName: null,
            error: null,
            isLoggingIn: false,
        };
    }

    public render(): React.ReactNode {
        if(!this.isValid()) {
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
                    <MessageBar messageBarType={MessageBarType.error}>{this.state.error}</MessageBar>
                )}
                {is.null(this.props.playerPlayFabID)
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
                        {this.state.isLoggingIn
                            ? <Spinner label="Logging in" />
                            : <PrimaryButton text="Login" onClick={this.login} />}
                    </DivConfirm>
                </fieldset>
            </form>
        );
    }

    private renderPlanetMenu(): React.ReactNode {
        if(is.null(this.props.planets)) {
            return <Spinner label="Loading planets" />;
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
            playerName: newValue,
        });
    }

    private login = (): void => {
        this.setState({
            error: null,
            isLoggingIn: true,
        });

        PlayFabHelper.login(this.props.titleID, this.state.playerName, (player) => {
            this.props.savePlayer(player, this.state.playerName);
            this.props.refreshPlanets();
            this.props.refreshInventory();
            this.props.refreshCatalog();
            this.setState({
                isLoggingIn: false,
            });
        }, (message) => {
            this.setState({
                error: message,
            })
        });
    }

    private isValid(): boolean {
        return !is.null(this.props.titleID);
    }
}