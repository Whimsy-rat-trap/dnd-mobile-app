export interface BackgroundData {
    name: string;
    skillProficiencies: string[];
    abilityBonuses?: { [key: string]: number };
    toolProficiencies: { name: string; attribute: string }[];
}

export const DND_BACKGROUNDS: BackgroundData[] = [
    {
        name: 'Acolyte',
        skillProficiencies: ['Insight', 'Religion'],
        abilityBonuses: { wis: 1, int: 1 },
        toolProficiencies: [],
    },
    {
        name: 'Charlatan',
        skillProficiencies: ['Deception', 'Sleight of Hand'],
        abilityBonuses: { cha: 1, dex: 1 },
        toolProficiencies: [
            { name: 'Disguise Kit', attribute: 'CHA' },
            { name: 'Forgery Kit', attribute: 'DEX' },
        ],
    },
    {
        name: 'Criminal',
        skillProficiencies: ['Deception', 'Stealth'],
        abilityBonuses: { dex: 1, cha: 1 },
        toolProficiencies: [
            { name: 'Thieves\' Tools', attribute: 'DEX' },
        ],
    },
    {
        name: 'Entertainer',
        skillProficiencies: ['Acrobatics', 'Performance'],
        abilityBonuses: { cha: 1, dex: 1 },
        toolProficiencies: [
            { name: 'Disguise Kit', attribute: 'CHA' },
            { name: 'Musical Instruments', attribute: 'CHA' },
        ],
    },
    {
        name: 'Folk Hero',
        skillProficiencies: ['Animal Handling', 'Survival'],
        abilityBonuses: { str: 1, con: 1 },
        toolProficiencies: [
            { name: 'Artisan\'s Tools', attribute: 'DEX' },
            { name: 'Vehicles (Land)', attribute: 'DEX' },
        ],
    },
    {
        name: 'Gladiator',
        skillProficiencies: ['Athletics', 'Performance'],
        abilityBonuses: { str: 1, cha: 1 },
        toolProficiencies: [
            { name: 'Musical Instruments', attribute: 'CHA' },
        ],
    },
    {
        name: 'Guild Artisan',
        skillProficiencies: ['Insight', 'Persuasion'],
        abilityBonuses: { int: 1, cha: 1 },
        toolProficiencies: [
            { name: 'Artisan\'s Tools', attribute: 'DEX' },
        ],
    },
    {
        name: 'Hermit',
        skillProficiencies: ['Medicine', 'Religion'],
        abilityBonuses: { wis: 1, int: 1 },
        toolProficiencies: [
            { name: 'Herbalism Kit', attribute: 'INT' },
        ],
    },
    {
        name: 'Knight',
        skillProficiencies: ['History', 'Persuasion'],
        abilityBonuses: { str: 1, cha: 1 },
        toolProficiencies: [
            { name: 'Vehicles (Land)', attribute: 'DEX' },
            { name: 'Gaming Set', attribute: 'CHA' },
        ],
    },
    {
        name: 'Noble',
        skillProficiencies: ['History', 'Persuasion'],
        abilityBonuses: { cha: 1, int: 1 },
        toolProficiencies: [
            { name: 'Gaming Set', attribute: 'CHA' },
        ],
    },
    {
        name: 'Outlander',
        skillProficiencies: ['Athletics', 'Survival'],
        abilityBonuses: { str: 1, wis: 1 },
        toolProficiencies: [
            { name: 'Musical Instruments', attribute: 'CHA' },
        ],
    },
    {
        name: 'Sage',
        skillProficiencies: ['Arcana', 'History'],
        abilityBonuses: { int: 1, wis: 1 },
        toolProficiencies: [],
    },
    {
        name: 'Sailor',
        skillProficiencies: ['Athletics', 'Perception'],
        abilityBonuses: { str: 1, con: 1 },
        toolProficiencies: [
            { name: 'Vehicles (Water)', attribute: 'STR' },
            { name: 'Navigator\'s Tools', attribute: 'WIS' },
        ],
    },
    {
        name: 'Soldier',
        skillProficiencies: ['Athletics', 'Intimidation'],
        abilityBonuses: { str: 1, con: 1 },
        toolProficiencies: [
            { name: 'Vehicles (Land)', attribute: 'DEX' },
            { name: 'Gaming Set', attribute: 'CHA' },
        ],
    },
    {
        name: 'Urchin',
        skillProficiencies: ['Sleight of Hand', 'Stealth'],
        abilityBonuses: { dex: 1, cha: 1 },
        toolProficiencies: [
            { name: 'Thieves\' Tools', attribute: 'DEX' },
            { name: 'Disguise Kit', attribute: 'CHA' },
        ],
    },
    {
        name: 'Artisan',
        skillProficiencies: ['Investigation', 'Perception'],
        abilityBonuses: { int: 1, dex: 1 },
        toolProficiencies: [
            { name: 'Artisan\'s Tools', attribute: 'DEX' },
        ],
    },
    {
        name: 'Bounty Hunter',
        skillProficiencies: ['Investigation', 'Survival'],
        abilityBonuses: { wis: 1, dex: 1 },
        toolProficiencies: [
            { name: 'Thieves\' Tools', attribute: 'DEX' },
        ],
    },
    {
        name: 'Courtier',
        skillProficiencies: ['Insight', 'Persuasion'],
        abilityBonuses: { cha: 1, int: 1 },
        toolProficiencies: [
            { name: 'Disguise Kit', attribute: 'CHA' },
            { name: 'Gaming Set', attribute: 'CHA' },
        ],
    },
    {
        name: 'Faction Agent',
        skillProficiencies: ['Deception', 'Persuasion'],
        abilityBonuses: { cha: 1, wis: 1 },
        toolProficiencies: [
            { name: 'Disguise Kit', attribute: 'CHA' },
        ],
    },
    {
        name: 'Far Traveler',
        skillProficiencies: ['Perception', 'Survival'],
        abilityBonuses: { wis: 1, cha: 1 },
        toolProficiencies: [
            { name: 'Musical Instruments', attribute: 'CHA' },
            { name: 'Navigator\'s Tools', attribute: 'WIS' },
        ],
    },
];