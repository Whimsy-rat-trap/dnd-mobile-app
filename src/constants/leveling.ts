/**
 * Правила level-up для D&D 5e.
 *
 * XP_TABLE[level] — минимальный накопленный XP для достижения уровня.
 * XP_TO_NEXT[level] — сколько XP нужно набрать внутри уровня (для UI).
 */

export const XP_TABLE: number[] = [
    0,        // level 1
    300,      // level 2
    900,      // level 3
    2_700,    // level 4
    6_500,    // level 5
    14_000,   // level 6
    23_000,   // level 7
    34_000,   // level 8
    48_000,   // level 9
    64_000,   // level 10
    85_000,   // level 11
    100_000,  // level 12
    120_000,  // level 13
    140_000,  // level 14
    165_000,  // level 15
    195_000,  // level 16
    225_000,  // level 17
    265_000,  // level 18
    305_000,  // level 19
    355_000,  // level 20
];

export const XP_TO_NEXT: number[] = [
    300,        // 1 → 2
    600,        // 2 → 3
    1_800,      // 3 → 4
    3_800,      // 4 → 5
    7_500,      // 5 → 6
    9_000,      // 6 → 7
    11_000,     // 7 → 8
    14_000,     // 8 → 9
    16_000,     // 9 → 10
    21_000,     // 10 → 11
    15_000,     // 11 → 12
    20_000,     // 12 → 13
    20_000,     // 13 → 14
    25_000,     // 14 → 15
    30_000,     // 15 → 16
    30_000,     // 16 → 17
    40_000,     // 17 → 18
    40_000,     // 18 → 19
    50_000,     // 19 → 20
];

/**
 * Уровни класса, на которых персонаж получает ASI (Ability Score Improvement).
 * Разные для Fighter и Rogue.
 */
export const ASI_LEVELS_BY_CLASS: Record<string, number[]> = {
    Barbarian: [4, 8, 12, 16, 19],
    Bard:      [4, 8, 12, 16, 19],
    Cleric:    [4, 8, 12, 16, 19],
    Druid:     [4, 8, 12, 16, 19],
    Fighter:   [4, 6, 8, 12, 14, 16, 19],
    Monk:      [4, 8, 12, 16, 19],
    Paladin:   [4, 8, 12, 16, 19],
    Ranger:    [4, 8, 12, 16, 19],
    Rogue:     [4, 8, 10, 12, 16, 19],
    Sorcerer:  [4, 8, 12, 16, 19],
    Warlock:   [4, 8, 12, 16, 19],
    Wizard:    [4, 8, 12, 16, 19],
    Artificer: [4, 8, 12, 16, 19],
};

/**
 * Уровень класса, на котором персонаж выбирает подкласс.
 */
export const SUBCLASS_LEVEL_BY_CLASS: Record<string, number> = {
    Barbarian: 3,
    Bard:      3,
    Cleric:    1,
    Druid:     2,
    Fighter:   3,
    Monk:      3,
    Paladin:   3,
    Ranger:    3,
    Rogue:     3,
    Sorcerer:  1,
    Warlock:   1,
    Wizard:    2,
    Artificer: 3,
};

export const MAX_LEVEL = 20;