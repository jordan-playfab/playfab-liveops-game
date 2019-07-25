import * as React from "react";
import { Switch, Route, HashRouter } from "react-router-dom";
import { routes } from "./routes";

import { HomePage } from "./pages/home";
import { PlayerPage } from "./pages/player";
import { PlanetPage } from "./pages/planet";
import NotFound from "./pages/not-found";
import { IPlanetData } from "./shared/types";
import { HomeBasePage } from "./pages/home-base";
import { UploadPage } from "./pages/upload";
import { DownloadPage } from "./pages/download";

export interface IRouterProps {
	titleID: string;
	saveTitleID: (titleID: string) => void;

	playerPlayFabID: string;
	playerName: string;
	savePlayer: (player: PlayFabClientModels.LoginResult, playerName: string) => void;

	inventory: PlayFabClientModels.GetUserInventoryResult;
	refreshInventory: () => void;

	planets: IPlanetData[];
	refreshPlanets: (callback?: () => void) => void;

	stores: PlayFabClientModels.GetStoreItemsResult[];
	refreshStores: (callback?: () => void) => void;

	catalog: PlayFabClientModels.CatalogItem[];
	refreshCatalog: (callback?: () => void) => void;
}

export class Router extends React.Component<IRouterProps> {
	public render(): React.ReactNode {
		return (
			<HashRouter>
				<Switch>
					<Route exact path={routes.Home} render={(props) => <HomePage {...props} {...this.props} />} />
					<Route exact path={routes.Player} render={(props) => <PlayerPage {...props} {...this.props} />} />
					<Route exact path={routes.Planet} render={(props) => <PlanetPage {...props} {...this.props} />} />
					<Route exact path={routes.HomeBase} render={(props) => <HomeBasePage {...props} {...this.props} />} />
					<Route exact path={routes.Upload} render={(props) => <UploadPage {...props} {...this.props} />} />
					<Route exact path={routes.Download} render={(props) => <DownloadPage {...props} {...this.props} />} />
					<Route component={NotFound} />
				</Switch>
			</HashRouter>
		);
	}
};
