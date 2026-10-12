import { Character } from '../types/Character';
import { CLASS_HIT_DICE } from '../constants/classHitDice';

export interface HitDicePool {
    sides: number;
    total: number;
    used: number;
    available: number;
}

/**
 * Возвращает пулы hit dice по размерам кубика.
 * Например, Fighter 3 / Wizard 2 → [{ sides: 10, total: 3 }, { sides: 6, total: 2 }].
 */
export function getHitDicePools(character: Character): HitDicePool[] {
    const totalsBySides: Record<number, number> = {};

    for (const cl of character.classLevels || []) {
        const sides = CLASS_HIT_DICE[cl.className] || 8;
        totalsBySides[sides] = (totalsBySides[sides] || 0) + cl.level;
    }

    const usedMap = character.hitDiceUsed || {};

    return Object.entries(totalsBySides)
        .map(([sidesStr, total]) => {
            const sides = Number(sidesStr);
            const used = Math.min(usedMap[sides] || 0, total);
            return {
                sides,
                total,
                used,
                available: total - used,
            };
        })
        .sort((a, b) => a.sides - b.sides);
}

export interface HitDiceSummary {
    total: number;
    used: number;
    available: number;
}

export function getTotalHitDice(character: Character): HitDiceSummary {
    const pools = getHitDicePools(character);
    return pools.reduce(
        (acc, p) => ({
            total: acc.total + p.total,
            used: acc.used + p.used,
            available: acc.available + p.available,
        }),
        { total: 0, used: 0, available: 0 }
    );
}

/**
 * Возвращает модификатор телосложения.
 */
function getConMod(character: Character): number {
    return Math.floor((character.abilities.con - 10) / 2);
}

export interface HitDieRollResult {
    sides: number;
    roll: number;
    conMod: number;
    heal: number;
}

/**
 * Бросает hit die указанного размера. Не изменяет персонажа.
 * Возвращает null, если нет доступных кубиков этого размера.
 */
export function rollHitDie(character: Character, sides: number): HitDieRollResult | null {
    const pools = getHitDicePools(character);
    const pool = pools.find(p => p.sides === sides);
    if (!pool || pool.available <= 0) return null;

    const roll = Math.floor(Math.random() * sides) + 1;
    const conMod = getConMod(character);
    const heal = Math.max(1, roll + conMod);

    return { sides, roll, conMod, heal };
}

/**
 * Восстанавливает половину от общего количества hit dice (min 1).
 * Возвращает новый объект hitDiceUsed.
 * Восстанавливает сначала кубики большего размера (они ценнее).
 */
export function restoreHitDiceOnLongRest(character: Character): Record<number, number> {
    const pools = getHitDicePools(character);
    const totalDice = pools.reduce((sum, p) => sum + p.total, 0);
    const totalUsed = pools.reduce((sum, p) => sum + p.used, 0);

    if (totalUsed === 0) return { ...(character.hitDiceUsed || {}) };

    let toRegain = Math.max(1, Math.floor(totalDice / 2));
    toRegain = Math.min(toRegain, totalUsed);

    const result: Record<number, number> = {};

    // Сначала восстанавливаем крупные кубики
    const sortedPools = [...pools].sort((a, b) => b.sides - a.sides);

    for (const pool of sortedPools) {
        let newUsed = pool.used;
        if (toRegain > 0 && pool.used > 0) {
            const canRestore = Math.min(pool.used, toRegain);
            newUsed = pool.used - canRestore;
            toRegain -= canRestore;
        }
        result[pool.sides] = newUsed;
    }

    return result;
}