import React from "react";

import { is } from "../shared/is";
import { IEnemyData } from "../shared/types";
import { UlInline } from "../styles";
import { Grid } from "./grid";

type Props = IEnemyData;

export const Enemy = React.memo((props: Props): React.ReactElement => {
    return (
        <React.Fragment>
            <Grid grid6x6>
                <p>
                    <strong>
                    {is.null(props.name) 
                        ? (<React.Fragment>
                                {props.genus} {props.species}
                            </React.Fragment>)
                        : (
                            <React.Fragment>
                                {props.name}<br />({props.genus} {props.species})
                            </React.Fragment>
                        )}
                    </strong>
                </p>
                <UlInline>
                    <li>HP: <strong>{props.hp}</strong></li>
                    <li>XP: <strong>{props.xp}</strong></li>
                    <li>Speed: <strong>{props.speed}</strong></li>
                </UlInline>
            </Grid>
            <Grid grid6x6>
                <React.Fragment>
                    {!is.null(props.attacks) && (
                        <React.Fragment>
                            <p>Attacks</p>

                            <ul>
                                {props.attacks.map((attack, index) => (
                                    <li key={index}>
                                        {attack.name}
                                        <br />
                                        Proability: <strong>{attack.probability}</strong>
                                        <br />
                                        Flavor: <strong>{attack.flavor}</strong>
                                        <br />
                                        Power: <strong>{attack.power}</strong>
                                        <br />
                                        Variance: <strong>{attack.variance}</strong>
                                        <br />
                                        Critical: <strong>{attack.critical}</strong>
                                        <br />
                                        Reload: <strong>{attack.reload}</strong>
                                    </li>
                                ))}
                            </ul>
                        </React.Fragment>
                    )}
                </React.Fragment>
                <React.Fragment>
                    {!is.null(props.resistances) && (
                        <React.Fragment>
                            <p>Resistances</p>

                            <ul>
                                {props.resistances.map((resistance, index) => (
                                    <li key={index}>
                                        {resistance.flavor} ({resistance.resistance})
                                    </li>
                                ))}
                            </ul>
                        </React.Fragment>
                    )}
                </React.Fragment>
            </Grid>
        </React.Fragment>
    )
});