import React from "react";

import { is } from "../shared/is";
import { IEnemyData } from "../shared/types";

type Props = IEnemyData;

export const Enemy = React.memo((props: Props): React.ReactElement => {
    return (
        <p>
            {!is.null(props.name) && (
                <React.Fragment>
                    <strong>{props.name}</strong>
                    <br />
                </React.Fragment>
            )}
            {props.genus} {props.species}
            <br />
            {props.hp} HP
        </p>
    )
});