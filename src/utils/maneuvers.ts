import { Character } from '../types/Character';
import {
    MANEUVERS,
    Maneuver,
    getManeuversKnownCount,
} from '../constants/maneuvers';
import { getClassLevelFor } from './classResources';
import { getProficiencyBonus, getModifier } from './characterUtils';

/**
 * Сколько манёвров знает персонаж (Battle Master).
 */
export function getKnownManeuversLimit(character: Character): number {
    const fighterLevel = getClassLevelFor(character, 'Fighter');
    const isBattleMaster = (character.classLevels || []).some(
        cl => cl.className === 'Fighter' && cl.subclass === 'Battle Master'
    );
    if (!isBattleMaster) return 0;
    return getManeuversKnownCount(fighterLevel);
}

/**
 * Известные манёвры персонажа.
 */
export function getKnownManeuvers(character: Character): Maneuver[] {
    const ids = character.knownManeuvers || [];
    return ids
        .map(id => MANEUVERS.find(m => m.id === id))
        .filter((m): m is Maneuver => !!m);
}

/**
 * Манёвры, которые ещё можно выучить.
 */
export function getAvailableManeuvers(character: Character): Maneuver[] {
    const known = new Set(character.knownManeuvers || []);
    return MANEUVERS.filter(m => !known.has(m.id));
}

/**
 * DC спасброска от манёвров:
 *   8 + prof + max(STR, DEX) mod
 */
export function getManeuverSaveDC(character: Character): number {
    const prof = getProficiencyBonus(character.level);
    const strMod = getModifier(character.abilities.str);
    const dexMod = getModifier(character.abilities.dex);
    return 8 + prof + Math.max(strMod, dexMod);
}

/**
 * Проверка: можно ли выучить ещё один манёвр.
 */
export function canLearnMoreManeuvers(character: Character): {
    can: boolean;
    used: number;
    max: number;
} {
    const max = getKnownManeuversLimit(character);
    const used = (character.knownManeuvers || []).length;
    return { can: max > 0 && used < max, used, max };
}