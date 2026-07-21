import { getDefaultAttribute } from './toolAttributes';

export interface BackgroundData {
    name: string;
    skillProficiencies: string[];
    abilityBonuses?: { [key: string]: number };
    toolProficiencies?: { name: string; attribute: string }[];
    languages?: string[];
}

export const DND_BACKGROUNDS: BackgroundData[] = [
    {
        name: 'Acolyte',
        skillProficiencies: ['Insight', 'Religion'],
        abilityBonuses: { wis: 1, int: 1 },
        toolProficiencies: [],
        languages: ['Common', 'Celestial', 'Infernal'],
    },
    {
        name: 'Charlatan',
        skillProficiencies: ['Deception', 'Sleight of Hand'],
        abilityBonuses: { cha: 1, dex: 1 },
        toolProficiencies: [
            { name: 'Disguise Kit', attribute: getDefaultAttribute('Disguise Kit') },
            { name: 'Forgery Kit', attribute: getDefaultAttribute('Forgery Kit') },
        ],
        languages: ['Common'],
    },
    {
        name: 'Criminal',
        skillProficiencies: ['Deception', 'Stealth'],
        abilityBonuses: { dex: 1, cha: 1 },
        toolProficiencies: [
            { name: "Thieves' Tools", attribute: getDefaultAttribute("Thieves' Tools") },
        ],
        languages: ['Common'],
    },
    {
        name: 'Entertainer',
        skillProficiencies: ['Acrobatics', 'Performance'],
        abilityBonuses: { cha: 1, dex: 1 },
        toolProficiencies: [
            { name: 'Musical Instruments', attribute: getDefaultAttribute('Musical Instruments') },
        ],
        languages: ['Common'],
    },
    {
        name: 'Folk Hero',
        skillProficiencies: ['Animal Handling', 'Survival'],
        abilityBonuses: { str: 1, con: 1 },
        toolProficiencies: [],
        languages: ['Common'],
    },
    {
        name: 'Gladiator',
        skillProficiencies: ['Athletics', 'Performance'],
        abilityBonuses: { str: 1, cha: 1 },
        toolProficiencies: [
            { name: 'Musical Instruments', attribute: getDefaultAttribute('Musical Instruments') },
        ],
        languages: ['Common'],
    },
    {
        name: 'Guild Artisan',
        skillProficiencies: ['Insight', 'Persuasion'],
        abilityBonuses: { int: 1, cha: 1 },
        toolProficiencies: [
            { name: "Artisan's Tools", attribute: getDefaultAttribute("Artisan's Tools") },
        ],
        languages: ['Common'],
    },
    {
        name: 'Hermit',
        skillProficiencies: ['Medicine', 'Religion'],
        abilityBonuses: { wis: 1, int: 1 },
        toolProficiencies: [],
        languages: ['Common'],
    },
    {
        name: 'Knight',
        skillProficiencies: ['History', 'Persuasion'],
        abilityBonuses: { str: 1, cha: 1 },
        toolProficiencies: [],
        languages: ['Common', 'Elvish', 'Orc'],
    },
    {
        name: 'Noble',
        skillProficiencies: ['History', 'Persuasion'],
        abilityBonuses: { cha: 1, int: 1 },
        toolProficiencies: [],
        languages: ['Common', 'Elvish', 'Dwarvish'],
    },
    {
        name: 'Outlander',
        skillProficiencies: ['Athletics', 'Survival'],
        abilityBonuses: { str: 1, wis: 1 },
        toolProficiencies: [],
        languages: ['Common', 'Giant'],
    },
    {
        name: 'Sage',
        skillProficiencies: ['Arcana', 'History'],
        abilityBonuses: { int: 1, wis: 1 },
        toolProficiencies: [],
        languages: ['Common', 'Draconic', 'Celestial'],
    },
    {
        name: 'Sailor',
        skillProficiencies: ['Athletics', 'Perception'],
        abilityBonuses: { str: 1, con: 1 },
        toolProficiencies: [
            { name: "Navigator's Tools", attribute: getDefaultAttribute("Navigator's Tools") },
        ],
        languages: ['Common'],
    },
    {
        name: 'Soldier',
        skillProficiencies: ['Athletics', 'Intimidation'],
        abilityBonuses: { str: 1, con: 1 },
        toolProficiencies: [
            { name: 'Vehicles (Land)', attribute: getDefaultAttribute('Vehicles (Land)') },
        ],
        languages: ['Common'],
    },
    {
        name: 'Urchin',
        skillProficiencies: ['Sleight of Hand', 'Stealth'],
        abilityBonuses: { dex: 1, cha: 1 },
        toolProficiencies: [
            { name: "Thieves' Tools", attribute: getDefaultAttribute("Thieves' Tools") },
        ],
        languages: ['Common'],
    },
    {
        name: 'Artisan',
        skillProficiencies: ['Investigation', 'Perception'],
        abilityBonuses: { int: 1, dex: 1 },
        toolProficiencies: [
            { name: "Artisan's Tools", attribute: getDefaultAttribute("Artisan's Tools") },
        ],
        languages: ['Common'],
    },
    {
        name: 'Bounty Hunter',
        skillProficiencies: ['Investigation', 'Survival'],
        abilityBonuses: { wis: 1, dex: 1 },
        toolProficiencies: [
            { name: "Thieves' Tools", attribute: getDefaultAttribute("Thieves' Tools") },
        ],
        languages: ['Common', "Thieves' Cant"],
    },
    {
        name: 'Courtier',
        skillProficiencies: ['Insight', 'Persuasion'],
        abilityBonuses: { cha: 1, int: 1 },
        toolProficiencies: [],
        languages: ['Common', 'Elvish', 'Dwarvish'],
    },
    {
        name: 'Faction Agent',
        skillProficiencies: ['Deception', 'Persuasion'],
        abilityBonuses: { cha: 1, wis: 1 },
        toolProficiencies: [],
        languages: ['Common', 'Undercommon'],
    },
    {
        name: 'Far Traveler',
        skillProficiencies: ['Perception', 'Survival'],
        abilityBonuses: { wis: 1, cha: 1 },
        toolProficiencies: [],
        languages: ['Common', 'Druidic'],
    },
];