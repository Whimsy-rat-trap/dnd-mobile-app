import { Character, ClassLevel } from '../types/Character';
import {
    XP_TO_NEXT,
    XP_TABLE,
    ASI_LEVELS_BY_CLASS,
    SUBCLASS_LEVEL_BY_CLASS,
    MAX_LEVEL,
} from '../constants/leveling';
import { CLASS_HIT_DICE } from '../constants/classHitDice';
import { getModifier } from './characterUtils';

/**
 * Сколько XP нужно внутри текущего уровня, чтобы дойти до следующего.
 * Для level 20 → Infinity.
 */
export function getXpToNextLevel(level: number): number {
    if (level >= MAX_LEVEL) return Infinity;
    return XP_TO_NEXT[level - 1] ?? Infinity;
}

/**
 * Накопленный XP, соответствующий началу уровня.
 */
export function getXpThresholdForLevel(level: number): number {
    if (level < 1) return 0;
    if (level > MAX_LEVEL) return XP_TABLE[MAX_LEVEL - 1];
    return XP_TABLE[level - 1];
}

/**
 * На каком уровне персонаж получает ASI для конкретного класса.
 */
export function getAsiLevelsForClass(className: string): number[] {
    return ASI_LEVELS_BY_CLASS[className] ?? [4, 8, 12, 16, 19];
}

/**
 * Получает ли персонаж ASI при достижении `newClassLevel` в `className`.
 */
export function shouldGetASI(className: string, newClassLevel: number): boolean {
    return getAsiLevelsForClass(className).includes(newClassLevel);
}

/**
 * Требуется ли выбрать подкласс при `newClassLevel` в `className`.
 * Возвращает true, если подкласс обязателен и он ещё не выбран.
 */
export function needsSubclassChoice(
    character: Character,
    classIndex: number,
    newClassLevel: number
): boolean {
    const cl = character.classLevels?.[classIndex];
    if (!cl) return false;
    if (cl.subclass) return false;
    const required = SUBCLASS_LEVEL_BY_CLASS[cl.className];
    if (!required) return false;
    return newClassLevel >= required;
}

/**
 * Сколько HP даёт один уровень класса.
 *   average: floor(hitDie/2) + 1 + conMod
 *   roll:    roll + conMod (min 1)
 */
export function computeHpGain(
    className: string,
    conMod: number,
    method: 'average' | 'roll',
    roll?: number
): { gain: number; usedRoll?: number } {
    const hitDie = CLASS_HIT_DICE[className] || 8;
    const average = Math.floor(hitDie / 2) + 1;

    if (method === 'average') {
        return { gain: Math.max(1, average + conMod) };
    }

    const usedRoll = roll !== undefined
        ? roll
        : Math.floor(Math.random() * hitDie) + 1;
    return {
        gain: Math.max(1, usedRoll + conMod),
        usedRoll,
    };
}

/**
 * Проверка «можно ли сейчас апнуть» для класса по индексу.
 * Возвращает причину, если нельзя.
 */
export function validateLevelUp(
    character: Character,
    classIndex: number
): { ok: boolean; reason?: string } {
    if (character.level >= MAX_LEVEL) {
        return { ok: false, reason: 'Maximum level reached (20)' };
    }

    const cl = character.classLevels?.[classIndex];
    if (!cl) return { ok: false, reason: 'Invalid class index' };

    if (character.levelingMode !== 'milestone') {
        const xpToNext = getXpToNextLevel(character.level);
        if (character.exp < xpToNext) {
            return {
                ok: false,
                reason: `Not enough XP (${character.exp} / ${xpToNext})`,
            };
        }
    }

    return { ok: true };
}

/**
 * Может ли персонаж апнуться прямо сейчас (хотя бы по одному классу).
 * Используется для баннера на Dashboard.
 */
export function canLevelUpNow(character: Character): boolean {
    if (character.level >= MAX_LEVEL) return false;
    if (character.levelingMode === 'milestone') return false; // DM решает
    return character.exp >= getXpToNextLevel(character.level);
}

/**
 * Сколько уровней «в запасе» — если exp больше, чем нужно для одного уровня.
 * Для XP-режима.
 */
export function getPendingLevelUps(character: Character): number {
    if (character.levelingMode === 'milestone') return 0;
    let count = 0;
    let xp = character.exp;
    let lvl = character.level;
    while (lvl < MAX_LEVEL && xp >= getXpToNextLevel(lvl)) {
        xp -= getXpToNextLevel(lvl);
        lvl += 1;
        count += 1;
    }
    return count;
}

/**
 * Список классов персонажа с их индексами — для UI выбора «какой класс апгрейдить».
 */
export function getClassOptionsForLevelUp(
    character: Character
): Array<{ index: number; className: string; currentLevel: number; subclass?: string }> {
    return (character.classLevels || []).map((cl, index) => ({
        index,
        className: cl.className,
        currentLevel: cl.level,
        subclass: cl.subclass,
    }));
}

/**
 * Производные данные HP после применения level up.
 * Используется в контексте для консистентной валидации.
 */
export interface LevelUpHpPayload {
    method: 'average' | 'roll';
    roll?: number;
}

export interface LevelUpAsiPayload {
    type: 'asi' | 'feat';
    bonuses?: Partial<Record<'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha', number>>;
    featId?: string;
}

export interface LevelUpPayload {
    classIndex: number;
    hp: LevelUpHpPayload;
    asi?: LevelUpAsiPayload;
    subclass?: string;
    /** Потреблять XP за этот level up (true для XP-режима). */
    consumeXp?: boolean;
}