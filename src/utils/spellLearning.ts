import { Character } from '../types/Character';
import { ALL_SPELLS, SpellData } from '../constants/spells';
import { getClassSpellListData, getMaxSpellLevelForClass } from './classSpellUtils';
import {
    isKnownCaster,
    getNewSpellsToLearn,
    getNewCantripsToLearn,
} from '../constants/spellsKnown';

export interface SpellLearningInfo {
    spellsToLearn: number;
    cantripsToLearn: number;
    maxSpellLevel: number;
}

/**
 * Информация о том, сколько заклинаний / кантрипов нужно выучить
 * при переходе с `fromLevel` на `toLevel` в данном классе.
 *
 * Возвращает null, если класс не known caster или учить нечего.
 */
export function getSpellLearningInfo(
    className: string,
    fromLevel: number,
    toLevel: number
): SpellLearningInfo | null {
    if (!isKnownCaster(className)) return null;

    const spellsToLearn = getNewSpellsToLearn(className, fromLevel, toLevel);
    const cantripsToLearn = getNewCantripsToLearn(className, fromLevel, toLevel);

    if (spellsToLearn === 0 && cantripsToLearn === 0) return null;

    const maxSpellLevel = getMaxSpellLevelForClass(className, toLevel);

    return { spellsToLearn, cantripsToLearn, maxSpellLevel };
}

/**
 * Кандидаты для изучения: заклинания из списка класса, которых ещё нет в книге.
 *
 * @param onlyCantrips — если true, возвращает только кантрипы (level 0);
 *                       если false — только НЕ кантрипы, ≤ maxSpellLevel.
 */
export function getSpellCandidates(
    character: Character,
    className: string,
    maxSpellLevel: number,
    onlyCantrips: boolean
): SpellData[] {
    const data = getClassSpellListData(className);
    if (!data) return [];

    const existing = new Set(character.spells.map((s) => s.name.toLowerCase()));
    const byName = new Map(ALL_SPELLS.map((s) => [s.name.toLowerCase(), s]));

    const result: SpellData[] = [];

    for (const [lvlStr, names] of Object.entries(data.spellsByLevel)) {
        const lvl = Number(lvlStr);

        if (onlyCantrips) {
            if (lvl !== 0) continue;
        } else {
            if (lvl === 0) continue;
            if (lvl > maxSpellLevel) continue;
        }

        for (const name of names) {
            const key = name.toLowerCase();
            if (existing.has(key)) continue;
            const spell = byName.get(key);
            if (spell) result.push(spell);
        }
    }

    // Сортируем по уровню, потом по имени
    result.sort((a, b) => {
        if (a.level !== b.level) return a.level - b.level;
        return a.name.localeCompare(b.name);
    });

    return result;
}
