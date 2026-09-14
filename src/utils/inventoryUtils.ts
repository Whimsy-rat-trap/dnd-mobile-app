import { InventoryItem } from '../types/Character';

/**
 * Возвращает уникальные типы предметов из инвентаря.
 */
export const getTypes = (inventory: InventoryItem[]): string[] =>
    Array.from(new Set(inventory.map(i => i.type)));

/**
 * Возвращает уникальные редкости предметов из инвентаря.
 */
export const getRarities = (inventory: InventoryItem[]): string[] =>
    Array.from(new Set(inventory.map(i => i.rarity)));

/**
 * Возвращает цвет для указанной редкости.
 */
export const getRarityColor = (rarity: string): string => {
    switch (rarity) {
        case 'common': return '#9ca3af';
        case 'uncommon': return '#34d399';
        case 'rare': return '#60a5fa';
        case 'very rare': return '#a78bfa';
        case 'legendary': return '#fbbf24';
        default: return '#fff';
    }
};

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
    return inventory.filter(item => {
        const matchesSearch = !query ||
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
        item.stealthDisadvantage
    );

/**
 * Формирует строку описания AC для брони.
 */
export const formatACDescription = (item: InventoryItem): string => {
    let desc = `AC ${item.baseAC}`;
    if (item.dexModifierAllowed) {
        desc += item.maxDexBonus !== undefined
            ? ` + Dex (max ${item.maxDexBonus})`
            : ' + Dex';
    }
    return desc;
};