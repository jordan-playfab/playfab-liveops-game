import * as React from "react";
import { Switch, Route, HashRouter } from "react-router-dom";
import { routes } from "./routes";

import Home from "./pages/home";
import NotFound from "./pages/not-found";

export class Router extends React.Component<{}> {
	public render(): React.ReactNode {
		return (
			<HashRouter>
				<Switch>
					<Route exact path={routes.Home} component={Home} />
					<Route component={NotFound} />
				</Switch>
			</HashRouter>
		);
	}
};
