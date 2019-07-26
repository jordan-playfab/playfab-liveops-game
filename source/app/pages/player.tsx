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
import { TITLE_DATA_PLANETS, CloudScriptFunctionNames } from "../shared/types";
import { IWithPageProps, withPage } from "../containers/with-page";
import { IPlayerLoginResponse } from "../../cloud-script/main";

type Props = RouteComponentProps & IWithAppStateProps & IWithPageProps;

interface IState {
    playerName: string;
    isLoggingIn: boolean;
}

class PlayerPageBase extends React.Component<Props, IState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            playerName: null,
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
                {!is.null(this.props.pageError) && (
                    <MessageBar messageBarType={MessageBarType.error}>{this.props.pageError}</MessageBar>
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
                {this.props.appState.planets.map((planet) => (
                    <li key={planet.name}><PrimaryButton text={`Fly to ${planet.name}`} onClick={this.sendToPlanet.bind(this, planet.name)} /></li>
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
        this.props.onPageClearError();

        this.setState({
            isLoggingIn: true,
        });

        PlayFabHelper.login(this.props.appState.titleId, this.state.playerName, (player) => {
            this.props.dispatch(actionSetPlayerId(player.PlayFabId));
            this.props.dispatch(actionSetPlayerName(this.state.playerName));

            if(player.NewlyCreated) {
                PlayFabHelper.updateDisplayName(this.state.playerName, this.props.onPageNothing, this.props.onPageError);

                // Also grant you some items
                PlayFabHelper.executeCloudScript(CloudScriptFunctionNames.playerLogin, null, (data) => {
                    this.getInventory();
                }, this.props.onPageError);
            }
            else {
                this.getInventory();
            }

            PlayFabHelper.getTitleData([TITLE_DATA_PLANETS], (data) => {
                this.props.dispatch(actionSetPlanetsFromTitleData(data));
            }, this.props.onPageError);
            
            PlayFabHelper.getCatalog((catalog) => {
                this.props.dispatch(actionSetCatalog(catalog));
            }, this.props.onPageError)
            
            this.setState({
                isLoggingIn: false,
            });
        }, this.props.onPageError);
    }

    private getInventory(): void {
        PlayFabHelper.getInventory((inventory) => {
            this.props.dispatch(actionSetInventory(inventory));
        }, this.props.onPageError);
    }

    private isValid(): boolean {
        return this.props.appState.hasTitleId;
    }
}

export const PlayerPage = withAppState(withPage(PlayerPageBase));