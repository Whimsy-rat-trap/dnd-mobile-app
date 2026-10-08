import { Character, ClassLevel } from '../types/Character';

// Классы по типу кастера

/** Полные кастеры: уровень класса = уровень кастера. */
const FULL_CASTER_CLASSES = ['Bard', 'Cleric', 'Druid', 'Sorcerer', 'Wizard'];

/** Полукастеры: округление вниз. */
const HALF_CASTER_CLASSES = ['Paladin', 'Ranger'];

/** Artificer — особый случай: полукастер, но округление вверх и доступен с 1-го уровня. */
const ARTIFICER_CLASS = 'Artificer';

/** Варлок — уникальная система слотов. */
const WARLOCK_CLASS = 'Warlock';

/**
 * Подклассы-третьи кастеры.
 * Получают заклинания начиная с 3-го уровня, используют INT, кастер-левел = floor(class level / 3).
 */
const THIRD_CASTER_SUBCLASSES: Record<string, string[]> = {
    Fighter: ['Eldritch Knight'],
    Rogue: ['Arcane Trickster'],
};

/**
 * Является ли конкретный класс (с его подклассом и уровнем) заклинателем.
 * @param className — название класса
 * @param subclass — подкласс этого класса (для проверки третьих кастеров)
 * @param classLevel — уровень в этом классе (для третьих кастеров нужно >= 3)
 */
export function isClassSpellcaster(
    className: string,
    subclass: string | undefined,
    classLevel: number
): boolean {
    if (FULL_CASTER_CLASSES.includes(className)) return true;
    if (HALF_CASTER_CLASSES.includes(className)) return true;
    if (className === ARTIFICER_CLASS) return true;
    if (className === WARLOCK_CLASS) return true;

    if (subclass && THIRD_CASTER_SUBCLASSES[className]?.includes(subclass)) {
        return classLevel >= 3;
    }

    return false;
}

/**
 * Является ли персонаж заклинателем хотя бы по одному классу.
 */
export function isSpellcastingClass(character: Character): boolean {
    if (!character.classLevels || character.classLevels.length === 0) return false;
    return character.classLevels.some(cl =>
        isClassSpellcaster(cl.className, cl.subclass, cl.level)
    );
}

/**
 * Вклад одного класса в общий уровень кастера.
 * Варлок считается отдельно и здесь возвращает 0.
 * Третьи кастеры (EK/AT) считаются как floor(level / 3).
 */
function getCasterLevelContribution(cl: ClassLevel): number {
    const { className, level, subclass } = cl;

    if (FULL_CASTER_CLASSES.includes(className)) return level;
    if (HALF_CASTER_CLASSES.includes(className)) return Math.floor(level / 2);
    if (className === ARTIFICER_CLASS) return Math.ceil(level / 2);
    if (className === WARLOCK_CLASS) return 0;

    if (subclass && THIRD_CASTER_SUBCLASSES[className]?.includes(subclass)) {
        return level >= 3 ? Math.floor(level / 3) : 0;
    }

    return 0;
}

/** Слоты полного кастера (по уровню кастера 1–20). */
const FULL_CASTER_SLOTS: Record<number, number[]> = {
    1: [2,0,0,0,0,0,0,0,0],
    2: [3,0,0,0,0,0,0,0,0],
    3: [4,2,0,0,0,0,0,0,0],
    4: [4,3,0,0,0,0,0,0,0],
    5: [4,3,2,0,0,0,0,0,0],
    6: [4,3,3,0,0,0,0,0,0],
    7: [4,3,3,1,0,0,0,0,0],
    8: [4,3,3,2,0,0,0,0,0],
    9: [4,3,3,3,1,0,0,0,0],
    10: [4,3,3,3,2,0,0,0,0],
    11: [4,3,3,3,2,1,0,0,0],
    12: [4,3,3,3,2,1,0,0,0],
    13: [4,3,3,3,2,1,1,0,0],
    14: [4,3,3,3,2,1,1,0,0],
    15: [4,3,3,3,2,1,1,1,0],
    16: [4,3,3,3,2,1,1,1,0],
    17: [4,3,3,3,2,1,1,1,1],
    18: [4,3,3,3,3,1,1,1,1],
    19: [4,3,3,3,3,2,1,1,1],
    20: [4,3,3,3,3,2,2,1,1],
};

/** Слоты варлока (по уровню 1–20). */
const WARLOCK_SLOTS: Record<number, number[]> = {
    1: [1,0,0,0,0,0,0,0,0],
    2: [2,0,0,0,0,0,0,0,0],
    3: [0,2,0,0,0,0,0,0,0],
    4: [0,2,0,0,0,0,0,0,0],
    5: [0,0,2,0,0,0,0,0,0],
    6: [0,0,2,0,0,0,0,0,0],
    7: [0,0,0,2,0,0,0,0,0],
    8: [0,0,0,2,0,0,0,0,0],
    9: [0,0,0,0,2,0,0,0,0],
    10: [0,0,0,0,2,0,0,0,0],
    11: [0,0,0,0,3,0,0,0,0],
    12: [0,0,0,0,3,0,0,0,0],
    13: [0,0,0,0,3,0,0,0,0],
    14: [0,0,0,0,3,0,0,0,0],
    15: [0,0,0,0,3,0,0,0,0],
    16: [0,0,0,0,3,0,0,0,0],
    17: [0,0,0,0,4,0,0,0,0],
    18: [0,0,0,0,4,0,0,0,0],
    19: [0,0,0,0,4,0,0,0,0],
    20: [0,0,0,0,4,0,0,0,0],
};

/** Слоты третьего кастера (Eldritch Knight / Arcane Trickster). */
const THIRD_CASTER_SLOTS: Record<number, number[]> = {
    1: [2,0,0,0,0,0,0,0,0],
    2: [3,0,0,0,0,0,0,0,0],
    3: [3,0,0,0,0,0,0,0,0],
    4: [4,2,0,0,0,0,0,0,0],
    5: [4,2,0,0,0,0,0,0,0],
    6: [4,3,0,0,0,0,0,0,0],
};

function getFullCasterSlots(level: number): number[] {
    if (level < 1 || level > 20) return Array(9).fill(0);
    return FULL_CASTER_SLOTS[level] || Array(9).fill(0);
}

function getWarlockSlots(level: number): number[] {
    if (level < 1 || level > 20) return Array(9).fill(0);
    return WARLOCK_SLOTS[level] || Array(9).fill(0);
}

function getThirdCasterSlots(casterLevel: number): number[] {
    if (casterLevel < 1 || casterLevel > 6) return Array(9).fill(0);
    return THIRD_CASTER_SLOTS[casterLevel] || Array(9).fill(0);
}

// Основные функции

/**
 * Возвращает массив слотов заклинаний для персонажа с учётом мультикласса.
 * По правилам D&D 5e:
 * - полные и половинные кастеры складываются в общий уровень кастера;
 * - третьи кастеры (EK/AT) добавляют floor(level / 3) к общему уровню;
 * - варлок имеет отдельный пул слотов, который не складывается с обычным
 *   (в этой реализации мы суммируем массивы, что даёт корректный итог по количеству).
 */
export function getSpellSlots(character: Character): number[] {
    const classLevels = character.classLevels || [];

    let totalCasterLevel = 0;
    let warlockLevel = 0;

    for (const cl of classLevels) {
        if (cl.className === WARLOCK_CLASS) {
            warlockLevel += cl.level;
        } else {
            totalCasterLevel += getCasterLevelContribution(cl);
        }
    }

    const slots = Array(9).fill(0);

    if (totalCasterLevel > 0) {
        const casterSlots = getFullCasterSlots(totalCasterLevel);
        for (let i = 0; i < 9; i++) slots[i] += casterSlots[i];
    }

    if (warlockLevel > 0) {
        const wSlots = getWarlockSlots(warlockLevel);
        for (let i = 0; i < 9; i++) slots[i] += wSlots[i];
    }

    return slots;
}

/**
 * Максимум подготовленных заклинаний с учётом мультикласса.
 *
 * Суммируется по всем классам, которые готовят заклинания:
 * - Wizard: level + INT (min 1)
 * - Cleric / Druid: level + WIS (min 1)
 * - Paladin: floor(level / 2) + CHA (min 1)
 * - Artificer: ceil(level / 2) + INT (min 1)
 *
 * Known casters (Bard, Sorcerer, Warlock, Ranger) и третьи кастеры (EK, AT)
 * не готовят заклинания — их вклад 0.
 */
export function getMaxPrepared(character: Character): number {
    if (!character.classLevels || character.classLevels.length === 0) return 0;

    let total = 0;

    for (const cl of character.classLevels) {
        const { className, level, subclass } = cl;

        if (className === 'Wizard') {
            const mod = Math.floor((character.abilities.int - 10) / 2);
            total += Math.max(level + mod, 1);
        } else if (['Cleric', 'Druid'].includes(className)) {
            const mod = Math.floor((character.abilities.wis - 10) / 2);
            total += Math.max(level + mod, 1);
        } else if (className === 'Paladin') {
            const mod = Math.floor((character.abilities.cha - 10) / 2);
            total += Math.max(Math.floor(level / 2) + mod, 1);
        } else if (className === ARTIFICER_CLASS) {
            const mod = Math.floor((character.abilities.int - 10) / 2);
            total += Math.max(Math.ceil(level / 2) + mod, 1);
        } else if (subclass && THIRD_CASTER_SUBCLASSES[className]?.includes(subclass)) {
            // EK / AT — known casters, вклад 0
        }
    }

    return total;
}

/**
 * Количество известных заклинаний (для known casters).
 */
export function getKnownSpells(character: Character): number {
    return character.spells.length;
}

/**
 * Возвращает слоты только обычных кастеров (без Warlock).
 * Pact Magic учитывается отдельно.
 */
export function getNonPactSpellSlots(character: Character): number[] {
    const classLevels = character.classLevels || [];
    let totalCasterLevel = 0;

    for (const cl of classLevels) {
        if (cl.className !== WARLOCK_CLASS) {
            totalCasterLevel += getCasterLevelContribution(cl);
        }
    }

    if (totalCasterLevel === 0) return Array(9).fill(0);
    return getFullCasterSlots(totalCasterLevel);
}

export interface PactMagicInfo {
    slotLevel: number;
    total: number;
    used: number;
    available: number;
}

/**
 * Возвращает информацию о Pact Magic (Warlock).
 * null, если персонаж не имеет уровней Warlock.
 */
export function getPactMagicInfo(character: Character): PactMagicInfo | null {
    const classLevels = character.classLevels || [];
    const warlockLevel = classLevels
        .filter(cl => cl.className === WARLOCK_CLASS)
        .reduce((sum, cl) => sum + cl.level, 0);

    if (warlockLevel === 0) return null;

    const slots = getWarlockSlots(warlockLevel);
    const idx = slots.findIndex(n => n > 0);
    if (idx === -1) return null;

    const total = slots[idx];
    const used = Math.min(character.usedPactSlots || 0, total);

    return {
        slotLevel: idx + 1,
        total,
        used,
        available: total - used,
    };
}

/**
 * Возвращает массив использованных слотов (индекс 0 = 1-й уровень).
 * Если поле отсутствует — возвращает нули.
 */
export function getUsedSpellSlots(character: Character): number[] {
    const base = character.usedSpellSlots || [];
    return Array.from({ length: 9 }, (_, i) => base[i] || 0);
}

/**
 * Возвращает доступные слоты обычных кастеров (total - used).
 */
export function getAvailableSpellSlots(character: Character): number[] {
    const total = getNonPactSpellSlots(character);
    const used = getUsedSpellSlots(character);
    return total.map((t, i) => Math.max(0, t - used[i]));
}

/**
 * Есть ли у персонажа хоть какие-то слоты (обычные или pact).
 */
export function hasAnySpellSlots(character: Character): boolean {
    const regular = getNonPactSpellSlots(character).some(n => n > 0);
    const pact = getPactMagicInfo(character);
    return regular || !!pact;
}