/**
 * Таблицы известных заклинаний и кантрипов для known caster'ов.
 *
 * Правило level-up: сколько новых заклинаний учить = (known на новом уровне)
 * минус (known на текущем уровне).
 *
 * Known caster'ы в 5e: Bard, Sorcerer, Warlock, Ranger.
 * (Eldritch Knight / Arcane Trickster — подклассы, у них свои таблицы,
 *  здесь не покрываются.)
 */

export const SPELLS_KNOWN_BY_CLASS: Record<string, Record<number, number>> = {
    Bard: {
        1: 4,
        2: 5,
        3: 6,
        4: 7,
        5: 8,
        6: 9,
        7: 10,
        8: 11,
        9: 12,
        10: 14,
        11: 15,
        12: 15,
        13: 16,
        14: 18,
        15: 19,
        16: 19,
        17: 20,
        18: 22,
        19: 22,
        20: 22,
    },
    Sorcerer: {
        1: 2,
        2: 3,
        3: 4,
        4: 5,
        5: 6,
        6: 7,
        7: 8,
        8: 9,
        9: 10,
        10: 11,
        11: 12,
        12: 12,
        13: 13,
        14: 13,
        15: 14,
        16: 14,
        17: 15,
        18: 15,
        19: 15,
        20: 15,
    },
    Warlock: {
        1: 2,
        2: 3,
        3: 4,
        4: 5,
        5: 6,
        6: 7,
        7: 8,
        8: 9,
        9: 10,
        10: 10,
        11: 11,
        12: 11,
        13: 12,
        14: 12,
        15: 13,
        16: 13,
        17: 14,
        18: 14,
        19: 15,
        20: 15,
    },
    Ranger: {
        1: 0,
        2: 2,
        3: 3,
        4: 3,
        5: 4,
        6: 4,
        7: 5,
        8: 5,
        9: 6,
        10: 6,
        11: 7,
        12: 7,
        13: 8,
        14: 8,
        15: 9,
        16: 9,
        17: 10,
        18: 10,
        19: 11,
        20: 11,
    },
};

export const CANTRIPS_KNOWN_BY_CLASS: Record<string, Record<number, number>> = {
    Bard: { 1: 2, 4: 3, 10: 4 },
    Sorcerer: { 1: 4, 4: 5, 10: 6 },
    Warlock: { 1: 2, 4: 3, 10: 4 },
    // Ranger: кантрипов нет
};

export function isKnownCaster(className: string): boolean {
    return className in SPELLS_KNOWN_BY_CLASS;
}

function lookupAtLevel(table: Record<number, number> | undefined, level: number): number {
    if (!table) return 0;
    let count = 0;
    for (const [lvl, n] of Object.entries(table)) {
        if (level >= Number(lvl)) count = n;
    }
    return count;
}

export function getSpellsKnownAtLevel(className: string, level: number): number {
    return lookupAtLevel(SPELLS_KNOWN_BY_CLASS[className], level);
}

export function getCantripsKnownAtLevel(className: string, level: number): number {
    return lookupAtLevel(CANTRIPS_KNOWN_BY_CLASS[className], level);
}

export function getNewSpellsToLearn(className: string, fromLevel: number, toLevel: number): number {
    return Math.max(
        0,
        getSpellsKnownAtLevel(className, toLevel) - getSpellsKnownAtLevel(className, fromLevel)
    );
}

export function getNewCantripsToLearn(
    className: string,
    fromLevel: number,
    toLevel: number
): number {
    return Math.max(
        0,
        getCantripsKnownAtLevel(className, toLevel) - getCantripsKnownAtLevel(className, fromLevel)
    );
}
