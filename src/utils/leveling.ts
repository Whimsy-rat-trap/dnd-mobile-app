import { Character, ClassLevel } from '../types/Character';
import {
    XP_TO_NEXT,
    XP_TABLE,
    ASI_LEVELS_BY_CLASS,
    SUBCLASS_LEVEL_BY_CLASS,
    MAX_LEVEL,
} from '../constants/leveling';
import { CLASS_HIT_DICE } from '../constants/classHitDice';
import { getModifier } from './characterUtils'
import {
    getNonPactSpellSlots,
    getPactMagicInfo,
    getMaxPrepared,
    isSpellcastingClass,
} from './spellcasting';
import { getMaxSpellLevelForClass } from './classSpellUtils';
import { getAvailableClassResources, ClassResourceState } from './classResources';
import { getSpellSaveDC, getSpellAttackBonus } from './spellUtils';
import {getProficiencyBonus} from "./proficiency";

/**
 * Сколько XP нужно внутри текущего уровня, чтобы дойти до следующего.
 * Для level 20 → Infinity.
 */
export function getXpToNextLevel(level: number): number {
    if (level >= MAX_LEVEL) return Infinity;
    return XP_TO_NEXT[level - 1] ?? Infinity;
}

/**
 * Накопленный XP, соответствующий началу уровня.
 */
export function getXpThresholdForLevel(level: number): number {
    if (level < 1) return 0;
    if (level > MAX_LEVEL) return XP_TABLE[MAX_LEVEL - 1];
    return XP_TABLE[level - 1];
}

/**
 * На каком уровне персонаж получает ASI для конкретного класса.
 */
export function getAsiLevelsForClass(className: string): number[] {
    return ASI_LEVELS_BY_CLASS[className] ?? [4, 8, 12, 16, 19];
}

/**
 * Получает ли персонаж ASI при достижении `newClassLevel` в `className`.
 */
export function shouldGetASI(className: string, newClassLevel: number): boolean {
    return getAsiLevelsForClass(className).includes(newClassLevel);
}

/**
 * Требуется ли выбрать подкласс при `newClassLevel` в `className`.
 * Возвращает true, если подкласс обязателен и он ещё не выбран.
 */
export function needsSubclassChoice(
    character: Character,
    classIndex: number,
    newClassLevel: number
): boolean {
    const cl = character.classLevels?.[classIndex];
    if (!cl) return false;
    if (cl.subclass) return false;
    const required = SUBCLASS_LEVEL_BY_CLASS[cl.className];
    if (!required) return false;
    return newClassLevel >= required;
}

/**
 * Сколько HP даёт один уровень класса.
 *   average: floor(hitDie/2) + 1 + conMod
 *   roll:    roll + conMod (min 1)
 */
export function computeHpGain(
    className: string,
    conMod: number,
    method: 'average' | 'roll',
    roll?: number
): { gain: number; usedRoll?: number } {
    const hitDie = CLASS_HIT_DICE[className] || 8;
    const average = Math.floor(hitDie / 2) + 1;

    if (method === 'average') {
        return { gain: Math.max(1, average + conMod) };
    }

    const usedRoll = roll !== undefined
        ? roll
        : Math.floor(Math.random() * hitDie) + 1;
    return {
        gain: Math.max(1, usedRoll + conMod),
        usedRoll,
    };
}

/**
 * Проверка «можно ли сейчас апнуть» для класса по индексу.
 * Возвращает причину, если нельзя.
 */
export function validateLevelUp(
    character: Character,
    classIndex: number
): { ok: boolean; reason?: string } {
    if (character.level >= MAX_LEVEL) {
        return { ok: false, reason: 'Maximum level reached (20)' };
    }

    const cl = character.classLevels?.[classIndex];
    if (!cl) return { ok: false, reason: 'Invalid class index' };

    if (character.levelingMode !== 'milestone') {
        const xpToNext = getXpToNextLevel(character.level);
        if (character.exp < xpToNext) {
            return {
                ok: false,
                reason: `Not enough XP (${character.exp} / ${xpToNext})`,
            };
        }
    }

    return { ok: true };
}

/**
 * Может ли персонаж апнуться прямо сейчас (хотя бы по одному классу).
 * Используется для баннера на Dashboard.
 */
export function canLevelUpNow(character: Character): boolean {
    if (character.level >= MAX_LEVEL) return false;
    if (character.levelingMode === 'milestone') return false; // DM решает
    return character.exp >= getXpToNextLevel(character.level);
}

/**
 * Сколько уровней «в запасе» — если exp больше, чем нужно для одного уровня.
 * Для XP-режима.
 */
export function getPendingLevelUps(character: Character): number {
    if (character.levelingMode === 'milestone') return 0;
    let count = 0;
    let xp = character.exp;
    let lvl = character.level;
    while (lvl < MAX_LEVEL && xp >= getXpToNextLevel(lvl)) {
        xp -= getXpToNextLevel(lvl);
        lvl += 1;
        count += 1;
    }
    return count;
}

/**
 * Список классов персонажа с их индексами — для UI выбора «какой класс апгрейдить».
 */
export function getClassOptionsForLevelUp(
    character: Character
): Array<{ index: number; className: string; currentLevel: number; subclass?: string }> {
    return (character.classLevels || []).map((cl, index) => ({
        index,
        className: cl.className,
        currentLevel: cl.level,
        subclass: cl.subclass,
    }));
}

/**
 * Производные данные HP после применения level up.
 * Используется в контексте для консистентной валидации.
 */
export interface LevelUpHpPayload {
    method: 'average' | 'roll';
    roll?: number;
}

export interface LevelUpAsiPayload {
    type: 'asi' | 'feat';
    bonuses?: Partial<Record<'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha', number>>;
    featId?: string;
}

export interface LevelUpPayload {
    classIndex: number;
    hp: LevelUpHpPayload;
    asi?: LevelUpAsiPayload;
    subclass?: string;
    /** Потреблять XP за этот level up (true для XP-режима). */
    consumeXp?: boolean;
}

// Level Up Preview

function simulateLevelUp(
    character: Character,
    classIndex: number,
    chosenSubclass?: string
): Character {
    const newClassLevels = character.classLevels.map((cl, i) =>
        i === classIndex
            ? {
                ...cl,
                level: cl.level + 1,
                subclass: chosenSubclass || cl.subclass,
            }
            : cl
    );
    return {
        ...character,
        classLevels: newClassLevels,
        level: newClassLevels.reduce((s, cl) => s + cl.level, 0),
    };
}

export interface SpellSlotDelta {
    level: number;
    from: number;
    to: number;
    delta: number;
}

export type ClassResourceChange =
    | { kind: 'maxUses'; from: number; to: number }
    | { kind: 'dieSize'; from: number | undefined; to: number | undefined }
    | { kind: 'recharge'; from: string; to: string }
    | { kind: 'new'; maxUses: number; dieSize?: number };

export interface ClassResourcePreview {
    id: string;
    name: string;
    changes: ClassResourceChange[];
}

export interface LevelUpPreview {
    levelFrom: number;
    levelTo: number;
    className: string;
    classLevelFrom: number;
    classLevelTo: number;

    proficiency: { from: number; to: number };
    spellSlots: SpellSlotDelta[];
    pactSlots: { from: number; to: number; slotLevel: number } | null;
    maxPrepared: { from: number; to: number } | null;
    maxSpellLevel: { from: number; to: number } | null;
    spellSaveDC: { from: number; to: number } | null;
    spellAttackBonus: { from: number; to: number } | null;
    classResources: ClassResourcePreview[];

    hasASI: boolean;
    hasSubclassChoice: boolean;
}

export function computeLevelUpPreview(
    character: Character,
    classIndex: number,
    chosenSubclass?: string
): LevelUpPreview | null {
    const cl = character.classLevels?.[classIndex];
    if (!cl) return null;

    const preview = simulateLevelUp(character, classIndex, chosenSubclass);
    const classLevelFrom = cl.level;
    const classLevelTo = cl.level + 1;

    // Proficiency
    const profFrom = getProficiencyBonus(character.level);
    const profTo = getProficiencyBonus(preview.level);

    // Spell slots
    const slotsFrom = getNonPactSpellSlots(character);
    const slotsTo = getNonPactSpellSlots(preview);
    const spellSlots: SpellSlotDelta[] = [];
    for (let i = 0; i < 9; i++) {
        const from = slotsFrom[i] || 0;
        const to = slotsTo[i] || 0;
        if (from !== to) {
            spellSlots.push({ level: i + 1, from, to, delta: to - from });
        }
    }

    // Pact slots
    const pactFrom = getPactMagicInfo(character);
    const pactTo = getPactMagicInfo(preview);
    let pactSlots: LevelUpPreview['pactSlots'] = null;
    if (pactFrom || pactTo) {
        const totalFrom = pactFrom?.total ?? 0;
        const totalTo = pactTo?.total ?? 0;
        const lvlFrom = pactFrom?.slotLevel ?? 0;
        const lvlTo = pactTo?.slotLevel ?? 0;
        if (totalFrom !== totalTo || lvlFrom !== lvlTo) {
            pactSlots = {
                from: totalFrom,
                to: totalTo,
                slotLevel: lvlTo || lvlFrom,
            };
        }
    }

    // Max prepared
    const prepFrom = getMaxPrepared(character);
    const prepTo = getMaxPrepared(preview);
    const maxPrepared =
        prepFrom !== prepTo ? { from: prepFrom, to: prepTo } : null;

    // Max spell level for this class
    const msFrom = getMaxSpellLevelForClass(cl.className, classLevelFrom, cl.subclass);
    const msTo = getMaxSpellLevelForClass(cl.className, classLevelTo, chosenSubclass || cl.subclass);
    const maxSpellLevel =
        msFrom !== msTo ? { from: msFrom, to: msTo } : null;

    // Spellcasting DC/Attack (только если это кастер)
    let spellSaveDC: LevelUpPreview['spellSaveDC'] = null;
    let spellAttackBonus: LevelUpPreview['spellAttackBonus'] = null;
    if (isSpellcastingClass(character) || isSpellcastingClass(preview)) {
        const dcFrom = getSpellSaveDC(character);
        const dcTo = getSpellSaveDC(preview);
        if (dcFrom !== dcTo) spellSaveDC = { from: dcFrom, to: dcTo };

        const atkFrom = getSpellAttackBonus(character);
        const atkTo = getSpellAttackBonus(preview);
        if (atkFrom !== atkTo) spellAttackBonus = { from: atkFrom, to: atkTo };
    }

    // Class resources
    const resFrom = getAvailableClassResources(character);
    const resTo = getAvailableClassResources(preview);
    const map = new Map<string, { from?: ClassResourceState; to?: ClassResourceState }>();
    for (const r of resFrom) map.set(r.definition.id, { from: r });
    for (const r of resTo) {
        const cur = map.get(r.definition.id) || {};
        map.set(r.definition.id, { ...cur, to: r });
    }

    const classResources: ClassResourcePreview[] = [];
    for (const [id, { from, to }] of map) {
        const def = to?.definition || from?.definition;
        if (!def) continue;

        const changes: ClassResourceChange[] = [];

        if (!from && to) {
            changes.push({
                kind: 'new',
                maxUses: to.maxUses,
                dieSize: to.dieSize,
            });
        } else if (from && to) {
            if (from.maxUses !== to.maxUses) {
                changes.push({ kind: 'maxUses', from: from.maxUses, to: to.maxUses });
            }
            if (from.dieSize !== to.dieSize) {
                changes.push({ kind: 'dieSize', from: from.dieSize, to: to.dieSize });
            }
            if (from.recharge !== to.recharge) {
                changes.push({ kind: 'recharge', from: from.recharge, to: to.recharge });
            }
        }

        if (changes.length > 0) {
            classResources.push({ id, name: def.name, changes });
        }
    }

    return {
        levelFrom: character.level,
        levelTo: preview.level,
        className: cl.className,
        classLevelFrom,
        classLevelTo,
        proficiency: { from: profFrom, to: profTo },
        spellSlots,
        pactSlots,
        maxPrepared,
        maxSpellLevel,
        spellSaveDC,
        spellAttackBonus,
        classResources,
        hasASI: shouldGetASI(cl.className, classLevelTo),
        hasSubclassChoice: needsSubclassChoice(character, classIndex, classLevelTo),
    };
}