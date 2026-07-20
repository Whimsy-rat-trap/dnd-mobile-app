type SpellSlots = Record<number, number>; // key: уровень заклинания, value: количество слотов

// Таблица для Wizard, подходит для большинства
const WIZARD_SLOTS: Record<number, SpellSlots> = {
    1: { 1: 2 },
    2: { 1: 3 },
    3: { 1: 4, 2: 2 },
    4: { 1: 4, 2: 3 },
    5: { 1: 4, 2: 3, 3: 2 },
    6: { 1: 4, 2: 3, 3: 3 },
    7: { 1: 4, 2: 3, 3: 3, 4: 1 },
    8: { 1: 4, 2: 3, 3: 3, 4: 2 },
    9: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 },
    10: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 },
    11: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1 },
    12: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1 },
    13: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1 },
    14: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1 },
    15: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1 },
    16: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1 },
    17: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1, 9: 1 },
    18: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 1, 7: 1, 8: 1, 9: 1 },
    19: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 1, 8: 1, 9: 1 },
    20: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 2, 8: 1, 9: 1 },
};

const WARLOCK_SLOTS: Record<number, SpellSlots> = {
    1: { 1: 1 },
    2: { 1: 2 },
    3: { 2: 2 },
    4: { 2: 2 },
    5: { 3: 2 },
    6: { 3: 2 },
    7: { 4: 2 },
    8: { 4: 2 },
    9: { 5: 2 },
    10: { 5: 2 },
    11: { 5: 3 },
    12: { 5: 3 },
    13: { 5: 3 },
    14: { 5: 3 },
    15: { 5: 3 },
    16: { 5: 3 },
    17: { 5: 4 },
    18: { 5: 4 },
    19: { 5: 4 },
    20: { 5: 4 },
};

export function getSpellSlots(classname: string, level: number): SpellSlots {
    if (classname === 'Warlock') {
        return WARLOCK_SLOTS[level] || {};
    }
    return WIZARD_SLOTS[level] || {};
}

// Вычисляем общее количество слотов
export function getTotalSpellSlots(classname: string, level: number): number {
    const slots = getSpellSlots(classname, level);
    return Object.values(slots).reduce((a, b) => a + b, 0);
}

// Вычисляем максимальное количество подготовленных заклинаний (для классов, которые готовят)
export function getMaxPreparedSpells(character: any): number {
    const classLower = character.class.toLowerCase();
    let mod = 0;
    if (classLower === 'wizard' || classLower === 'artificer') {
        mod = Math.floor((character.abilities.int - 10) / 2);
    } else if (classLower === 'cleric' || classLower === 'druid' || classLower === 'ranger') {
        mod = Math.floor((character.abilities.wis - 10) / 2);
    } else if (classLower === 'sorcerer' || classLower === 'warlock' || classLower === 'bard') {
        mod = Math.floor((character.abilities.cha - 10) / 2);
    } else {
        mod = 0;
    }
    return Math.max(character.level + mod, 1);
}