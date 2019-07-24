import * as React from "react";
import { IRouterProps } from "../router";
import { is } from "../shared/is";
import { Redirect, RouteComponentProps } from "react-router";
import { routes } from "../routes";
import { Page } from "../components/page";

type Props = IRouterProps & RouteComponentProps;

export default class TitleData extends React.Component<Props> {
    public render(): React.ReactNode {
        if(is.null(this.props.titleID)) {
            return <Redirect to={routes.Home} />;
        }

        return (
            <Page
                {...this.props}
                title="Title Data"
            >
                <h1>Title Data</h1>
                <p>Your title ID is {this.props.titleID}</p>
                <p>This page will help you load the required title data into your title.</p>
                <p>This page hasn't been built yet.</p>
            </Page>
        );
    }
}