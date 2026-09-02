import { LibraryItem } from './items';

export interface EquipmentSet {
    name: string;
    description?: string;
    items: Omit<LibraryItem, 'id'>[];
}

// Вспомогательная функция для создания предмета
function item(name: string, type: any, rarity: any, desc: string, attunement?: boolean): Omit<LibraryItem, 'id'> {
    return { name, type, rarity, description: desc, attunement };
}

export const EQUIPMENT_SETS: EquipmentSet[] = [
    {
        name: 'Standard Adventurer',
        description: 'A basic set of gear for any adventurer.',
        items: [
            item("Backpack", "other", "common", "A sturdy backpack."),
            item("Bedroll", "other", "common", "A warm bedroll."),
            item("Tinderbox", "other", "common", "A tinderbox for starting fires."),
            item("Rations (10 days)", "other", "common", "10 days of dry rations."),
            item("Waterskin", "other", "common", "A waterskin for carrying water."),
            item("Torch (10)", "other", "common", "10 torches."),
            item("Hempen Rope (50 ft)", "other", "common", "A coil of strong rope."),
        ],
    },
    {
        name: 'Light Armor Set',
        description: 'Standard light armor and a weapon.',
        items: [
            item("Leather Armor", "armor", "common", "Standard leather armor."),
            item("Dagger", "weapon", "common", "A simple dagger."),
            item("Shortbow", "weapon", "common", "A shortbow for ranged attacks."),
            item("Arrows (20)", "other", "common", "20 arrows for a bow."),
        ],
    },
    {
        name: 'Medium Armor Set',
        description: 'Medium armor and versatile weapons.',
        items: [
            item("Scale Mail", "armor", "common", "Scale mail, AC 14 + Dex (max 2)."),
            item("Battleaxe", "weapon", "common", "A versatile battleaxe."),
            item("Shield", "shield", "common", "A wooden or metal shield."),
        ],
    },
    {
        name: 'Heavy Armor Set',
        description: 'Heavy armor for front-line fighters.',
        items: [
            item("Chain Mail", "armor", "common", "Chain mail, AC 16, requires Str 13."),
            item("Longsword", "weapon", "common", "A versatile longsword."),
            item("Shield", "shield", "common", "A wooden or metal shield."),
        ],
    },
    {
        name: 'Arcane Caster Set',
        description: 'Basic gear for a wizard or sorcerer.',
        items: [
            item("Arcane Focus", "other", "common", "A focus for arcane spells."),
            item("Spellbook", "other", "common", "A blank spellbook."),
            item("Component Pouch", "other", "common", "A pouch for spell components."),
            item("Dagger", "weapon", "common", "A simple dagger."),
        ],
    },
    {
        name: 'Divine Caster Set',
        description: 'Basic gear for a cleric or paladin.',
        items: [
            item("Holy Symbol", "other", "common", "A holy symbol of your deity."),
            item("Prayer Book", "other", "common", "A book of prayers."),
            item("Mace", "weapon", "common", "A simple mace."),
            item("Shield", "shield", "common", "A wooden or metal shield."),
        ],
    },
    {
        name: 'Rogue Set',
        description: 'Gear for a stealthy character.',
        items: [
            item("Thieves' Tools", "other", "common", "A set of tools for picking locks."),
            item("Shortsword", "weapon", "common", "A light shortsword."),
            item("Shortbow", "weapon", "common", "A shortbow for ranged attacks."),
            item("Dark Clothes", "other", "common", "Dark, hooded clothing."),
        ],
    },
    {
        name: 'Ranger Set',
        description: 'Gear for a wilderness expert.',
        items: [
            item("Longbow", "weapon", "common", "A powerful longbow."),
            item("Arrows (20)", "other", "common", "20 arrows."),
            item("Hunting Trap", "other", "common", "A trap for hunting."),
            item("Explorer's Pack", "other", "common", "A pack for exploration."),
        ],
    },
    {
        name: 'Bard Set',
        description: 'Gear for a performer.',
        items: [
            item("Musical Instrument", "other", "common", "Your choice of instrument."),
            item("Rapier", "weapon", "common", "A finely balanced rapier."),
            item("Leather Armor", "armor", "common", "Standard leather armor."),
            item("Costume", "other", "common", "A colorful costume."),
        ],
    },
    {
        name: 'Potion Set',
        description: 'A set of useful potions.',
        items: [
            item("Healing Potion", "potion", "common", "Restores 2d4+2 hit points."),
            item("Potion of Greater Healing", "potion", "uncommon", "Restores 4d4+4 hit points."),
        ],
    },
    {
        name: 'Magic Starter',
        description: 'Basic magic items for a low-level character.',
        items: [
            item("Wand of Magic Missiles", "wand", "uncommon", "A wand with 7 charges for Magic Missile.", true),
            item("Bag of Holding", "other", "uncommon", "A bag that holds 500 lbs."),
        ],
    },
    {
        name: 'Full Adventurer Kit',
        description: 'Complete gear for a well-prepared adventurer.',
        items: [
            // Armor
            item("Leather Armor", "armor", "common", "Standard leather armor."),
            // Weapons
            item("Longsword", "weapon", "common", "A versatile longsword."),
            item("Shortbow", "weapon", "common", "A shortbow."),
            item("Arrows (20)", "other", "common", "20 arrows."),
            // Adventuring gear
            item("Backpack", "other", "common", "A sturdy backpack."),
            item("Bedroll", "other", "common", "A warm bedroll."),
            item("Tinderbox", "other", "common", "A tinderbox."),
            item("Rations (10 days)", "other", "common", "10 days of rations."),
            item("Waterskin", "other", "common", "A waterskin."),
            item("Torch (10)", "other", "common", "10 torches."),
            item("Hempen Rope (50 ft)", "other", "common", "50 ft of rope."),
            // Tools
            item("Thieves' Tools", "other", "common", "A set of lockpicks."),
            // Magic
            item("Healing Potion", "potion", "common", "Restores 2d4+2 hit points."),
        ],
    },
];