import { DND_BACKGROUNDS } from '../constants/backgrounds';
import { RACIAL_BONUSES } from '../constants/racialBonuses';
import { SUBRACE_DETAILS } from '../constants/subraceDetails';
import { RACIAL_SKILLS, RACIAL_TOOLS } from '../constants/raceProficiencies';
import { CLASS_STARTING_EQUIPMENT } from '../constants/classStartingEquipment';
import { CLASS_SAVING_THROWS } from '../constants/classSavingThrows';
import { RACE_DETAILS } from '../constants/raceDetails';
import { LibraryItem } from '../constants/items';
import { Character, InventoryItem } from '../types/Character';
import {getRacialEffects} from "./racialFeatures";

export const POINT_BUY_POINTS = 27;
export const DEFAULT_SKILLS = [
    { name: 'Acrobatics', attribute: 'DEX', proficient: false },
    { name: 'Animal Handling', attribute: 'WIS', proficient: false },
    { name: 'Arcana', attribute: 'INT', proficient: false },
    { name: 'Athletics', attribute: 'STR', proficient: false },
    { name: 'Deception', attribute: 'CHA', proficient: false },
    { name: 'History', attribute: 'INT', proficient: false },
    { name: 'Insight', attribute: 'WIS', proficient: false },
    { name: 'Intimidation', attribute: 'CHA', proficient: false },
    { name: 'Investigation', attribute: 'INT', proficient: false },
    { name: 'Medicine', attribute: 'WIS', proficient: false },
    { name: 'Nature', attribute: 'INT', proficient: false },
    { name: 'Perception', attribute: 'WIS', proficient: false },
    { name: 'Performance', attribute: 'CHA', proficient: false },
    { name: 'Persuasion', attribute: 'CHA', proficient: false },
    { name: 'Religion', attribute: 'INT', proficient: false },
    { name: 'Sleight of Hand', attribute: 'DEX', proficient: false },
    { name: 'Stealth', attribute: 'DEX', proficient: false },
    { name: 'Survival', attribute: 'WIS', proficient: false },
];

export const getBackgroundAbilityBonuses = (bgName: string): { [key: string]: number } => {
    const bg = DND_BACKGROUNDS.find(b => b.name === bgName);
    return bg?.abilityBonuses || {};
};

export const roll4d6DropLowest = (): number => {
    const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
    rolls.sort((a, b) => a - b);
    rolls.shift();
    return rolls.reduce((sum, r) => sum + r, 0);
};

export const standardArray = (): { str: number; dex: number; con: number; int: number; wis: number; cha: number } => {
    const array = [15, 14, 13, 12, 10, 8];
    return {
        str: array[0],
        dex: array[1],
        con: array[2],
        int: array[3],
        wis: array[4],
        cha: array[5],
    };
};

export const getPointBuyCost = (value: number): number => {
    if (value < 8 || value > 15) return 0;
    const costMap: Record<number, number> = {
        8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9
    };
    return costMap[value] || 0;
};

// Применение всех бонусов к способностям
export function applyBonuses(
    abilities: { str: number; dex: number; con: number; int: number; wis: number; cha: number },
    race: string,
    subrace: string | undefined,
    background: string,
    selectedBonusAttrs: (string | null)[]
): typeof abilities {
    const result = { ...abilities };
    const raceBonus = RACIAL_BONUSES[race];
    if (raceBonus) {
        if (raceBonus.fixed) {
            for (const [attr, bonus] of Object.entries(raceBonus.fixed)) {
                if (result.hasOwnProperty(attr)) result[attr as keyof typeof result] += bonus;
            }
        } else if (raceBonus.choose) {
            for (const attr of selectedBonusAttrs) {
                if (attr && result.hasOwnProperty(attr)) {
                    result[attr as keyof typeof result] += raceBonus.choose.bonus;
                }
            }
        }
    }
    if (subrace) {
        const subraceBonus = SUBRACE_DETAILS[subrace]?.abilityBonuses;
        if (subraceBonus) {
            for (const [attr, bonus] of Object.entries(subraceBonus)) {
                if (result.hasOwnProperty(attr)) result[attr as keyof typeof result] += bonus;
            }
        }
    }
    const bgBonuses = getBackgroundAbilityBonuses(background);
    for (const [attr, bonus] of Object.entries(bgBonuses)) {
        if (result.hasOwnProperty(attr)) result[attr as keyof typeof result] += bonus;
    }
    return result;
}

// Создание инвентаря из стартового снаряжения
export function buildStartingItems(
    characterClass: string,
    background: string
): Omit<InventoryItem, 'id'>[] {
    const classEquipData = CLASS_STARTING_EQUIPMENT[characterClass];
    const classItems: Omit<LibraryItem, 'id'>[] = [];
    if (classEquipData) {
        classItems.push(...classEquipData.mandatory);
        if (classEquipData.choices) {
            classEquipData.choices.forEach(choice => {
                const firstOption = choice.options[0];
                if (firstOption) classItems.push(...firstOption.items);
            });
        }
    }
    const bg = DND_BACKGROUNDS.find(b => b.name === background);
    const bgItems = bg?.startingEquipment || [];
    return [...classItems, ...bgItems].map(item => ({
        id: `start-${Date.now()}-${Math.random()}`,
        name: item.name,
        type: item.type,
        rarity: item.rarity,
        description: item.description,
        equipped: item.type === 'armor' || item.type === 'shield' ? true : false,
    }));
}

// Основная функция построения объекта персонажа
export function buildCharacter(
    formData: any,
    classLevels: { className: string; level: number }[],
    selectedBonusAttrs: (string | null)[],
    selectedRacialSkills: string[],
    selectedRacialTools: string[],
    today: string
): Omit<Character, 'id'> {
    const skillData = RACIAL_SKILLS[formData.race];
    const toolData = RACIAL_TOOLS[formData.race];
    const bg = DND_BACKGROUNDS.find(b => b.name === formData.background);
    const bgLanguages = bg?.languages || [];
    const raceDetails = RACE_DETAILS[formData.race];

    const abilities = applyBonuses(
        formData.abilities,
        formData.race,
        formData.subrace,
        formData.background,
        selectedBonusAttrs
    );

    const racialEffects = getRacialEffects(formData.race, formData.subrace);
    const racialLanguages = racialEffects
        .filter(e => e.type === 'language')
        .flatMap(e => {
            if (typeof e.value === 'string') {
                return e.value.split(', ').map(l => l.trim());
            }
            return [];
        });

// Объединяем и убираем дубликаты
    const allLanguages = Array.from(new Set([...bgLanguages, ...racialLanguages]));

    const proficientSkillNames = new Set<string>();
    bg?.skillProficiencies.forEach(s => proficientSkillNames.add(s));
    if (skillData) {
        if (skillData.fixed) skillData.fixed.forEach(s => proficientSkillNames.add(s));
        else if (skillData.choose) selectedRacialSkills.forEach(s => { if (s) proficientSkillNames.add(s); });
    }
    const skills = DEFAULT_SKILLS.map(skill => ({
        ...skill,
        proficient: proficientSkillNames.has(skill.name),
    }));

    let toolProficiencies = bg?.toolProficiencies?.map(tool => ({
        name: tool.name,
        attribute: tool.attribute || 'DEX',
        proficient: true,
    })) || [];
    if (toolData) {
        const racialToolNames: string[] = [];
        if (toolData.fixed) racialToolNames.push(...toolData.fixed);
        else if (toolData.choose) selectedRacialTools.forEach(t => { if (t) racialToolNames.push(t); });
        racialToolNames.forEach(toolName => {
            if (!toolProficiencies.some(t => t.name === toolName)) {
                toolProficiencies.push({ name: toolName, attribute: 'DEX', proficient: true });
            }
        });
    }

    const mainClass = classLevels[0]?.className || formData.class;
    const creatureType = raceDetails?.creatureType || 'Humanoid';
    const size = formData.size || (typeof raceDetails?.size === 'string' ? raceDetails.size : 'Medium');

    return {
        ...formData,
        class: mainClass,
        classes: classLevels.map(cl => cl.className),
        level: formData.level,
        classLevels: classLevels.map(cl => ({ className: cl.className, level: cl.level })),
        subclass: formData.subclass,
        abilities,
        skills,
        toolProficiencies,
        languages: allLanguages,
        creatureType,
        size,
        savingThrowProficiencies: CLASS_SAVING_THROWS[mainClass] || [],
        status: 'active' as const,
        created: today,
        lastUsed: today,
        died: undefined,
        archived: undefined,
        diceLogs: {},
        deathSuccesses: 0,
        deathFailures: 0,
        isStable: false,
        inventory: buildStartingItems(formData.class, formData.background),
        spells: [],
        quests: [],
        campaigns: [],
    };
}