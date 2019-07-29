import React from "react";
import { DefaultButton } from "office-ui-fabric-react";

import { is } from "../shared/is";
import { IWithAppStateProps, withAppState } from "../containers/with-app-state";
import { actionSetTitleId } from "../store/actions";
import { RouteComponentProps } from "react-router-dom";
import { routes } from "../routes";
import styled from "../styles";

const FooterTag = styled.footer`
    margin-top: ${s => s.theme.size.spacer};
    border-top: 1px solid ${s => s.theme.color.border200};
    padding: 0 ${s => s.theme.size.spacer} ${s => s.theme.size.spacerD2} ${s => s.theme.size.spacer};
    text-align: right;
`;

const ButtonReset = styled(DefaultButton)`
    font-size: 0.8em;
    padding: 0.2em;
    min-width: none;
    height: auto;
    margin-top: 0.2em;
    margin-left: ${s => s.theme.size.spacer};
`;

type Props = RouteComponentProps<any> & IWithAppStateProps;

class FooterBase extends React.PureComponent<Props> {
    public render(): React.ReactNode {
        if(is.null(this.props.appState.titleId)) {
            return null;
        }

        return (
            <FooterTag>
                <p><strong>Title ID:</strong> {this.props.appState.titleId} <ButtonReset text="Reset" onClick={this.resetTitleId} /></p>
            </FooterTag>
        );
    }

    private resetTitleId = (): void => {
        PlayFab.settings.titleId = null;
        this.props.dispatch(actionSetTitleId(null));
        this.props.history.push(routes.Index());
    }
}

export const Footer = withAppState(FooterBase);