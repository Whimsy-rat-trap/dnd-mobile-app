import { Character } from '../types/Character';
import {
    CLASS_RESOURCES,
    ClassResourceDefinition,
    ResourceMaxUses,
    ResourceRecharge,
    ResourceRechargeSpec,
    ResourceDieSizeSpec,
} from '../constants/classResources';

export function getClassLevelFor(character: Character, className: string): number {
    return (character.classLevels || [])
        .filter(cl => cl.className === className)
        .reduce((sum, cl) => sum + cl.level, 0);
}

/**
 * Доступен ли ресурс персонажу с учётом:
 *   - уровня класса >= minClassLevel,
 *   - (если задан) подкласс совпадает хотя бы у одной записи этого класса.
 */
export function isResourceApplicable(
    character: Character,
    def: ClassResourceDefinition
): boolean {
    const classLevel = getClassLevelFor(character, def.className);
    if (classLevel < def.minClassLevel) return false;

    if (def.subclass) {
        const hasSubclass = (character.classLevels || []).some(
            cl => cl.className === def.className && cl.subclass === def.subclass
        );
        if (!hasSubclass) return false;
    }

    return true;
}

export function computeMaxUses(
    formula: ResourceMaxUses,
    character: Character,
    classLevel: number
): number {
    if (formula.type === 'fixed') return formula.value;
    if (formula.type === 'level') {
        return Math.max(0, classLevel * formula.multiplier);
    }
    if (formula.type === 'ability') {
        const score = character.abilities[formula.ability];
        const mod = Math.floor((score - 10) / 2);
        return Math.max(formula.min, mod);
    }
    // 'table'
    let max = 0;
    for (const row of formula.table) {
        if (classLevel >= row.minLevel) max = row.uses;
    }
    return max;
}

export function resolveRecharge(
    spec: ResourceRechargeSpec,
    classLevel: number
): ResourceRecharge {
    if (spec === 'short' || spec === 'long') return spec;
    let result: ResourceRecharge = 'long';
    for (const row of spec.table) {
        if (classLevel >= row.minLevel) result = row.recharge;
    }
    return result;
}

export function resolveDieSize(
    spec: ResourceDieSizeSpec | undefined,
    classLevel: number
): number | undefined {
    if (spec === undefined) return undefined;
    if (typeof spec === 'number') return spec;

    let result: number | undefined;
    for (const row of spec.table) {
        if (classLevel >= row.minLevel) result = row.dieSize;
    }
    return result;
}

export interface ClassResourceState {
    definition: ClassResourceDefinition;
    classLevel: number;
    maxUses: number;
    usedUses: number;
    availableUses: number;
    recharge: ResourceRecharge;
    dieSize?: number;
}

export function getClassResourceState(
    character: Character,
    resourceId: string
): ClassResourceState | null {
    const def = CLASS_RESOURCES.find(r => r.id === resourceId);
    if (!def) return null;
    if (!isResourceApplicable(character, def)) return null;

    const classLevel = getClassLevelFor(character, def.className);
    if (classLevel < def.minClassLevel) return null;

    const maxUses = computeMaxUses(def.maxUses, character, classLevel);
    if (maxUses === 0) return null;

    const usedMap = character.classResourcesUsed || {};
    const rawUsed = usedMap[resourceId] || 0;
    const usedUses = Math.min(rawUsed, maxUses);

    return {
        definition: def,
        classLevel,
        maxUses,
        usedUses,
        availableUses: Math.max(0, maxUses - usedUses),
        recharge: resolveRecharge(def.recharge, classLevel),
        dieSize: resolveDieSize(def.dieSize, classLevel),
    };
}

export function getAvailableClassResources(character: Character): ClassResourceState[] {
    const result: ClassResourceState[] = [];
    for (const def of CLASS_RESOURCES) {
        const state = getClassResourceState(character, def.id);
        if (state) result.push(state);
    }
    return result;
}