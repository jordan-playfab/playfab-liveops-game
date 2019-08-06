import React from "react";

import { ITEM_CLASS_WEAPON, WEAPON_CUSTOM_DATA_STATS, IWeaponData, IStringDictionary, IAttackType, ARMOR_CUSTOM_DATA_STATS, IArmorData, ITEM_CLASS_ARMOR } from "../shared/types";
import { is } from "../shared/is";

interface IProps {
    instanceItem: PlayFabClientModels.ItemInstance;
}

interface IItemText {
    text?: string;
    secondaryText?: string;
    tertiaryText?: string;
}

export const Item = React.memo((props: IProps): React.ReactElement => {
    const initials = getInitials(props.instanceItem.DisplayName);

    let text = props.instanceItem.DisplayName;

    let itemText: IItemText = {
        text: "",
    };
    let getItemTextFunction: (customData: IStringDictionary) => IItemText;

    switch(props.instanceItem.ItemClass) {
        case ITEM_CLASS_WEAPON:
            getItemTextFunction = getWeaponText;
            break;
        case ITEM_CLASS_ARMOR:
            getItemTextFunction = getArmorText;
            break;
    }

    if(!is.null(getItemTextFunction)) {
        itemText = getItemTextFunction(props.instanceItem.CustomData);
    }

    if(!is.null(itemText.text)) {
        text = itemText.text;
    }

    return (
        <div>
            <p>[{initials}] {text}</p>
            {!is.null(itemText.secondaryText) && (
                <p>{itemText.secondaryText}</p>
            )}
            {!is.null(itemText.tertiaryText) && (
                <p>{itemText.tertiaryText}</p>
            )}
        </div>
    );
});

// ----- Helper functions ----- //

function getInitials(displayName: string): string {
    if(displayName.length < 3) {
        return displayName;
    }
    else {
        const words = displayName.split(" ");

        if(words.length === 1) {
            return displayName.substr(0, 2);
        }
        
        return words[0].charAt(0) + words[1].charAt(0);
    }
}

function getArmorText(customData: IStringDictionary): IItemText {
    const response: IItemText = {
        text: "",
        secondaryText: "",
        tertiaryText: "",
    };
    
    if(is.null(customData) || is.null(customData[ARMOR_CUSTOM_DATA_STATS])) {
        return response;
    }

    const data = JSON.parse(customData[ARMOR_CUSTOM_DATA_STATS]) as IArmorData;

    if(!is.null(data.name)) {
        if(data.isUnique) {
            response.text = `Unique ${data.name}`;
        }
        else {
            response.text = data.name;
        }
    }

    response.secondaryText = `${data.rarity} ${data.slot}`;

    response.tertiaryText = data.resistances.reduce((text, resistance, index) => {
        return `${text}${index > 0 && ", "}${resistance.flavor} ${Math.floor(resistance.resistance * 100)}`;
    }, "");

    return response;
}

function getWeaponText(customData: IStringDictionary): IItemText {
    const response: IItemText = {
        text: "",
        secondaryText: "",
        tertiaryText: "",
    };
    
    if(is.null(customData) || is.null(customData[WEAPON_CUSTOM_DATA_STATS])) {
        return response;
    }

    const data = JSON.parse(customData[WEAPON_CUSTOM_DATA_STATS]) as IWeaponData;

    if(!is.null(data.name)) {
        if(data.isUnique) {
            response.text = `Unique ${data.name}`;
        }
        else {
            response.text = data.name;
        }
    }

    response.secondaryText = `${data.rarity} ${data.category}`;

    // Pick out the most likely attack
    if(is.null(data.attacks)) {
        // This should be impossible
    }
    else if(data.attacks.length === 1) {
        response.tertiaryText = formatAttackType(data.attacks[0]);
    }
    else {
        response.tertiaryText = formatAttackType(getMostLikelyAttack(data.attacks));
    }
    
    return response;
}

function formatAttackType(attack: IAttackType): string {
    return `${attack.flavor} ${attack.power}PW/${attack.variance}v and ${attack.critical}c@${attack.reload}s`;
}

function getMostLikelyAttack(attacks: IAttackType[]): IAttackType {
    return attacks.reduce((mostLikely: IAttackType, currentAttack) => {
        if(is.null(mostLikely)) {
            return currentAttack;
        }

        if(mostLikely.probability < currentAttack.probability) {
            return currentAttack;
        }

        return mostLikely;
    }, null);
}