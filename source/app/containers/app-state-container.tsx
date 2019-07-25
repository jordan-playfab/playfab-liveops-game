import React from "react";
import { IApplicationState } from "../store/types";
import { AppStateProvider } from "./with-app-state";
import { connect } from "react-redux";

interface IPropsFromState {
    appState: IApplicationState;
}

const AppStateContainerBase: React.FunctionComponent<IPropsFromState> = (props): JSX.Element => {
    return (
        <AppStateProvider value={{appState: props.appState }} />
    );
}

const mapStateToProps = (state: IApplicationState): IPropsFromState => ({
    appState: state,
});

export const AppStateContainer = connect<IPropsFromState>(mapStateToProps)(AppStateContainerBase);