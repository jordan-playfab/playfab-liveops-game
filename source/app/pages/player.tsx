import * as React from "react";
import { IRouterProps } from "../router";
import { is } from "../shared/is";
import { Redirect } from "react-router";
import { routes } from "../routes";

type Props = IRouterProps;

export default class Player extends React.Component<Props> {
    public render(): React.ReactNode {
        if(is.null(this.props.titleID)) {
            return <Redirect to={routes.Home} />;
        }

        return (
            <React.Fragment>
                <h1>Player</h1>
                <p>Your title ID is {this.props.titleID}</p>
                <p>This page will let you login a player using Custom ID.</p>
                <p>This page hasn't been built yet.</p>
            </React.Fragment>
        );
    }
}