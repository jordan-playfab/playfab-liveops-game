import * as React from "react";
import { Switch, Route, HashRouter } from "react-router-dom";
import { routes } from "./routes";

import Home from "./pages/home";
import TitleData from "./pages/title-data";
import { PlayerPage } from "./pages/player";
import { PlanetPage } from "./pages/planet";
import NotFound from "./pages/not-found";
import { ITitleDataPlanets } from "./shared/types";
import { HomeBasePage } from "./pages/home-base";

export interface IRouterProps {
	titleID: string;
	saveTitleID: (titleID: string) => void;

	player: PlayFabClientModels.LoginResult;
	savePlayer: (player: PlayFabClientModels.LoginResult) => void;

	inventory: PlayFabClientModels.GetUserInventoryResult;
	refreshInventory: () => void;

	planets: ITitleDataPlanets;
	refreshPlanets: (callback?: () => void) => void;

	stores: PlayFabClientModels.GetStoreItemsResult[];
	refreshStores: (callback?: () => void) => void;
}

export class Router extends React.Component<IRouterProps> {
	public render(): React.ReactNode {
		return (
			<HashRouter>
				<Switch>
					<Route exact path={routes.Home} render={(props) => <Home {...props} {...this.props} />} />
					<Route exact path={routes.TitleData} render={(props) => <TitleData {...props} {...this.props} />} />
					<Route exact path={routes.Player} render={(props) => <PlayerPage {...props} {...this.props} />} />
					<Route exact path={routes.Planet} render={(props) => <PlanetPage {...props} {...this.props} />} />
					<Route exact path={routes.HomeBase} render={(props) => <HomeBasePage {...props} {...this.props} />} />
					<Route component={NotFound} />
				</Switch>
			</HashRouter>
		);
	}
};
