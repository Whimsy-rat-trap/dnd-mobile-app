export interface SkillData {
    name: string;
    attribute: string;
    proficient: boolean;
}

/**
 * Стандартный список навыков 5e (все — непрофициентные по умолчанию).
 * Используется как fallback, если у персонажа нет `skills` в данных.
 */
export const DEFAULT_SKILLS: SkillData[] = [
    { name: 'Acrobatics',       attribute: 'DEX', proficient: false },
    { name: 'Animal Handling',  attribute: 'WIS', proficient: false },
    { name: 'Arcana',           attribute: 'INT', proficient: false },
    { name: 'Athletics',        attribute: 'STR', proficient: false },
    { name: 'Deception',        attribute: 'CHA', proficient: false },
    { name: 'History',          attribute: 'INT', proficient: false },
    { name: 'Insight',          attribute: 'WIS', proficient: false },
    { name: 'Intimidation',     attribute: 'CHA', proficient: false },
    { name: 'Investigation',    attribute: 'INT', proficient: false },
    { name: 'Medicine',         attribute: 'WIS', proficient: false },
    { name: 'Nature',           attribute: 'INT', proficient: false },
    { name: 'Perception',       attribute: 'WIS', proficient: false },
    { name: 'Performance',      attribute: 'CHA', proficient: false },
    { name: 'Persuasion',       attribute: 'CHA', proficient: false },
    { name: 'Religion',         attribute: 'INT', proficient: false },
    { name: 'Sleight of Hand',  attribute: 'DEX', proficient: false },
    { name: 'Stealth',          attribute: 'DEX', proficient: false },
    { name: 'Survival',         attribute: 'WIS', proficient: false },
];