import { LibraryItem } from './items';

export interface EquipmentChoice {
    type: 'choice';
    options: { label: string; items: Omit<LibraryItem, 'id'>[] }[];
    count?: number;
}

export interface ClassStartingEquipment {
    mandatory: Omit<LibraryItem, 'id'>[];
    choices?: EquipmentChoice[];
}

// Вспомогательная функция для создания предмета
function item(name: string, type: any, rarity: any, desc: string, attunement?: boolean): Omit<LibraryItem, 'id'> {
    return { name, type, rarity, description: desc, attunement };
}

export const CLASS_STARTING_EQUIPMENT: Record<string, ClassStartingEquipment> = {
    Barbarian: {
        mandatory: [
            item("Greataxe", "weapon", "common", "A heavy two-handed axe."),
            item("Handaxe", "weapon", "common", "A light throwing axe."),
            item("Explorer's Pack", "other", "common", "Includes a backpack, bedroll, mess kit, tinderbox, 10 torches, 10 days of rations, and a waterskin."),
            item("Javelin", "weapon", "common", "A light throwing spear."),
        ],
        choices: [
            {
                type: 'choice',
                options: [
                    { label: "Two handaxes", items: [item("Handaxe", "weapon", "common", "A light throwing axe."), item("Handaxe", "weapon", "common", "A light throwing axe.")] },
                    { label: "One martial weapon", items: [item("Longsword", "weapon", "common", "A versatile one-handed sword.")] },
                ],
                count: 1,
            },
            {
                type: 'choice',
                options: [
                    { label: "Shield", items: [item("Shield", "shield", "common", "A wooden or metal shield.")] },
                    { label: "Another martial weapon", items: [item("Battleaxe", "weapon", "common", "A one-handed axe.")] },
                ],
                count: 1,
            },
        ],
    },
    Bard: {
        mandatory: [
            item("Rapier", "weapon", "common", "A finely balanced one-handed sword."),
            item("Leather Armor", "armor", "common", "Standard leather armor."),
            item("Entertainer's Pack", "other", "common", "Includes a backpack, bedroll, 2 costumes, 5 candles, 5 days of rations, and a waterskin."),
            item("Lute", "other", "common", "A musical instrument."),
        ],
        choices: [
            {
                type: 'choice',
                options: [
                    { label: "Dagger", items: [item("Dagger", "weapon", "common", "A small dagger.")] },
                    { label: "Sling", items: [item("Sling", "weapon", "common", "A simple sling.")] },
                ],
                count: 1,
            },
            {
                type: 'choice',
                options: [
                    { label: "Dagger", items: [item("Dagger", "weapon", "common", "A small dagger.")] },
                    { label: "Sling", items: [item("Sling", "weapon", "common", "A simple sling.")] },
                ],
                count: 1,
            },
        ],
    },
    Cleric: {
        mandatory: [
            item("Mace", "weapon", "common", "A simple one-handed mace."),
            item("Chain Mail", "armor", "common", "Heavy armor, AC 16, requires Str 13."),
            item("Priest's Pack", "other", "common", "Includes a backpack, bedroll, 10 candles, a tinderbox, an alms box, 2 blocks of incense, a censer, 10 days of rations, and a waterskin."),
            item("Shield", "shield", "common", "A wooden or metal shield."),
        ],
        choices: [
            {
                type: 'choice',
                options: [
                    { label: "Light Crossbow and 20 bolts", items: [item("Light Crossbow", "weapon", "common", "A light crossbow."), item("Bolts (20)", "other", "common", "20 crossbow bolts.")] },
                    { label: "Simple weapon", items: [item("Spear", "weapon", "common", "A simple spear.")] },
                ],
                count: 1,
            },
        ],
    },
    Druid: {
        mandatory: [
            item("Wooden Shield", "shield", "common", "A wooden shield."),
            item("Druidic Focus", "other", "common", "A druidic focus (e.g., totem, wand)."),
            item("Scimitar", "weapon", "common", "A curved one-handed sword."),
            item("Leather Armor", "armor", "common", "Standard leather armor."),
            item("Explorer's Pack", "other", "common", "Includes a backpack, bedroll, mess kit, tinderbox, 10 torches, 10 days of rations, and a waterskin."),
        ],
        choices: [
            {
                type: 'choice',
                options: [
                    { label: "Shortbow and quiver of 20 arrows", items: [item("Shortbow", "weapon", "common", "A simple bow."), item("Arrows (20)", "other", "common", "20 arrows.")] },
                    { label: "Simple weapon", items: [item("Spear", "weapon", "common", "A simple spear.")] },
                ],
                count: 1,
            },
        ],
    },
    Fighter: {
        mandatory: [
            item("Chain Mail", "armor", "common", "Heavy armor, AC 16, requires Str 13."),
            item("Longsword", "weapon", "common", "A versatile one-handed sword."),
            item("Shield", "shield", "common", "A wooden or metal shield."),
            item("Explorer's Pack", "other", "common", "Includes a backpack, bedroll, mess kit, tinderbox, 10 torches, 10 days of rations, and a waterskin."),
        ],
        choices: [
            {
                type: 'choice',
                options: [
                    { label: "Longbow and 20 arrows", items: [item("Longbow", "weapon", "common", "A powerful bow."), item("Arrows (20)", "other", "common", "20 arrows.")] },
                    { label: "Two handaxes", items: [item("Handaxe", "weapon", "common", "A light throwing axe."), item("Handaxe", "weapon", "common", "A light throwing axe.")] },
                ],
                count: 1,
            },
            {
                type: 'choice',
                options: [
                    { label: "Dungeoneer's Pack", items: [item("Dungeoneer's Pack", "other", "common", "Includes a backpack, bedroll, 10 torches, 10 days of rations, a waterskin, 50 feet of rope.")] },
                    { label: "Explorer's Pack", items: [item("Explorer's Pack", "other", "common", "Includes a backpack, bedroll, mess kit, tinderbox, 10 torches, 10 days of rations, and a waterskin.")] },
                ],
                count: 1,
            },
        ],
    },
    Monk: {
        mandatory: [
            item("Shortsword", "weapon", "common", "A short, one-handed sword."),
            item("Dart", "weapon", "common", "A small throwing dart."),
            item("Monk's Pack", "other", "common", "Includes a backpack, bedroll, 5 candles, a tinderbox, 10 days of rations, a waterskin, and a set of common clothes."),
        ],
        choices: [
            {
                type: 'choice',
                options: [
                    { label: "Shortsword", items: [item("Shortsword", "weapon", "common", "A short, one-handed sword.")] },
                    { label: "Simple weapon", items: [item("Spear", "weapon", "common", "A simple spear.")] },
                ],
                count: 1,
            },
            {
                type: 'choice',
                options: [
                    { label: "Dungeoneer's Pack", items: [item("Dungeoneer's Pack", "other", "common", "Includes a backpack, bedroll, 10 torches, 10 days of rations, a waterskin, 50 feet of rope.")] },
                    { label: "Explorer's Pack", items: [item("Explorer's Pack", "other", "common", "Includes a backpack, bedroll, mess kit, tinderbox, 10 torches, 10 days of rations, and a waterskin.")] },
                ],
                count: 1,
            },
        ],
    },
    Paladin: {
        mandatory: [
            item("Chain Mail", "armor", "common", "Heavy armor, AC 16, requires Str 13."),
            item("Longsword", "weapon", "common", "A versatile one-handed sword."),
            item("Shield", "shield", "common", "A wooden or metal shield."),
            item("Holy Symbol", "other", "common", "A holy symbol of your deity."),
        ],
        choices: [
            {
                type: 'choice',
                options: [
                    { label: "Javelin", items: [item("Javelin", "weapon", "common", "A light throwing spear.")] },
                    { label: "Simple weapon", items: [item("Spear", "weapon", "common", "A simple spear.")] },
                ],
                count: 1,
            },
            {
                type: 'choice',
                options: [
                    { label: "Dungeoneer's Pack", items: [item("Dungeoneer's Pack", "other", "common", "Includes a backpack, bedroll, 10 torches, 10 days of rations, a waterskin, 50 feet of rope.")] },
                    { label: "Explorer's Pack", items: [item("Explorer's Pack", "other", "common", "Includes a backpack, bedroll, mess kit, tinderbox, 10 torches, 10 days of rations, and a waterskin.")] },
                ],
                count: 1,
            },
        ],
    },
    Ranger: {
        mandatory: [
            item("Longbow", "weapon", "common", "A powerful bow."),
            item("Arrows (20)", "other", "common", "20 arrows."),
            item("Leather Armor", "armor", "common", "Standard leather armor."),
            item("Two shortswords", "weapon", "common", "A short, one-handed sword."),
            item("Explorer's Pack", "other", "common", "Includes a backpack, bedroll, mess kit, tinderbox, 10 torches, 10 days of rations, and a waterskin."),
        ],
        choices: [
            {
                type: 'choice',
                options: [
                    { label: "Two handaxes", items: [item("Handaxe", "weapon", "common", "A light throwing axe."), item("Handaxe", "weapon", "common", "A light throwing axe.")] },
                    { label: "One martial weapon", items: [item("Longsword", "weapon", "common", "A versatile one-handed sword.")] },
                ],
                count: 1,
            },
        ],
    },
    Rogue: {
        mandatory: [
            item("Rapier", "weapon", "common", "A finely balanced one-handed sword."),
            item("Shortbow", "weapon", "common", "A simple bow."),
            item("Arrows (20)", "other", "common", "20 arrows."),
            item("Leather Armor", "armor", "common", "Standard leather armor."),
            item("Thieves' Tools", "other", "common", "A set of thieves' tools."),
            item("Burglar's Pack", "other", "common", "Includes a backpack, bag of 1000 ball bearings, 10 feet of string, a bell, 5 candles, a crowbar, a hammer, 10 pitons, a hooded lantern, 2 flasks of oil, 5 days of rations, a tinderbox, and a waterskin."),
        ],
        choices: [
            {
                type: 'choice',
                options: [
                    { label: "Dagger", items: [item("Dagger", "weapon", "common", "A small dagger.")] },
                    { label: "Shortsword", items: [item("Shortsword", "weapon", "common", "A short, one-handed sword.")] },
                ],
                count: 1,
            },
        ],
    },
    Sorcerer: {
        mandatory: [
            item("Dagger", "weapon", "common", "A small dagger."),
            item("Arcane Focus", "other", "common", "An arcane focus (crystal, orb, rod, staff, or wand)."),
            item("Explorer's Pack", "other", "common", "Includes a backpack, bedroll, mess kit, tinderbox, 10 torches, 10 days of rations, and a waterskin."),
        ],
        choices: [
            {
                type: 'choice',
                options: [
                    { label: "Light Crossbow and 20 bolts", items: [item("Light Crossbow", "weapon", "common", "A light crossbow."), item("Bolts (20)", "other", "common", "20 crossbow bolts.")] },
                    { label: "Simple weapon", items: [item("Spear", "weapon", "common", "A simple spear.")] },
                ],
                count: 1,
            },
        ],
    },
    Warlock: {
        mandatory: [
            item("Dagger", "weapon", "common", "A small dagger."),
            item("Arcane Focus", "other", "common", "An arcane focus (crystal, orb, rod, staff, or wand)."),
            item("Leather Armor", "armor", "common", "Standard leather armor."),
            item("Explorer's Pack", "other", "common", "Includes a backpack, bedroll, mess kit, tinderbox, 10 torches, 10 days of rations, and a waterskin."),
        ],
        choices: [
            {
                type: 'choice',
                options: [
                    { label: "Light Crossbow and 20 bolts", items: [item("Light Crossbow", "weapon", "common", "A light crossbow."), item("Bolts (20)", "other", "common", "20 crossbow bolts.")] },
                    { label: "Simple weapon", items: [item("Spear", "weapon", "common", "A simple spear.")] },
                ],
                count: 1,
            },
        ],
    },
    Wizard: {
        mandatory: [
            item("Dagger", "weapon", "common", "A small dagger."),
            item("Spellbook", "other", "common", "A spellbook containing your spells."),
            item("Arcane Focus", "other", "common", "An arcane focus (crystal, orb, rod, staff, or wand)."),
            item("Explorer's Pack", "other", "common", "Includes a backpack, bedroll, mess kit, tinderbox, 10 torches, 10 days of rations, and a waterskin."),
        ],
        choices: [
            {
                type: 'choice',
                options: [
                    { label: "Light Crossbow and 20 bolts", items: [item("Light Crossbow", "weapon", "common", "A light crossbow."), item("Bolts (20)", "other", "common", "20 crossbow bolts.")] },
                    { label: "Simple weapon", items: [item("Spear", "weapon", "common", "A simple spear.")] },
                ],
                count: 1,
            },
        ],
    },
    Artificer: {
        mandatory: [
            item("Dagger", "weapon", "common", "A small dagger."),
            item("Thieves' Tools", "other", "common", "A set of thieves' tools."),
            item("Tinker's Tools", "other", "common", "A set of tinker's tools."),
            item("Leather Armor", "armor", "common", "Standard leather armor."),
            item("Explorer's Pack", "other", "common", "Includes a backpack, bedroll, mess kit, tinderbox, 10 torches, 10 days of rations, and a waterskin."),
        ],
        choices: [
            {
                type: 'choice',
                options: [
                    { label: "Light Crossbow and 20 bolts", items: [item("Light Crossbow", "weapon", "common", "A light crossbow."), item("Bolts (20)", "other", "common", "20 crossbow bolts.")] },
                    { label: "Simple weapon", items: [item("Spear", "weapon", "common", "A simple spear.")] },
                ],
                count: 1,
            },
        ],
    },
};