import { useState, useEffect } from 'react';
import { CLASS_HIT_DICE } from '../constants/classHitDice';

export const useCharacterHP = (isCreative: boolean, mainClass: string, conMod: number, level: number) => {
    const [hpMethod, setHpMethod] = useState<'average' | 'roll'>('average');
    const [rolledHps, setRolledHps] = useState<number[]>([]);
    const [maxHp, setMaxHp] = useState(10);

    const handleRoll = (result: number) => {
        if (isCreative) return;
        const hitDie = CLASS_HIT_DICE[mainClass] || 6;
        const additionalLevels = level - 1;
        if (additionalLevels === 0) return;

        if (rolledHps.length === additionalLevels) {
            const newRolls = Array.from({ length: additionalLevels }, () =>
                Math.floor(Math.random() * hitDie) + 1
            );
            setRolledHps(newRolls);
        } else {
            setRolledHps([...rolledHps, result]);
        }
    };

    const rerollAll = () => {
        if (isCreative) return;
        const hitDie = CLASS_HIT_DICE[mainClass] || 6;
        const additionalLevels = level - 1;
        if (additionalLevels === 0) return;
        const newRolls = Array.from({ length: additionalLevels }, () =>
            Math.floor(Math.random() * hitDie) + 1
        );
        setRolledHps(newRolls);
    };

    useEffect(() => {
        if (isCreative) return;
        const hitDie = CLASS_HIT_DICE[mainClass] || 6;
        let totalHp = hitDie + conMod;
        if (level > 1) {
            const additionalLevels = level - 1;
            if (hpMethod === 'average') {
                const average = Math.floor(hitDie / 2) + 1;
                totalHp += additionalLevels * (average + conMod);
            } else if (rolledHps.length > 0) {
                const sumRolls = rolledHps.reduce((sum, r) => sum + r + conMod, 0);
                totalHp += sumRolls;
            }
        }
        setMaxHp(totalHp);
    }, [mainClass, conMod, level, hpMethod, rolledHps, isCreative]);

    useEffect(() => {
        if (hpMethod === 'average') setRolledHps([]);
    }, [hpMethod]);

    return {
        hpMethod,
        setHpMethod,
        rolledHps,
        maxHp,
        handleRoll,
        rerollAll,
    };
};