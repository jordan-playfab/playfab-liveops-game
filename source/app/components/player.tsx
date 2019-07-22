import * as React from "react";
import { is } from "../shared/is";

interface IProps {
    id: string;
    name: string;
    credits: number;
    items: any[];
    location: string;
}

export class Player extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div>
                <h3>{this.props.name}</h3>
                <p>{this.props.id}</p>
                <p>Credits: {this.props.credits}</p>
                <p>Items:</p>
                {is.null(this.props.items)
                    ? (<p>None</p>)
                    : <ul>
                        {this.props.items.map((i) => (
                            <li key={i}>{i}</li>
                        ))}
                    </ul>}
            </div>
        );
    }
}