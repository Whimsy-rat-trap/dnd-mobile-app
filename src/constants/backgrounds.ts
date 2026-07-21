export interface BackgroundData {
    name: string;
    skillProficiencies: string[];
    abilityBonuses?: { [key: string]: number };
    toolProficiencies?: string[];
}

export const DND_BACKGROUNDS: BackgroundData[] = [
    {
        name: 'Acolyte',
        skillProficiencies: ['Insight', 'Religion'],
        abilityBonuses: { wis: 1, int: 1 },
        toolProficiencies: ['Calligrapher\'s supplies'],
    },
    {
        name: 'Charlatan',
        skillProficiencies: ['Deception', 'Sleight of Hand'],
        abilityBonuses: { cha: 1, dex: 1 },
        toolProficiencies: ['Disguise kit', 'Forgery kit'],
    },
    {
        name: 'Criminal',
        skillProficiencies: ['Deception', 'Stealth'],
        abilityBonuses: { dex: 1, cha: 1 },
        toolProficiencies: ['Thieves\' tools', 'Gaming set'],
    },
    {
        name: 'Entertainer',
        skillProficiencies: ['Acrobatics', 'Performance'],
        abilityBonuses: { cha: 1, dex: 1 },
        toolProficiencies: ['Musical instrument', 'Disguise kit'],
    },
    {
        name: 'Folk Hero',
        skillProficiencies: ['Animal Handling', 'Survival'],
        abilityBonuses: { str: 1, con: 1 },
        toolProficiencies: ['Artisan\'s tools (woodworking)', 'Vehicles (land)'],
    },
    {
        name: 'Gladiator',
        skillProficiencies: ['Athletics', 'Performance'],
        abilityBonuses: { str: 1, cha: 1 },
        toolProficiencies: ['Gaming set', 'Musical instrument'],
    },
    {
        name: 'Guild Artisan',
        skillProficiencies: ['Insight', 'Persuasion'],
        abilityBonuses: { int: 1, cha: 1 },
        toolProficiencies: ['Artisan\'s tools (one type)'],
    },
    {
        name: 'Hermit',
        skillProficiencies: ['Medicine', 'Religion'],
        abilityBonuses: { wis: 1, int: 1 },
        toolProficiencies: ['Herbalism kit'],
    },
    {
        name: 'Knight',
        skillProficiencies: ['History', 'Persuasion'],
        abilityBonuses: { str: 1, cha: 1 },
        toolProficiencies: ['Gaming set', 'Vehicles (land)'],
    },
    {
        name: 'Noble',
        skillProficiencies: ['History', 'Persuasion'],
        abilityBonuses: { cha: 1, int: 1 },
        toolProficiencies: ['Gaming set', 'Musical instrument'],
    },
    {
        name: 'Outlander',
        skillProficiencies: ['Athletics', 'Survival'],
        abilityBonuses: { str: 1, wis: 1 },
        toolProficiencies: ['Musical instrument', 'Vehicles (land)'],
    },
    {
        name: 'Sage',
        skillProficiencies: ['Arcana', 'History'],
        abilityBonuses: { int: 1, wis: 1 },
        toolProficiencies: ['Calligrapher\'s supplies'],
    },
    {
        name: 'Sailor',
        skillProficiencies: ['Athletics', 'Perception'],
        abilityBonuses: { str: 1, con: 1 },
        toolProficiencies: ['Vehicles (water)', 'Navigator\'s tools'],
    },
    {
        name: 'Soldier',
        skillProficiencies: ['Athletics', 'Intimidation'],
        abilityBonuses: { str: 1, con: 1 },
        toolProficiencies: ['Gaming set', 'Vehicles (land)'],
    },
    {
        name: 'Urchin',
        skillProficiencies: ['Sleight of Hand', 'Stealth'],
        abilityBonuses: { dex: 1, cha: 1 },
        toolProficiencies: ['Thieves\' tools', 'Disguise kit'],
    },
    {
        name: 'Artisan',
        skillProficiencies: ['Investigation', 'Perception'],
        abilityBonuses: { int: 1, dex: 1 },
        toolProficiencies: ['Artisan\'s tools (one type)'],
    },
    {
        name: 'Bounty Hunter',
        skillProficiencies: ['Investigation', 'Survival'],
        abilityBonuses: { wis: 1, dex: 1 },
        toolProficiencies: ['Thieves\' tools', 'Vehicles (land)'],
    },
    {
        name: 'Courtier',
        skillProficiencies: ['Insight', 'Persuasion'],
        abilityBonuses: { cha: 1, int: 1 },
        toolProficiencies: ['Gaming set', 'Calligrapher\'s supplies'],
    },
    {
        name: 'Faction Agent',
        skillProficiencies: ['Deception', 'Persuasion'],
        abilityBonuses: { cha: 1, wis: 1 },
        toolProficiencies: ['Disguise kit', 'Forgery kit'],
    },
    {
        name: 'Far Traveler',
        skillProficiencies: ['Perception', 'Survival'],
        abilityBonuses: { wis: 1, cha: 1 },
        toolProficiencies: ['Musical instrument', 'Navigator\'s tools'],
    },
];