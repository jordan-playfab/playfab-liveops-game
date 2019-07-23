import * as React from "react";
import { IRouterProps } from "../router";
import { is } from "../shared/is";
import { Redirect } from "react-router";
import { routes } from "../routes";
import { PrimaryButton } from 'office-ui-fabric-react';
import { PlayFabHelper } from "../shared/playfab";

type Props = IRouterProps;

export default class TitleData extends React.Component<Props> {
    public render(): React.ReactNode {
        if(is.null(this.props.titleID)) {
            return <Redirect to={routes.Home} />;
        }
        console.log("redning title data page");
        return (
            <React.Fragment>
                <h1>Title Data</h1>
                <p>Your title ID is {this.props.titleID}</p>
                <p>This page will help you load the required title data into your title.</p>
                <p>This page hasn't been built yet.</p>
                <p>Upload local title data: {this.renderUploadTitleDataButton()}</p>
            </React.Fragment>
        );
    }

    private renderUploadTitleDataButton() : React.ReactNode {
        return (
            <PrimaryButton text="Upload" onClick={this.uploadTitleData} />
          );
    }

    private uploadTitleData() {
       // PlayFabHelper.uploadTitleData("Enemies", "testString", (data) => {
          //  this.uploadSuccess(data);
        //}, (error) =>{
          //  alert("We failed to upload title data");
        //})
        // TODO read json file and add text field for title data to update
        //PlayFabHelper.uploadTitleData()
    }

    private uploadSuccess(result: PlayFabAdminModels.SetTitleDataResult){
        alert("Upload successful");
    }
}