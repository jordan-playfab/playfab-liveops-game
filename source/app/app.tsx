import * as React from "react";
import { Router } from "./router";

export default class App extends React.Component<{}> {
    public render(): React.ReactNode {
        return (
            <Router
                {...this.props}
            />
        )
    }
}