import * as React from "react";
import { is } from "../shared/is";

interface IProps {
    titleID?: string;
}

export class Header extends React.PureComponent<IProps> {
    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <h1>PlayFab Demo Game</h1>
                {!is.null(this.props.titleID) && (
                    <h2>Title ID: {this.props.titleID}</h2>
                )}
                <p>This website shows how a looter shooter game interacts with <a href="https://playfab.com">PlayFab</a>, a backend platform for games.</p>
                <hr />
            </React.Fragment>
        );
    }
}