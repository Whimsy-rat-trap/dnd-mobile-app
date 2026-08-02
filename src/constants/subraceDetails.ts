export interface SubraceDetail {
    abilityBonuses?: { [key: string]: number };
    features: { name: string; description: string }[];
}

export const SUBRACE_DETAILS: Record<string, SubraceDetail> = {
    // Dwarf
    'Hill Dwarf': {
        abilityBonuses: { wis: 1 },
        features: [
            { name: 'Dwarven Toughness', description: 'Your hit point maximum increases by 1, and it increases by 1 every time you gain a level.' }
        ]
    },
    'Mountain Dwarf': {
        abilityBonuses: { str: 2 },
        features: [
            { name: 'Dwarven Armor Training', description: 'You have proficiency with light and medium armor.' }
        ]
    },
    // Elf
    'High Elf': {
        abilityBonuses: { int: 1 },
        features: [
            { name: 'Elf Weapon Training', description: 'You have proficiency with the longsword, shortsword, shortbow, and longbow.' },
            { name: 'Cantrip', description: 'You know one cantrip of your choice from the wizard spell list. Intelligence is your spellcasting ability for it.' },
            { name: 'Extra Language', description: 'You can speak, read, and write one additional language of your choice.' }
        ]
    },
    'Wood Elf': {
        abilityBonuses: { wis: 1 },
        features: [
            { name: 'Elf Weapon Training', description: 'You have proficiency with the longsword, shortsword, shortbow, and longbow.' },
            { name: 'Fleet of Foot', description: 'Your base walking speed increases to 35 feet.' },
            { name: 'Mask of the Wild', description: 'You can attempt to hide even when you are only lightly obscured by foliage, heavy rain, falling snow, mist, and other natural phenomena.' }
        ]
    },
    'Dark Elf (Drow)': {
        abilityBonuses: { cha: 1 },
        features: [
            { name: 'Drow Magic', description: 'You know the Dancing Lights cantrip. When you reach 3rd level, you can cast the Faerie Fire spell once per day. When you reach 5th level, you can cast the Darkness spell once per day. Charisma is your spellcasting ability for these spells.' },
            { name: 'Drow Weapon Training', description: 'You have proficiency with the rapier, shortsword, and hand crossbow.' },
            { name: 'Sunlight Sensitivity', description: 'You have disadvantage on attack rolls and Wisdom (Perception) checks that rely on sight when you, the target of your attack, or whatever you are trying to perceive is in direct sunlight.' }
        ]
    },
    // Gnome
    'Forest Gnome': {
        abilityBonuses: { dex: 1 },
        features: [
            { name: 'Natural Illusionist', description: 'You know the Minor Illusion cantrip. Intelligence is your spellcasting ability for it.' },
            { name: 'Speak with Small Beasts', description: 'Through sounds and gestures, you can communicate simple ideas with Small or smaller beasts.' }
        ]
    },
    'Rock Gnome': {
        abilityBonuses: { con: 1 },
        features: [
            { name: 'Artificer\'s Lore', description: 'Whenever you make an Intelligence (History) check related to magic items, alchemical objects, or technological devices, you can add twice your proficiency bonus, instead of any proficiency bonus you normally apply.' },
            { name: 'Tinker', description: 'You have proficiency with artisan\'s tools (tinker\'s tools). Using those tools, you can spend 1 hour and 10 gp worth of materials to construct a Tiny clockwork device (AC 5, 1 hp). The device ceases to function after 24 hours (unless you spend 1 hour repairing it to keep the device functioning), or when you use your action to dismantle it; at that time, you can reclaim the materials used to create it. You can have up to three such devices active at a time. When you create a device, choose one of the following options: Clockwork Toy, Fire Starter, Music Box.' }
        ]
    },
    // Halfling
    'Lightfoot Halfling': {
        abilityBonuses: { cha: 1 },
        features: [
            { name: 'Naturally Stealthy', description: 'You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you.' }
        ]
    },
    'Stout Halfling': {
        abilityBonuses: { con: 1 },
        features: [
            { name: 'Stout Resilience', description: 'You have advantage on saving throws against poison, and you have resistance against poison damage.' }
        ]
    },
    // Tiefling
    'Asmodeus': {
        abilityBonuses: { cha: 1, int: 1 },
        features: [
            { name: 'Legacy of Asmodeus', description: 'You know the Thaumaturgy cantrip. When you reach 3rd level, you can cast the Hellish Rebuke spell once per day as a 2nd-level spell. When you reach 5th level, you can also cast the Darkness spell once per day. Charisma is your spellcasting ability for these spells.' }
        ]
    },
    'Baalzebul': {
        abilityBonuses: { cha: 1, int: 1 },
        features: [
            { name: 'Legacy of Baalzebul', description: 'You know the Thaumaturgy cantrip. When you reach 3rd level, you can cast the Ray of Sickness spell once per day as a 2nd-level spell. When you reach 5th level, you can also cast the Crown of Madness spell once per day. Charisma is your spellcasting ability for these spells.' }
        ]
    },
    'Dispater': {
        abilityBonuses: { cha: 1, dex: 1 },
        features: [
            { name: 'Legacy of Dispater', description: 'You know the Thaumaturgy cantrip. When you reach 3rd level, you can cast the Disguise Self spell once per day. When you reach 5th level, you can also cast the Invisibility spell once per day. Charisma is your spellcasting ability for these spells.' }
        ]
    },
    'Fierna': {
        abilityBonuses: { cha: 1, wis: 1 },
        features: [
            { name: 'Legacy of Fierna', description: 'You know the Friends cantrip. When you reach 3rd level, you can cast the Charm Person spell once per day. When you reach 5th level, you can also cast the Suggestion spell once per day. Charisma is your spellcasting ability for these spells.' }
        ]
    },
    'Glasya': {
        abilityBonuses: { cha: 1, dex: 1 },
        features: [
            { name: 'Legacy of Glasya', description: 'You know the Minor Illusion cantrip. When you reach 3rd level, you can cast the Disguise Self spell once per day. When you reach 5th level, you can also cast the Invisibility spell once per day. Charisma is your spellcasting ability for these spells.' }
        ]
    },
    'Levistus': {
        abilityBonuses: { cha: 1, con: 1 },
        features: [
            { name: 'Legacy of Levistus', description: 'You know the Ray of Frost cantrip. When you reach 3rd level, you can cast the Armor of Agathys spell once per day as a 2nd-level spell. When you reach 5th level, you can also cast the Darkness spell once per day. Charisma is your spellcasting ability for these spells.' }
        ]
    },
    'Mammon': {
        abilityBonuses: { cha: 1, int: 1 },
        features: [
            { name: 'Legacy of Mammon', description: 'You know the Mage Hand cantrip. When you reach 3rd level, you can cast the Tenser\'s Floating Disk spell once per day. When you reach 5th level, you can also cast the Arcane Lock spell once per day. Charisma is your spellcasting ability for these spells.' }
        ]
    },
    'Mephistopheles': {
        abilityBonuses: { cha: 1, int: 1 },
        features: [
            { name: 'Legacy of Mephistopheles', description: 'You know the Mage Hand cantrip. When you reach 3rd level, you can cast the Burning Hands spell once per day as a 2nd-level spell. When you reach 5th level, you can also cast the Flame Blade spell once per day. Charisma is your spellcasting ability for these spells.' }
        ]
    },
    'Zariel': {
        abilityBonuses: { cha: 1, str: 1 },
        features: [
            { name: 'Legacy of Zariel', description: 'You know the Thaumaturgy cantrip. When you reach 3rd level, you can cast the Searing Smite spell once per day as a 2nd-level spell. When you reach 5th level, you can also cast the Branding Smite spell once per day. Charisma is your spellcasting ability for these spells.' }
        ]
    },
    // Dragonborn
    'Black': {
        abilityBonuses: { cha: 1 },
        features: [
            { name: 'Acid Breath', description: 'Your breath weapon deals acid damage. Each creature in the area must make a Dexterity saving throw (DC 8 + your Constitution modifier + your proficiency bonus). A creature takes 2d6 acid damage on a failed save, and half as much on a successful one. The damage increases to 3d6 at 6th level, 4d6 at 11th level, and 5d6 at 16th level.' },
            { name: 'Acid Resistance', description: 'You have resistance to acid damage.' }
        ]
    },
    'Blue': {
        abilityBonuses: { cha: 1 },
        features: [
            { name: 'Lightning Breath', description: 'Your breath weapon deals lightning damage. Each creature in the area must make a Dexterity saving throw (DC 8 + your Constitution modifier + your proficiency bonus). A creature takes 2d6 lightning damage on a failed save, and half as much on a successful one. The damage increases to 3d6 at 6th level, 4d6 at 11th level, and 5d6 at 16th level.' },
            { name: 'Lightning Resistance', description: 'You have resistance to lightning damage.' }
        ]
    },
    'Brass': {
        abilityBonuses: { cha: 1 },
        features: [
            { name: 'Fire Breath', description: 'Your breath weapon deals fire damage. Each creature in the area must make a Dexterity saving throw (DC 8 + your Constitution modifier + your proficiency bonus). A creature takes 2d6 fire damage on a failed save, and half as much on a successful one. The damage increases to 3d6 at 6th level, 4d6 at 11th level, and 5d6 at 16th level.' },
            { name: 'Fire Resistance', description: 'You have resistance to fire damage.' }
        ]
    },
    'Bronze': {
        abilityBonuses: { cha: 1 },
        features: [
            { name: 'Lightning Breath', description: 'Your breath weapon deals lightning damage. Each creature in the area must make a Dexterity saving throw (DC 8 + your Constitution modifier + your proficiency bonus). A creature takes 2d6 lightning damage on a failed save, and half as much on a successful one. The damage increases to 3d6 at 6th level, 4d6 at 11th level, and 5d6 at 16th level.' },
            { name: 'Lightning Resistance', description: 'You have resistance to lightning damage.' }
        ]
    },
    'Copper': {
        abilityBonuses: { cha: 1 },
        features: [
            { name: 'Acid Breath', description: 'Your breath weapon deals acid damage. Each creature in the area must make a Dexterity saving throw (DC 8 + your Constitution modifier + your proficiency bonus). A creature takes 2d6 acid damage on a failed save, and half as much on a successful one. The damage increases to 3d6 at 6th level, 4d6 at 11th level, and 5d6 at 16th level.' },
            { name: 'Acid Resistance', description: 'You have resistance to acid damage.' }
        ]
    },
    'Gold': {
        abilityBonuses: { cha: 1 },
        features: [
            { name: 'Fire Breath', description: 'Your breath weapon deals fire damage. Each creature in the area must make a Dexterity saving throw (DC 8 + your Constitution modifier + your proficiency bonus). A creature takes 2d6 fire damage on a failed save, and half as much on a successful one. The damage increases to 3d6 at 6th level, 4d6 at 11th level, and 5d6 at 16th level.' },
            { name: 'Fire Resistance', description: 'You have resistance to fire damage.' }
        ]
    },
    'Green': {
        abilityBonuses: { cha: 1 },
        features: [
            { name: 'Poison Breath', description: 'Your breath weapon deals poison damage. Each creature in the area must make a Constitution saving throw (DC 8 + your Constitution modifier + your proficiency bonus). A creature takes 2d6 poison damage on a failed save, and half as much on a successful one. The damage increases to 3d6 at 6th level, 4d6 at 11th level, and 5d6 at 16th level.' },
            { name: 'Poison Resistance', description: 'You have resistance to poison damage.' }
        ]
    },
    'Red': {
        abilityBonuses: { cha: 1 },
        features: [
            { name: 'Fire Breath', description: 'Your breath weapon deals fire damage. Each creature in the area must make a Dexterity saving throw (DC 8 + your Constitution modifier + your proficiency bonus). A creature takes 2d6 fire damage on a failed save, and half as much on a successful one. The damage increases to 3d6 at 6th level, 4d6 at 11th level, and 5d6 at 16th level.' },
            { name: 'Fire Resistance', description: 'You have resistance to fire damage.' }
        ]
    },
    'Silver': {
        abilityBonuses: { cha: 1 },
        features: [
            { name: 'Cold Breath', description: 'Your breath weapon deals cold damage. Each creature in the area must make a Constitution saving throw (DC 8 + your Constitution modifier + your proficiency bonus). A creature takes 2d6 cold damage on a failed save, and half as much on a successful one. The damage increases to 3d6 at 6th level, 4d6 at 11th level, and 5d6 at 16th level.' },
            { name: 'Cold Resistance', description: 'You have resistance to cold damage.' }
        ]
    },
    'White': {
        abilityBonuses: { cha: 1 },
        features: [
            { name: 'Cold Breath', description: 'Your breath weapon deals cold damage. Each creature in the area must make a Constitution saving throw (DC 8 + your Constitution modifier + your proficiency bonus). A creature takes 2d6 cold damage on a failed save, and half as much on a successful one. The damage increases to 3d6 at 6th level, 4d6 at 11th level, and 5d6 at 16th level.' },
            { name: 'Cold Resistance', description: 'You have resistance to cold damage.' }
        ]
    }
};