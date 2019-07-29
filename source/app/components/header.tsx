import React from "react";
import { DefaultButton } from "office-ui-fabric-react";

import { is } from "../shared/is";
import styled from "../styles";
import { IWithAppStateProps, withAppState } from "../containers/with-app-state";
import { actionSetTitleId } from "../store/actions";
import { RouteComponentProps } from "react-router-dom";
import { routes } from "../routes";
import logo from "../../../static/img/logo.png";

const H1Tag = styled.h1`
    text-align: center;
    margin: 0;
    padding 0;

    img {
        width: 256px;
    }
`;

const ButtonReset = styled(DefaultButton)`
    font-size: 0.8em;
    padding: 0.2em;
    min-width: none;
    height: auto;
    margin-top: 0.2em;
`;

type Props = RouteComponentProps<any> & IWithAppStateProps;

class HeaderBase extends React.PureComponent<Props> {
    public render(): React.ReactNode {
        return (
            <header>
                <H1Tag><img src={logo} alt="Vanguard Outrider" /></H1Tag>
                
                {!is.null(this.props.appState.titleId) && (
                    <div>
                        <div><strong>Title ID</strong></div>
                        <div>{this.props.appState.titleId}</div>
                        <div><ButtonReset text="Reset" onClick={this.resetTitleId} /></div>
                    </div>
                )}
            </header>
        );
    }

    private resetTitleId = (): void => {
        PlayFab.settings.titleId = null;
        this.props.dispatch(actionSetTitleId(null));
        this.props.history.push(routes.Index());
    }
}

export const Header = withAppState(HeaderBase);