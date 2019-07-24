import * as React from "react";
import { IRouterProps } from "../router";
import { is } from "../shared/is";
import { Redirect, RouteComponentProps } from "react-router";
import { routes } from "../routes";
import { PrimaryButton } from 'office-ui-fabric-react';
import { PlayFabHelper } from "../shared/playfab";
import { TextInput } from 'react-native';

interface IState {
    titleDataInput: string;
    titleDataValue: string;
}
import { Page } from "../components/page";

type Props = IRouterProps & RouteComponentProps;


export default class TitleData extends React.Component<Props, IState> {

    constructor(props: Props) {
        super(props);
        this.uploadTitleData=this.uploadTitleData.bind(this);

        this.state = {
            titleDataInput: null,
            titleDataValue: null
        }

        this.handleTitleDataInputEvent = this.handleTitleDataInputEvent.bind(this);
        this.handleTitleDataValueInputEvent = this.handleTitleDataValueInputEvent.bind(this);
    }
    public render(): React.ReactNode {
        if(is.null(this.props.titleID)) {
            return <Redirect to={routes.Home} />;
        }
        console.log("redning title data page");
        return (
            <Page
                {...this.props}
                title="Title Data"
            >
                <h1>Title Data</h1>
                <p>Your title ID is {this.props.titleID}</p>
                <p>This page will help you load the required title data into your title.</p>
                <p>This page hasn't been built yet.</p>
                <h2>Upload local title data: </h2>
                <p>{this.renderTitleDataKeyInput()}</p>
                <p>{this.renderTitleDataFilePathInput()}</p>
                <p>{this.renderUploadTitleDataButton()}</p>
            </Page>
        );
    }

    private renderTitleDataKeyInput() {
        return (
        <label>
          Title data key:
          <input height="300" type="text" value={this.state.titleDataInput} onChange={this.handleTitleDataInputEvent} />
        </label>
         );
    }

    private renderTitleDataFilePathInput() {
        return (
            <label>
              Title data json value:
              <input type="text" value={this.state.titleDataValue} onChange={this.handleTitleDataValueInputEvent} style={{ width: "300px" }} />
            </label>
             );
    }
    

    private handleTitleDataInputEvent(event: any) {
        console.log("updated state to " + this.state.titleDataInput);
        this.setState({titleDataInput: event.target.value});
    }

    private handleTitleDataValueInputEvent(event: any) {
        console.log("Updated file path to " + event.target.value);
        this.setState({titleDataValue: event.target.value});
    }

    private renderUploadTitleDataButton() : React.ReactNode {
        return (
            <PrimaryButton text="Upload" onClick={this.uploadTitleData} />
          );
    }

    private uploadTitleData() {

        if (!this.state.titleDataInput || !this.state.titleDataValue)
        {
            alert("Either file path or title data key is missing.")
            return;
        }

        alert("Title data input is " + this.state.titleDataInput);
       PlayFabHelper.uploadTitleData(this.state.titleDataInput, this.state.titleDataValue, (data) => {
            this.uploadSuccess(data);
        }, (error) =>{
            alert("We failed to upload title data");
        });
    }

    private uploadSuccess(result: PlayFabAdminModels.SetTitleDataResult){
        alert("Upload successful");
    }
}