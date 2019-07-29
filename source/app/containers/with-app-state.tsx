import { IApplicationState } from "../store/types";
import React from "react";
import { Dispatch } from "redux";
import { IEquipItemInstanceRequest, IEquipItemRequest } from "../../cloud-script/main";

const AppStateContext = React.createContext<IWithAppStateProps>(null);
export const AppStateProvider = AppStateContext.Provider;

export interface IWithAppStateProps {
    readonly appState: IApplicationState;
    readonly dispatch: Dispatch;
}

export interface ICloudScriptFunctions {
    equipItem: (items: IEquipItemInstanceRequest[], success: (data: PlayFabClientModels.ExecuteCloudScriptResult) => void, error: (message: string) => void) => void;
}

export const withAppState = <P extends IWithAppStateProps>(Component: React.ComponentType<P>) => {
    return class WithAppState extends React.Component<Omit<P, keyof IWithAppStateProps>> {
        public static contextType = AppStateContext;

        public render(): React.ReactNode {
            return (
                <Component
                    {...this.props as P}
                    appState={this.context.appState}
                    dispatch={this.context.dispatch}
                />
            );
        }
    }
}