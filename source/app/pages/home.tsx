import * as React from "react";

export default class Home extends React.Component<{}> {
    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <p>This is the home page.</p>
                <p>Here we need to determine whether you have a title ID already.</p>
                <p>If you do, proceed to player selection.</p>
                <p>If not, ask for it.</p>
            </React.Fragment>
        );
    }
}