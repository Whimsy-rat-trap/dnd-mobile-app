import { Character } from '../types/Character';
import {
    PARTIAL_RECOVERY_FEATURES,
    PartialRecoveryFeature,
    PartialRecoveryTarget,
} from '../constants/partialRecovery';
import { getClassLevelFor } from './classResources';

/**
 * Бюджет восстановления (для spell-slots — сумма уровней; для resource — кол-во).
 */
export function getPartialRecoveryBudget(
    character: Character,
    target: PartialRecoveryTarget,
    className: string
): number {
    const classLevel = getClassLevelFor(character, className);
    if (target.type === 'spell-slots') {
        const divisor = target.divisor ?? 2;
        return Math.ceil(classLevel / divisor);
    }
    if (target.type === 'resource') {
        if (target.amount === 'class-level') return classLevel;
        return target.amount;
    }
    return 0;
}

export function canUsePartialRecovery(
    character: Character,
    feature: PartialRecoveryFeature
): { can: boolean; reason?: string } {
    const classLevel = getClassLevelFor(character, feature.className);
    if (classLevel < feature.minClassLevel) {
        return { can: false, reason: `${feature.className} ${feature.minClassLevel}+ required` };
    }

    if (feature.subclass) {
        const hasSubclass = (character.classLevels || []).some(
            cl => cl.className === feature.className && cl.subclass === feature.subclass
        );
        if (!hasSubclass) {
            return { can: false, reason: `${feature.className} (${feature.subclass}) required` };
        }
    }

    const used = character.partialRecoveryUsed || [];
    if (used.includes(feature.id)) {
        return {
            can: false,
            reason: feature.cooldown === 'long'
                ? 'Already used since last long rest'
                : 'Already used since last short rest',
        };
    }

    return { can: true };
}

/**
 * Возвращает все partial-recovery features, доступные персонажу
 * (для отображения в UI — вне зависимости от cooldown).
 */
export function getAvailablePartialRecoveryFeatures(
    character: Character
): Array<{ feature: PartialRecoveryFeature; cooldown: boolean }> {
    return PARTIAL_RECOVERY_FEATURES
        .filter(f => {
            const classLevel = getClassLevelFor(character, f.className);
            if (classLevel < f.minClassLevel) return false;
            if (f.subclass) {
                const has = (character.classLevels || []).some(
                    cl => cl.className === f.className && cl.subclass === f.subclass
                );
                if (!has) return false;
            }
            return true;
        })
        .map(feature => {
            const used = character.partialRecoveryUsed || [];
            return { feature, cooldown: used.includes(feature.id) };
        });
}