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
    border: 4px solid ${s => s.theme.colorBorder200};
    border-radius: 0.5em;
`;

const DivPage = styled.div`
    margin-top: 1em;
`;

type Props = IRouterProps;

export class Page extends React.PureComponent<Props> {
    public render(): React.ReactNode {
        return (
            <MainTag>
                <Header titleID={this.props.titleID} resetTitleID={this.resetTitleID} />
                <Player inventory={this.props.inventory} player={this.props.player} />
                <DivPage>
                    {this.props.children}
                </DivPage>
            </MainTag>
        );
    }

    private resetTitleID = (): void => {
        this.props.saveTitleID(null);
    }
}