import React from "react";
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton, MessageBar, MessageBarType, Spinner } from 'office-ui-fabric-react';
import { is } from "../shared/is";
import { routes } from "../routes";
import { PlayFabHelper } from "../shared/playfab";
import { RouteComponentProps } from "react-router";
import { Page } from "../components/page";
import { DivConfirm } from "../styles";
import { IWithAppStateProps, withAppState } from "../containers/with-app-state";
import { actionSetPlayerId, actionSetPlayerName, actionSetCatalog, actionSetInventory, actionSetPlanetsFromTitleData, actionSetStoreNamesFromTitleData, actionSetPlayerHP, actionSetEnemiesFromTitleData, actionSetEquipmentMultiple, actionSetPlayerLevel, actionSetPlayerXP } from "../store/actions";
import { TITLE_DATA_PLANETS, CATALOG_VERSION, TITLE_DATA_STORES, TITLE_DATA_ENEMIES, IStringDictionary } from "../shared/types";
import { IWithPageProps, withPage } from "../containers/with-page";
import { IEquipItemInstance } from "../store/types";
import { CloudScriptHelper } from "../shared/cloud-script";

type Props = RouteComponentProps & IWithAppStateProps & IWithPageProps;

interface IState {
    playerName: string;
    isLoggingIn: boolean;
    equipment: IStringDictionary;
    loadingCounter: number;
}

class LoginPageBase extends React.Component<Props, IState> {
    private loadingMax = 3;

    constructor(props: Props) {
        super(props);

        this.state = {
            playerName: null,
            isLoggingIn: false,
            equipment: null,
            loadingCounter: 0,
        };
    }

    public componentDidUpdate(): void {
        this.tryAndEquip();
        this.redirectWhenDoneLoading();
    }

    public render(): React.ReactNode {
        if(!this.props.appState.hasTitleId) {
            return null;
        }

        return (
            <Page {...this.props} title="Login">
                {!is.null(this.props.pageError) && (
                    <MessageBar messageBarType={MessageBarType.error}>{this.props.pageError}</MessageBar>
                )}
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
            </Page>
        );
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

        PlayFabHelper.LoginWithCustomID(this.props.appState.titleId, this.state.playerName, (player) => {
            this.props.dispatch(actionSetPlayerId(player.PlayFabId));
            this.props.dispatch(actionSetPlayerName(this.state.playerName));

            if(player.NewlyCreated) {
                PlayFabHelper.UpdateUserTitleDisplayName(this.state.playerName, this.props.onPageNothing, this.props.onPageError);
            }

            CloudScriptHelper.login((response) => {
                this.props.dispatch(actionSetPlayerHP(response.playerHP));
                this.props.dispatch(actionSetPlayerLevel(response.level));
                this.props.dispatch(actionSetPlayerXP(response.xp));
                this.props.dispatch(actionSetInventory(response.inventory));

                this.setState({
                    equipment: response.equipment
                }, this.advanceLoadCounter);
            }, this.props.onPageError);

            PlayFabHelper.GetTitleData([TITLE_DATA_PLANETS, TITLE_DATA_STORES, TITLE_DATA_ENEMIES], (data) => {
                this.props.dispatch(actionSetPlanetsFromTitleData(data, TITLE_DATA_PLANETS));
                this.props.dispatch(actionSetStoreNamesFromTitleData(data, TITLE_DATA_STORES));
                this.props.dispatch(actionSetEnemiesFromTitleData(data, TITLE_DATA_ENEMIES));
            }, this.props.onPageError);
            
            PlayFabHelper.GetCatalogItems(CATALOG_VERSION, (catalog) => {
                this.props.dispatch(actionSetCatalog(catalog));
            }, this.props.onPageError)
            
            this.advanceLoadCounter();
        }, this.props.onPageError);
    }

    private tryAndEquip(): void {
        const shouldTryAndEquip = !is.null(this.props.appState.inventory) && !is.null(this.props.appState.inventory.Inventory) && !is.null(this.state.equipment);

        if(shouldTryAndEquip) {
            const equipmentArray = Object.keys(this.state.equipment).map(slot => {
                return {
                    slot,
                    item: this.props.appState.inventory.Inventory.find(i => i.ItemInstanceId === this.state.equipment[slot])
                } as IEquipItemInstance;
            });

            this.props.dispatch(actionSetEquipmentMultiple(equipmentArray));

            this.setState({
                equipment: null,
            }, this.advanceLoadCounter);
        }
    }

    private redirectWhenDoneLoading(): void {
        if(this.state.loadingCounter === this.loadingMax && this.props.appState.hasTitleId && this.props.appState.hasPlayerId) {
            this.setState({
                isLoggingIn: false,
            }, () => {
                this.props.history.push(routes.Guide(this.props.appState.titleId, this.props.appState.playerId));
            });
        }
    }

    private advanceLoadCounter = (): void => {
        this.setState(prevState => ({
            loadingCounter: prevState.loadingCounter + 1,
        }));
    }
}

export const LoginPage = withAppState(withPage(LoginPageBase));