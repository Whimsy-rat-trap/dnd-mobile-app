import { Character } from '../types/Character';
import {
    METAMAGIC,
    Metamagic,
    getMetamagicKnownCount,
} from '../constants/metamagic';
import { getClassLevelFor } from './classResources';

/**
 * Сколько Metamagic опций персонаж может знать (только Sorcerer).
 */
export function getKnownMetamagicLimit(character: Character): number {
    const sorcererLevel = getClassLevelFor(character, 'Sorcerer');
    return getMetamagicKnownCount(sorcererLevel);
}

export function getKnownMetamagic(character: Character): Metamagic[] {
    const ids = character.knownMetamagic || [];
    return ids
        .map(id => METAMAGIC.find(m => m.id === id))
        .filter((m): m is Metamagic => !!m);
}

export function getAvailableMetamagic(character: Character): Metamagic[] {
    const known = new Set(character.knownMetamagic || []);
    return METAMAGIC.filter(m => !known.has(m.id));
}

export function canLearnMoreMetamagic(character: Character): {
    can: boolean;
    used: number;
    max: number;
} {
    const max = getKnownMetamagicLimit(character);
    const used = (character.knownMetamagic || []).length;
    return { can: max > 0 && used < max, used, max };
}

/**
 * Стоимость конкретного Metamagic в SP.
 * Для 'spell-level' нужен уровень заклинания (для кантрипа = 1).
 */
export function getMetamagicSpCost(
    metamagic: Metamagic,
    spellLevel?: number
): number {
    if (metamagic.cost.type === 'fixed') return metamagic.cost.amount;
    if (spellLevel === undefined) return 0;
    // Twinned Spell: для кантрипа 1 SP, для заклинания — уровень
    if (spellLevel === 0) return 1;
    return spellLevel;
}

/**
 * Требует ли Metamagic указания уровня заклинания (для UI).
 */
export function metamagicNeedsSpellLevel(metamagic: Metamagic): boolean {
    return metamagic.cost.type === 'spell-level';
}