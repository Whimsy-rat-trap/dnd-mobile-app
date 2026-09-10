export interface LibraryItem {
    id: string;
    name: string;
    type: 'weapon' | 'armor' | 'shield' | 'potion' | 'scroll' | 'ring' | 'wand' | 'natural weapon' | 'other';
    rarity: 'common' | 'uncommon' | 'rare' | 'very rare' | 'legendary';
    description: string;
    attunement?: boolean;
    value?: string;
    // Оружие
    damageDice?: string;
    damageType?: string;
    // Исцеление
    healingDice?: string;
    // Заряды
    uses?: { current: number; max: number };
    // Броня / щит
    baseAC?: number;
    acBonus?: number;
    dexModifierAllowed?: boolean;
    maxDexBonus?: number;
    strengthRequirement?: number;
    stealthDisadvantage?: boolean;
}

export const ALL_ITEMS: LibraryItem[] = [
    // Weapons
    { id: 'w1', name: 'Longsword +1', type: 'weapon', rarity: 'uncommon', description: 'A finely crafted longsword with a faint magical aura.', attunement: false, damageDice: '1d8+1', damageType: 'slashing' },
    { id: 'w2', name: 'Dagger of Venom', type: 'weapon', rarity: 'rare', description: 'On a hit, you can activate the dagger to deal an extra 2d10 poison damage.', attunement: true, damageDice: '1d4', damageType: 'piercing' },
    { id: 'w3', name: 'Flame Tongue', type: 'weapon', rarity: 'rare', description: 'While ignited, this sword deals an extra 2d6 fire damage on a hit.', attunement: true, damageDice: '1d8 + 2d6', damageType: 'slashing / fire' },
    { id: 'w4', name: 'Frost Brand', type: 'weapon', rarity: 'very rare', description: 'This sword sheds dim light in a 10-foot radius when the temperature drops below 0°F.', attunement: true, damageDice: '1d8 + 1d6', damageType: 'slashing / cold' },
    { id: 'w5', name: 'Vorpal Sword', type: 'weapon', rarity: 'legendary', description: 'On a critical hit, the sword severs a creature\'s head.', attunement: true, damageDice: '3d8', damageType: 'slashing' },
    { id: 'w6', name: 'Sun Blade', type: 'weapon', rarity: 'rare', description: 'This weapon is a magic longsword that sheds bright light in a 15-foot radius.', attunement: true, damageDice: '1d8 + 1d4', damageType: 'radiant' },
    { id: 'w7', name: 'Defender', type: 'weapon', rarity: 'legendary', description: 'A magic sword that grants a +3 bonus to attack and damage, but you can transfer some of the bonus to AC.', attunement: true, damageDice: '1d8+3', damageType: 'slashing' },
    { id: 'w8', name: 'Holy Avenger', type: 'weapon', rarity: 'legendary', description: 'A powerful sword that deals extra radiant damage to fiends and undead.', attunement: true, damageDice: '1d8 + 1d10', damageType: 'slashing / radiant' },
    { id: 'w9', name: 'Rapier +2', type: 'weapon', rarity: 'rare', description: 'A finely balanced rapier with a +2 bonus.', attunement: false, damageDice: '1d8+2', damageType: 'piercing' },
    { id: 'w10', name: 'Mace of Disruption', type: 'weapon', rarity: 'rare', description: 'When you hit a fiend or undead with this mace, it must make a Wisdom saving throw or be destroyed.', attunement: true, damageDice: '1d6', damageType: 'bludgeoning' },

    // Armour
    // Лёгкая броня
    { id: 'a1', name: 'Leather Armor', type: 'armor', rarity: 'common', description: 'Standard leather armor, well-worn but sturdy.', baseAC: 11, dexModifierAllowed: true },
    { id: 'a8', name: 'Studded Leather +1', type: 'armor', rarity: 'uncommon', description: 'Studded leather armor with a +1 bonus to AC.', baseAC: 13, dexModifierAllowed: true },

    // Средняя броня
    { id: 'a9', name: 'Hide Armor', type: 'armor', rarity: 'common', description: 'Armor made from thick hide, gives AC 12 + Dex (max 2).', baseAC: 12, dexModifierAllowed: true, maxDexBonus: 2 },
    { id: 'a10', name: 'Chain Shirt', type: 'armor', rarity: 'common', description: 'A chain shirt gives AC 13 + Dex (max 2).', baseAC: 13, dexModifierAllowed: true, maxDexBonus: 2 },
    { id: 'a11', name: 'Scale Mail', type: 'armor', rarity: 'common', description: 'Scale mail gives AC 14 + Dex (max 2).', baseAC: 14, dexModifierAllowed: true, maxDexBonus: 2, stealthDisadvantage: true },
    { id: 'a12', name: 'Breastplate', type: 'armor', rarity: 'common', description: 'A breastplate gives AC 14 + Dex (max 2).', baseAC: 14, dexModifierAllowed: true, maxDexBonus: 2 },
    { id: 'a13', name: 'Half Plate', type: 'armor', rarity: 'common', description: 'Half plate gives AC 15 + Dex (max 2).', baseAC: 15, dexModifierAllowed: true, maxDexBonus: 2, stealthDisadvantage: true },

    // Тяжёлая броня
    { id: 'a14', name: 'Ring Mail', type: 'armor', rarity: 'common', description: 'Ring mail gives AC 14 (no Dex).', baseAC: 14, dexModifierAllowed: false, stealthDisadvantage: true },
    { id: 'a15', name: 'Chain Mail', type: 'armor', rarity: 'common', description: 'Chain mail gives AC 16, requires Str 13, stealth disadvantage.', baseAC: 16, dexModifierAllowed: false, strengthRequirement: 13, stealthDisadvantage: true },
    { id: 'a16', name: 'Splint Armor', type: 'armor', rarity: 'common', description: 'Splint armor gives AC 17, requires Str 15, stealth disadvantage.', baseAC: 17, dexModifierAllowed: false, strengthRequirement: 15, stealthDisadvantage: true },
    { id: 'a17', name: 'Plate Armor', type: 'armor', rarity: 'common', description: 'Plate armor gives AC 18, requires Str 15, stealth disadvantage.', baseAC: 18, dexModifierAllowed: false, strengthRequirement: 15, stealthDisadvantage: true },

    // Магическая броня
    { id: 'a2', name: 'Plate Armor +2', type: 'armor', rarity: 'very rare', description: 'Shining plate armor that grants a +2 bonus to AC.', baseAC: 20, dexModifierAllowed: false, strengthRequirement: 15, stealthDisadvantage: true, attunement: false },
    { id: 'a5', name: 'Elven Chain', type: 'armor', rarity: 'rare', description: 'A fine chain shirt that can be worn under clothing. You are considered proficient with it even if you lack proficiency with medium armor.', baseAC: 13, dexModifierAllowed: true, maxDexBonus: 2, attunement: false },
    { id: 'a6', name: 'Dragon Scale Mail', type: 'armor', rarity: 'very rare', description: 'Armor made from the scales of a dragon. You have resistance to the dragon\'s damage type.', baseAC: 14, dexModifierAllowed: true, maxDexBonus: 2, stealthDisadvantage: true, attunement: true },
    { id: 'a7', name: 'Demon Armor', type: 'armor', rarity: 'very rare', description: 'This armor grants a +1 bonus to AC and allows you to use it as a weapon.', baseAC: 18, dexModifierAllowed: false, strengthRequirement: 15, stealthDisadvantage: true, attunement: true },

    // Прочие защитные предметы
    { id: 'a3', name: 'Cloak of Protection', type: 'armor', rarity: 'uncommon', description: 'You gain a +1 bonus to AC and saving throws while wearing this cloak.', acBonus: 1, attunement: true },

    // Shields
    { id: 'sh1', name: 'Shield', type: 'shield', rarity: 'common', description: 'A wooden or metal shield that grants +2 to AC.', acBonus: 2 },
    { id: 'sh2', name: 'Shield +1', type: 'shield', rarity: 'uncommon', description: 'A magic shield that grants a +1 bonus to AC in addition to the normal +2.', acBonus: 3 },
    { id: 'sh3', name: 'Shield of Missile Attraction', type: 'shield', rarity: 'rare', description: 'While holding this shield, you have resistance to damage from ranged weapon attacks.', acBonus: 2, attunement: true },

    // Potions
    { id: 'p1', name: 'Healing Potion', type: 'potion', rarity: 'common', description: 'Restores 2d4+2 hit points when consumed.', healingDice: '2d4+2', uses: { current: 1, max: 1 } },
    { id: 'p2', name: 'Potion of Invisibility', type: 'potion', rarity: 'rare', description: 'Becomes invisible for 1 hour or until you attack/cast a spell.', uses: { current: 1, max: 1 } },
    { id: 'p3', name: 'Potion of Greater Healing', type: 'potion', rarity: 'uncommon', description: 'Restores 4d4+4 hit points when consumed.', healingDice: '4d4+4', uses: { current: 1, max: 1 } },
    { id: 'p4', name: 'Potion of Speed', type: 'potion', rarity: 'very rare', description: 'Gain the effect of the Haste spell for 1 minute.', uses: { current: 1, max: 1 } },
    { id: 'p5', name: 'Potion of Superior Healing', type: 'potion', rarity: 'rare', description: 'Restores 8d4+8 hit points when consumed.', healingDice: '8d4+8', uses: { current: 1, max: 1 } },
    { id: 'p6', name: 'Potion of Fire Breath', type: 'potion', rarity: 'uncommon', description: 'After drinking this potion, you can exhale fire in a 15-foot cone.', attunement: false, damageDice: '4d6', damageType: 'fire', uses: { current: 1, max: 1 } },
    { id: 'p7', name: 'Potion of Giant Strength', type: 'potion', rarity: 'rare', description: 'Your Strength becomes 21 for 1 hour.', uses: { current: 1, max: 1 } },
    { id: 'p8', name: 'Potion of Flying', type: 'potion', rarity: 'very rare', description: 'You gain a flying speed of 60 feet for 1 hour.', uses: { current: 1, max: 1 } },

    // Scrolls
    { id: 's1', name: 'Scroll of Fireball', type: 'scroll', rarity: 'rare', description: 'Casts Fireball (3rd level) as an action.', damageDice: '8d6', damageType: 'fire', uses: { current: 1, max: 1 } },
    { id: 's2', name: 'Scroll of Revivify', type: 'scroll', rarity: 'very rare', description: 'Casts Revivify to bring a dead creature back to life.', uses: { current: 1, max: 1 } },
    { id: 's3', name: 'Scroll of Wish', type: 'scroll', rarity: 'legendary', description: 'Casts Wish, the most powerful spell a mortal can cast.', uses: { current: 1, max: 1 } },
    { id: 's4', name: 'Scroll of Identify', type: 'scroll', rarity: 'common', description: 'Casts Identify to learn the properties of a magic item.', uses: { current: 1, max: 1 } },
    { id: 's5', name: 'Scroll of Protection', type: 'scroll', rarity: 'uncommon', description: 'Creates a protective barrier against a specific creature type.', uses: { current: 1, max: 1 } },
    { id: 's6', name: 'Scroll of Teleportation', type: 'scroll', rarity: 'very rare', description: 'Casts Teleport to transport you and your allies to a destination.', uses: { current: 1, max: 1 } },

    // Wands
    { id: 'wa1', name: 'Wand of Magic Missiles', type: 'wand', rarity: 'uncommon', description: 'A wand with 7 charges. Expends 1 charge to cast Magic Missile.', attunement: true, damageDice: '3d4+3', damageType: 'force', uses: { current: 7, max: 7 } },
    { id: 'wa2', name: 'Wand of Fireballs', type: 'wand', rarity: 'very rare', description: 'A wand with 7 charges. Expends 1-3 charges to cast Fireball (3rd-5th level).', attunement: true, damageDice: '8d6', damageType: 'fire', uses: { current: 7, max: 7 } },
    { id: 'wa3', name: 'Wand of Lightning Bolts', type: 'wand', rarity: 'rare', description: 'A wand with 7 charges. Expends 1-3 charges to cast Lightning Bolt (3rd-5th level).', attunement: true, damageDice: '8d6', damageType: 'lightning', uses: { current: 7, max: 7 } },
    { id: 'wa4', name: 'Wand of Polymorph', type: 'wand', rarity: 'very rare', description: 'A wand with 7 charges. Expends 1-3 charges to cast Polymorph.', attunement: true, uses: { current: 7, max: 7 } },

    // Rings
    { id: 'r1', name: 'Ring of Jumping', type: 'ring', rarity: 'uncommon', description: 'You can cast Jump on yourself as a bonus action.', attunement: true },
    { id: 'r2', name: 'Ring of Water Walking', type: 'ring', rarity: 'uncommon', description: 'You can walk on any liquid surface as if it were solid ground.', attunement: true },
    { id: 'r3', name: 'Ring of Invisibility', type: 'ring', rarity: 'legendary', description: 'While wearing this ring, you can turn invisible at will.', attunement: true },
    { id: 'r4', name: 'Ring of Spell Storing', type: 'ring', rarity: 'rare', description: 'This ring stores spells cast into it, which can be released later.', attunement: true },
    { id: 'r5', name: 'Ring of Warmth', type: 'ring', rarity: 'uncommon', description: 'You have resistance to cold damage while wearing this ring.', attunement: true },
    { id: 'a4', name: 'Ring of Protection', type: 'ring', rarity: 'rare', description: 'You gain a +1 bonus to AC and saving throws while wearing this ring.', acBonus: 1, attunement: true },

    // Other
    { id: 'o1', name: 'Bag of Holding', type: 'other', rarity: 'uncommon', description: 'A bag that can hold up to 500 pounds of items without changing weight.' },
    { id: 'o2', name: 'Portable Hole', type: 'other', rarity: 'very rare', description: 'A 6-foot diameter hole that can be folded and placed on a surface to create a temporary extra-dimensional space.' },
    { id: 'o3', name: 'Cubic Gate', type: 'other', rarity: 'legendary', description: 'A cube that can be used to travel to other planes of existence.', attunement: true },
    { id: 'o4', name: 'Deck of Many Things', type: 'other', rarity: 'legendary', description: 'A powerful magical deck that can grant wishes or bring doom.' },
    { id: 'o5', name: 'Eyes of the Eagle', type: 'other', rarity: 'uncommon', description: 'These goggles grant advantage on Perception checks that rely on sight.' },
    { id: 'o6', name: 'Gauntlets of Ogre Power', type: 'other', rarity: 'uncommon', description: 'Your Strength becomes 19 while wearing these gauntlets.', attunement: true },
    { id: 'o7', name: 'Helm of Telepathy', type: 'other', rarity: 'rare', description: 'You can cast Detect Thoughts and use telepathy while wearing this helm.', attunement: true },
    { id: 'o8', name: 'Ioun Stone', type: 'other', rarity: 'very rare', description: 'Various stones with different magical properties.', attunement: true },
    { id: 'o9', name: 'Figurine of Wondrous Power', type: 'other', rarity: 'rare', description: 'A figurine that can be transformed into a real creature for a limited time.' },
    { id: 'o10', name: 'Robe of Useful Items', type: 'other', rarity: 'uncommon', description: 'A robe with patches that can be torn off to produce various useful items.' },

    // Natural Weapons
    { id: 'nw1', name: 'Claws', type: 'natural weapon', rarity: 'common', description: 'Your claws are natural weapons, which you can use to make unarmed strikes. If you hit with them, you deal slashing damage equal to 1d4 + your Strength modifier.', damageDice: '1d4', damageType: 'slashing' },
    { id: 'nw2', name: 'Bite', type: 'natural weapon', rarity: 'common', description: 'Your fanged maw is a natural weapon, which you can use to make unarmed strikes. If you hit with it, you deal piercing damage equal to 1d6 + your Strength modifier.', damageDice: '1d6', damageType: 'piercing' },
    { id: 'nw3', name: 'Talons', type: 'natural weapon', rarity: 'common', description: 'Your talons are natural weapons, which you can use to make unarmed strikes. If you hit with them, you deal slashing damage equal to 1d4 + your Strength modifier.', damageDice: '1d4', damageType: 'slashing' },
    { id: 'nw4', name: 'Fangs', type: 'natural weapon', rarity: 'common', description: 'Your fangs are natural weapons, which you can use to make unarmed strikes. If you hit with them, you deal piercing damage equal to 1d4 + your Strength modifier.', damageDice: '1d4', damageType: 'piercing' },
];