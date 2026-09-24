import { Character, InventoryItem } from '../types/Character';

export const NATURAL_ARMOR: Record<string, { base: number; dex?: boolean; max?: number }> = {
    Tortle: { base: 17 },
    Lizardfolk: { base: 13, dex: true, max: 2 },
};

export const getProficiencyBonus = (level: number): number => {
    if (level <= 4) return 2;
    if (level <= 8) return 3;
    if (level <= 12) return 4;
    if (level <= 16) return 5;
    return 6;
};

export const getModifier = (score: number): number => Math.floor((score - 10) / 2);

export const getSpellcastingAbility = (character: Character): keyof Character['abilities'] => {
    const mainClass = character.classLevels?.[0]?.className;
    if (!mainClass) return 'cha';
    if (['Wizard', 'Artificer'].includes(mainClass)) return 'int';
    if (['Cleric', 'Druid', 'Ranger'].includes(mainClass)) return 'wis';
    return 'cha';
};

export interface ACInfo {
    total: number;
    breakdown: string[];
}

export const getACInfo = (character: Character): ACInfo => {
    const dexMod = getModifier(character.abilities.dex);
    const equippedArmor = character.inventory.find(i => i.type === 'armor' && i.equipped);
    const equippedShield = character.inventory.find(i => i.type === 'shield' && i.equipped);
    const acBonusItems = character.inventory.filter(
        i => i.equipped && i.acBonus && i.type !== 'armor' && i.type !== 'shield'
    );
    const raceNaturalArmor = NATURAL_ARMOR[character.race];

    let total = 0;
    const breakdown: string[] = [];

    if (raceNaturalArmor) {
        let ac = raceNaturalArmor.base;
        if (raceNaturalArmor.dex) {
            const maxDex = raceNaturalArmor.max ?? Infinity;
            const dexBonus = Math.min(dexMod, maxDex);
            ac += dexBonus;
            breakdown.push(`Natural Armor: ${raceNaturalArmor.base} + Dex (max ${maxDex}) = ${ac}`);
        } else {
            breakdown.push(`Natural Armor: ${ac}`);
        }
        total = ac;
    } else if (equippedArmor) {
        const baseAC = equippedArmor.baseAC ?? 10;
        let ac = baseAC;
        breakdown.push(`Armor (${equippedArmor.name}): ${baseAC}`);
        if (equippedArmor.dexModifierAllowed) {
            const maxDex = equippedArmor.maxDexBonus ?? Infinity;
            const dexBonus = Math.min(dexMod, maxDex);
            ac += dexBonus;
            breakdown.push(
                `Dex bonus: ${dexBonus >= 0 ? '+' : ''}${dexBonus}` +
                (maxDex !== Infinity ? ` (max ${maxDex})` : '')
            );
        }
        total = ac;
    } else {
        total = 10 + dexMod;
        breakdown.push(`Base: 10 + Dex (${dexMod >= 0 ? '+' : ''}${dexMod}) = ${total}`);
    }

    if (equippedShield) {
        const shieldBonus = equippedShield.acBonus ?? 2;
        total += shieldBonus;
        breakdown.push(`Shield (${equippedShield.name}): +${shieldBonus}`);
    }

    for (const item of acBonusItems) {
        total += item.acBonus ?? 0;
        breakdown.push(`${item.name}: +${item.acBonus}`);
    }

    return { total, breakdown };
};

export const getSkillBonus = (
    skill: Character['skills'][0],
    abilities: Character['abilities'],
    proficiencyBonus: number
): number => {
    const mod = getModifier(abilities[skill.attribute.toLowerCase() as keyof Character['abilities']]);
    return skill.proficient ? mod + proficiencyBonus : mod;
};

export const getToolBonus = (
    tool: Character['toolProficiencies'][0],
    abilities: Character['abilities'],
    proficiencyBonus: number
): number => {
    const attrKey = (tool.attribute || 'DEX').toLowerCase() as keyof Character['abilities'];
    const mod = getModifier(abilities[attrKey]);
    return tool.proficient ? mod + proficiencyBonus : mod;
};

export const getSavingThrowBonus = (
    attr: keyof Character['abilities'],
    abilities: Character['abilities'],
    proficiencies: string[],
    proficiencyBonus: number
): number => {
    const mod = getModifier(abilities[attr]);
    const isProficient = proficiencies.includes(attr.toUpperCase());
    return isProficient ? mod + proficiencyBonus : mod;
};

export const getAttackBonuses = (character: Character) => {
    const prof = getProficiencyBonus(character.level);
    const strMod = getModifier(character.abilities.str);
    const spellAbility = getSpellcastingAbility(character);
    const spellMod = getModifier(character.abilities[spellAbility]);

    return {
        meleeAttack: prof + strMod,
        meleeDamage: strMod,
        spellAttack: prof + spellMod,
        spellDamage: spellMod,
    };
};