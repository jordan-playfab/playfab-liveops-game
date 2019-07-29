import React from "react";
import { Link } from "react-router-dom";

interface IProps {
    to: string;
    label: string;
}

export const BackLink = React.memo((props: IProps): React.ReactElement => {
    return (
        <p><Link to={props.to}><strong>&laquo; {props.label}</strong></Link></p>
    )
});