import * as React from "react";
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton } from 'office-ui-fabric-react';
import { IRouterProps } from "../router";
import { is } from "../shared/is";
import { Redirect } from "react-router";
import { routes } from "../routes";
import { PlayFabHelper } from "../shared/playfab";
import { RouteComponentProps } from "react-router";

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
                <h1>Player</h1>
                <p>Your title ID is {this.props.titleID}</p>
                {!is.null(this.state.error) && (
                    <p>There was an error: {this.state.error}</p>
                )}
                <p>Start by entering a player ID. This can be a name (e.g. "James"), a GUID, or any other string.</p>
                <p>Enter a new player ID to start a new game, or a previous one to load that player's data.</p>
                <p>This page will let you login a player using Custom ID.</p>
                {is.null(this.props.player)
                    ? this.renderPlayerLogin()
                    : this.renderPlayer()}
            </React.Fragment>
        );
    }

    private renderPlayerLogin(): React.ReactNode {
        return (
            <form>
                <fieldset>
                    <legend>Player</legend>
                    <TextField label="Player ID" onChange={this.setLocalPlayerID} />
                    <PrimaryButton text="Save" onClick={this.login} />
                </fieldset>
            </form>
        );
    }

    private renderPlayer(): React.ReactNode {
        return (
            <React.Fragment>
                <p><strong>You are logged in as:</strong> {this.props.player.PlayFabId}</p>
                <button onClick={this.sendToPlanet.bind(this, "Mars")}>Continue to Mars</button>
            </React.Fragment>
        );
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
        }, (message) => {
            this.setState({
                error: message,
            })
        });
    }
}