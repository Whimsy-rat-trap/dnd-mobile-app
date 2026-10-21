import { Character } from '../types/Character';
import {
    CLASS_RESOURCES,
    ClassResourceDefinition,
    ResourceMaxUses,
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
 * Считает максимум использований ресурса для конкретного уровня класса.
 */
export function computeMaxUses(
    formula: ResourceMaxUses,
    classLevel: number
): number {
    if (formula.type === 'fixed') return formula.value;
    if (formula.type === 'level') return Math.max(0, classLevel * formula.multiplier);

    // 'table' — берём последнюю подходящую строку
    let max = 0;
    for (const row of formula.table) {
        if (classLevel >= row.minLevel) max = row.uses;
    }
    return max;
}

export interface ClassResourceState {
    definition: ClassResourceDefinition;
    classLevel: number;
    maxUses: number;
    usedUses: number;
    availableUses: number;
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

    const maxUses = computeMaxUses(def.maxUses, classLevel);
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