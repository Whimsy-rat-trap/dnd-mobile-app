import { SpellData } from './types';
import { CANTRIPS } from './cantrips';
import { LEVEL_1_SPELLS } from './level1';
import { LEVEL_2_SPELLS } from './level2';
import { LEVEL_3_SPELLS } from './level3';
import { LEVEL_4_SPELLS } from './level4';
import { LEVEL_5_SPELLS } from './level5';

// Объединённый массив всех заклинаний (обратная совместимость)
export const ALL_SPELLS: SpellData[] = [
    ...CANTRIPS,
    ...LEVEL_1_SPELLS,
    ...LEVEL_2_SPELLS,
    ...LEVEL_3_SPELLS,
    ...LEVEL_4_SPELLS,
    ...LEVEL_5_SPELLS,
];

// Индивидуальные экспорты для случаев, когда нужен только конкретный уровень
export { CANTRIPS, LEVEL_1_SPELLS, LEVEL_2_SPELLS, LEVEL_3_SPELLS, LEVEL_4_SPELLS, LEVEL_5_SPELLS };
export type { SpellData };

// Утилиты

/**
 * Возвращает заклинания указанного уровня.
 * Если level === undefined — возвращает все.
 */
export function getSpellsByLevel(level?: number): SpellData[] {
    if (level === undefined) return ALL_SPELLS;
    switch (level) {
        case 0: return CANTRIPS;
        case 1: return LEVEL_1_SPELLS;
        case 2: return LEVEL_2_SPELLS;
        case 3: return LEVEL_3_SPELLS;
        case 4: return LEVEL_4_SPELLS;
        case 5: return LEVEL_5_SPELLS;
        default: return [];
    }
}

/**
 * Быстрый поиск заклинания по имени.
 * Если нужно найти одно заклинание — используйте эту функцию.
 */
export function getSpellByName(name: string): SpellData | undefined {
    const lower = name.toLowerCase();
    return ALL_SPELLS.find(s => s.name.toLowerCase() === lower);
}

/**
 * Возвращает заклинания, доступные указанному классу.
 */
export function getSpellsByClass(className: string): SpellData[] {
    return ALL_SPELLS.filter(s => s.classes?.includes(className));
}