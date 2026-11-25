import { InventoryItem } from '../types/Character';
import { FINESSE_WEAPONS, RANGED_WEAPONS } from '../constants/weapons';

/**
 * Возвращает уникальные типы предметов из инвентаря.
 */
export const getTypes = (inventory: InventoryItem[]): string[] =>
    Array.from(new Set(inventory.map((i) => i.type)));

/**
 * Возвращает уникальные редкости предметов из инвентаря.
 */
export const getRarities = (inventory: InventoryItem[]): string[] =>
    Array.from(new Set(inventory.map((i) => i.rarity)));

export const isFinesse = (name: string): boolean =>
    FINESSE_WEAPONS.some((w) => name.toLowerCase().includes(w));

export const isRanged = (name: string): boolean =>
    RANGED_WEAPONS.some((w) => name.toLowerCase().includes(w));

/**
 * Проверяет, является ли предмет natural weapon.
 */
export const isNaturalWeapon = (type: string): boolean => type === 'natural weapon';

/**
 * Фильтрует предметы инвентаря по поисковому запросу и фильтрам.
 */
export const filterInventoryItems = (
    inventory: InventoryItem[],
    searchQuery: string,
    filters: { type: string; rarity: string }
): InventoryItem[] => {
    const query = searchQuery.toLowerCase().trim();
    return inventory.filter((item) => {
        const matchesSearch =
            !query ||
            item.name.toLowerCase().includes(query) ||
            (item.description || '').toLowerCase().includes(query);
        const matchesType = !filters.type || item.type === filters.type;
        const matchesRarity = !filters.rarity || item.rarity === filters.rarity;
        return matchesSearch && matchesType && matchesRarity;
    });
};

/**
 * Определяет, есть ли у предмета характеристики для отображения в блоке статов.
 */
export const hasItemStats = (item: InventoryItem): boolean =>
    Boolean(
        item.damageDice ||
        item.healingDice ||
        item.uses ||
        item.baseAC !== undefined ||
        item.acBonus !== undefined ||
        item.strengthRequirement !== undefined ||
        item.stealthDisadvantage ||
        item.attunement
    );

/**
 * Формирует строку описания AC для брони.
 */
export const formatACDescription = (item: InventoryItem): string => {
    let desc = `AC ${item.baseAC}`;
    if (item.dexModifierAllowed) {
        desc += item.maxDexBonus !== undefined ? ` + Dex (max ${item.maxDexBonus})` : ' + Dex';
    }
    return desc;
};
