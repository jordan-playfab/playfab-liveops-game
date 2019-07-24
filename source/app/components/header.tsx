import * as React from "react";
import { DefaultButton } from 'office-ui-fabric-react';

import { is } from "../shared/is";
import styled from "../styles";

interface IProps {
    titleID?: string;
    resetTitleID: () => void;
}

const HeaderWrapper = styled.header`
    position: relative;
`;

const H1Tag = styled.h1`
    text-align: center;
`;

const DivTitleID = styled.div`
    position: absolute;
    top: 0.5em;
    right: 0.5em;
    margin: 0;
    text-align: center;
`;

const PTagline = styled.p`
    text-align: center;
    border-bottom: 2px solid ${s => s.theme.colorBorder200};
    padding-bottom: 1em;
`;

const ButtonReset = styled(DefaultButton)`
    font-size: 0.8em;
    padding: 0.2em;
    min-width: none;
    height: auto;
    margin-top: 0.2em;
`;

export class Header extends React.PureComponent<IProps> {
    public render(): React.ReactNode {
        return (
            <HeaderWrapper>
                <H1Tag>Vanguard Outrider</H1Tag>
                {!is.null(this.props.titleID) && (
                    <DivTitleID>
                        <div><strong>Title ID</strong></div>
                        <div>{this.props.titleID}</div>
                        <div><ButtonReset text="Reset" onClick={this.props.resetTitleID} /></div>
                    </DivTitleID>
                )}
                <PTagline>A looter shooter game simulation using <a href="https://playfab.com">PlayFab</a></PTagline>
            </HeaderWrapper>
        );
    }
}