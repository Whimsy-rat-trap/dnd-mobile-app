export interface FeatCatalogEntry {
    id: string;
    name: string;
    description: string;
    prerequisite?: string;
}

export const GENERAL_FEATS: FeatCatalogEntry[] = [
    {
        id: 'alert',
        name: 'Alert',
        description: 'You gain a +5 bonus to initiative. You can\'t be surprised while conscious, and other creatures don\'t gain advantage on attack rolls against you as a result of being hidden from you.',
    },
    {
        id: 'athlete',
        name: 'Athlete',
        description: 'Increase your Strength or Dexterity by 1. You can stand up from prone using only 5 feet of movement, climb without extra cost, and make running jumps after moving only 5 feet.',
    },
    {
        id: 'actor',
        name: 'Actor',
        description: 'Increase your Charisma by 1. You have advantage on Deception and Performance checks when trying to pass as a different person.',
    },
    {
        id: 'charger',
        name: 'Charger',
        description: 'When you use your action to Dash, you can use a bonus action to make one melee weapon attack or shove a creature.',
    },
    {
        id: 'crossbow-expert',
        name: 'Crossbow Expert',
        description: 'Ignore the loading property of crossbows. Being within 5 feet of a hostile creature doesn\'t impose disadvantage on ranged attacks. When using Attack action with a one-handed weapon, you can use a bonus action to attack with a hand crossbow.',
    },
    {
        id: 'defensive-duelist',
        name: 'Defensive Duelist',
        description: 'When wielding a finesse weapon you\'re proficient with, you can use your reaction to add your proficiency bonus to your AC against one melee attack.',
        prerequisite: 'Dexterity 13+',
    },
    {
        id: 'dual-wielder',
        name: 'Dual Wielder',
        description: '+1 AC while wielding two weapons. You can use two-weapon fighting even if weapons aren\'t light. You can draw or stow two one-handed weapons when you normally could only draw or stow one.',
    },
    {
        id: 'dungeon-delver',
        name: 'Dungeon Delver',
        description: 'Advantage on Perception and Investigation checks to find secret doors, and on saving throws against traps. You can search for traps while traveling at a normal pace, and you have resistance to trap damage.',
    },
    {
        id: 'durable',
        name: 'Durable',
        description: 'Increase your Constitution by 1. When you roll a Hit Die to regain HP, the minimum number of HP you regain equals twice your Constitution modifier.',
    },
    {
        id: 'elemental-adept',
        name: 'Elemental Adept',
        description: 'Choose a damage type: acid, cold, fire, lightning, or thunder. Your spells of that type ignore resistance, and 1s on damage dice count as 2s.',
    },
    {
        id: 'grappler',
        name: 'Grappler',
        description: 'Advantage on attack rolls against a creature you\'re grappling. You can use your action to pin a grappled creature.',
        prerequisite: 'Strength 13+',
    },
    {
        id: 'great-weapon-master',
        name: 'Great Weapon Master',
        description: 'On a crit or when you reduce a creature to 0 HP with a melee weapon, you can make a bonus action melee weapon attack. Before you make a melee attack with a heavy weapon, you can take -5 to hit for +10 damage.',
    },
    {
        id: 'healer',
        name: 'Healer',
        description: 'When using a healer\'s kit to stabilize a dying creature, that creature regains 1 HP. As an action, spend one use of a healer\'s kit to restore 1d6 + 4 + number of Hit Dice HP.',
    },
    {
        id: 'heavily-armored',
        name: 'Heavily Armored',
        description: 'Increase your Strength by 1. You gain proficiency with heavy armor.',
        prerequisite: 'Medium armor proficiency',
    },
    {
        id: 'heavy-armor-master',
        name: 'Heavy Armor Master',
        description: 'Increase your Strength by 1. While wearing heavy armor, bludgeoning, piercing, and slashing damage from nonmagical weapons is reduced by 3.',
        prerequisite: 'Heavy armor proficiency',
    },
    {
        id: 'inspiring-leader',
        name: 'Inspiring Leader',
        description: 'Spend 10 minutes to give up to 6 creatures (including you) temporary HP equal to your level + Charisma modifier. Once per short or long rest.',
        prerequisite: 'Charisma 13+',
    },
    {
        id: 'keen-mind',
        name: 'Keen Mind',
        description: 'Increase your Intelligence by 1. You always know which way is north, how many hours until sunrise/sunset, and can accurately recall anything you\'ve seen or heard within the past month.',
    },
    {
        id: 'lightly-armored',
        name: 'Lightly Armored',
        description: 'Increase your Strength or Dexterity by 1. You gain proficiency with light armor.',
    },
    {
        id: 'linguist',
        name: 'Linguist',
        description: 'Increase your Intelligence by 1. You learn three languages. You can create ciphers that only you and those you teach can decipher.',
    },
    {
        id: 'lucky',
        name: 'Lucky',
        description: 'You have 3 luck points. Spend one to roll an additional d20 on an attack roll, ability check, or saving throw (or when an attacker rolls against you). You choose which roll to use. Regain on long rest.',
    },
    {
        id: 'mage-slayer',
        name: 'Mage Slayer',
        description: 'When a creature within 5 feet casts a spell, you can use your reaction to make a melee weapon attack. Advantage on saving throws against spells cast by creatures within 5 feet. When you damage a concentrating creature, it has disadvantage on its concentration save.',
    },
    {
        id: 'magic-initiate',
        name: 'Magic Initiate',
        description: 'Choose a class: Bard, Cleric, Druid, Sorcerer, Warlock, or Wizard. You learn two cantrips and one 1st-level spell from that class\'s spell list. Cast the 1st-level spell once per long rest.',
    },
    {
        id: 'martial-adept',
        name: 'Martial Adept',
        description: 'You learn two maneuvers of your choice from the Battle Master archetype. You gain one superiority die (d6) that recharges on short or long rest.',
    },
    {
        id: 'medium-armor-master',
        name: 'Medium Armor Master',
        description: 'Wearing medium armor doesn\'t impose disadvantage on Stealth. When wearing medium armor, add up to 3 (instead of 2) to AC from Dexterity.',
        prerequisite: 'Medium armor proficiency',
    },
    {
        id: 'mobile',
        name: 'Mobile',
        description: 'Your speed increases by 10 feet. When you use Dash, difficult terrain doesn\'t cost extra movement. When you make a melee attack against a creature, you don\'t provoke opportunity attacks from that creature for the rest of the turn.',
    },
    {
        id: 'moderately-armored',
        name: 'Moderately Armored',
        description: 'Increase your Strength or Dexterity by 1. You gain proficiency with medium armor and shields.',
        prerequisite: 'Light armor proficiency',
    },
    {
        id: 'mounted-combatant',
        name: 'Mounted Combatant',
        description: 'Advantage on melee attacks against unmounted creatures smaller than your mount. You can force an attack targeted at your mount to target you. If your mount fails a Dexterity save, you can use your reaction to make it succeed.',
    },
    {
        id: 'observant',
        name: 'Observant',
        description: 'Increase your Intelligence or Wisdom by 1. If you can see a creature\'s mouth, you can read its lips. +5 bonus to passive Perception and passive Investigation.',
    },
    {
        id: 'polearm-master',
        name: 'Polearm Master',
        description: 'When you take the Attack action with a glaive, halberd, quarterstaff, or spear, you can use a bonus action to make a melee attack with the opposite end (1d4 bludgeoning). Opportunity attacks trigger when creatures enter your reach with those weapons.',
    },
    {
        id: 'resilient',
        name: 'Resilient',
        description: 'Choose one ability score. Increase it by 1. You gain proficiency in saving throws using that ability.',
    },
    {
        id: 'ritual-caster',
        name: 'Ritual Caster',
        description: 'You acquire a ritual book containing two 1st-level ritual spells. You can cast them as rituals, and add more ritual spells as you find them.',
        prerequisite: 'Intelligence or Wisdom 13+',
    },
    {
        id: 'savage-attacker',
        name: 'Savage Attacker',
        description: 'Once per turn when you roll damage for a melee weapon attack, you can reroll the damage dice and use either total.',
    },
    {
        id: 'sentinel',
        name: 'Sentinel',
        description: 'When you hit a creature with an opportunity attack, its speed becomes 0 for the rest of the turn. Creatures within 5 feet provoke opportunity attacks even if they Disengage. When a creature within 5 feet attacks a target other than you, you can use your reaction to make a melee weapon attack against the attacker.',
    },
    {
        id: 'sharpshooter',
        name: 'Sharpshooter',
        description: 'Attacking at long range doesn\'t impose disadvantage. Your ranged weapon attacks ignore half and three-quarters cover. Before making an attack with a ranged weapon you\'re proficient with, you can take -5 to hit for +10 damage.',
    },
    {
        id: 'shield-master',
        name: 'Shield Master',
        description: 'If you take the Attack action, you can use a bonus action to shove a creature with your shield. You can add your shield\'s AC bonus to Dexterity saves against effects targeting only you. On a success, you take no damage.',
    },
    {
        id: 'skilled',
        name: 'Skilled',
        description: 'You gain proficiency in any combination of three skills or tools of your choice.',
    },
    {
        id: 'skulker',
        name: 'Skulker',
        description: 'You can hide when only lightly obscured. If you miss with a ranged attack while hidden, you don\'t reveal your position. Dim light doesn\'t impose disadvantage on Perception checks relying on sight.',
        prerequisite: 'Dexterity 13+',
    },
    {
        id: 'spell-sniper',
        name: 'Spell Sniper',
        description: 'When you cast a spell that requires an attack roll, its range is doubled. Your ranged spell attacks ignore half and three-quarters cover. You learn one cantrip that requires an attack roll.',
        prerequisite: 'Spellcasting',
    },
    {
        id: 'tavern-brawler',
        name: 'Tavern Brawler',
        description: 'Increase your Strength or Constitution by 1. You\'re proficient with improvised weapons and unarmed strikes (1d4 bludgeoning). When you hit with an unarmed strike or improvised weapon, you can use a bonus action to grapple the target.',
    },
    {
        id: 'tough',
        name: 'Tough',
        description: 'Your hit point maximum increases by 2 per character level.',
    },
    {
        id: 'war-caster',
        name: 'War Caster',
        description: 'Advantage on Constitution saving throws to maintain concentration. You can perform somatic components even when both hands are full. You can cast a spell as an opportunity attack.',
        prerequisite: 'Spellcasting',
    },
    {
        id: 'weapon-master',
        name: 'Weapon Master',
        description: 'Increase your Strength or Dexterity by 1. You gain proficiency with four weapons of your choice.',
    },
];

export const getGeneralFeatById = (id: string): FeatCatalogEntry | undefined =>
    GENERAL_FEATS.find(f => f.id === id);