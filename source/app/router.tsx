import React from "react";
import { Switch, Route, HashRouter } from "react-router-dom";

import { routeNames } from "./routes";
import { IWithAppStateProps, withAppState } from "./containers/with-app-state";

import { IndexPage } from "./pages";
import { LoginPage } from "./pages/login";
import { PlanetPage } from "./pages/planet";
import { NotFoundPage } from "./pages/not-found";
import { HeadquartersPage } from "./pages/headquarters";
import { UploadPage } from "./pages/upload";
import { DownloadPage } from "./pages/download";
import { LevelPage } from "./pages/level";
import { MainMenuPage } from "./pages/menu";
import { GuidePage } from "./pages/guide";
import { CreditsPage } from "./pages/credits";

type Props = IWithAppStateProps;

class RouterBase extends React.Component<Props> {
	public render(): React.ReactNode {
		return (
			<HashRouter>
				<Switch>
					<Route exact path={routeNames.Index} component={IndexPage} />
					<Route exact path={routeNames.MainMenu} component={MainMenuPage} />
					<Route exact path={routeNames.Login} component={LoginPage} />
					<Route exact path={routeNames.Guide} component={GuidePage} />
					<Route exact path={routeNames.Planet} component={PlanetPage} />
					<Route exact path={routeNames.Headquarters} component={HeadquartersPage} />
					<Route exact path={routeNames.Upload} component={UploadPage} />
					<Route exact path={routeNames.Download} component={DownloadPage} />
					<Route exact path={routeNames.LevelCurve} component={LevelPage} />
					<Route exact path={routeNames.Credits} component={CreditsPage} />
					<Route component={NotFoundPage} />
				</Switch>
			</HashRouter>
		);
	}
};

export const Router = withAppState(RouterBase);