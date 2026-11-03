import { Character, Spell } from '../types/Character';
import { ALL_SPELLS, SpellData } from '../constants/spells';
import { getClassSpellListData, getMaxSpellLevelForClass } from './classSpellUtils';

/**
 * Known casters, у которых есть смысл в «swap spell»:
 * они учат фиксированный список, и замена позволяет исправить ошибки выбора.
 */
const KNOWN_CASTER_CLASSES = ['Bard', 'Sorcerer', 'Warlock', 'Ranger'];

export function canSwapSpellOnLongRest(character: Character): boolean {
    return (character.classLevels || []).some(cl =>
        KNOWN_CASTER_CLASSES.includes(cl.className)
    );
}

/**
 * Заклинания, которые можно «забыть» для свапа.
 * Только не-cantrips, не racial, не always-prepared.
 */
export function getForgettableSpells(character: Character): Spell[] {
    const result: Spell[] = [];
    for (const s of character.spells) {
        if (s.level === 0) continue;
        if (s.isRacial || s.isAlwaysPrepared) continue;
        result.push(s);
    }
    result.sort((a, b) => {
        if (a.level !== b.level) return a.level - b.level;
        return a.name.localeCompare(b.name);
    });
    return result;
}

/**
 * Заклинания, которые можно «выучить» вместо забытого:
 *   - из списка known-caster классов персонажа;
 *   - level ≤ maxLevel (не выше забытого);
 *   - не кантрип;
 *   - не уже в книге.
 */
export function getLearnableSpellsForSwap(
    character: Character,
    maxLevel: number
): SpellData[] {
    const existing = new Set(character.spells.map(s => s.name.toLowerCase()));
    const byName = new Map(ALL_SPELLS.map(s => [s.name.toLowerCase(), s]));
    const result = new Map<string, SpellData>();

    for (const cl of character.classLevels || []) {
        if (!KNOWN_CASTER_CLASSES.includes(cl.className)) continue;
        const data = getClassSpellListData(cl.className, cl.subclass);
        if (!data) continue;

        const classMax = getMaxSpellLevelForClass(cl.className, cl.level, cl.subclass);
        const limit = Math.min(maxLevel, classMax);

        for (const [lvlStr, names] of Object.entries(data.spellsByLevel)) {
            const lvl = Number(lvlStr);
            if (lvl === 0) continue;
            if (lvl > limit) continue;
            for (const name of names) {
                const key = name.toLowerCase();
                if (existing.has(key)) continue;
                if (result.has(key)) continue;
                const spell = byName.get(key);
                if (spell) result.set(key, spell);
            }
        }
    }

    return Array.from(result.values()).sort((a, b) => {
        if (a.level !== b.level) return a.level - b.level;
        return a.name.localeCompare(b.name);
    });
}