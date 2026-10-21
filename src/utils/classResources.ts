import { Character } from '../types/Character';
import {
    CLASS_RESOURCES,
    ClassResourceDefinition,
    ResourceMaxUses,
    ResourceRecharge,
    ResourceRechargeSpec,
    ResourceDieSizeSpec,
} from '../constants/classResources';

/**
 * Суммарный уровень класса в персонаже (для мультикласса).
 */
export function getClassLevelFor(character: Character, className: string): number {
    return (character.classLevels || [])
        .filter(cl => cl.className === className)
        .reduce((sum, cl) => sum + cl.level, 0);
}

/**
 * Максимум использований для данного уровня класса.
 */
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

/**
 * Резолвит recharge для конкретного уровня класса.
 */
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

/**
 * Резолвит dieSize для конкретного уровня класса. Возвращает undefined, если не задан.
 */
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
    /** Активный recharge (уже резолвленный). */
    recharge: ResourceRecharge;
    /** Активный dieSize (если задан). */
    dieSize?: number;
}

/**
 * Один ресурс персонажа (если он у него есть).
 */
export function getClassResourceState(
    character: Character,
    resourceId: string
): ClassResourceState | null {
    const def = CLASS_RESOURCES.find(r => r.id === resourceId);
    if (!def) return null;

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

/**
 * Все ресурсы, доступные персонажу (с учётом мультикласса).
 */
export function getAvailableClassResources(character: Character): ClassResourceState[] {
    const result: ClassResourceState[] = [];
    for (const def of CLASS_RESOURCES) {
        const state = getClassResourceState(character, def.id);
        if (state) result.push(state);
    }
    return result;
}

/**
 * Список ресурсов, восстанавливающихся на short rest.
 */
export function getShortRestRecoverableResources(character: Character): ClassResourceState[] {
    return getAvailableClassResources(character).filter(
        r => r.definition.recharge === 'short' && r.usedUses > 0
    );
}