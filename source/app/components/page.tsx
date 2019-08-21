import React from "react";
import { RouteComponentProps } from "react-router";
import { Helmet } from "react-helmet";

import styled from "../styles";
import { Header } from "./header";
import { Player } from "./player";
import { IWithAppStateProps, withAppState } from "../containers/with-app-state";
import { actionSetTitleId, actionPlayerLogOut, actionSetCloud } from "../store/actions";
import { Footer } from "./footer";
import { routes } from "../routes";
import { utilities } from "../shared/utilities";
import { is } from "../shared/is";

const MainTag = styled.main`
    background: ${s => s.theme.color.background000};
    
    @media ${s => s.theme.breakpoint.small} {
        margin: ${s => s.theme.size.spacer2} auto;
        box-shadow: 0 1.6px 3.6px 0 rgba(0,0,0,0.132),0 0.3px 0.9px 0 rgba(0,0,0,0.108);
        max-width: 90%;
    }

    @media ${s => s.theme.breakpoint.large} {
        max-width: ${s => s.theme.breakpointUnits.large};
    }
`;

const DivPageContent = styled.div`
    border-top: 1px solid ${s => s.theme.color.border200};
    padding: ${s => s.theme.size.spacer};
`;

interface IProps {
    title?: string;
    shouldShowPlayerInfo?: boolean;
}

type Props = IProps & RouteComponentProps<any> & IWithAppStateProps;

class PageBase extends React.PureComponent<Props> {
    public static defaultProps: Partial<Props> = {
        shouldShowPlayerInfo: false,
    }

	public componentDidMount(): void {
		this.checkForURIParameters();
	}

	public componentDidUpdate(): void {
		this.checkForURIParameters();
	}

    public render(): React.ReactNode {
        return (
            <MainTag>
                {this.getHelmet()}
                <Header title={this.props.title} />
                {this.props.shouldShowPlayerInfo && (
                    <Player logOut={this.logOut} />
                )}
                <DivPageContent>
                    {this.props.children}
                </DivPageContent>
                <Footer {...this.props} />
            </MainTag>
        );
    }

	private checkForURIParameters(): void {
		if(this.props.match.params.titleid !== this.props.appState.titleId) {
            PlayFab.settings.titleId = this.props.match.params.titleid;
			this.props.dispatch(actionSetTitleId(this.props.match.params.titleid));
        }
        
		if(this.props.match.params.cloud !== this.props.appState.cloud) {
            utilities.setCloud(this.props.match.params.cloud);
			this.props.dispatch(actionSetCloud(this.props.match.params.cloud));
		}
	}

    private logOut = (): void => {
        this.props.dispatch(actionPlayerLogOut());
        this.props.history.push(routes.Login(this.props.appState.cloud, this.props.appState.titleId));
    }

    private getHelmet(): React.ReactNode {
        if(!is.analyticsEnabled()) {
            return null;
        }

        const azureInsightsCode = `var appInsights=window.appInsights||function(a){ function b(a){c[a]=function(){var b=arguments;c.queue.push(function(){c[a].apply(c,b)})}}var c={config:a},d=document,e=window;setTimeout(function(){var b=d.createElement("script");b.src=a.url||"https://az416426.vo.msecnd.net/scripts/a/ai.0.js",d.getElementsByTagName("script")[0].parentNode.appendChild(b)});try{c.cookie=d.cookie}catch(a){}c.queue=[];for(var f=["Event","Exception","Metric","PageView","Trace","Dependency"];f.length;)b("track"+f.pop());if(b("setAuthenticatedUserContext"),b("clearAuthenticatedUserContext"),b("startTrackEvent"),b("stopTrackEvent"),b("startTrackPage"),b("stopTrackPage"),b("flush"),!a.disableExceptionTracking){f="onerror",b("_"+f);var g=e[f];e[f]=function(a,b,d,e,h){var i=g&&g(a,b,d,e,h);return!0!==i&&c["_"+f](a,b,d,e,h),i}}return c }({ instrumentationKey:"5e380edb-9854-4389-aaf5-3942e06c2048" }); window.appInsights=appInsights,appInsights.queue&&0===appInsights.queue.length&&appInsights.trackPageView();`;

        return (
            <Helmet>
                <script type="text/javascript">{azureInsightsCode}</script>
            </Helmet>
        );
    }
}

export const Page = withAppState(PageBase);