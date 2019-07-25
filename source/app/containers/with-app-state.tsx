import { IApplicationState } from "../store/types";
import React from "react";

const AppStateContext = React.createContext<IWithAppStateProps>(null);
export const AppStateProvider = AppStateContext.Provider;

export interface IWithAppStateProps {
    readonly appState: IApplicationState;
}

export const withAppState = <P extends IWithAppStateProps>(Component: React.ComponentType<P>) => {
    return class WithAppState extends React.Component<Omit<P, keyof IWithAppStateProps>> {
        public render(): React.ReactNode {
            return (
                <Component
                    {...this.props as P}
                    appState={this.context}
                />
            );
        }
    }
}