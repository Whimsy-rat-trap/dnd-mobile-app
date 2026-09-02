import { getDefaultAttribute } from './toolAttributes';
import { LibraryItem } from './items';

export interface BackgroundData {
    name: string;
    skillProficiencies: string[];
    abilityBonuses?: { [key: string]: number };
    toolProficiencies?: { name: string; attribute: string }[];
    languages?: string[];
    startingEquipment?: Omit<LibraryItem, 'id'>[]; // новое поле
}

// Вспомогательная функция для создания предмета
function item(name: string, type: any, rarity: any, desc: string): Omit<LibraryItem, 'id'> {
    return { name, type, rarity, description: desc };
}

export const DND_BACKGROUNDS: BackgroundData[] = [
    {
        name: 'Acolyte',
        skillProficiencies: ['Insight', 'Religion'],
        abilityBonuses: { wis: 1, int: 1 },
        toolProficiencies: [],
        languages: ['Common', 'Celestial', 'Infernal'],
        startingEquipment: [
            item("Holy Symbol", "other", "common", "A holy symbol of your deity."),
            item("Prayer Book", "other", "common", "A book of prayers and rituals."),
            item("Incense (5 blocks)", "other", "common", "Blocks of incense for rituals."),
            item("Common Clothes", "other", "common", "Simple clothes."),
        ],
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
        startingEquipment: [
            item("Fine Clothes", "other", "common", "Quality clothing."),
            item("Disguise Kit", "other", "common", "A kit for changing your appearance."),
            item("Forgery Kit", "other", "common", "A kit for forging documents."),
            item("Dice Set", "other", "common", "A set of dice."),
        ],
    },
    {
        name: 'Criminal',
        skillProficiencies: ['Deception', 'Stealth'],
        abilityBonuses: { dex: 1, cha: 1 },
        toolProficiencies: [
            { name: "Thieves' Tools", attribute: getDefaultAttribute("Thieves' Tools") },
        ],
        languages: ['Common'],
        startingEquipment: [
            item("Thieves' Tools", "other", "common", "A set of tools for picking locks."),
            item("Dark Clothes", "other", "common", "Dark, hooded clothing."),
            item("Pouch", "other", "common", "A small pouch with 10 gp."),
        ],
    },
    {
        name: 'Entertainer',
        skillProficiencies: ['Acrobatics', 'Performance'],
        abilityBonuses: { cha: 1, dex: 1 },
        toolProficiencies: [
            { name: 'Musical Instruments', attribute: getDefaultAttribute('Musical Instruments') },
        ],
        languages: ['Common'],
        startingEquipment: [
            item("Musical Instrument", "other", "common", "Your choice of instrument."),
            item("Costume", "other", "common", "A colorful costume."),
            item("Pouch", "other", "common", "A small pouch with 10 gp."),
        ],
    },
    {
        name: 'Folk Hero',
        skillProficiencies: ['Animal Handling', 'Survival'],
        abilityBonuses: { str: 1, con: 1 },
        toolProficiencies: [],
        languages: ['Common'],
        startingEquipment: [
            item("Common Clothes", "other", "common", "Simple clothes."),
            item("Shovel", "other", "common", "A sturdy shovel."),
            item("Iron Pot", "other", "common", "A cooking pot."),
            item("Pouch", "other", "common", "A small pouch with 10 gp."),
        ],
    },
    {
        name: 'Gladiator',
        skillProficiencies: ['Athletics', 'Performance'],
        abilityBonuses: { str: 1, cha: 1 },
        toolProficiencies: [
            { name: 'Musical Instruments', attribute: getDefaultAttribute('Musical Instruments') },
        ],
        languages: ['Common'],
        startingEquipment: [
            item("Costume", "other", "common", "A gladiator's costume."),
            item("Musical Instrument", "other", "common", "Your choice of instrument."),
            item("Pouch", "other", "common", "A small pouch with 10 gp."),
        ],
    },
    {
        name: 'Guild Artisan',
        skillProficiencies: ['Insight', 'Persuasion'],
        abilityBonuses: { int: 1, cha: 1 },
        toolProficiencies: [
            { name: "Artisan's Tools", attribute: getDefaultAttribute("Artisan's Tools") },
        ],
        languages: ['Common'],
        startingEquipment: [
            item("Artisan's Tools", "other", "common", "The tools of your trade."),
            item("Letter of Introduction", "other", "common", "A letter from your guild."),
            item("Common Clothes", "other", "common", "Simple clothes."),
            item("Pouch", "other", "common", "A small pouch with 10 gp."),
        ],
    },
    {
        name: 'Hermit',
        skillProficiencies: ['Medicine', 'Religion'],
        abilityBonuses: { wis: 1, int: 1 },
        toolProficiencies: [],
        languages: ['Common'],
        startingEquipment: [
            item("Common Clothes", "other", "common", "Simple clothes."),
            item("Herbalism Kit", "other", "common", "A kit for making potions."),
            item("Pouch", "other", "common", "A small pouch with 10 gp."),
        ],
    },
    {
        name: 'Knight',
        skillProficiencies: ['History', 'Persuasion'],
        abilityBonuses: { str: 1, cha: 1 },
        toolProficiencies: [],
        languages: ['Common', 'Elvish', 'Orc'],
        startingEquipment: [
            item("Fine Clothes", "other", "common", "Quality clothing."),
            item("Horse", "other", "common", "A riding horse."),
            item("Saddle", "other", "common", "A saddle and tack."),
            item("Pouch", "other", "common", "A small pouch with 10 gp."),
        ],
    },
    {
        name: 'Noble',
        skillProficiencies: ['History', 'Persuasion'],
        abilityBonuses: { cha: 1, int: 1 },
        toolProficiencies: [],
        languages: ['Common', 'Elvish', 'Dwarvish'],
        startingEquipment: [
            item("Fine Clothes", "other", "common", "Quality clothing."),
            item("Signet Ring", "other", "common", "A ring with your family crest."),
            item("Scroll of Pedigree", "other", "common", "A scroll proving your lineage."),
            item("Pouch", "other", "common", "A small pouch with 10 gp."),
        ],
    },
    {
        name: 'Outlander',
        skillProficiencies: ['Athletics', 'Survival'],
        abilityBonuses: { str: 1, wis: 1 },
        toolProficiencies: [],
        languages: ['Common', 'Giant'],
        startingEquipment: [
            item("Common Clothes", "other", "common", "Simple clothes."),
            item("Staff", "other", "common", "A wooden staff."),
            item("Hunting Trap", "other", "common", "A trap for hunting."),
            item("Pouch", "other", "common", "A small pouch with 10 gp."),
        ],
    },
    {
        name: 'Sage',
        skillProficiencies: ['Arcana', 'History'],
        abilityBonuses: { int: 1, wis: 1 },
        toolProficiencies: [],
        languages: ['Common', 'Draconic', 'Celestial'],
        startingEquipment: [
            item("Common Clothes", "other", "common", "Simple clothes."),
            item("Book of Lore", "other", "common", "A book containing knowledge."),
            item("Ink and Quill", "other", "common", "Writing supplies."),
            item("Pouch", "other", "common", "A small pouch with 10 gp."),
        ],
    },
    {
        name: 'Sailor',
        skillProficiencies: ['Athletics', 'Perception'],
        abilityBonuses: { str: 1, con: 1 },
        toolProficiencies: [
            { name: "Navigator's Tools", attribute: getDefaultAttribute("Navigator's Tools") },
        ],
        languages: ['Common'],
        startingEquipment: [
            item("Common Clothes", "other", "common", "Simple clothes."),
            item("Navigator's Tools", "other", "common", "Tools for navigation."),
            item("Whistle", "other", "common", "A signaling whistle."),
            item("Pouch", "other", "common", "A small pouch with 10 gp."),
        ],
    },
    {
        name: 'Soldier',
        skillProficiencies: ['Athletics', 'Intimidation'],
        abilityBonuses: { str: 1, con: 1 },
        toolProficiencies: [
            { name: 'Vehicles (Land)', attribute: getDefaultAttribute('Vehicles (Land)') },
        ],
        languages: ['Common'],
        startingEquipment: [
            item("Common Clothes", "other", "common", "Simple clothes."),
            item("Rank Insignia", "other", "common", "A symbol of your rank."),
            item("Dice Set", "other", "common", "A set of dice."),
            item("Pouch", "other", "common", "A small pouch with 10 gp."),
        ],
    },
    {
        name: 'Urchin',
        skillProficiencies: ['Sleight of Hand', 'Stealth'],
        abilityBonuses: { dex: 1, cha: 1 },
        toolProficiencies: [
            { name: "Thieves' Tools", attribute: getDefaultAttribute("Thieves' Tools") },
        ],
        languages: ['Common'],
        startingEquipment: [
            item("Common Clothes", "other", "common", "Simple clothes."),
            item("Small Knife", "other", "common", "A simple knife."),
            item("Map of the City", "other", "common", "A map of your home city."),
            item("Pouch", "other", "common", "A small pouch with 10 gp."),
        ],
    },
    {
        name: 'Artisan',
        skillProficiencies: ['Investigation', 'Perception'],
        abilityBonuses: { int: 1, dex: 1 },
        toolProficiencies: [
            { name: "Artisan's Tools", attribute: getDefaultAttribute("Artisan's Tools") },
        ],
        languages: ['Common'],
        startingEquipment: [
            item("Artisan's Tools", "other", "common", "The tools of your trade."),
            item("Common Clothes", "other", "common", "Simple clothes."),
            item("Pouch", "other", "common", "A small pouch with 10 gp."),
        ],
    },
    {
        name: 'Bounty Hunter',
        skillProficiencies: ['Investigation', 'Survival'],
        abilityBonuses: { wis: 1, dex: 1 },
        toolProficiencies: [
            { name: "Thieves' Tools", attribute: getDefaultAttribute("Thieves' Tools") },
        ],
        languages: ['Common', "Thieves' Cant"],
        startingEquipment: [
            item("Thieves' Tools", "other", "common", "A set of tools for picking locks."),
            item("Manacles", "other", "common", "A set of manacles."),
            item("Common Clothes", "other", "common", "Simple clothes."),
            item("Pouch", "other", "common", "A small pouch with 10 gp."),
        ],
    },
    {
        name: 'Courtier',
        skillProficiencies: ['Insight', 'Persuasion'],
        abilityBonuses: { cha: 1, int: 1 },
        toolProficiencies: [],
        languages: ['Common', 'Elvish', 'Dwarvish'],
        startingEquipment: [
            item("Fine Clothes", "other", "common", "Quality clothing."),
            item("Signet Ring", "other", "common", "A ring with your family crest."),
            item("Scroll of Pedigree", "other", "common", "A scroll proving your lineage."),
            item("Pouch", "other", "common", "A small pouch with 10 gp."),
        ],
    },
    {
        name: 'Faction Agent',
        skillProficiencies: ['Deception', 'Persuasion'],
        abilityBonuses: { cha: 1, wis: 1 },
        toolProficiencies: [],
        languages: ['Common', 'Undercommon'],
        startingEquipment: [
            item("Common Clothes", "other", "common", "Simple clothes."),
            item("Faction Badge", "other", "common", "A symbol of your faction."),
            item("Codebook", "other", "common", "A book with secret codes."),
            item("Pouch", "other", "common", "A small pouch with 10 gp."),
        ],
    },
    {
        name: 'Far Traveler',
        skillProficiencies: ['Perception', 'Survival'],
        abilityBonuses: { wis: 1, cha: 1 },
        toolProficiencies: [],
        languages: ['Common', 'Druidic'],
        startingEquipment: [
            item("Common Clothes", "other", "common", "Simple clothes."),
            item("Staff", "other", "common", "A wooden staff."),
            item("Map of the Region", "other", "common", "A map of your travels."),
            item("Pouch", "other", "common", "A small pouch with 10 gp."),
        ],
    },
];