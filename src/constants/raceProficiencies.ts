export interface RaceSkillProficiency {
    fixed?: string[];
    choose?: { count: number; options: string[] };
}

export interface RaceToolProficiency {
    fixed?: string[];
    choose?: { count: number; options: string[] };
}

// Все стандартные навыки (для выбора)
export const ALL_SKILLS = [
    'Acrobatics',
    'Animal Handling',
    'Arcana',
    'Athletics',
    'Deception',
    'History',
    'Insight',
    'Intimidation',
    'Investigation',
    'Medicine',
    'Nature',
    'Perception',
    'Performance',
    'Persuasion',
    'Religion',
    'Sleight of Hand',
    'Stealth',
    'Survival',
];

/**
 * Расовая принадлежность к навыкам (Skill Proficiencies)
 * Ключ – точное имя расы из DND_RACES
 * Ключи с дефисом берутся в кавычки!
 */
export const RACIAL_SKILLS: Record<string, RaceSkillProficiency> = {
    'Half-Elf': {
        choose: { count: 2, options: ALL_SKILLS },
    },
    'Half-Orc': {
        fixed: ['Intimidation'],
    },
    Elf: {
        fixed: ['Perception'],
    },
    Goliath: {
        fixed: ['Athletics'],
    },
    Human: {
        choose: { count: 1, options: ALL_SKILLS },
    },
    Kenku: {
        fixed: ['Deception', 'Sleight of Hand'],
    },
    Tabaxi: {
        fixed: ['Perception', 'Stealth'],
    },
    // Остальные расы без бонусов
    Aarakocra: {},
    Aasimar: {},
    Dragonborn: {},
    Dwarf: {},
    Firbolg: {},
    Gnome: {},
    Halfling: {},
    Lizardfolk: {},
    Tiefling: {},
    Tortle: {},
};

/**
 * Расовая принадлежность к инструментам (Tool Proficiencies)
 * Ключ – точное имя расы из DND_RACES
 * Ключи с дефисом берутся в кавычки!
 */
export const RACIAL_TOOLS: Record<string, RaceToolProficiency> = {
    Dwarf: {
        choose: {
            count: 1,
            options: ["Smith's Tools", "Brewer's Supplies", "Mason's Tools"],
        },
    },
    Gnome: {
        fixed: ["Tinker's Tools"],
    },
    // Остальные расы
    'Half-Elf': {},
    'Half-Orc': {},
    Aarakocra: {},
    Aasimar: {},
    Dragonborn: {},
    Elf: {},
    Firbolg: {},
    Goliath: {},
    Halfling: {},
    Human: {},
    Kenku: {},
    Lizardfolk: {},
    Tabaxi: {},
    Tiefling: {},
    Tortle: {},
};