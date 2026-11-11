import { Character, ConditionId, ActiveCondition } from '../types/Character';
import { getConditionById, getExhaustionEffects } from '../constants/conditions';

export interface ConditionEffectsSummary {
    active: ActiveCondition[];
    /** Condition names causing disadvantage on attack rolls. */
    attackDisadvantageSources: string[];
    /** Condition names causing disadvantage on ability checks. */
    checkDisadvantageSources: string[];
    incapacitated: boolean;
    speedZero: boolean;
    grantsAdvantageOnAttack: boolean;
    prone: boolean;
    autoFailStrSave: boolean;
    autoFailDexSave: boolean;
    exhaustionLevel: number;
    exhaustionEffects: string[];
}

export function hasCondition(character: Character, conditionId: ConditionId): boolean {
    return (character.conditions || []).some((c) => c.conditionId === conditionId);
}

export function getConditionEffects(character: Character): ConditionEffectsSummary {
    const active = character.conditions || [];
    const exhaustionLevel = character.exhaustionLevel || 0;

    const attackDisadvantageSources: string[] = [];
    const checkDisadvantageSources: string[] = [];
    let incapacitated = false;
    let speedZero = false;
    let grantsAdvantageOnAttack = false;
    let prone = false;
    let autoFailStrSave = false;
    let autoFailDexSave = false;

    for (const c of active) {
        const def = getConditionById(c.conditionId);
        if (!def) continue;
        if (def.attackDisadvantage) attackDisadvantageSources.push(def.name);
        if (def.checkDisadvantage) checkDisadvantageSources.push(def.name);
        if (def.incapacitated) incapacitated = true;
        if (def.speedZero) speedZero = true;
        if (def.grantsAdvantageOnAttack) grantsAdvantageOnAttack = true;
        if (def.prone) prone = true;
        if (def.autoFailStrSave) autoFailStrSave = true;
        if (def.autoFailDexSave) autoFailDexSave = true;
    }

    if (exhaustionLevel >= 1) checkDisadvantageSources.push(`Exhaustion ${exhaustionLevel}`);
    if (exhaustionLevel >= 3) attackDisadvantageSources.push(`Exhaustion ${exhaustionLevel}`);
    if (exhaustionLevel >= 5) speedZero = true;

    return {
        active,
        attackDisadvantageSources,
        checkDisadvantageSources,
        incapacitated,
        speedZero,
        grantsAdvantageOnAttack,
        prone,
        autoFailStrSave,
        autoFailDexSave,
        exhaustionLevel,
        exhaustionEffects: getExhaustionEffects(exhaustionLevel),
    };
}
