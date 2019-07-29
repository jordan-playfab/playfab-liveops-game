import React from "react";
import { Breadcrumb, IBreadcrumbItem } from 'office-ui-fabric-react/lib/Breadcrumb';
import styled from "../styles";
import { Header } from "./header";
import { Player } from "./player";
import { RouteComponentProps } from "react-router";
import { routes } from "../routes";
import { is } from "../shared/is";
import { IWithAppStateProps, withAppState } from "../containers/with-app-state";
import { actionSetTitleId } from "../store/actions";
import { Footer } from "./footer";

const MainTag = styled.main`
    background: ${s => s.theme.color.background000};
    margin: ${s => s.theme.size.spacer2} auto;
    box-shadow: 0 1.6px 3.6px 0 rgba(0,0,0,0.132),0 0.3px 0.9px 0 rgba(0,0,0,0.108);
    max-width: 90%;

    @media ${s => s.theme.breakpoint.large} {
        max-width: ${s => s.theme.breakpointUnits.large};
    }
`;

const DivPageContent = styled.div`
    border-top: 1px solid ${s => s.theme.color.border200};
    padding: ${s => s.theme.size.spacer};
    margin-top: ${s => s.theme.size.spacer};
`;

interface IProps {
    title?: string;
    breadcrumbs?: IBreadcrumbRoute[];
    shouldShowPlayerInfo?: boolean;
}

export interface IBreadcrumbRoute {
    text: string;
    href: string;
    onClick?: () => void;
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
                <Header title={this.props.title} />
                {this.props.shouldShowPlayerInfo && (
                    <Player />
                )}
                {this.renderBreadcrumbs()}
                <DivPageContent>
                    {this.props.children}
                </DivPageContent>
                <Footer {...this.props} />
            </MainTag>
        );
    }

    private renderBreadcrumbs(): React.ReactNode {
        if(is.null(this.props.breadcrumbs)) {
            return null;
        }

        const allBreadcrumbs: IBreadcrumbItem[] = 
            [{
                text: "Director",
                key: "director",
                onClick: this.onBreadcrumbClicked,
                href: routes.Guide(this.props.appState.titleId),
            }]
            .concat(this.props.breadcrumbs.map((b, index) => ({
                    key: index.toString(),
                    text: b.text,
                    href: b.href,
                    onClick: (e: React.MouseEvent<HTMLElement>, item: IBreadcrumbItem) => {
                        e.preventDefault();

                        if(!is.null(b.onClick)) {
                            b.onClick();
                        }
                        else {
                            this.onBreadcrumbClicked(e, item);
                        }
                    },
                    isCurrentItem: index === this.props.breadcrumbs.length - 1
            })));

        return (
            <Breadcrumb
                items={allBreadcrumbs}
                dividerAs={this.getBreadcrumbDivider}
            />
        );
    }

    private getBreadcrumbDivider = (): JSX.Element => {
        return (
            <React.Fragment>&raquo;</React.Fragment>
        );
    }

    private onBreadcrumbClicked = (e: React.MouseEvent<HTMLElement>, item: IBreadcrumbItem): void => {
        e.preventDefault();

        if(item.isCurrentItem) {
            return;
        }

        this.props.history.push(item.href);
    }

	private checkForURIParameters(): void {
		if(this.props.match.params.titleid !== this.props.appState.titleId) {
            PlayFab.settings.titleId = this.props.match.params.titleid;
			this.props.dispatch(actionSetTitleId(this.props.match.params.titleid));
		}
	}
}

export const Page = withAppState(PageBase);