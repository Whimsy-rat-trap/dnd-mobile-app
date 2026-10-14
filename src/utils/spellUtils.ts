import { Character, Spell } from '../types/Character';
import { ALL_SPELLS } from '../constants/spells';
import { getModifier, getProficiencyBonus } from './characterUtils';

export const getElementFromSpell = (spell: Spell | { name: string }): string | undefined => {
    const name = spell.name.toLowerCase();
    if (name.includes('fire') || name.includes('flame') || name.includes('burn') || name.includes('burning')) return 'fire';
    if (name.includes('cold') || name.includes('frost') || name.includes('ice') || name.includes('freeze')) return 'cold';
    if (name.includes('lightning') || name.includes('shock') || name.includes('storm')) return 'lightning';
    if (name.includes('thunder')) return 'thunder';
    if (name.includes('acid')) return 'acid';
    if (name.includes('poison') || name.includes('venom')) return 'poison';
    if (name.includes('force') || name.includes('magic missile')) return 'force';
    if (name.includes('necrotic') || name.includes('chill touch') || name.includes('death') || name.includes('inflict')) return 'necrotic';
    if (name.includes('radiant') || name.includes('light') || name.includes('holy') || name.includes('guiding bolt')) return 'radiant';
    if (name.includes('psychic')) return 'psychic';
    if (name.includes('healing') || name.includes('cure') || name.includes('restore')) return 'healing';
    return undefined;
};

export const SCHOOLS = Array.from(new Set(ALL_SPELLS.map(s => s.school)));
export const ELEMENTS = ['fire', 'cold', 'lightning', 'acid', 'poison', 'force', 'necrotic', 'radiant', 'psychic', 'healing', 'thunder'];

// Spellcasting Ability / DC / Attack

type AbilityKey = keyof Character['abilities'];

/**
 * Способность для конкретного класса (учитывает EK/AT).
 */
export function getSpellcastingAbilityForClass(
    className: string,
    subclass?: string
): AbilityKey {
    if (className === 'Wizard' || className === 'Artificer') return 'int';
    if (className === 'Cleric' || className === 'Druid' || className === 'Ranger') return 'wis';
    if (className === 'Fighter' && subclass === 'Eldritch Knight') return 'int';
    if (className === 'Rogue' && subclass === 'Arcane Trickster') return 'int';
    // Bard, Paladin, Sorcerer, Warlock
    return 'cha';
}

const CASTER_CLASSES = [
    'Wizard', 'Artificer', 'Cleric', 'Druid',
    'Bard', 'Paladin', 'Ranger', 'Sorcerer', 'Warlock',
];

function isCasterClass(cl: { className: string; subclass?: string }): boolean {
    if (CASTER_CLASSES.includes(cl.className)) return true;
    if (cl.className === 'Fighter' && cl.subclass === 'Eldritch Knight') return true;
    if (cl.className === 'Rogue' && cl.subclass === 'Arcane Trickster') return true;
    return false;
}

/**
 * Способность для конкретного заклинания.
 * Приоритет: совпадение по spell.classes → первый класс-кастер у персонажа → 'cha'.
 */
export function getSpellcastingAbilityForSpell(
    character: Character,
    spell: Spell
): AbilityKey {
    const classLevels = character.classLevels || [];

    if (spell.classes && spell.classes.length > 0) {
        const matching = classLevels.find(cl => spell.classes!.includes(cl.className));
        if (matching) return getSpellcastingAbilityForClass(matching.className, matching.subclass);
    }

    const firstCaster = classLevels.find(isCasterClass);
    if (firstCaster) return getSpellcastingAbilityForClass(firstCaster.className, firstCaster.subclass);

    return 'cha';
}

/**
 * Основная способность кастера (для сводки в SpellcastingSection).
 */
export function getPrimarySpellcastingAbility(character: Character): AbilityKey {
    const classLevels = character.classLevels || [];
    const firstCaster = classLevels.find(isCasterClass);
    if (firstCaster) return getSpellcastingAbilityForClass(firstCaster.className, firstCaster.subclass);
    return 'cha';
}

/**
 * Spell Save DC = 8 + prof + abilityMod
 */
export function getSpellSaveDC(character: Character, spell?: Spell): number {
    const prof = getProficiencyBonus(character.level);
    const ability = spell
        ? getSpellcastingAbilityForSpell(character, spell)
        : getPrimarySpellcastingAbility(character);
    const mod = getModifier(character.abilities[ability]);
    return 8 + prof + mod;
}

/**
 * Spell Attack Bonus = prof + abilityMod
 */
export function getSpellAttackBonus(character: Character, spell?: Spell): number {
    const prof = getProficiencyBonus(character.level);
    const ability = spell
        ? getSpellcastingAbilityForSpell(character, spell)
        : getPrimarySpellcastingAbility(character);
    const mod = getModifier(character.abilities[ability]);
    return prof + mod;
}

/**
 * Spell Damage Bonus = abilityMod
 */
export function getSpellDamageBonus(character: Character, spell?: Spell): number {
    const ability = spell
        ? getSpellcastingAbilityForSpell(character, spell)
        : getPrimarySpellcastingAbility(character);
    return getModifier(character.abilities[ability]);
}

/**
 * Определяет, требует ли заклинание броска атаки (а не спасброска).
 * Простая эвристика: есть урон, не healing, и в описании нет "saving throw".
 */
export function spellRequiresAttackRoll(spell: Spell): boolean {
    const roll = spell.damageRoll || spell.diceRoll;
    if (!roll) return false;
    if (spell.damageType === 'healing' || spell.element === 'healing') return false;
    // Если в описании явно упомянут saving throw — не атака
    if (/saving throw|save\b/i.test(spell.description)) return false;
    return true;
}