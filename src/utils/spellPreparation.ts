import { Character, Spell } from '../types/Character';
import { getMaxPrepared } from './spellcasting';
import { getMaxSpellLevelForClass } from './classSpellUtils';

const PREPARED_CASTER_CLASSES = ['Wizard', 'Cleric', 'Druid', 'Paladin', 'Artificer'];

/**
 * Есть ли у персонажа класс, который готовит заклинания (не known caster).
 */
export function hasPreparedCaster(character: Character): boolean {
    return (character.classLevels || []).some(cl =>
        PREPARED_CASTER_CLASSES.includes(cl.className)
    );
}

/**
 * Может ли персонаж готовить заклинания в принципе.
 */
export function canPrepareSpells(character: Character): boolean {
    if (!hasPreparedCaster(character)) return false;
    if (getMaxPrepared(character) <= 0) return false;
    return true;
}

/**
 * Максимальный уровень заклинаний, который персонаж может кастовать
 * (по любому из его классов). Спеллы выше — нельзя готовить.
 */
export function getMaxCastableLevel(character: Character): number {
    let max = 0;
    for (const cl of character.classLevels || []) {
        const lvl = getMaxSpellLevelForClass(cl.className, cl.level, cl.subclass);
        if (lvl > max) max = lvl;
    }
    return max;
}

export interface PreparableSpellsData {
    /** Заклинания, которые можно/нужно готовить (не cantrip, не racial, не always-prepared). */
    spells: Spell[];
    /** Заклинания, которые уже always-prepared (не считаются в лимите). */
    alwaysPrepared: Spell[];
    /** Максимум подготовленных. */
    maxPrepared: number;
    /** Сколько сейчас подготовлено (без always-prepared и cantrips). */
    currentPrepared: number;
    /** Максимальный уровень заклинаний, которые можно готовить. */
    maxCastableLevel: number;
}

/**
 * Готовит данные для модалки подготовки заклинаний.
 */
export function getPreparableSpellsData(character: Character): PreparableSpellsData {
    const maxCastableLevel = getMaxCastableLevel(character);
    const preparable: Spell[] = [];
    const alwaysPrepared: Spell[] = [];

    for (const s of character.spells) {
        if (s.isAlwaysPrepared || s.isRacial) {
            alwaysPrepared.push(s);
            continue;
        }
        // Cantrips — всегда доступны, не считаются
        if (s.level === 0) continue;
        // Выше доступного уровня — нельзя готовить
        if (s.level > maxCastableLevel) continue;
        preparable.push(s);
    }

    // Сортируем: по уровню, потом по имени
    preparable.sort((a, b) => {
        if (a.level !== b.level) return a.level - b.level;
        return a.name.localeCompare(b.name);
    });

    // Сортируем always-prepared тоже
    alwaysPrepared.sort((a, b) => {
        if (a.level !== b.level) return a.level - b.level;
        return a.name.localeCompare(b.name);
    });

    const maxPrepared = getMaxPrepared(character);
    const currentPrepared = preparable.filter(s => s.prepared).length;

    return {
        spells: preparable,
        alwaysPrepared,
        maxPrepared,
        currentPrepared,
        maxCastableLevel,
    };
}