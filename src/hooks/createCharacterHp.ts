import { CLASS_HIT_DICE } from '../constants/classHitDice';
import { getModifier } from '../utils/characterUtils';

export type HpMethod = 'average' | 'roll';

/**
 * Hit die for a class. Falls back to d8 (the average across all classes)
 * when the class is unknown — a `d6` fallback was silently turning Fighters
 * into Wizards whenever a typo slipped through.
 */
export function getHitDie(mainClass: string): number {
    return CLASS_HIT_DICE[mainClass] ?? 8;
}

/**
 * Roll `count` hit dice of the given number of sides.
 */
export function rollHitDice(sides: number, count: number): number[] {
    return Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
}

/**
 * True when the rolled-HP array is complete for the given level + method.
 * - level 1: always complete (no additional rolls needed)
 * - method 'average': always complete
 * - method 'roll': needs exactly `level - 1` entries
 */
export function isRolledHpComplete(level: number, method: HpMethod, rolledHps: number[]): boolean {
    if (method === 'average') return true;
    if (level <= 1) return true;
    return rolledHps.length === level - 1;
}

/**
 * Compute max HP for a newly-created character.
 *
 * While rolled HP is incomplete (roll mode, fewer rolls than `level - 1`),
 * falls back to the average calculation so the form always shows *some*
 * valid number. Use `isRolledHpComplete` to gate submission.
 */
export function computeMaxHp(
    mainClass: string,
    level: number,
    conScore: number,
    method: HpMethod,
    rolledHps: number[] = []
): number {
    const hitDie = getHitDie(mainClass);
    const conMod = getModifier(conScore);

    const base = hitDie + conMod;
    if (level <= 1) return Math.max(1, base);

    const additionalLevels = level - 1;

    if (method === 'average' || rolledHps.length !== additionalLevels) {
        const avg = Math.floor(hitDie / 2) + 1;
        return Math.max(1, base + additionalLevels * (avg + conMod));
    }

    const sum = rolledHps.reduce((acc, r) => acc + r + conMod, 0);
    return Math.max(1, base + sum);
}
