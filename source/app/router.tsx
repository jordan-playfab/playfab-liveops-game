import * as React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import routes from "./routes";

import About from "./pages/about";
import ForgotPassword from "./pages/forgot-password";
import SignIn from "./pages/sign-in";
import NotFound from "./pages/not-found";
import Play from "./pages/play";
import CreateAccount from "./pages/create-account";

export const Router: React.SFC = (): JSX.Element => {
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path={routes.Play} component={Play} />
				<Route exact path={routes.About} component={About} />
				<Route exact path={routes.SignIn} component={SignIn} />
				<Route exact path={routes.CreateAccount} component={CreateAccount} />
				<Route exact path={routes.ForgotPassword} component={ForgotPassword} />
				<Route component={NotFound} />
			</Switch>
		</BrowserRouter>
	);
};
