import React from "react";
import { Store } from "redux";
import { Provider } from "react-redux";

import { Router } from "./router";
import { GlobalStyle, defaultTheme, ThemeProvider } from "./styles";
import { reduxStore } from "./store/store";
import { AppStateContainer } from "./containers/app-state-container";
import setupAnalytics from "./analytics";

require("../../static/favicon.ico");
require("../../static/img/logo-ios.png");
require("../../static/img/logo-open-graph.png");
require("../../static/img/logo-launch-1242x2688.png");
require("../../static/img/logo-launch-828x1792.png");
require("../../static/img/logo-launch-1125x2436.png");
require("../../static/img/logo-launch-1242x2208.png");
require("../../static/img/logo-launch-750x1334.png");

interface IProps {
    store: Store;
}

type Props = IProps;

setupAnalytics();

export class App extends React.Component<Props> {
    public static defaultProps: Partial<Props> = {
        store: reduxStore,
    }

    public render(): React.ReactNode {
        return (
            <ThemeProvider theme={defaultTheme}>
                <Provider store={this.props.store}>
                    <GlobalStyle />
                    <AppStateContainer>
                        <Router />
                    </AppStateContainer>
                </Provider>
            </ThemeProvider>
        );
    }
}