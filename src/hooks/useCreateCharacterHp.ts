import { useEffect, useRef, useState } from 'react';
import {
    computeMaxHp,
    getHitDie,
    HpMethod,
    isRolledHpComplete,
    rollHitDice,
} from './createCharacterHp';

/**
 * HP state for the character-creation form.
 *
 * Runtime HP (hp / tempHp / death saves / rests) lives in CharacterContext —
 * this hook is only for computing the *starting* max HP of a new character.
 */
export function useCreateCharacterHp(
    isCreative: boolean,
    mainClass: string,
    conScore: number,
    level: number
) {
    const [hpMethod, setHpMethod] = useState<HpMethod>('average');
    const [rolledHps, setRolledHps] = useState<number[]>([]);

    const hitDie = getHitDie(mainClass);
    const additionalLevels = Math.max(0, level - 1);

    // Reset rolls when switching to average
    useEffect(() => {
        if (hpMethod === 'average') setRolledHps([]);
    }, [hpMethod]);

    // Reset all rolls when the hit die changes (main class changed)
    const prevHitDie = useRef(hitDie);
    useEffect(() => {
        if (prevHitDie.current !== hitDie) {
            prevHitDie.current = hitDie;
            setRolledHps([]);
        }
    }, [hitDie]);

    // Trim excess rolls when level decreases
    useEffect(() => {
        if (rolledHps.length > additionalLevels) {
            setRolledHps(rolledHps.slice(0, additionalLevels));
        }
    }, [additionalLevels, rolledHps.length]);

    const maxHp = computeMaxHp(mainClass, level, conScore, hpMethod, rolledHps);
    const isComplete = isRolledHpComplete(level, hpMethod, rolledHps);

    /** Append a single roll result (no-op if the array is already full). */
    const roll = (result: number) => {
        if (isCreative || hpMethod !== 'roll') return;
        if (rolledHps.length >= additionalLevels) return;
        setRolledHps([...rolledHps, result]);
    };

    /** Re-roll all additional-level hit dice. */
    const rollAll = () => {
        if (isCreative || hpMethod !== 'roll') return;
        if (additionalLevels <= 0) return;
        setRolledHps(rollHitDice(hitDie, additionalLevels));
    };

    return {
        hpMethod,
        setHpMethod,
        rolledHps,
        maxHp,
        isComplete,
        hitDie,
        roll,
        rollAll,
    };
}
