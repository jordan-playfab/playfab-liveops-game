import * as React from "react";
import { IRouterProps } from "../router";
import { is } from "../shared/is";
import { Redirect } from "react-router";
import { routes } from "../routes";
import { PlayFabHelper } from "../shared/playfab";

type Props = IRouterProps;

export default class TitleData extends React.Component<Props> {
    public render(): React.ReactNode {
        if(is.null(this.props.titleID)) {
            return <Redirect to={routes.Home} />;
        }

        return (
            <React.Fragment>
                <h1>Title Data</h1>
                <p>Your title ID is {this.props.titleID}</p>
                <p>This page will help you load the required title data into your title.</p>
                <p>This page hasn't been built yet.</p>
                {this.renderUploadTitleDataButton()}
            </React.Fragment>
        );
    }

    private renderUploadTitleDataButton() : React.ReactNode {
        return (
            <button onClick={function() { alert('click'); }}>
            </button>
          );
    }

    private uploadTitleData() {
        
        // TODO read json file and add text field for title data to update
        //PlayFabHelper.uploadTitleData()
    }
}