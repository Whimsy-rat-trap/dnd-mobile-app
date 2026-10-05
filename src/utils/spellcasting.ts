import { Character } from '../types/Character';

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
 * Является ли класс (с учётом подкласса) заклинателем.
 * @param className — название класса
 * @param subclass — название подкласса (для проверки третьих кастеров)
 * @param classLevel — уровень в этом классе (нужно для третьих кастеров, они начинают с 3-го)
 */
export function isSpellcastingClass(
    className: string,
    subclass?: string,
    classLevel?: number
): boolean {
    if (FULL_CASTER_CLASSES.includes(className)) return true;
    if (HALF_CASTER_CLASSES.includes(className)) return true;
    if (className === ARTIFICER_CLASS) return true;
    if (className === WARLOCK_CLASS) return true;

    // Третьи кастеры доступны только с 3-го уровня
    if (subclass && THIRD_CASTER_SUBCLASSES[className]?.includes(subclass)) {
        if (classLevel === undefined || classLevel >= 3) return true;
    }

    return false;
}

/**
 * Возвращает уровень кастера для одного класса.
 * Для третьих кастеров не используется — они считаются отдельно.
 */
function getCasterLevel(className: string, classLevel: number): number {
    if (FULL_CASTER_CLASSES.includes(className)) return classLevel;
    if (HALF_CASTER_CLASSES.includes(className)) return Math.floor(classLevel / 2);
    if (className === ARTIFICER_CLASS) return Math.ceil(classLevel / 2);
    if (className === WARLOCK_CLASS) return classLevel;
    return 0;
}

/**
 * Уровень третьего кастера (Eldritch Knight, Arcane Trickster).
 * Прогрессия: floor(level / 3), минимально 1 на 3-м уровне.
 */
function getThirdCasterLevel(className: string, classLevel: number): number {
    if (classLevel < 3) return 0;
    return Math.floor(classLevel / 3);
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
 * Возвращает массив слотов заклинаний для персонажа.
 * Учитывает полных, половинных, третьих кастеров и варлока.
 */
export function getSpellSlots(character: Character): number[] {
    const classLevels = character.classLevels || [];
    const subclass = character.subclass;

    let totalCasterLevel = 0;
    let thirdCasterLevel = 0;
    let warlockLevel = 0;

    for (const cl of classLevels) {
        // Третьи кастеры (EK/AT) — только для основного класса с подклассом
        if (
            subclass &&
            THIRD_CASTER_SUBCLASSES[cl.className]?.includes(subclass)
        ) {
            thirdCasterLevel += getThirdCasterLevel(cl.className, cl.level);
            continue;
        }

        if (cl.className === WARLOCK_CLASS) {
            warlockLevel += cl.level;
        } else {
            totalCasterLevel += getCasterLevel(cl.className, cl.level);
        }
    }

    const slots = Array(9).fill(0);

    // Слоты обычных кастеров
    if (totalCasterLevel > 0) {
        const casterSlots = getFullCasterSlots(totalCasterLevel);
        for (let i = 0; i < 9; i++) slots[i] += casterSlots[i];
    }

    // Слоты варлока (складываются с обычными, но по правилам 5e выбирается один пул)
    if (warlockLevel > 0) {
        const wSlots = getWarlockSlots(warlockLevel);
        for (let i = 0; i < 9; i++) slots[i] += wSlots[i];
    }

    // Слоты третьего кастера
    if (thirdCasterLevel > 0) {
        const tSlots = getThirdCasterSlots(thirdCasterLevel);
        for (let i = 0; i < 9; i++) slots[i] += tSlots[i];
    }

    return slots;
}

/**
 * Количество подготовленных заклинаний, доступных персонажу.
 * Для "known" кастеров (Bard, Sorcerer, Warlock, EK, AT) возвращает 0 —
 * они не готовят заклинания, а знают их.
 */
export function getMaxPrepared(character: Character): number {
    if (!character.classLevels || character.classLevels.length === 0) return 0;

    const mainClass = character.classLevels[0];
    const className = mainClass.className;
    const level = mainClass.level;
    const subclass = character.subclass;

    // Prepared casters
    if (className === 'Wizard') {
        const mod = Math.floor((character.abilities.int - 10) / 2);
        return Math.max(level + mod, 1);
    }
    if (['Cleric', 'Druid'].includes(className)) {
        const mod = Math.floor((character.abilities.wis - 10) / 2);
        return Math.max(level + mod, 1);
    }
    if (className === 'Paladin') {
        const mod = Math.floor((character.abilities.cha - 10) / 2);
        return Math.max(Math.floor(level / 2) + mod, 1);
    }
    if (className === ARTIFICER_CLASS) {
        const mod = Math.floor((character.abilities.int - 10) / 2);
        return Math.max(Math.ceil(level / 2) + mod, 1);
    }

    // Known casters
    if (['Bard', 'Sorcerer', 'Warlock', 'Ranger'].includes(className)) return 0;

    // Третьи кастеры (EK, AT) — known, не prepared
    if (subclass && THIRD_CASTER_SUBCLASSES[className]?.includes(subclass)) return 0;

    // Обычные не-кастеры (Barbarian, Fighter без EK, Monk, Rogue без AT)
    return 0;
}

/**
 * Количество известных заклинаний (для known casters).
 */
export function getKnownSpells(character: Character): number {
    return character.spells.length;
}