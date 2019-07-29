import * as React from "react";
import styled, { UlInline } from "../styles";

const UlFooter = styled(UlInline)`
    border-top: 2px solid ${s => s.theme.color.border200};
    margin-top: 1em;
    padding-top: 0.5em;
    display: flex;
    justify-content: space-evenly;
`;

const StrongTag = styled.strong`
    display: block;
`;

export class Footer extends React.PureComponent<{}> {
    public render(): React.ReactNode {
        return (
            <UlFooter>
                <li>
                    <StrongTag>Development</StrongTag>
                    Jordan Roher
                </li>
                <li>
                    <StrongTag>Scenario</StrongTag>
                    Ashton Summers
                </li>
                <li>
                    <StrongTag>Deployment</StrongTag>
                    Julio Colon
                </li>
                <li>
                    <StrongTag>Graphics</StrongTag>
                    Aaron Lai
                </li>
            </UlFooter>
        )
    }
}