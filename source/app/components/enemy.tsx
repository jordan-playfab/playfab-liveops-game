import React from "react";
import { DocumentCard } from "office-ui-fabric-react";

import { is } from "../shared/is";
import { IEnemyData } from "../shared/types";
import styled, { DlStats, PNone, UlAlternatingIndented, UlInline } from "../styles";
import { Grid } from "./grid";

const DocumentCardEnemy = styled(DocumentCard)`
    padding: ${s => s.theme.size.spacer};
`;

interface IProps {
    buttons?: React.ReactNode[];
}

type Props = IEnemyData & IProps;

export const Enemy = React.memo((props: Props): React.ReactElement => {
    return (
        <DocumentCardEnemy>
            <h4>{is.null(props.name) 
                ? (<React.Fragment>
                        {props.genus} {props.species}
                    </React.Fragment>)
                : (
                    <React.Fragment>
                        {props.name}<br />({props.genus} {props.species})
                    </React.Fragment>
                )}
            </h4>
            <Grid grid4x4x4>
                <DlStats>
                    <dt>HP</dt>
                    <dd>{props.hp}</dd>
                </DlStats>
                <DlStats>
                    <dt>XP</dt>
                    <dd>{props.xp}</dd>
                </DlStats>
                <DlStats>
                    <dt>Speed</dt>
                    <dd>{props.speed}</dd>
                </DlStats>
            </Grid>
            <React.Fragment>
                <h5>Attacks</h5>
                {is.null(props.attacks) 
                    ? (
                        <PNone>None</PNone>
                    )
                    : (
                        <UlAlternatingIndented>
                            {props.attacks.map((attack, index) => (
                                <li key={index}>
                                    <h6>{attack.name}</h6>
                                    <Grid grid4x4x4>
                                        <DlStats>
                                            <dt>Proability</dt>
                                            <dd>{attack.probability}</dd>
                                            
                                            <dt>Flavor</dt>
                                            <dd>{attack.flavor}</dd>
                                        </DlStats>
                                        <DlStats>
                                            <dt>Power</dt>
                                            <dd>{attack.power}</dd>

                                            <dt>Variance</dt>
                                            <dd>{attack.variance}</dd>
                                        </DlStats>
                                        <DlStats>
                                            <dt>Critical</dt>
                                            <dd>{attack.critical}</dd>
                                            
                                            <dt>Reload</dt>
                                            <dd>{attack.reload}</dd>
                                        </DlStats>
                                    </Grid>
                                </li>
                            ))}
                        </UlAlternatingIndented>
                    )}
            </React.Fragment>
            <React.Fragment>
                <h5>Resistances</h5>
                {is.null(props.resistances) 
                    ? (
                        <PNone>None</PNone>
                    )
                    : (
                        <UlAlternatingIndented>
                            {props.resistances.map((resistance, index) => (
                                <li key={index}>
                                    <Grid grid6x6>
                                        <DlStats>
                                            <dt>Flavor</dt>
                                            <dd>{resistance.flavor}</dd>
                                        </DlStats>
                                        <DlStats>
                                            <dt>Resistance</dt>
                                            <dd>{resistance.resistance}</dd>
                                        </DlStats>
                                    </Grid>
                                </li>
                            ))}
                        </UlAlternatingIndented>
                    )}
            </React.Fragment>
            {!is.null(props.buttons) && (
                <UlInline>
                    {props.buttons.map((button, index) => (
                        <li key={index}>{button}</li>
                    ))}
                </UlInline>
            )}
        </DocumentCardEnemy>
    );
});