import { Character } from '../types/Character';
import { ALL_SPELLS, SpellData } from '../constants/spells';
import {
    CLASS_SPELL_LISTS,
    ClassSpellListData,
} from '../constants/classSpellLists';

// Ключи и резолвинг класса

/**
 * Возвращает ключ в CLASS_SPELL_LISTS для пары (класс, подкласс).
 * Для EK/AT (у которых свой список) это 'Fighter:Eldritch Knight', ...
 * Для обычных классов — просто 'Wizard', 'Cleric' и т.д.
 *
 * Если подкласс не указан или у класса нет подклассового списка,
 * возвращает базовый ключ.
 */
export function resolveSpellListKey(
    className: string,
    subclass?: string
): string {
    if (subclass) {
        const composite = `${className}:${subclass}`;
        if (CLASS_SPELL_LISTS[composite]) return composite;
    }
    return className;
}

/**
 * Метаданные (ability, casterType, spellsByLevel) для класса/подкласса.
 */
export function getClassSpellListData(
    className: string,
    subclass?: string
): ClassSpellListData | undefined {
    return CLASS_SPELL_LISTS[resolveSpellListKey(className, subclass)];
}

// Списки заклинаний

/**
 * Все заклинания класса из ALL_SPELLS. Если задан `level`, только этого уровня.
 */
export function getSpellsForClass(
    className: string,
    level?: number,
    subclass?: string
): SpellData[] {
    const data = getClassSpellListData(className, subclass);
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

// Прогрессия уровня заклинаний

/**
 * Максимальный уровень заклинаний, доступный на данном уровне КЛАССА.
 * Возвращает 0, если класс ещё не получил Spellcasting.
 *
 * Формулы:
 *   - Полные (Bard, Cleric, Druid, Sorcerer, Warlock, Wizard): 1→1, 3→2, ...
 *   - Полукастеры (Paladin, Ranger): 2→1, 5→2, 9→3, 13→4, 17→5
 *   - Artificer: 1→1, 5→2, 9→3, 13→4, 17→5
 *   - Третьи (EK, AT): 3→1, 7→2, 13→3, 19→4
 *   - Warlock (Pact Magic): 1→1, 3→2, 5→3, 7→4, 9→5, 17→5
 */
export function getMaxSpellLevelForClass(
    className: string,
    classLevel: number,
    subclass?: string
): number {
    const data = getClassSpellListData(className, subclass);
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

// Доступные персонажу заклинания

/**
 * Все заклинания, доступные персонажу, с учётом его мультикласса,
 * подклассов (EK/AT) и уровней.
 */
export function getSpellsAvailableToCharacter(
    character: Character,
    options: { respectSpellLevel?: boolean } = {}
): SpellData[] {
    const { respectSpellLevel = true } = options;
    const byName = new Map(ALL_SPELLS.map(s => [s.name.toLowerCase(), s]));
    const result = new Map<string, SpellData>();

    for (const cl of character.classLevels || []) {
        const data = getClassSpellListData(cl.className, cl.subclass);
        if (!data) continue;

        const maxLevel = respectSpellLevel
            ? getMaxSpellLevelForClass(cl.className, cl.level, cl.subclass)
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

// Обратный индекс: spell name → классы

/**
 * Какие классы могут кастовать это заклинание по данным CLASS_SPELL_LISTS.
 * Для составных ключей ('Fighter:Eldritch Knight') возвращает базовый класс.
 */
export function getClassesForSpell(spellName: string): string[] {
    const lower = spellName.toLowerCase();
    const result = new Set<string>();

    for (const [key, data] of Object.entries(CLASS_SPELL_LISTS)) {
        const found = Object.values(data.spellsByLevel).some(names =>
            names.some(n => n.toLowerCase() === lower)
        );
        if (found) {
            const baseClass = key.includes(':') ? key.split(':')[0] : key;
            result.add(baseClass);
        }
    }

    return Array.from(result);
}