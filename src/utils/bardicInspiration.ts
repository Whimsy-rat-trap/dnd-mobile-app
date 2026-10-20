import { Character } from '../types/Character';
import { BARDIC_INSPIRATION_TABLE } from '../constants/bardicInspiration';

/**
 * Суммарный уровень Bard'а (учитывает мультикласс).
 */
export function getBardLevel(character: Character): number {
    return (character.classLevels || [])
        .filter(cl => cl.className === 'Bard')
        .reduce((sum, cl) => sum + cl.level, 0);
}

export interface BardicInspirationInfo {
    isBard: boolean;
    bardLevel: number;
    dieSize: number;
    maxUses: number;
    usedUses: number;
    availableUses: number;
    recharge: 'short' | 'long';
    hasFontOfInspiration: boolean;
}

/**
 * Полная информация о Bardic Inspiration для персонажа.
 * Если персонаж не бард — isBard: false, dieSize: 0, maxUses: 0.
 */
export function getBardicInspirationInfo(character: Character): BardicInspirationInfo {
    const bardLevel = getBardLevel(character);
    const isBard = bardLevel > 0;

    let dieSize = 0;
    let recharge: 'short' | 'long' = 'long';

    if (isBard) {
        for (const row of BARDIC_INSPIRATION_TABLE) {
            if (bardLevel >= row.minLevel) {
                dieSize = row.dieSize;
                recharge = row.recharge;
            }
        }
    }

    const chaMod = Math.floor((character.abilities.cha - 10) / 2);
    const maxUses = isBard ? Math.max(1, chaMod) : 0;
    const usedUses = Math.min(character.bardicInspirationUsed || 0, maxUses);
    const availableUses = Math.max(0, maxUses - usedUses);

    return {
        isBard,
        bardLevel,
        dieSize,
        maxUses,
        usedUses,
        availableUses,
        recharge,
        hasFontOfInspiration: bardLevel >= 5,
    };
}