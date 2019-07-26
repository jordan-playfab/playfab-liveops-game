import React from "react";
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
import { IWithAppStateProps, withAppState } from "./containers/with-app-state";
import { titleHelper } from "./shared/title-helper";
import { is } from "./shared/is";
import { actionSetTitleId } from "./store/actions";

type Props = IWithAppStateProps;

class RouterBase extends React.Component<Props> {
	public componentDidMount(): void {
		const titleId = titleHelper.get();

		if(!is.null(titleId)) {
			this.props.dispatch(actionSetTitleId(titleId));
		}
	}

	public render(): React.ReactNode {
		return (
			<HashRouter>
				<Switch>
					<Route exact path={routes.Home} component={HomePage} />
					<Route exact path={routes.Player} component={PlayerPage} />
					<Route exact path={routes.Planet} component={PlanetPage} />
					<Route exact path={routes.HomeBase} component={HomeBasePage} />
					<Route exact path={routes.Upload} component={UploadPage} />
					<Route exact path={routes.Download} component={DownloadPage} />
					<Route component={NotFound} />
				</Switch>
			</HashRouter>
		);
	}
};

export const Router = withAppState(RouterBase);