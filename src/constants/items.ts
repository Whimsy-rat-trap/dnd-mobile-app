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
    // Simple melee
    { id: 'w-dagger', name: 'Dagger', type: 'weapon', rarity: 'common', description: 'A small, light blade. Finesse, light, thrown.', damageDice: '1d4', damageType: 'piercing' },
    { id: 'w-handaxe', name: 'Handaxe', type: 'weapon', rarity: 'common', description: 'A light axe for one-handed use. Light, thrown.', damageDice: '1d6', damageType: 'slashing' },
    { id: 'w-javelin', name: 'Javelin', type: 'weapon', rarity: 'common', description: 'A light spear for throwing.', damageDice: '1d6', damageType: 'piercing' },
    { id: 'w-mace', name: 'Mace', type: 'weapon', rarity: 'common', description: 'A simple one-handed mace.', damageDice: '1d6', damageType: 'bludgeoning' },
    { id: 'w-spear', name: 'Spear', type: 'weapon', rarity: 'common', description: 'A simple spear, can be thrown.', damageDice: '1d6', damageType: 'piercing' },
    { id: 'w-staff', name: 'Staff', type: 'weapon', rarity: 'common', description: 'A wooden quarterstaff.', damageDice: '1d6', damageType: 'bludgeoning' },
    { id: 'w-sling', name: 'Sling', type: 'weapon', rarity: 'common', description: 'A simple ranged weapon using stones.', damageDice: '1d4', damageType: 'bludgeoning' },
    { id: 'w-light-crossbow', name: 'Light Crossbow', type: 'weapon', rarity: 'common', description: 'A simple crossbow.', damageDice: '1d8', damageType: 'piercing' },
    { id: 'w-shortbow', name: 'Shortbow', type: 'weapon', rarity: 'common', description: 'A small bow for ranged attacks.', damageDice: '1d6', damageType: 'piercing' },
    { id: 'w-longbow', name: 'Longbow', type: 'weapon', rarity: 'common', description: 'A powerful bow. Heavy, two-handed.', damageDice: '1d8', damageType: 'piercing' },
    { id: 'w-small-knife', name: 'Small Knife', type: 'weapon', rarity: 'common', description: 'A small utility knife.', damageDice: '1d4', damageType: 'piercing' },

    // Simple/martial melee
    { id: 'w-greataxe', name: 'Greataxe', type: 'weapon', rarity: 'common', description: 'A two-handed axe.', damageDice: '1d12', damageType: 'slashing' },
    { id: 'w-battleaxe', name: 'Battleaxe', type: 'weapon', rarity: 'common', description: 'A one- or two-handed axe.', damageDice: '1d8', damageType: 'slashing' },
    { id: 'w-longsword', name: 'Longsword', type: 'weapon', rarity: 'common', description: 'A versatile one-handed sword.', damageDice: '1d8', damageType: 'slashing' },
    { id: 'w-shortsword', name: 'Shortsword', type: 'weapon', rarity: 'common', description: 'A light, finesse short blade.', damageDice: '1d6', damageType: 'piercing' },
    { id: 'w-rapier', name: 'Rapier', type: 'weapon', rarity: 'common', description: 'A finely balanced, finesse sword.', damageDice: '1d8', damageType: 'piercing' },

    // Magic weapons
    { id: 'w1', name: 'Longsword +1', type: 'weapon', rarity: 'uncommon', description: 'A finely crafted longsword with a faint magical aura.', damageDice: '1d8+1', damageType: 'slashing' },
    { id: 'w2', name: 'Dagger of Venom', type: 'weapon', rarity: 'rare', description: 'On a hit, you can activate the dagger to deal an extra 2d10 poison damage.', attunement: true, damageDice: '1d4', damageType: 'piercing' },
    { id: 'w3', name: 'Flame Tongue', type: 'weapon', rarity: 'rare', description: 'While ignited, this sword deals an extra 2d6 fire damage on a hit.', attunement: true, damageDice: '1d8 + 2d6', damageType: 'fire' },
    { id: 'w4', name: 'Frost Brand', type: 'weapon', rarity: 'very rare', description: 'This sword deals extra cold damage.', attunement: true, damageDice: '1d8 + 1d6', damageType: 'cold' },
    { id: 'w5', name: 'Vorpal Sword', type: 'weapon', rarity: 'legendary', description: 'On a critical hit, the sword severs a creature\'s head.', attunement: true, damageDice: '1d8', damageType: 'slashing' },
    { id: 'w6', name: 'Sun Blade', type: 'weapon', rarity: 'rare', description: 'A magic longsword that sheds bright light.', attunement: true, damageDice: '1d8', damageType: 'radiant' },
    { id: 'w7', name: 'Defender', type: 'weapon', rarity: 'legendary', description: 'A magic sword that grants a +3 bonus to attack and damage.', attunement: true, damageDice: '1d8+3', damageType: 'slashing' },
    { id: 'w8', name: 'Holy Avenger', type: 'weapon', rarity: 'legendary', description: 'A powerful sword that deals extra radiant damage to fiends and undead.', attunement: true, damageDice: '1d8', damageType: 'radiant' },
    { id: 'w9', name: 'Rapier +2', type: 'weapon', rarity: 'rare', description: 'A finely balanced rapier with a +2 bonus.', damageDice: '1d8+2', damageType: 'piercing' },
    { id: 'w10', name: 'Mace of Disruption', type: 'weapon', rarity: 'rare', description: 'When you hit a fiend or undead, it must save or be destroyed.', attunement: true, damageDice: '1d6', damageType: 'bludgeoning' },

    // Ammunition
    { id: 'am1', name: 'Arrows (20)', type: 'other', rarity: 'common', description: '20 arrows for a bow.' },
    { id: 'am2', name: 'Bolts (20)', type: 'other', rarity: 'common', description: '20 bolts for a crossbow.' },

    // Armour
    // Light armor
    { id: 'a1', name: 'Leather Armor', type: 'armor', rarity: 'common', description: 'Standard leather armor.', baseAC: 11, dexModifierAllowed: true },
    { id: 'a8', name: 'Studded Leather +1', type: 'armor', rarity: 'uncommon', description: 'Studded leather armor with a +1 bonus to AC.', baseAC: 13, dexModifierAllowed: true },

    // Medium armor
    { id: 'a9', name: 'Hide Armor', type: 'armor', rarity: 'common', description: 'Armor made from thick hide.', baseAC: 12, dexModifierAllowed: true, maxDexBonus: 2 },
    { id: 'a10', name: 'Chain Shirt', type: 'armor', rarity: 'common', description: 'A chain shirt.', baseAC: 13, dexModifierAllowed: true, maxDexBonus: 2 },
    { id: 'a11', name: 'Scale Mail', type: 'armor', rarity: 'common', description: 'Scale mail armor.', baseAC: 14, dexModifierAllowed: true, maxDexBonus: 2, stealthDisadvantage: true },
    { id: 'a12', name: 'Breastplate', type: 'armor', rarity: 'common', description: 'A breastplate.', baseAC: 14, dexModifierAllowed: true, maxDexBonus: 2 },
    { id: 'a13', name: 'Half Plate', type: 'armor', rarity: 'common', description: 'Half plate armor.', baseAC: 15, dexModifierAllowed: true, maxDexBonus: 2, stealthDisadvantage: true },

    // Heavy armor
    { id: 'a14', name: 'Ring Mail', type: 'armor', rarity: 'common', description: 'Ring mail armor.', baseAC: 14, dexModifierAllowed: false, stealthDisadvantage: true },
    { id: 'a15', name: 'Chain Mail', type: 'armor', rarity: 'common', description: 'Chain mail armor.', baseAC: 16, dexModifierAllowed: false, strengthRequirement: 13, stealthDisadvantage: true },
    { id: 'a16', name: 'Splint Armor', type: 'armor', rarity: 'common', description: 'Splint armor.', baseAC: 17, dexModifierAllowed: false, strengthRequirement: 15, stealthDisadvantage: true },
    { id: 'a17', name: 'Plate Armor', type: 'armor', rarity: 'common', description: 'Plate armor.', baseAC: 18, dexModifierAllowed: false, strengthRequirement: 15, stealthDisadvantage: true },
    { id: 'a2', name: 'Plate Armor +2', type: 'armor', rarity: 'very rare', description: 'Shining plate armor with a +2 bonus to AC.', baseAC: 20, dexModifierAllowed: false, strengthRequirement: 15, stealthDisadvantage: true },

    // Magic armor / accessories
    { id: 'a3', name: 'Cloak of Protection', type: 'armor', rarity: 'uncommon', description: 'You gain a +1 bonus to AC and saving throws while wearing this cloak.', acBonus: 1, attunement: true },
    { id: 'a5', name: 'Elven Chain', type: 'armor', rarity: 'rare', description: 'A fine chain shirt that can be worn under clothing.', baseAC: 13, dexModifierAllowed: true },
    { id: 'a6', name: 'Dragon Scale Mail', type: 'armor', rarity: 'very rare', description: 'Armor made from the scales of a dragon. You have resistance to the dragon\'s damage type.', baseAC: 14, dexModifierAllowed: true, maxDexBonus: 2, attunement: true },
    { id: 'a7', name: 'Demon Armor', type: 'armor', rarity: 'very rare', description: 'This armor grants a +1 bonus to AC and allows you to use it as a weapon.', baseAC: 16, dexModifierAllowed: false, strengthRequirement: 13, stealthDisadvantage: true, attunement: true },

    // Shields
    { id: 'sh1', name: 'Shield', type: 'shield', rarity: 'common', description: 'A wooden or metal shield that grants +2 to AC.', acBonus: 2 },
    { id: 'sh2', name: 'Shield +1', type: 'shield', rarity: 'uncommon', description: 'A magic shield that grants a +1 bonus to AC in addition to the normal +2.', acBonus: 3 },
    { id: 'sh3', name: 'Shield of Missile Attraction', type: 'shield', rarity: 'rare', description: 'While holding this shield, you have resistance to damage from ranged weapon attacks.', acBonus: 2, attunement: true },

    // Potions
    { id: 'p1', name: 'Healing Potion', type: 'potion', rarity: 'common', description: 'Restores 2d4+2 hit points when consumed.', healingDice: '2d4+2' },
    { id: 'p2', name: 'Potion of Invisibility', type: 'potion', rarity: 'rare', description: 'Becomes invisible for 1 hour or until you attack/cast a spell.' },
    { id: 'p3', name: 'Potion of Greater Healing', type: 'potion', rarity: 'uncommon', description: 'Restores 4d4+4 hit points when consumed.', healingDice: '4d4+4' },
    { id: 'p4', name: 'Potion of Speed', type: 'potion', rarity: 'very rare', description: 'Gain the effect of the Haste spell for 1 minute.' },
    { id: 'p5', name: 'Potion of Superior Healing', type: 'potion', rarity: 'rare', description: 'Restores 8d4+8 hit points when consumed.', healingDice: '8d4+8' },
    { id: 'p6', name: 'Potion of Fire Breath', type: 'potion', rarity: 'uncommon', description: 'After drinking this potion, you can exhale fire in a 15-foot cone.', damageDice: '4d6', damageType: 'fire' },
    { id: 'p7', name: 'Potion of Giant Strength', type: 'potion', rarity: 'rare', description: 'Your Strength becomes 21 for 1 hour.' },
    { id: 'p8', name: 'Potion of Flying', type: 'potion', rarity: 'very rare', description: 'You gain a flying speed of 60 feet for 1 hour.' },

    // Scrolls
    { id: 's1', name: 'Scroll of Fireball', type: 'scroll', rarity: 'rare', description: 'Casts Fireball (3rd level) as an action.', damageDice: '8d6', damageType: 'fire', uses: { current: 1, max: 1 } },
    { id: 's2', name: 'Scroll of Revivify', type: 'scroll', rarity: 'very rare', description: 'Casts Revivify to bring a dead creature back to life.', uses: { current: 1, max: 1 } },
    { id: 's3', name: 'Scroll of Wish', type: 'scroll', rarity: 'legendary', description: 'Casts Wish, the most powerful spell a mortal can cast.', uses: { current: 1, max: 1 } },
    { id: 's4', name: 'Scroll of Identify', type: 'scroll', rarity: 'common', description: 'Casts Identify to learn the properties of a magic item.', uses: { current: 1, max: 1 } },
    { id: 's5', name: 'Scroll of Protection', type: 'scroll', rarity: 'uncommon', description: 'Creates a protective barrier against a specific creature type.', uses: { current: 1, max: 1 } },
    { id: 's6', name: 'Scroll of Teleportation', type: 'scroll', rarity: 'very rare', description: 'Casts Teleport to transport you and your allies to a destination.', uses: { current: 1, max: 1 } },

    // Wands
    { id: 'wa1', name: 'Wand of Magic Missiles', type: 'wand', rarity: 'uncommon', description: 'A wand with 7 charges. Expends 1 charge to cast Magic Missile.', attunement: true, uses: { current: 7, max: 7 } },
    { id: 'wa2', name: 'Wand of Fireballs', type: 'wand', rarity: 'very rare', description: 'A wand with 7 charges. Expends 1-3 charges to cast Fireball (3rd-5th level).', attunement: true, uses: { current: 7, max: 7 }, damageDice: '8d6', damageType: 'fire' },
    { id: 'wa3', name: 'Wand of Lightning Bolts', type: 'wand', rarity: 'rare', description: 'A wand with 7 charges. Expends 1-3 charges to cast Lightning Bolt (3rd-5th level).', attunement: true, uses: { current: 7, max: 7 }, damageDice: '8d6', damageType: 'lightning' },
    { id: 'wa4', name: 'Wand of Polymorph', type: 'wand', rarity: 'very rare', description: 'A wand with 7 charges. Expends 1-3 charges to cast Polymorph.', attunement: true, uses: { current: 7, max: 7 } },

    // Rings
    { id: 'r1', name: 'Ring of Jumping', type: 'ring', rarity: 'uncommon', description: 'You can cast Jump on yourself as a bonus action.', attunement: true },
    { id: 'r2', name: 'Ring of Water Walking', type: 'ring', rarity: 'uncommon', description: 'You can walk on any liquid surface as if it were solid ground.', attunement: true },
    { id: 'r3', name: 'Ring of Invisibility', type: 'ring', rarity: 'legendary', description: 'While wearing this ring, you can turn invisible at will.', attunement: true },
    { id: 'r4', name: 'Ring of Spell Storing', type: 'ring', rarity: 'rare', description: 'This ring stores spells cast into it, which can be released later.', attunement: true },
    { id: 'r5', name: 'Ring of Warmth', type: 'ring', rarity: 'uncommon', description: 'You have resistance to cold damage while wearing this ring.', attunement: true },
    { id: 'a4', name: 'Ring of Protection', type: 'ring', rarity: 'rare', description: 'You gain a +1 bonus to AC and saving throws while wearing this ring.', acBonus: 1, attunement: true },

    // Tools
    { id: 't1', name: "Thieves' Tools", type: 'other', rarity: 'common', description: 'A set of tools for picking locks and disarming traps.' },
    { id: 't2', name: 'Disguise Kit', type: 'other', rarity: 'common', description: 'A kit for changing your appearance.' },
    { id: 't3', name: 'Forgery Kit', type: 'other', rarity: 'common', description: 'A kit for forging documents.' },
    { id: 't4', name: 'Dice Set', type: 'other', rarity: 'common', description: 'A set of dice used for gambling.' },
    { id: 't5', name: 'Musical Instrument', type: 'other', rarity: 'common', description: 'A musical instrument of your choice.' },
    { id: 't6', name: "Artisan's Tools", type: 'other', rarity: 'common', description: 'The tools of your trade.' },
    { id: 't7', name: 'Herbalism Kit', type: 'other', rarity: 'common', description: 'A kit for identifying and using herbs.' },
    { id: 't8', name: "Navigator's Tools", type: 'other', rarity: 'common', description: 'Tools for navigation and mapmaking.' },
    { id: 't9', name: 'Manacles', type: 'other', rarity: 'common', description: 'A set of manacles for restraining a creature.' },
    { id: 't10', name: 'Hunting Trap', type: 'other', rarity: 'common', description: 'A trap for hunting game.' },

    // Packs
    { id: 'pk1', name: "Explorer's Pack", type: 'other', rarity: 'common', description: "Includes a backpack, bedroll, mess kit, tinderbox, 10 torches, 10 days of rations, and a waterskin." },
    { id: 'pk2', name: "Entertainer's Pack", type: 'other', rarity: 'common', description: "Includes a backpack, bedroll, 2 costumes, 5 candles, 5 days of rations, and a waterskin." },
    { id: 'pk3', name: "Priest's Pack", type: 'other', rarity: 'common', description: "Includes a backpack, bedroll, 10 candles, a tinderbox, an alms box, 2 blocks of incense, a censer, 10 days of rations, and a waterskin." },
    { id: 'pk4', name: 'Backpack', type: 'other', rarity: 'common', description: 'A sturdy backpack for carrying gear.' },
    { id: 'pk5', name: 'Bedroll', type: 'other', rarity: 'common', description: 'A warm bedroll for resting.' },
    { id: 'pk6', name: 'Tinderbox', type: 'other', rarity: 'common', description: 'A tinderbox for starting fires.' },
    { id: 'pk7', name: 'Rations (10 days)', type: 'other', rarity: 'common', description: '10 days of dry rations.' },
    { id: 'pk8', name: 'Waterskin', type: 'other', rarity: 'common', description: 'A waterskin for carrying water.' },
    { id: 'pk9', name: 'Torch (10)', type: 'other', rarity: 'common', description: '10 torches for illumination.' },
    { id: 'pk10', name: 'Hempen Rope (50 ft)', type: 'other', rarity: 'common', description: 'A 50-foot coil of hempen rope.' },

    // Gear / misc
    { id: 'g1', name: 'Holy Symbol', type: 'other', rarity: 'common', description: 'A holy symbol of your deity.' },
    { id: 'g2', name: 'Prayer Book', type: 'other', rarity: 'common', description: 'A book of prayers and rituals.' },
    { id: 'g3', name: 'Incense (5 blocks)', type: 'other', rarity: 'common', description: 'Blocks of incense for rituals.' },
    { id: 'g4', name: 'Common Clothes', type: 'other', rarity: 'common', description: 'Simple, everyday clothing.' },
    { id: 'g5', name: 'Fine Clothes', type: 'other', rarity: 'common', description: 'Quality clothing suitable for high society.' },
    { id: 'g6', name: 'Dark Clothes', type: 'other', rarity: 'common', description: 'Dark, hooded clothing for stealth.' },
    { id: 'g7', name: 'Costume', type: 'other', rarity: 'common', description: 'A colorful costume for performance.' },
    { id: 'g8', name: 'Pouch', type: 'other', rarity: 'common', description: 'A small pouch, often containing coins.' },
    { id: 'g9', name: 'Shovel', type: 'other', rarity: 'common', description: 'A sturdy shovel.' },
    { id: 'g10', name: 'Iron Pot', type: 'other', rarity: 'common', description: 'A cooking pot.' },
    { id: 'g11', name: 'Letter of Introduction', type: 'other', rarity: 'common', description: 'A letter from your guild.' },
    { id: 'g12', name: 'Horse', type: 'other', rarity: 'common', description: 'A riding horse.' },
    { id: 'g13', name: 'Saddle', type: 'other', rarity: 'common', description: 'A saddle and tack for a horse.' },
    { id: 'g14', name: 'Signet Ring', type: 'other', rarity: 'common', description: 'A ring bearing your family crest.' },
    { id: 'g15', name: 'Scroll of Pedigree', type: 'other', rarity: 'common', description: 'A scroll proving your lineage.' },
    { id: 'g16', name: 'Book of Lore', type: 'other', rarity: 'common', description: 'A book containing knowledge and lore.' },
    { id: 'g17', name: 'Ink and Quill', type: 'other', rarity: 'common', description: 'Writing supplies.' },
    { id: 'g18', name: 'Whistle', type: 'other', rarity: 'common', description: 'A signaling whistle.' },
    { id: 'g19', name: 'Rank Insignia', type: 'other', rarity: 'common', description: 'A symbol of your military rank.' },
    { id: 'g20', name: 'Map of the City', type: 'other', rarity: 'common', description: 'A map of the city you grew up in.' },
    { id: 'g21', name: 'Faction Badge', type: 'other', rarity: 'common', description: 'A symbol of your faction.' },
    { id: 'g22', name: 'Codebook', type: 'other', rarity: 'common', description: 'A book with secret codes.' },
    { id: 'g23', name: 'Map of the Region', type: 'other', rarity: 'common', description: 'A map of the region you have traveled.' },
    { id: 'g24', name: 'Lute', type: 'other', rarity: 'common', description: 'A stringed musical instrument.' },

    // Other magical weapons
    { id: 'o1', name: 'Bag of Holding', type: 'other', rarity: 'uncommon', description: 'A bag that can hold up to 500 pounds of items.' },
    { id: 'o2', name: 'Portable Hole', type: 'other', rarity: 'very rare', description: 'A 6-foot diameter hole that creates a temporary extra-dimensional space.' },
    { id: 'o3', name: 'Cubic Gate', type: 'other', rarity: 'legendary', description: 'A cube that can be used to travel to other planes of existence.', attunement: true },
    { id: 'o4', name: 'Deck of Many Things', type: 'other', rarity: 'legendary', description: 'A powerful magical deck that can grant wishes or bring doom.' },
    { id: 'o5', name: 'Eyes of the Eagle', type: 'other', rarity: 'uncommon', description: 'These goggles grant advantage on Perception checks that rely on sight.' },
    { id: 'o6', name: 'Gauntlets of Ogre Power', type: 'other', rarity: 'uncommon', description: 'Your Strength becomes 19 while wearing these gauntlets.', attunement: true },
    { id: 'o7', name: 'Helm of Telepathy', type: 'other', rarity: 'rare', description: 'You can cast Detect Thoughts and use telepathy while wearing this helm.', attunement: true },
    { id: 'o8', name: 'Ioun Stone', type: 'other', rarity: 'very rare', description: 'Various stones with different magical properties.', attunement: true },
    { id: 'o9', name: 'Figurine of Wondrous Power', type: 'other', rarity: 'rare', description: 'A figurine that can be transformed into a real creature.' },
    { id: 'o10', name: 'Robe of Useful Items', type: 'other', rarity: 'uncommon', description: 'A robe with patches that produce useful items.' },

    // Natural weapons
    { id: 'nw1', name: 'Claws', type: 'natural weapon', rarity: 'common', description: 'Your claws are natural weapons, dealing 1d4 + Str slashing damage on a hit.', damageDice: '1d4', damageType: 'slashing' },
    { id: 'nw2', name: 'Bite', type: 'natural weapon', rarity: 'common', description: 'Your fanged maw is a natural weapon, dealing 1d6 + Str piercing damage on a hit.', damageDice: '1d6', damageType: 'piercing' },
    { id: 'nw3', name: 'Talons', type: 'natural weapon', rarity: 'common', description: 'Your talons are natural weapons, dealing 1d4 + Str slashing damage on a hit.', damageDice: '1d4', damageType: 'slashing' },
    { id: 'nw4', name: 'Fangs', type: 'natural weapon', rarity: 'common', description: 'Your fangs are natural weapons, dealing 1d4 + Str piercing damage on a hit.', damageDice: '1d4', damageType: 'piercing' },
];