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
            <main>
                <Header {...this.props} />
                {this.props.shouldShowPlayerInfo && (
                    <Player />
                )}
                {this.renderBreadcrumbs()}
                {!is.null(this.props.title) && (
                    <h2>{this.props.title}</h2>
                )}
                {this.props.children}
            </main>
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