import React from "react";
import { Store } from "redux";
import { Provider } from "react-redux";

import { Router } from "./router";
import { GlobalStyle, defaultTheme, ThemeProvider } from "./styles";
import { reduxStore } from "./store/store";
import { AppStateContainer } from "./containers/app-state-container";
import { is } from "./shared/is";

require("../../static/favicon.ico");
require("../../static/img/logo-ios.png");
require("../../static/img/logo-open-graph.png");
require("../../static/img/logo-launch-1242x2688.png");
require("../../static/img/logo-launch-828x1792.png");
require("../../static/img/logo-launch-1125x2436.png");
require("../../static/img/logo-launch-1242x2208.png");
require("../../static/img/logo-launch-750x1334.png");

declare var awa: any;

interface IProps {
    store: Store;
}

type Props = IProps;

export class App extends React.Component<Props> {
    public static defaultProps: Partial<Props> = {
        store: reduxStore,
    }

	public componentDidMount(): void {
        this.addAnalytics();
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

    private addAnalytics(): void {
        if(!is.analyticsEnabled()) {
            return;
        }

        this.insertJS("https://az725175.vo.msecnd.net/scripts/jsll-4.js", () => {
            const config = {
                coreData: {
                    appId: "PlayFab_Vanguard_Outrider",
                    market: "en-us"
                }
            };
            awa.init(config);
        });
    }

    private insertJS(js: string, callback?: () => void): void {
        const script = document.createElement("script") as HTMLScriptElement;
        script.src = js;

        if(callback) {
            script.onload = callback;
        }

        document.body.appendChild(script);
    }
}