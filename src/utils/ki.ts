import { Character } from '../types/Character';

/** Ki появляется только со 2-го уровня Monk. */
export const KI_MIN_MONK_LEVEL = 2;

/**
 * Суммарный уровень Monk'а (учитывает мультикласс).
 */
export function getMonkLevel(character: Character): number {
    return (character.classLevels || [])
        .filter(cl => cl.className === 'Monk')
        .reduce((sum, cl) => sum + cl.level, 0);
}

export interface KiInfo {
    isMonk: boolean;
    monkLevel: number;
    /** Ки есть только с Monk 2+, но isMonk true уже с Monk 1. */
    hasKi: boolean;
    maxUses: number;
    usedUses: number;
    availableUses: number;
}

/**
 * Полная информация о Ki для персонажа.
 */
export function getKiInfo(character: Character): KiInfo {
    const monkLevel = getMonkLevel(character);
    const isMonk = monkLevel > 0;
    const hasKi = monkLevel >= KI_MIN_MONK_LEVEL;

    const maxUses = hasKi ? monkLevel : 0;
    const usedUses = Math.min(character.kiUsed || 0, maxUses);
    const availableUses = Math.max(0, maxUses - usedUses);

    return { isMonk, monkLevel, hasKi, maxUses, usedUses, availableUses };
}