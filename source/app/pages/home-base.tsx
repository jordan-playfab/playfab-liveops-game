import * as React from "react";
import { IRouterProps } from "../router";
import { Header } from "../components/header";
import { is } from "../shared/is";
import { Player } from "../components/player";
import { Redirect } from "react-router";
import { routes } from "../routes";

type Props = IRouterProps;

interface IState {
    selectedStore: string;
}

export class HomeBasePage extends React.Component<Props, IState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            selectedStore: null,
        };
    }

    public componentDidMount(): void {
        this.props.refreshStores();
    }

    public render(): React.ReactNode {
        if(!this.isValid()) {
            return <Redirect to={routes.Home} />;
        }

        return (
            <React.Fragment>
                <Header titleID={this.props.titleID} />
                <Player inventory={this.props.inventory} player={this.props.player} />
                <h1>Welcome to Home Base</h1>
                {this.renderStores()}
            </React.Fragment>
        );
    }

    public renderStores(): React.ReactNode {
        if(is.null(this.props.stores)) {
            return (
                <p>Loading stores&hellip;</p>
            );
        }

        return (
            <ul>
                {this.props.stores.map((store, index) => {
                    <li key={index}><button onClick={this.openStore.bind(this, store.StoreId)}>{store.MarketingData.DisplayName}</button></li>
                })}
            </ul>
        );
    }

    private openStore = (selectedStore: string): void => {
        this.setState({
            selectedStore,
        });
    }

    private isValid(): boolean {
        return !is.null(this.props.titleID) && !is.null(this.props.player);
    }
}