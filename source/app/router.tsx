import * as React from "react";
import { Switch, Route, HashRouter } from "react-router-dom";
import { routes } from "./routes";

import Home from "./pages/home";
import TitleData from "./pages/title-data";
import Player from "./pages/player";
import NotFound from "./pages/not-found";

export interface IRouterProps {
	titleID: string;
	saveTitleID: (titleID: string) => void;
}

export class Router extends React.Component<IRouterProps> {
	public render(): React.ReactNode {
		return (
			<HashRouter>
				<Switch>
					<Route exact path={routes.Home} render={(props) => <Home {...props} {...this.props} />} />
					<Route exact path={routes.TitleData} render={(props) => <TitleData {...props} {...this.props} />} />
					<Route exact path={routes.Player} render={(props) => <Player {...props} {...this.props} />} />
					<Route component={NotFound} />
				</Switch>
			</HashRouter>
		);
	}
};
