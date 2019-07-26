import React from "react";
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton, MessageBar, MessageBarType, Spinner } from 'office-ui-fabric-react';
import { is } from "../shared/is";
import { Redirect } from "react-router";
import { routes } from "../routes";
import { PlayFabHelper } from "../shared/playfab";
import { RouteComponentProps } from "react-router";
import { Page } from "../components/page";
import { DivConfirm, UlInline } from "../styles";
import { IWithAppStateProps, withAppState } from "../containers/with-app-state";
import { actionSetPlayerId, actionSetPlayerName, actionSetCatalog, actionSetInventory, actionSetPlanetsFromTitleData } from "../store/actions";
import { TITLE_DATA_PLANETS } from "../shared/types";

type Props = RouteComponentProps & IWithAppStateProps;

interface IState {
    playerName: string;
    error: string;
    isLoggingIn: boolean;
}

class PlayerPageBase extends React.Component<Props, IState> {
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
                    {this.props.appState.hasPlayerId
                        ? "Choose Your Destination"
                        : "Play Game"}
                </h2>
                {!is.null(this.state.error) && (
                    <MessageBar messageBarType={MessageBarType.error}>{this.state.error}</MessageBar>
                )}
                {this.props.appState.hasPlayerId
                    ? this.renderPlanetMenu()
                    : this.renderPlayerLogin()}
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
        if(is.null(this.props.appState.planets)) {
            return <Spinner label="Loading planets" />;
        }

        return (
            <UlInline>
                <li key={"homebase"}><PrimaryButton text="Home base" onClick={this.sendToHomeBase} /></li>
                {Object.keys(this.props.appState.planets).map((name) => (
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

        PlayFabHelper.login(this.props.appState.titleId, this.state.playerName, (player) => {
            this.props.dispatch(actionSetPlayerId(player.PlayFabId));
            this.props.dispatch(actionSetPlayerName(this.state.playerName));
            PlayFabHelper.getTitleData([TITLE_DATA_PLANETS], (data) => {
                this.props.dispatch(actionSetPlanetsFromTitleData(data));
            }, this.loadError);
            PlayFabHelper.getInventory((inventory) => {
                this.props.dispatch(actionSetInventory(inventory));
            }, this.loadError);
            PlayFabHelper.getCatalog((catalog) => {
                this.props.dispatch(actionSetCatalog(catalog));
            }, this.loadError)
            this.setState({
                isLoggingIn: false,
            });
        }, this.loadError);
    }

    private loadError = (message: string): void => {
        this.setState({
            error: message,
        });
    }

    private isValid(): boolean {
        return this.props.appState.hasTitleId;
    }
}

export const PlayerPage = withAppState(PlayerPageBase);