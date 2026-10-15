import { SpellData } from './types';
import { CANTRIPS } from './cantrips';
import { LEVEL_1_SPELLS } from './level1';
import { LEVEL_2_SPELLS } from './level2';
import { LEVEL_3_SPELLS } from './level3';
import { LEVEL_4_SPELLS } from './level4';
import { LEVEL_5_SPELLS } from './level5';
import { CLASS_SPELL_LISTS } from '../classSpellLists';

// ---------------------------------------------------------------------------
// Синхронизация spell.classes ← CLASS_SPELL_LISTS
// ---------------------------------------------------------------------------
//
// Единственный источник правды для "какие классы могут кастовать заклинание" —
// CLASS_SPELL_LISTS. Здесь мы пересчитываем поле `classes` у каждого заклинания
// при загрузке, чтобы данные не разъезжались.
//
// Пока CLASS_SPELL_LISTS содержит не все классы, работаем в MERGE-режиме:
// новые классы ДОБАВЛЯЮТСЯ к уже существующим, но не удаляют старые.
//
// Когда все классы будут заполнены — заменить MERGE_MODE на false,
// и тогда `classes` станет полностью производным от CLASS_SPELL_LISTS.
// После этого можно вовсе удалить `classes` из SpellData (опционально).

const MERGE_MODE = true;

function getClassesForSpellFromLists(name: string): string[] {
    const lower = name.toLowerCase();
    const classes: string[] = [];

    for (const [className, data] of Object.entries(CLASS_SPELL_LISTS)) {
        const found = Object.values(data.spellsByLevel).some(names =>
            names.some(n => n.toLowerCase() === lower)
        );
        if (found) classes.push(className);
    }

    return classes;
}

function syncSpellClasses(spells: SpellData[]): SpellData[] {
    return spells.map(s => {
        const fromLists = getClassesForSpellFromLists(s.name);

        if (MERGE_MODE) {
            const merged = Array.from(new Set([...(s.classes || []), ...fromLists]));
            return { ...s, classes: merged };
        }

        // Replace-режим (включим, когда все списки классов будут готовы)
        if (fromLists.length > 0) {
            return { ...s, classes: fromLists };
        }
        return { ...s, classes: s.classes || [] };
    });
}

// Итоговый массив — единая точка для всей аппки

export const ALL_SPELLS: SpellData[] = syncSpellClasses([
    ...CANTRIPS,
    ...LEVEL_1_SPELLS,
    ...LEVEL_2_SPELLS,
    ...LEVEL_3_SPELLS,
    ...LEVEL_4_SPELLS,
    ...LEVEL_5_SPELLS,
]);

// Индивидуальные экспорты для случаев когда нужен только конкретный уровень
// они НЕ синхронизированы. Если где-то нужны классы юзай ALL_SPELLS
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
        case 0: return ALL_SPELLS.filter(s => s.level === 0);
        case 1: return ALL_SPELLS.filter(s => s.level === 1);
        case 2: return ALL_SPELLS.filter(s => s.level === 2);
        case 3: return ALL_SPELLS.filter(s => s.level === 3);
        case 4: return ALL_SPELLS.filter(s => s.level === 4);
        case 5: return ALL_SPELLS.filter(s => s.level === 5);
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