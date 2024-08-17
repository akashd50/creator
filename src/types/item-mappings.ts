import { ItemType } from "./item-type";

export const ItemIconMappings: Record<ItemType, string> = {
    [ItemType.Lava]: "orange.png",
    [ItemType.Earth]: "orange.png",
    [ItemType.DarkSouls]: "orange.png",
    [ItemType.Mountain]: "orange.png",
};

export const ItemLabelMappings: Record<ItemType, string> = {
    [ItemType.Lava]: "Lava",
    [ItemType.Earth]: "Earth",
    [ItemType.DarkSouls]: "Dark souls",
    [ItemType.Mountain]: "Mountain",
};


export const ItemMergeMappings: Record<ItemType, Record<ItemType, ItemType>> = {
    [ItemType.Lava]: {
        [ItemType.Lava]: ItemType.Lava,
        [ItemType.Earth]: ItemType.Earth,
        [ItemType.DarkSouls]: ItemType.Lava,
        [ItemType.Mountain]: ItemType.Lava,
    },
    [ItemType.Earth]: {
        [ItemType.Lava]: ItemType.Earth,
        [ItemType.Earth]: ItemType.Earth,
        [ItemType.DarkSouls]: ItemType.Earth,
        [ItemType.Mountain]: ItemType.Earth,
    },
    [ItemType.DarkSouls]: {
        [ItemType.Lava]: ItemType.Lava,
        [ItemType.Earth]: ItemType.Lava,
        [ItemType.DarkSouls]: ItemType.Lava,
        [ItemType.Mountain]: ItemType.Lava,
    },
    [ItemType.Mountain]: {
        [ItemType.Lava]: ItemType.Lava,
        [ItemType.Earth]: ItemType.Lava,
        [ItemType.DarkSouls]: ItemType.Lava,
        [ItemType.Mountain]: ItemType.Lava,
    },
};
