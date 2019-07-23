import * as React from "react";
import { IRouterProps } from "../router";
import { is } from "../shared/is";
import { Redirect } from "react-router";
import { routes } from "../routes";
import { PrimaryButton } from 'office-ui-fabric-react';
import { PlayFabHelper } from "../shared/playfab";

type Props = IRouterProps;
interface IState {
    titleDataInput: string;
    titleDataFilePath: string;
}


export default class TitleData extends React.Component<Props, IState> {


    constructor() {
        super(undefined);

        this.state = {
            titleDataInput: null,
            titleDataFilePath: null
        }

        this.handleTitleDataInputEvent = this.handleTitleDataInputEvent.bind(this);
    }
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
                <p>Upload local title data: {this.renderTitleDataKeyInput()} {this.renderUploadTitleDataButton()} </p>
            </React.Fragment>
        );
    }

    private renderTitleDataKeyInput() {
        return (
        <label>
          Title data key:
          <input type="text" value={this.state.titleDataInput} onChange={this.handleTitleDataInputEvent} />
        </label>
         );
    }
    

    private handleTitleDataInputEvent(event: any) {
        console.log("updated state to " + this.state.titleDataInput);
        this.setState({titleDataInput: event.target.value});
    }

    private renderUploadTitleDataButton() : React.ReactNode {
        return (
            <PrimaryButton text="Upload" onClick={this.uploadTitleData} />
          );
    }

    private uploadTitleData() {
        alert("Title data input is " + this.state.titleDataInput);
       PlayFabHelper.uploadTitleData(this.state.titleDataInput, "testString", (data) => {
            this.uploadSuccess(data);
        }, (error) =>{
            alert("We failed to upload title data");
        });
    }

    private uploadSuccess(result: PlayFabAdminModels.SetTitleDataResult){
        alert("Upload successful");
    }
}