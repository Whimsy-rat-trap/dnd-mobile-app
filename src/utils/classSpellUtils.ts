import { Character } from '../types/Character';
import { ALL_SPELLS, SpellData } from '../constants/spells';
import {
    CLASS_SPELL_LISTS,
    ClassSpellListData,
} from '../constants/classSpellLists';

/**
 * Возвращает данные класса (ability, casterType, spell list).
 */
export function getClassSpellListData(
    className: string
): ClassSpellListData | undefined {
    return CLASS_SPELL_LISTS[className];
}

/**
 * Возвращает все заклинания из ALL_SPELLS, которые есть в списке класса,
 * включая те, что ещё не существуют в базе (будут отфильтрованы).
 */
export function getSpellsForClass(
    className: string,
    level?: number
): SpellData[] {
    const data = CLASS_SPELL_LISTS[className];
    if (!data) return [];

    const names =
        level === undefined
            ? Object.values(data.spellsByLevel).flat()
            : data.spellsByLevel[level] || [];

    const byName = new Map(ALL_SPELLS.map(s => [s.name.toLowerCase(), s]));
    return names
        .map(n => byName.get(n.toLowerCase()))
        .filter((s): s is SpellData => !!s);
}

/**
 * Максимальный уровень заклинаний, доступный на данном уровне класса.
 * Формулы по типам кастеров:
 *   - Полные (Wizard, Cleric, ...): 1→1, 3→2, 5→3, 7→4, 9→5, 11→6, 13→7, 15→8, 17→9
 *   - Полукастеры (Paladin, Ranger): 2→1, 5→2, 9→3, 13→4, 17→5
 *   - Artificer: 1→1, 5→2, 9→3, 13→4, 17→5 (как полукастер, но старт с 1-го уровня)
 *   - Третьи (EK, AT): 3→1, 7→2, 13→3, 19→4
 *   - Warlock: отдельная таблица, смотри WARLOCK_SLOTS в spellcasting.ts
 */
export function getMaxSpellLevelForClass(
    className: string,
    classLevel: number
): number {
    const data = CLASS_SPELL_LISTS[className];
    if (!data) return 0;
    if (classLevel < data.startsAtClassLevel) return 0;

    if (className === 'Artificer') {
        if (classLevel >= 17) return 5;
        if (classLevel >= 13) return 4;
        if (classLevel >= 9) return 3;
        if (classLevel >= 5) return 2;
        return 1;
    }
    if (className === 'Paladin' || className === 'Ranger') {
        if (classLevel >= 17) return 5;
        if (classLevel >= 13) return 4;
        if (classLevel >= 9) return 3;
        if (classLevel >= 5) return 2;
        if (classLevel >= 2) return 1;
        return 0;
    }
    if (className === 'Fighter' || className === 'Rogue') {
        // Eldritch Knight / Arcane Trickster
        if (classLevel >= 19) return 4;
        if (classLevel >= 13) return 3;
        if (classLevel >= 7) return 2;
        if (classLevel >= 3) return 1;
        return 0;
    }
    if (className === 'Warlock') {
        if (classLevel >= 17) return 5;
        if (classLevel >= 9) return 5;
        if (classLevel >= 7) return 4;
        if (classLevel >= 5) return 3;
        if (classLevel >= 3) return 2;
        return 1;
    }
    // Полные кастеры
    if (classLevel >= 17) return 9;
    if (classLevel >= 15) return 8;
    if (classLevel >= 13) return 7;
    if (classLevel >= 11) return 6;
    if (classLevel >= 9) return 5;
    if (classLevel >= 7) return 4;
    if (classLevel >= 5) return 3;
    if (classLevel >= 3) return 2;
    return 1;
}

/**
 * Возвращает все заклинания, доступные персонажу по его классам,
 * с учётом максимального уровня, который он может кастовать.
 *
 * Использование в SpellsLibrary для фильтра "Available to this character".
 */
export function getSpellsAvailableToCharacter(
    character: Character,
    options: { respectSpellLevel?: boolean } = {}
): SpellData[] {
    const { respectSpellLevel = true } = options;
    const byName = new Map(ALL_SPELLS.map(s => [s.name.toLowerCase(), s]));
    const result = new Map<string, SpellData>();

    for (const cl of character.classLevels || []) {
        const data = CLASS_SPELL_LISTS[cl.className];
        if (!data) continue;

        const maxLevel = respectSpellLevel
            ? getMaxSpellLevelForClass(cl.className, cl.level)
            : 9;

        for (const [lvlStr, names] of Object.entries(data.spellsByLevel)) {
            const lvl = Number(lvlStr);
            if (lvl > maxLevel) continue;
            for (const name of names) {
                const key = name.toLowerCase();
                if (result.has(key)) continue;
                const spell = byName.get(key);
                if (spell) result.set(key, spell);
            }
        }
    }

    return Array.from(result.values());
}