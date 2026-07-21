export interface BackgroundData {
    name: string;
    skillProficiencies: string[];
    abilityBonuses?: { [key: string]: number };
}

export const DND_BACKGROUNDS: BackgroundData[] = [
    {
        name: 'Acolyte',
        skillProficiencies: ['Insight', 'Religion'],
        abilityBonuses: { wis: 1, int: 1 },
    },
    {
        name: 'Charlatan',
        skillProficiencies: ['Deception', 'Sleight of Hand'],
        abilityBonuses: { cha: 1, dex: 1 },
    },
    {
        name: 'Criminal',
        skillProficiencies: ['Deception', 'Stealth'],
        abilityBonuses: { dex: 1, cha: 1 },
    },
    {
        name: 'Entertainer',
        skillProficiencies: ['Acrobatics', 'Performance'],
        abilityBonuses: { cha: 1, dex: 1 },
    },
    {
        name: 'Folk Hero',
        skillProficiencies: ['Animal Handling', 'Survival'],
        abilityBonuses: { str: 1, con: 1 },
    },
    {
        name: 'Gladiator',
        skillProficiencies: ['Athletics', 'Performance'],
        abilityBonuses: { str: 1, cha: 1 },
    },
    {
        name: 'Guild Artisan',
        skillProficiencies: ['Insight', 'Persuasion'],
        abilityBonuses: { int: 1, cha: 1 },
    },
    {
        name: 'Hermit',
        skillProficiencies: ['Medicine', 'Religion'],
        abilityBonuses: { wis: 1, int: 1 },
    },
    {
        name: 'Knight',
        skillProficiencies: ['History', 'Persuasion'],
        abilityBonuses: { str: 1, cha: 1 },
    },
    {
        name: 'Noble',
        skillProficiencies: ['History', 'Persuasion'],
        abilityBonuses: { cha: 1, int: 1 },
    },
    {
        name: 'Outlander',
        skillProficiencies: ['Athletics', 'Survival'],
        abilityBonuses: { str: 1, wis: 1 },
    },
    {
        name: 'Sage',
        skillProficiencies: ['Arcana', 'History'],
        abilityBonuses: { int: 1, wis: 1 },
    },
    {
        name: 'Sailor',
        skillProficiencies: ['Athletics', 'Perception'],
        abilityBonuses: { str: 1, con: 1 },
    },
    {
        name: 'Soldier',
        skillProficiencies: ['Athletics', 'Intimidation'],
        abilityBonuses: { str: 1, con: 1 },
    },
    {
        name: 'Urchin',
        skillProficiencies: ['Sleight of Hand', 'Stealth'],
        abilityBonuses: { dex: 1, cha: 1 },
    },
    {
        name: 'Artisan',
        skillProficiencies: ['Investigation', 'Perception'],
        abilityBonuses: { int: 1, dex: 1 },
    },
    {
        name: 'Bounty Hunter',
        skillProficiencies: ['Investigation', 'Survival'],
        abilityBonuses: { wis: 1, dex: 1 },
    },
    {
        name: 'Courtier',
        skillProficiencies: ['Insight', 'Persuasion'],
        abilityBonuses: { cha: 1, int: 1 },
    },
    {
        name: 'Faction Agent',
        skillProficiencies: ['Deception', 'Persuasion'],
        abilityBonuses: { cha: 1, wis: 1 },
    },
    {
        name: 'Far Traveler',
        skillProficiencies: ['Perception', 'Survival'],
        abilityBonuses: { wis: 1, cha: 1 },
    },
];