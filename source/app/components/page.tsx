import * as React from "react";
import styled from "../styles";
import { IRouterProps } from "../router";
import { Header } from "./header";
import { Player } from "./player";

const MainTag = styled.main`
    width: 85%;
    max-width: 60em;
    margin: 2em auto;
    padding: 1em;
    background-color: ${s => s.theme.colorBackground000};
    border: 1px solid ${s => s.theme.colorBorder200};
    border-radius: 0.5em;
`;

type Props = IRouterProps;

export class Page extends React.PureComponent<Props> {
    public render(): React.ReactNode {
        return (
            <MainTag>
                <Header titleID={this.props.titleID} />
                <Player inventory={this.props.inventory} player={this.props.player} />
                {this.props.children}
            </MainTag>
        );
    }
}