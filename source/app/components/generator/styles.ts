import styled, { ButtonTiny } from "../../styles";

export const ButtonRemove = styled(ButtonTiny)`
    color: ${s => s.theme.color.error500};
    border-color: ${s => s.theme.color.error500};
    margin: ${s => s.theme.size.spacerD2} ${s => s.theme.size.spacerD2} 0 0;

    &:hover {
        background-color: ${s => s.theme.color.error100};
        color: ${s => s.theme.color.error500};
    }
`;