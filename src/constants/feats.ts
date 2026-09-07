import { Feat } from '../types/Character';

// КЛАССОВЫЕ ЧЕРТЫ
export const CLASS_FEATS: Record<string, Feat[]> = {
    Barbarian: [
        {
            id: 'rage',
            name: 'Rage',
            description: 'You can enter a rage as a bonus action, gaining advantage on Strength checks and saving throws, bonus damage, and resistance to bludgeoning, piercing, and slashing damage.',
            source: 'class',
        },
        {
            id: 'unarmored-defense-barbarian',
            name: 'Unarmored Defense',
            description: 'While not wearing armor, your AC equals 10 + Dexterity modifier + Constitution modifier.',
            source: 'class',
        },
    ],
    Bard: [
        {
            id: 'spellcasting-bard',
            name: 'Spellcasting',
            description: 'You can cast spells from the bard spell list. You know two cantrips and four 1st-level spells. Charisma is your spellcasting ability.',
            source: 'class',
        },
        {
            id: 'bardic-inspiration',
            name: 'Bardic Inspiration',
            description: 'You can inspire others with your words or music. As a bonus action, you can grant a creature a Bardic Inspiration die (d6), which it can add to one ability check, attack roll, or saving throw.',
            source: 'class',
        },
    ],
    Cleric: [
        {
            id: 'spellcasting-cleric',
            name: 'Spellcasting',
            description: 'You can cast spells from the cleric spell list. You know three cantrips and can prepare spells from the cleric list. Wisdom is your spellcasting ability.',
            source: 'class',
        },
        {
            id: 'divine-domain',
            name: 'Divine Domain',
            description: 'You choose a Divine Domain (Life, Light, Tempest, etc.) that grants you additional spells and abilities.',
            source: 'class',
        },
    ],
    Druid: [
        {
            id: 'spellcasting-druid',
            name: 'Spellcasting',
            description: 'You can cast spells from the druid spell list. You know two cantrips and can prepare spells from the druid list. Wisdom is your spellcasting ability.',
            source: 'class',
        },
        {
            id: 'druidic',
            name: 'Druidic',
            description: 'You know Druidic, the secret language of druids. You can speak and write it.',
            source: 'class',
        },
    ],
    Fighter: [
        {
            id: 'fighting-style',
            name: 'Fighting Style',
            description: 'Choose one fighting style: Archery, Defense, Dueling, Great Weapon Fighting, Protection, Two-Weapon Fighting. You gain the benefits of that style.',
            source: 'class',
        },
        {
            id: 'second-wind',
            name: 'Second Wind',
            description: 'You can use a bonus action to regain hit points equal to 1d10 + your fighter level. Once per short or long rest.',
            source: 'class',
        },
    ],
    Monk: [
        {
            id: 'unarmored-defense-monk',
            name: 'Unarmored Defense',
            description: 'While not wearing armor or a shield, your AC equals 10 + Dexterity modifier + Wisdom modifier.',
            source: 'class',
        },
        {
            id: 'martial-arts',
            name: 'Martial Arts',
            description: 'You gain the ability to make unarmed strikes with a d4 damage die, and can make an additional unarmed strike as a bonus action when you attack with a monk weapon or unarmed strike.',
            source: 'class',
        },
    ],
    Paladin: [
        {
            id: 'divine-sense',
            name: 'Divine Sense',
            description: 'You can sense the presence of celestial, fiend, or undead within 60 feet. You can use this ability a number of times equal to 1 + Charisma modifier.',
            source: 'class',
        },
        {
            id: 'lay-on-hands',
            name: 'Lay on Hands',
            description: 'You can heal wounds with a touch. You have a pool of healing equal to your paladin level × 5. You can spend from it to restore hit points or cure diseases/poisons.',
            source: 'class',
        },
    ],
    Ranger: [
        {
            id: 'favored-enemy',
            name: 'Favored Enemy',
            description: 'Choose one type of enemy (beasts, monstrosities, etc.). You have advantage on Wisdom (Survival) checks to track them, and Intelligence checks to recall information about them.',
            source: 'class',
        },
        {
            id: 'natural-explorer',
            name: 'Natural Explorer',
            description: 'You have advantage on Wisdom (Survival) checks to track, and can move stealthily at a normal pace in your favored terrain.',
            source: 'class',
        },
    ],
    Rogue: [
        {
            id: 'expertise',
            name: 'Expertise',
            description: 'Choose two skill proficiencies (or one skill and thieves\' tools). Your proficiency bonus is doubled for those skills.',
            source: 'class',
        },
        {
            id: 'sneak-attack',
            name: 'Sneak Attack',
            description: 'You deal an extra 1d6 damage when you have advantage on an attack roll, or when an ally is within 5 feet of the target and you don\'t have disadvantage.',
            source: 'class',
        },
    ],
    Sorcerer: [
        {
            id: 'spellcasting-sorcerer',
            name: 'Spellcasting',
            description: 'You can cast spells from the sorcerer spell list. You know four cantrips and two 1st-level spells. Charisma is your spellcasting ability.',
            source: 'class',
        },
        {
            id: 'sorcerous-origin',
            name: 'Sorcerous Origin',
            description: 'You choose a magical origin (Draconic Bloodline, Wild Magic, etc.) that grants you additional spells and features.',
            source: 'class',
        },
    ],
    Warlock: [
        {
            id: 'otherworldly-patron',
            name: 'Otherworldly Patron',
            description: 'You make a pact with an otherworldly being (Archfey, Fiend, Great Old One, etc.) which grants you additional spells and features.',
            source: 'class',
        },
        {
            id: 'pact-magic',
            name: 'Pact Magic',
            description: 'You can cast spells from the warlock spell list. You know two cantrips and two 1st-level spells. Charisma is your spellcasting ability.',
            source: 'class',
        },
    ],
    Wizard: [
        {
            id: 'spellcasting-wizard',
            name: 'Spellcasting',
            description: 'You can cast spells from the wizard spell list. You know three cantrips and have a spellbook with six 1st-level spells. Intelligence is your spellcasting ability.',
            source: 'class',
        },
        {
            id: 'arcane-recovery',
            name: 'Arcane Recovery',
            description: 'Once per day, you can recover expended spell slots (total levels equal to half your wizard level, rounded up).',
            source: 'class',
        },
    ],
    Artificer: [
        {
            id: 'spellcasting-artificer',
            name: 'Spellcasting',
            description: 'You can cast spells from the artificer spell list. You know two cantrips and can prepare spells. Intelligence is your spellcasting ability.',
            source: 'class',
        },
        {
            id: 'infuse-items',
            name: 'Infuse Items',
            description: 'You can infuse items with magical properties. You start with two infusions known and can infuse two items.',
            source: 'class',
        },
    ],
};

// РАСОВЫЕ ЧЕРТЫ
export const RACE_FEATS: Record<string, Feat[]> = {
    Dragonborn: [
        {
            id: 'draconic-ancestry',
            name: 'Draconic Ancestry',
            description: 'You have draconic ancestry, granting you a breath weapon and resistance to a damage type based on your dragon type.',
            source: 'race',
        },
        {
            id: 'breath-weapon',
            name: 'Breath Weapon',
            description: 'You can exhale destructive energy. Damage and shape depend on your dragon type. Use once per short rest.',
            source: 'race',
        },
        {
            id: 'damage-resistance-dragonborn',
            name: 'Damage Resistance',
            description: 'You have resistance to the damage type associated with your draconic ancestry.',
            source: 'race',
        },
    ],
    Dwarf: [
        {
            id: 'darkvision-dwarf',
            name: 'Darkvision',
            description: 'You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light.',
            source: 'race',
        },
        {
            id: 'dwarven-resilience',
            name: 'Dwarven Resilience',
            description: 'You have advantage on saving throws against poison, and you have resistance against poison damage.',
            source: 'race',
        },
        {
            id: 'stonecunning',
            name: 'Stonecunning',
            description: 'You gain proficiency in History checks related to stonework, and add double your proficiency bonus.',
            source: 'race',
        },
    ],
    Elf: [
        {
            id: 'darkvision-elf',
            name: 'Darkvision',
            description: 'You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light.',
            source: 'race',
        },
        {
            id: 'fey-ancestry',
            name: 'Fey Ancestry',
            description: 'You have advantage on saving throws against being charmed, and magic can\'t put you to sleep.',
            source: 'race',
        },
        {
            id: 'trance',
            name: 'Trance',
            description: 'You meditate for 4 hours instead of sleeping, gaining the same benefit as 8 hours of sleep.',
            source: 'race',
        },
        {
            id: 'keen-senses',
            name: 'Keen Senses',
            description: 'You have proficiency in the Perception skill.',
            source: 'race',
        },
    ],
    Gnome: [
        {
            id: 'darkvision-gnome',
            name: 'Darkvision',
            description: 'You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light.',
            source: 'race',
        },
        {
            id: 'gnome-cunning',
            name: 'Gnome Cunning',
            description: 'You have advantage on Intelligence, Wisdom, and Charisma saving throws against magic.',
            source: 'race',
        },
        {
            id: 'natural-illusionist',
            name: 'Natural Illusionist',
            description: 'You know the Minor Illusion cantrip. Intelligence is your spellcasting ability for it.',
            source: 'race',
        },
    ],
    'Half-Elf': [
        {
            id: 'darkvision-half-elf',
            name: 'Darkvision',
            description: 'You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light.',
            source: 'race',
        },
        {
            id: 'fey-ancestry-half-elf',
            name: 'Fey Ancestry',
            description: 'You have advantage on saving throws against being charmed, and magic can\'t put you to sleep.',
            source: 'race',
        },
        {
            id: 'skill-versatility',
            name: 'Skill Versatility',
            description: 'You gain proficiency in two skills of your choice.',
            source: 'race',
        },
    ],
    'Half-Orc': [
        {
            id: 'darkvision-half-orc',
            name: 'Darkvision',
            description: 'You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light.',
            source: 'race',
        },
        {
            id: 'menacing',
            name: 'Menacing',
            description: 'You gain proficiency in the Intimidation skill.',
            source: 'race',
        },
        {
            id: 'relentless-endurance',
            name: 'Relentless Endurance',
            description: 'When you are reduced to 0 hit points but not killed, you can drop to 1 hit point instead. Once per long rest.',
            source: 'race',
        },
        {
            id: 'savage-attacks',
            name: 'Savage Attacks',
            description: 'When you score a critical hit with a melee weapon, you can roll one additional damage die and add it to the damage.',
            source: 'race',
        },
    ],
    Halfling: [
        {
            id: 'lucky',
            name: 'Lucky',
            description: 'When you roll a 1 on a d20 for an attack, ability check, or saving throw, you can reroll it and use the new roll.',
            source: 'race',
        },
        {
            id: 'brave',
            name: 'Brave',
            description: 'You have advantage on saving throws against being frightened.',
            source: 'race',
        },
        {
            id: 'halfling-nimbleness',
            name: 'Halfling Nimbleness',
            description: 'You can move through the space of any creature that is of a size larger than yours.',
            source: 'race',
        },
    ],
    Human: [
        {
            id: 'versatile-human',
            name: 'Versatile',
            description: 'You gain proficiency in one skill of your choice.',
            source: 'race',
        },
        // Если используется вариант человека с чертой, можно добавить "Feat" как отдельную черту
    ],
    Tiefling: [
        {
            id: 'darkvision-tiefling',
            name: 'Darkvision',
            description: 'You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light.',
            source: 'race',
        },
        {
            id: 'hellish-resistance',
            name: 'Hellish Resistance',
            description: 'You have resistance to fire damage.',
            source: 'race',
        },
        {
            id: 'legacy-of-malbolge',
            name: 'Legacy of Malbolge',
            description: 'You know the Thaumaturgy cantrip. At 3rd level, you can cast Hellish Rebuke once per day. At 5th level, you can cast Darkness once per day.',
            source: 'race',
        },
    ],
    Aarakocra: [
        {
            id: 'flight',
            name: 'Flight',
            description: 'You have a flying speed of 50 feet. You cannot wear medium or heavy armor.',
            source: 'race',
        },
        {
            id: 'talons',
            name: 'Talons',
            description: 'You are proficient with your unarmed strikes, which deal 1d4 slashing damage.',
            source: 'race',
        },
    ],
    Aasimar: [
        {
            id: 'darkvision-aasimar',
            name: 'Darkvision',
            description: 'You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light.',
            source: 'race',
        },
        {
            id: 'celestial-resistance',
            name: 'Celestial Resistance',
            description: 'You have resistance to necrotic and radiant damage.',
            source: 'race',
        },
        {
            id: 'healing-hands',
            name: 'Healing Hands',
            description: 'You can touch a creature and restore hit points equal to your level. Once per long rest.',
            source: 'race',
        },
    ],
    Firbolg: [
        {
            id: 'firbolg-magic',
            name: 'Firbolg Magic',
            description: 'You can cast Detect Magic and Disguise Self, using Wisdom as your spellcasting ability. Each once per short rest.',
            source: 'race',
        },
        {
            id: 'hidden-step',
            name: 'Hidden Step',
            description: 'As a bonus action, you can become invisible until the start of your next turn. Once per short rest.',
            source: 'race',
        },
        {
            id: 'powerful-build',
            name: 'Powerful Build',
            description: 'You count as one size larger when determining carrying capacity and push/drag/lift weight.',
            source: 'race',
        },
    ],
    Goliath: [
        {
            id: 'natural-athlete',
            name: 'Natural Athlete',
            description: 'You have proficiency in the Athletics skill.',
            source: 'race',
        },
        {
            id: 'stones-endurance',
            name: 'Stone\'s Endurance',
            description: 'As a reaction, you can reduce damage by 1d12 + Constitution modifier. Once per short rest.',
            source: 'race',
        },
        {
            id: 'powerful-build-goliath',
            name: 'Powerful Build',
            description: 'You count as one size larger when determining carrying capacity and push/drag/lift weight.',
            source: 'race',
        },
    ],
    Kenku: [
        {
            id: 'expert-forgery',
            name: 'Expert Forgery',
            description: 'You have advantage on checks to produce forgeries or duplicates of existing objects.',
            source: 'race',
        },
        {
            id: 'kenku-mimicry',
            name: 'Kenku Mimicry',
            description: 'You can mimic sounds you have heard, including voices. A creature can tell it is an imitation with a Wisdom (Insight) check.',
            source: 'race',
        },
        {
            id: 'kenku-training',
            name: 'Kenku Training',
            description: 'You are proficient in Deception and Sleight of Hand.',
            source: 'race',
        },
    ],
    Lizardfolk: [
        {
            id: 'bite',
            name: 'Bite',
            description: 'Your fanged maw is a natural weapon, dealing 1d6 piercing damage.',
            source: 'race',
        },
        {
            id: 'cunning-artisan',
            name: 'Cunning Artisan',
            description: 'You can harvest bone and hide from a slain creature to create simple weapons or shields during a short rest.',
            source: 'race',
        },
        {
            id: 'hold-breath',
            name: 'Hold Breath',
            description: 'You can hold your breath for up to 15 minutes.',
            source: 'race',
        },
        {
            id: 'hungry-jaws',
            name: 'Hungry Jaws',
            description: 'You can make a special attack with your bite, gaining temporary HP equal to your Constitution modifier. Use a number of times equal to Con modifier per long rest.',
            source: 'race',
        },
        {
            id: 'natural-armor-lizardfolk',
            name: 'Natural Armor',
            description: 'Your AC is 13 + Dexterity modifier when not wearing armor.',
            source: 'race',
        },
    ],
    Tabaxi: [
        {
            id: 'cats-claws',
            name: 'Cat\'s Claws',
            description: 'You have a climbing speed of 20 feet. Your claws are natural weapons dealing 1d4 slashing damage.',
            source: 'race',
        },
        {
            id: 'cats-talent',
            name: 'Cat\'s Talent',
            description: 'You have proficiency in Perception and Stealth.',
            source: 'race',
        },
        {
            id: 'feline-agility',
            name: 'Feline Agility',
            description: 'You can double your speed until the end of your turn. You regain use when you move 0 feet on a turn.',
            source: 'race',
        },
    ],
    Tortle: [
        {
            id: 'claws-tortle',
            name: 'Claws',
            description: 'Your claws are natural weapons dealing 1d4 slashing damage.',
            source: 'race',
        },
        {
            id: 'hold-breath-tortle',
            name: 'Hold Breath',
            description: 'You can hold your breath for up to 1 hour.',
            source: 'race',
        },
        {
            id: 'natural-armor-tortle',
            name: 'Natural Armor',
            description: 'Your AC is 17 (Dexterity modifier does not affect this). You cannot wear armor but can use a shield.',
            source: 'race',
        },
        {
            id: 'shell-defense',
            name: 'Shell Defense',
            description: 'You can withdraw into your shell, gaining +4 AC and advantage on Strength and Constitution saves, but you are prone and can\'t take reactions.',
            source: 'race',
        },
    ],
};

// ФОНОВЫЕ ЧЕРТЫ
export const BACKGROUND_FEATS: Record<string, Feat[]> = {
    Acolyte: [
        {
            id: 'shelter-of-the-faithful',
            name: 'Shelter of the Faithful',
            description: 'You can receive free healing and care at temples, shrines, and other establishments of your faith.',
            source: 'background',
        },
    ],
    Charlatan: [
        {
            id: 'false-identity',
            name: 'False Identity',
            description: 'You have a second identity, complete with documents and established acquaintances. You can use this to pass yourself off as another person.',
            source: 'background',
        },
    ],
    Criminal: [
        {
            id: 'criminal-contact',
            name: 'Criminal Contact',
            description: 'You have a reliable and trustworthy contact who acts as your liaison to the criminal underworld.',
            source: 'background',
        },
    ],
    Entertainer: [
        {
            id: 'by-popular-demand',
            name: 'By Popular Demand',
            description: 'You can always find a place to perform, and you can earn enough to live comfortably.',
            source: 'background',
        },
    ],
    'Folk Hero': [
        {
            id: 'rustic-hospitality',
            name: 'Rustic Hospitality',
            description: 'You can find a place to hide, rest, or recuperate among common folk.',
            source: 'background',
        },
    ],
    Gladiator: [
        {
            id: 'gladiator-fame',
            name: 'Gladiator Fame',
            description: 'You have a reputation as a gladiator. You can often find an audience for your performances, and can sometimes get free room and board.',
            source: 'background',
        },
    ],
    'Guild Artisan': [
        {
            id: 'guild-membership',
            name: 'Guild Membership',
            description: 'You have membership in a guild. You can access guild services and lodging, and can request support from the guild.',
            source: 'background',
        },
    ],
    Hermit: [
        {
            id: 'discovery',
            name: 'Discovery',
            description: 'You have made a significant discovery or revelation that could change the world. Its nature is up to the DM.',
            source: 'background',
        },
    ],
    Knight: [
        {
            id: 'retainer',
            name: 'Retainer',
            description: 'You have a loyal retainer (or squire) who serves you and can perform tasks for you.',
            source: 'background',
        },
    ],
    Noble: [
        {
            id: 'position-of-privilege',
            name: 'Position of Privilege',
            description: 'You are a noble, and people treat you with respect. You can gain access to high-society events and places.',
            source: 'background',
        },
    ],
    Outlander: [
        {
            id: 'wanderer',
            name: 'Wanderer',
            description: 'You have an excellent memory for maps and geography, and you can always recall the general layout of terrain. You can also find food and water for yourself and up to five others.',
            source: 'background',
        },
    ],
    Sage: [
        {
            id: 'researcher',
            name: 'Researcher',
            description: 'When you need to learn or recall some piece of lore, you know where and from whom you can obtain it.',
            source: 'background',
        },
    ],
    Sailor: [
        {
            id: 'ship-s-passage',
            name: 'Ship\'s Passage',
            description: 'You can secure free passage on a sailing ship for yourself and your companions.',
            source: 'background',
        },
    ],
    Soldier: [
        {
            id: 'military-rank',
            name: 'Military Rank',
            description: 'You have a military rank from your former service, which gives you influence over other soldiers and access to military facilities.',
            source: 'background',
        },
    ],
    Urchin: [
        {
            id: 'city-secrets',
            name: 'City Secrets',
            description: 'You know the secret ways and shortcuts of cities. You can travel twice as fast through urban environments.',
            source: 'background',
        },
    ],
    Artisan: [
        {
            id: 'artisan-skills',
            name: 'Artisan Skills',
            description: 'You have proficiency with artisan\'s tools and can create items of your craft.',
            source: 'background',
        },
    ],
    'Bounty Hunter': [
        {
            id: 'bounty-hunting',
            name: 'Bounty Hunting',
            description: 'You can find out information about bounties and track down targets.',
            source: 'background',
        },
    ],
    Courtier: [
        {
            id: 'court-intrigue',
            name: 'Court Intrigue',
            description: 'You understand the politics of courts and can navigate social situations with ease.',
            source: 'background',
        },
    ],
    'Faction Agent': [
        {
            id: 'faction-agent',
            name: 'Faction Agent',
            description: 'You are a member of a faction and can call upon its resources and contacts.',
            source: 'background',
        },
    ],
    'Far Traveler': [
        {
            id: 'far-traveler',
            name: 'Far Traveler',
            description: 'Your travels have given you a broader perspective. You can find food and shelter in unfamiliar places more easily.',
            source: 'background',
        },
    ],
};

// ПОДРАСОВЫЕ
export const SUBRACE_FEATS: Record<string, Feat[]> = {
    'Hill Dwarf': [
        {
            id: 'dwarven-toughness',
            name: 'Dwarven Toughness',
            description: 'Your hit point maximum increases by 1, and it increases by 1 every time you gain a level.',
            source: 'subrace',
        },
    ],
    'Mountain Dwarf': [
        {
            id: 'dwarven-armor-training',
            name: 'Dwarven Armor Training',
            description: 'You have proficiency with light and medium armor.',
            source: 'subrace',
        },
    ],
    'High Elf': [
        {
            id: 'elf-weapon-training',
            name: 'Elf Weapon Training',
            description: 'You have proficiency with longsword, shortsword, shortbow, and longbow.',
            source: 'subrace',
        },
        {
            id: 'cantrip-high-elf',
            name: 'Cantrip',
            description: 'You know one cantrip of your choice from the wizard spell list. Intelligence is your spellcasting ability.',
            source: 'subrace',
        },
        {
            id: 'extra-language-high-elf',
            name: 'Extra Language',
            description: 'You can speak, read, and write one additional language of your choice.',
            source: 'subrace',
        },
    ],
    'Wood Elf': [
        {
            id: 'elf-weapon-training-wood',
            name: 'Elf Weapon Training',
            description: 'You have proficiency with longsword, shortsword, shortbow, and longbow.',
            source: 'subrace',
        },
        {
            id: 'fleet-of-foot',
            name: 'Fleet of Foot',
            description: 'Your base walking speed increases to 35 feet.',
            source: 'subrace',
        },
        {
            id: 'mask-of-the-wild',
            name: 'Mask of the Wild',
            description: 'You can attempt to hide even when you are lightly obscured by foliage, heavy rain, falling snow, mist, and other natural phenomena.',
            source: 'subrace',
        },
    ],
    'Dark Elf (Drow)': [
        {
            id: 'drow-magic',
            name: 'Drow Magic',
            description: 'You know the Dancing Lights cantrip. At 3rd level, you can cast Faerie Fire once per day. At 5th level, you can cast Darkness once per day. Charisma is your spellcasting ability.',
            source: 'subrace',
        },
        {
            id: 'drow-weapon-training',
            name: 'Drow Weapon Training',
            description: 'You have proficiency with rapier, shortsword, and hand crossbow.',
            source: 'subrace',
        },
        {
            id: 'sunlight-sensitivity',
            name: 'Sunlight Sensitivity',
            description: 'You have disadvantage on attack rolls and Perception checks that rely on sight when you, your target, or what you are trying to perceive is in direct sunlight.',
            source: 'subrace',
        },
    ],
    'Forest Gnome': [
        {
            id: 'natural-illusionist-forest',
            name: 'Natural Illusionist',
            description: 'You know the Minor Illusion cantrip. Intelligence is your spellcasting ability.',
            source: 'subrace',
        },
        {
            id: 'speak-with-small-beasts',
            name: 'Speak with Small Beasts',
            description: 'Through sounds and gestures, you can communicate simple ideas with Small or smaller beasts.',
            source: 'subrace',
        },
    ],
    'Rock Gnome': [
        {
            id: 'artificers-lore',
            name: 'Artificer\'s Lore',
            description: 'Whenever you make an Intelligence (History) check related to magic items, alchemical objects, or technological devices, you can add twice your proficiency bonus.',
            source: 'subrace',
        },
        {
            id: 'tinker',
            name: 'Tinker',
            description: 'You have proficiency with tinker\'s tools. Using them, you can construct a Tiny clockwork device that functions for 24 hours.',
            source: 'subrace',
        },
    ],
    'Lightfoot Halfling': [
        {
            id: 'naturally-stealthy',
            name: 'Naturally Stealthy',
            description: 'You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you.',
            source: 'subrace',
        },
    ],
    'Stout Halfling': [
        {
            id: 'stout-resilience',
            name: 'Stout Resilience',
            description: 'You have advantage on saving throws against poison and resistance against poison damage.',
            source: 'subrace',
        },
    ],
    // Драконьи подрасы (просто резисты и дыхание)
    'Black': [
        {
            id: 'acid-breath',
            name: 'Acid Breath',
            description: 'Your breath weapon deals acid damage. Each creature must make a Dexterity save (DC 8 + Con + Prof). Damage: 2d6, increases at levels.',
            source: 'subrace',
        },
        {
            id: 'acid-resistance',
            name: 'Acid Resistance',
            description: 'You have resistance to acid damage.',
            source: 'subrace',
        },
    ],
    'Blue': [
        {
            id: 'lightning-breath',
            name: 'Lightning Breath',
            description: 'Your breath weapon deals lightning damage. Each creature must make a Dexterity save (DC 8 + Con + Prof). Damage: 2d6, increases at levels.',
            source: 'subrace',
        },
        {
            id: 'lightning-resistance',
            name: 'Lightning Resistance',
            description: 'You have resistance to lightning damage.',
            source: 'subrace',
        },
    ],
    'Brass': [
        {
            id: 'fire-breath-brass',
            name: 'Fire Breath',
            description: 'Your breath weapon deals fire damage. Each creature must make a Dexterity save (DC 8 + Con + Prof). Damage: 2d6, increases at levels.',
            source: 'subrace',
        },
        {
            id: 'fire-resistance-brass',
            name: 'Fire Resistance',
            description: 'You have resistance to fire damage.',
            source: 'subrace',
        },
    ],
    'Bronze': [
        {
            id: 'lightning-breath-bronze',
            name: 'Lightning Breath',
            description: 'Your breath weapon deals lightning damage. Each creature must make a Dexterity save (DC 8 + Con + Prof). Damage: 2d6, increases at levels.',
            source: 'subrace',
        },
        {
            id: 'lightning-resistance-bronze',
            name: 'Lightning Resistance',
            description: 'You have resistance to lightning damage.',
            source: 'subrace',
        },
    ],
    'Copper': [
        {
            id: 'acid-breath-copper',
            name: 'Acid Breath',
            description: 'Your breath weapon deals acid damage. Each creature must make a Dexterity save (DC 8 + Con + Prof). Damage: 2d6, increases at levels.',
            source: 'subrace',
        },
        {
            id: 'acid-resistance-copper',
            name: 'Acid Resistance',
            description: 'You have resistance to acid damage.',
            source: 'subrace',
        },
    ],
    'Gold': [
        {
            id: 'fire-breath-gold',
            name: 'Fire Breath',
            description: 'Your breath weapon deals fire damage. Each creature must make a Dexterity save (DC 8 + Con + Prof). Damage: 2d6, increases at levels.',
            source: 'subrace',
        },
        {
            id: 'fire-resistance-gold',
            name: 'Fire Resistance',
            description: 'You have resistance to fire damage.',
            source: 'subrace',
        },
    ],
    'Green': [
        {
            id: 'poison-breath',
            name: 'Poison Breath',
            description: 'Your breath weapon deals poison damage. Each creature must make a Constitution save (DC 8 + Con + Prof). Damage: 2d6, increases at levels.',
            source: 'subrace',
        },
        {
            id: 'poison-resistance',
            name: 'Poison Resistance',
            description: 'You have resistance to poison damage.',
            source: 'subrace',
        },
    ],
    'Red': [
        {
            id: 'fire-breath-red',
            name: 'Fire Breath',
            description: 'Your breath weapon deals fire damage. Each creature must make a Dexterity save (DC 8 + Con + Prof). Damage: 2d6, increases at levels.',
            source: 'subrace',
        },
        {
            id: 'fire-resistance-red',
            name: 'Fire Resistance',
            description: 'You have resistance to fire damage.',
            source: 'subrace',
        },
    ],
    'Silver': [
        {
            id: 'cold-breath',
            name: 'Cold Breath',
            description: 'Your breath weapon deals cold damage. Each creature must make a Constitution save (DC 8 + Con + Prof). Damage: 2d6, increases at levels.',
            source: 'subrace',
        },
        {
            id: 'cold-resistance',
            name: 'Cold Resistance',
            description: 'You have resistance to cold damage.',
            source: 'subrace',
        },
    ],
    'White': [
        {
            id: 'cold-breath-white',
            name: 'Cold Breath',
            description: 'Your breath weapon deals cold damage. Each creature must make a Constitution save (DC 8 + Con + Prof). Damage: 2d6, increases at levels.',
            source: 'subrace',
        },
        {
            id: 'cold-resistance-white',
            name: 'Cold Resistance',
            description: 'You have resistance to cold damage.',
            source: 'subrace',
        },
    ],
    // Тифлинги - все 9 подрас Asmodeus, Baalzebul, etc.
    'Asmodeus': [
        {
            id: 'legacy-of-asmodeus',
            name: 'Legacy of Asmodeus',
            description: 'You know Thaumaturgy. At 3rd level, you can cast Hellish Rebuke once per day as a 2nd-level spell. At 5th level, you can cast Darkness once per day. Charisma is your spellcasting ability.',
            source: 'subrace',
        },
    ],
    Baalzebul: [
        {
            id: 'legacy-of-baalzebul',
            name: 'Legacy of Baalzebul',
            description: 'You know the Thaumaturgy cantrip. At 3rd level, you can cast Ray of Sickness (2nd level) once per day. At 5th level, you can cast Crown of Madness once per day.',
            source: 'subrace',
        },
    ],
    Dispater: [
        {
            id: 'legacy-of-dispater',
            name: 'Legacy of Dispater',
            description: 'You know the Thaumaturgy cantrip. At 3rd level, you can cast Disguise Self once per day. At 5th level, you can cast Invisibility once per day.',
            source: 'subrace',
        },
    ],
    Fierna: [
        {
            id: 'legacy-of-fierna',
            name: 'Legacy of Fierna',
            description: 'You know the Friends cantrip. At 3rd level, you can cast Charm Person once per day. At 5th level, you can cast Suggestion once per day.',
            source: 'subrace',
        },
    ],
    Glasya: [
        {
            id: 'legacy-of-glasya',
            name: 'Legacy of Glasya',
            description: 'You know the Minor Illusion cantrip. At 3rd level, you can cast Disguise Self once per day. At 5th level, you can cast Invisibility once per day.',
            source: 'subrace',
        },
    ],
    Levistus: [
        {
            id: 'legacy-of-levistus',
            name: 'Legacy of Levistus',
            description: 'You know the Ray of Frost cantrip. At 3rd level, you can cast Armor of Agathys (2nd level) once per day. At 5th level, you can cast Darkness once per day.',
            source: 'subrace',
        },
    ],
    Mammon: [
        {
            id: 'legacy-of-mammon',
            name: 'Legacy of Mammon',
            description: 'You know the Mage Hand cantrip. At 3rd level, you can cast Tenser\'s Floating Disk once per day. At 5th level, you can cast Arcane Lock once per day.',
            source: 'subrace',
        },
    ],
    Mephistopheles: [
        {
            id: 'legacy-of-mephistopheles',
            name: 'Legacy of Mephistopheles',
            description: 'You know the Mage Hand cantrip. At 3rd level, you can cast Burning Hands (2nd level) once per day. At 5th level, you can cast Flame Blade once per day.',
            source: 'subrace',
        },
    ],
    Zariel: [
        {
            id: 'legacy-of-zariel',
            name: 'Legacy of Zariel',
            description: 'You know the Thaumaturgy cantrip. At 3rd level, you can cast Searing Smite (2nd level) once per day. At 5th level, you can cast Branding Smite once per day.',
            source: 'subrace',
        },
    ],
};

// ФУНКЦИЯ ДЛЯ СБОРА ЧЕРТ ДЛЯ ПЕРСОНАЖА
export function getFeatsForCharacter(
    characterClass: string,
    race: string,
    subrace: string | undefined,
    background: string
): Feat[] {
    const allFeats: Feat[] = [];

    // Классовые черты
    if (CLASS_FEATS[characterClass]) {
        allFeats.push(...CLASS_FEATS[characterClass]);
    }

    // Расовые черты
    if (RACE_FEATS[race]) {
        allFeats.push(...RACE_FEATS[race]);
    }

    // Черты фона
    if (BACKGROUND_FEATS[background]) {
        allFeats.push(...BACKGROUND_FEATS[background]);
    }

    // Черты подрасы
    if (subrace && SUBRACE_FEATS[subrace]) {
        allFeats.push(...SUBRACE_FEATS[subrace]);
    }

    // Генерируем уникальные id для каждой черты (чтобы не было конфликтов)
    return allFeats.map((feat, index) => ({
        ...feat,
        id: `${feat.source}-${feat.name.replace(/\s+/g, '-').toLowerCase()}-${index}`,
    }));
}