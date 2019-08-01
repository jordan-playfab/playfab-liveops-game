import React from "react";
import { Persona, PersonaSize } from "office-ui-fabric-react";
import { ITEM_CLASS_WEAPON } from "../shared/types";

interface IProps {
    instanceItem: PlayFabClientModels.ItemInstance;
    catalogItem?: PlayFabClientModels.CatalogItem;
}

function getInitials(displayName: string): string {
    if(displayName.length < 3) {
        return displayName;
    }
    else {
        const words = displayName.split(" ");

        if(words.length === 1) {
            return displayName.substr(0, 2);
        }
        else {
            return words[0].charAt(0) + words[1].charAt(0);
        }
    }
}

export const Item = React.memo((props: IProps): React.ReactElement => {
    const initials = getInitials(props.instanceItem.DisplayName);

    let secondaryText = "";
    let tertiaryText = "";

    switch(props.instanceItem.ItemClass) {
        case ITEM_CLASS_WEAPON:
            break;
    }

    return (
        <Persona
            text={props.instanceItem.DisplayName}
            imageInitials={initials}
            size={PersonaSize.size72}
            secondaryText={secondaryText}
            tertiaryText={tertiaryText}
        />
    )
});