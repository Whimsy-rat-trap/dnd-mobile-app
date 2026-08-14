export interface LibraryItem {
    id: string;
    name: string;
    type: 'weapon' | 'armor' | 'potion' | 'scroll' | 'ring' | 'wand' | 'other';
    rarity: 'common' | 'uncommon' | 'rare' | 'very rare' | 'legendary';
    description: string;
    attunement?: boolean;
    value?: string;
}

export const ALL_ITEMS: LibraryItem[] = [
    // Weapons
    { id: 'w1', name: 'Longsword +1', type: 'weapon', rarity: 'uncommon', description: 'A finely crafted longsword with a faint magical aura.', attunement: false },
    { id: 'w2', name: 'Dagger of Venom', type: 'weapon', rarity: 'rare', description: 'On a hit, you can activate the dagger to deal an extra 2d10 poison damage.', attunement: true },
    { id: 'w3', name: 'Flame Tongue', type: 'weapon', rarity: 'rare', description: 'While ignited, this sword deals an extra 2d6 fire damage on a hit.', attunement: true },
    { id: 'w4', name: 'Frost Brand', type: 'weapon', rarity: 'very rare', description: 'This sword sheds dim light in a 10-foot radius when the temperature drops below 0°F.', attunement: true },
    { id: 'w5', name: 'Vorpal Sword', type: 'weapon', rarity: 'legendary', description: 'On a critical hit, the sword severs a creature\'s head.', attunement: true },
    // Armor
    { id: 'a1', name: 'Leather Armor', type: 'armor', rarity: 'common', description: 'Standard leather armor, well-worn but sturdy.' },
    { id: 'a2', name: 'Plate Armor +2', type: 'armor', rarity: 'very rare', description: 'Shining plate armor that grants a +2 bonus to AC.', attunement: false },
    { id: 'a3', name: 'Cloak of Protection', type: 'armor', rarity: 'uncommon', description: 'You gain a +1 bonus to AC and saving throws while wearing this cloak.', attunement: true },
    { id: 'a4', name: 'Ring of Protection', type: 'armor', rarity: 'rare', description: 'You gain a +1 bonus to AC and saving throws while wearing this ring.', attunement: true },
    { id: 'a5', name: 'Elven Chain', type: 'armor', rarity: 'rare', description: 'A fine chain shirt that can be worn under clothing. You are considered proficient with it even if you lack proficiency with medium armor.', attunement: false },
    // Potions
    { id: 'p1', name: 'Healing Potion', type: 'potion', rarity: 'common', description: 'Restores 2d4+2 hit points when consumed.' },
    { id: 'p2', name: 'Potion of Invisibility', type: 'potion', rarity: 'rare', description: 'Becomes invisible for 1 hour or until you attack/cast a spell.' },
    { id: 'p3', name: 'Potion of Greater Healing', type: 'potion', rarity: 'uncommon', description: 'Restores 4d4+4 hit points when consumed.' },
    { id: 'p4', name: 'Potion of Speed', type: 'potion', rarity: 'very rare', description: 'Gain the effect of the Haste spell for 1 minute.' },
    { id: 'p5', name: 'Potion of Superior Healing', type: 'potion', rarity: 'rare', description: 'Restores 8d4+8 hit points when consumed.' },
    // Scrolls
    { id: 's1', name: 'Scroll of Fireball', type: 'scroll', rarity: 'rare', description: 'Casts Fireball (3rd level) as an action.' },
    { id: 's2', name: 'Scroll of Revivify', type: 'scroll', rarity: 'very rare', description: 'Casts Revivify to bring a dead creature back to life.' },
    { id: 's3', name: 'Scroll of Wish', type: 'scroll', rarity: 'legendary', description: 'Casts Wish, the most powerful spell a mortal can cast.' },
    // Wands
    { id: 'wa1', name: 'Wand of Magic Missiles', type: 'wand', rarity: 'uncommon', description: 'A wand with 7 charges. Expends 1 charge to cast Magic Missile.', attunement: true },
    { id: 'wa2', name: 'Wand of Fireballs', type: 'wand', rarity: 'very rare', description: 'A wand with 7 charges. Expends 1-3 charges to cast Fireball (3rd-5th level).', attunement: true },
    // Rings
    { id: 'r1', name: 'Ring of Jumping', type: 'ring', rarity: 'uncommon', description: 'You can cast Jump on yourself as a bonus action.', attunement: true },
    { id: 'r2', name: 'Ring of Water Walking', type: 'ring', rarity: 'uncommon', description: 'You can walk on any liquid surface as if it were solid ground.', attunement: true },
    // Other
    { id: 'o1', name: 'Bag of Holding', type: 'other', rarity: 'uncommon', description: 'A bag that can hold up to 500 pounds of items without changing weight.' },
    { id: 'o2', name: 'Portable Hole', type: 'other', rarity: 'very rare', description: 'A 6-foot diameter hole that can be folded and placed on a surface to create a temporary extra-dimensional space.' },
    { id: 'o3', name: 'Cubic Gate', type: 'other', rarity: 'legendary', description: 'A cube that can be used to travel to other planes of existence.', attunement: true },
];