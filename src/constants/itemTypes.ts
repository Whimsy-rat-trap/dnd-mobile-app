// All possible InventoryItem.type values. Mirrors the union in types/Character.ts.
export const ITEM_TYPES = [
    'weapon',
    'armor',
    'potion',
    'scroll',
    'ring',
    'wand',
    'shield',
    'natural weapon',
    'other',
] as const;

export type ItemType = (typeof ITEM_TYPES)[number];
