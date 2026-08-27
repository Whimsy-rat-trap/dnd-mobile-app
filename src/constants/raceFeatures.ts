export interface Feature {
    name: string;
    description: string;
    resistance?: string;
    immunity?: string;
}

export const RACE_FEATURES: Record<string, Feature[]> = {
    Dragonborn: [
        {
            name: 'Draconic Ancestry',
            description: 'You have draconic ancestry. Choose one type of dragon from the Draconic Ancestry table. Your breath weapon and damage resistance are determined by the dragon type.'
        },
        {
            name: 'Breath Weapon',
            description: 'You can use your action to exhale destructive energy. Your draconic ancestry determines the size, shape, and damage type of the exhalation. When you use your breath weapon, each creature in the area must make a saving throw, the type of which is determined by your draconic ancestry. The DC for this saving throw equals 8 + your Constitution modifier + your proficiency bonus. A creature takes 2d6 damage on a failed save, and half as much damage on a successful one. The damage increases to 3d6 at 6th level, 4d6 at 11th level, and 5d6 at 16th level. After you use your breath weapon, you can\'t use it again until you complete a short or long rest.'
        },
        {
            name: 'Damage Resistance',
            description: 'You have resistance to the damage type associated with your draconic ancestry.'
        }
    ],
    Dwarf: [
        {
            name: 'Darkvision',
            description: 'Accustomed to life underground, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can\'t discern color in darkness, only shades of gray.'
        },
        {
            name: 'Dwarven Resilience',
            description: 'You have advantage on saving throws against poison, and you have resistance against poison damage.',
            resistance: 'poison'
        },
        {
            name: 'Dwarven Combat Training',
            description: 'You have proficiency with the battleaxe, handaxe, light hammer, and warhammer.'
        },
        {
            name: 'Tool Proficiency',
            description: 'You gain proficiency with the artisan\'s tools of your choice: smith\'s tools, brewer\'s supplies, or mason\'s tools.'
        },
        {
            name: 'Stonecunning',
            description: 'Whenever you make an Intelligence (History) check related to the origin of stonework, you are considered proficient in the History skill and add double your proficiency bonus to the check, instead of your normal proficiency bonus.'
        }
    ],
    Elf: [
        {
            name: 'Darkvision',
            description: 'Accustomed to twilit forests and the night sky, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can\'t discern color in darkness, only shades of gray.'
        },
        {
            name: 'Fey Ancestry',
            description: 'You have advantage on saving throws against being charmed, and magic can\'t put you to sleep.'
        },
        {
            name: 'Trance',
            description: 'Elves don\'t need to sleep. Instead, they meditate deeply, remaining semiconscious, for 4 hours a day. (The Common word for such meditation is "trance.") While meditating, you can dream after a fashion; such dreams are actually mental exercises that have become reflexive through years of practice. After resting in this way, you gain the same benefit that a human does from 8 hours of sleep.'
        },
        {
            name: 'Keen Senses',
            description: 'You have proficiency in the Perception skill.'
        }
    ],
    Gnome: [
        {
            name: 'Darkvision',
            description: 'Accustomed to life underground, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can\'t discern color in darkness, only shades of gray.'
        },
        {
            name: 'Gnome Cunning',
            description: 'You have advantage on all Intelligence, Wisdom, and Charisma saving throws against magic.'
        },
        {
            name: 'Natural Illusionist',
            description: 'You know the minor illusion cantrip. Intelligence is your spellcasting ability for it.'
        },
        {
            name: 'Speak with Small Beasts',
            description: 'Through sounds and gestures, you can communicate simple ideas with Small or smaller beasts.'
        }
    ],
    'Half-Elf': [
        {
            name: 'Darkvision',
            description: 'Thanks to your elf blood, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can\'t discern color in darkness, only shades of gray.'
        },
        {
            name: 'Fey Ancestry',
            description: 'You have advantage on saving throws against being charmed, and magic can\'t put you to sleep.'
        },
        {
            name: 'Skill Versatility',
            description: 'You gain proficiency in two skills of your choice.'
        }
    ],
    'Half-Orc': [
        {
            name: 'Darkvision',
            description: 'Thanks to your orc blood, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can\'t discern color in darkness, only shades of gray.'
        },
        {
            name: 'Menacing',
            description: 'You gain proficiency in the Intimidation skill.'
        },
        {
            name: 'Relentless Endurance',
            description: 'When you are reduced to 0 hit points but not killed outright, you can drop to 1 hit point instead. You can\'t use this feature again until you finish a long rest.'
        },
        {
            name: 'Savage Attacks',
            description: 'When you score a critical hit with a melee weapon attack, you can roll one of the weapon\'s damage dice one additional time and add it to the extra damage of the critical hit.'
        }
    ],
    Halfling: [
        {
            name: 'Lucky',
            description: 'When you roll a 1 on the d20 for an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll.'
        },
        {
            name: 'Brave',
            description: 'You have advantage on saving throws against being frightened.'
        },
        {
            name: 'Halfling Nimbleness',
            description: 'You can move through the space of any creature that is of a size larger than yours.'
        },
        {
            name: 'Naturally Stealthy',
            description: 'You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you.'
        }
    ],
    Human: [
        {
            name: 'Versatile',
            description: 'You gain proficiency in one skill of your choice.'
        },
        {
            name: 'Extra Language',
            description: 'You can speak, read, and write one additional language of your choice.'
        }
    ],
    Tiefling: [
        {
            name: 'Darkvision',
            description: 'Thanks to your infernal heritage, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can\'t discern color in darkness, only shades of gray.'
        },
        {
            name: 'Hellish Resistance',
            description: 'You have resistance to fire damage.',
            resistance: 'fire'
        },
        {
            name: 'Legacy of Malbolge',
            description: 'You know the Thaumaturgy cantrip. Once you reach 3rd level, you can cast the Hellish Rebuke spell once per day as a 2nd-level spell. Once you reach 5th level, you can also cast the Darkness spell once per day. Charisma is your spellcasting ability for these spells.'
        }
    ],
    Aarakocra: [
        {
            name: 'Flight',
            description: 'You have a flying speed of 50 feet. To use this speed, you can\'t be wearing medium or heavy armor.'
        },
        {
            name: 'Talons',
            description: 'You are proficient with your unarmed strikes, which deal 1d4 slashing damage on a hit.'
        },
        {
            name: 'Wind Walker',
            description: 'You can hold your breath for up to 15 minutes at a time.'
        }
    ],
    Aasimar: [
        {
            name: 'Darkvision',
            description: 'Thanks to your celestial heritage, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can\'t discern color in darkness, only shades of gray.'
        },
        {
            name: 'Celestial Resistance',
            description: 'You have resistance to necrotic damage and radiant damage.',
            resistance: 'necrotic, radiant'
        },
        {
            name: 'Healing Hands',
            description: 'As an action, you can touch a creature and cause it to regain a number of hit points equal to your level. Once you use this trait, you can\'t use it again until you finish a long rest.'
        },
        {
            name: 'Light Bearer',
            description: 'You know the Light cantrip. Charisma is your spellcasting ability for it.'
        },
        {
            name: 'Radiant Soul',
            description: 'Starting at 3rd level, you can use your action to unleash the divine energy within yourself, causing your eyes to glimmer and two luminous, incorporeal wings to sprout from your back. Your transformation lasts for 1 minute or until you end it as a bonus action. During it, you have a flying speed of 30 feet, and once on each of your turns, you can deal extra radiant damage to one target when you deal damage to it with an attack or a spell. The extra radiant damage equals your level. Once you use this trait, you can\'t use it again until you finish a long rest.'
        }
    ],
    Firbolg: [
        {
            name: 'Firbolg Magic',
            description: 'You can cast Detect Magic and Disguise Self with this trait, using Wisdom as your spellcasting ability for them. Once you cast either spell, you can\'t cast it again with this trait until you finish a short or long rest. When you use this version of Disguise Self, you can seem up to 3 feet shorter than normal, allowing you to more easily blend in with humans and elves.'
        },
        {
            name: 'Hidden Step',
            description: 'As a bonus action, you can magically turn invisible until the start of your next turn or until you attack, make a damage roll, or force someone to make a saving throw. Once you use this trait, you can\'t use it again until you finish a short or long rest.'
        },
        {
            name: 'Powerful Build',
            description: 'You count as one size larger when determining your carrying capacity and the weight you can push, drag, or lift.'
        },
        {
            name: 'Speech of Beast and Leaf',
            description: 'You have the ability to communicate in a limited manner with beasts and plants. They can understand the meaning of your words, though you have no special ability to understand them in return. You have advantage on all Charisma checks you make to influence them.'
        }
    ],
    Goliath: [
        {
            name: 'Natural Athlete',
            description: 'You have proficiency in the Athletics skill.'
        },
        {
            name: 'Stone\'s Endurance',
            description: 'You can focus yourself to occasionally shrug off injury. When you take damage, you can use your reaction to roll a d12. Add your Constitution modifier to the number rolled, and reduce the damage by that total. After you use this trait, you can\'t use it again until you finish a short or long rest.'
        },
        {
            name: 'Powerful Build',
            description: 'You count as one size larger when determining your carrying capacity and the weight you can push, drag, or lift.'
        },
        {
            name: 'Mountain Born',
            description: 'You have resistance to cold damage. You\'re also acclimated to high altitude, including elevations above 20,000 feet.',
            resistance: 'cold'
        }
    ],
    Kenku: [
        {
            name: 'Expert Forgery',
            description: 'You can duplicate other creatures\' handwriting and craftwork. You have advantage on all checks made to produce forgeries or duplicates of existing objects.'
        },
        {
            name: 'Kenku Mimicry',
            description: 'You can mimic sounds you have heard, including voices. A creature that hears the sounds you make can tell they are imitations with a successful Wisdom (Insight) check opposed by your Charisma (Deception) check.'
        },
        {
            name: 'Kenku Training',
            description: 'You are proficient in the Deception and Sleight of Hand skills.'
        }
    ],
    Lizardfolk: [
        {
            name: 'Bite',
            description: 'Your fanged maw is a natural weapon, which you can use to make unarmed strikes. If you hit with it, you deal piercing damage equal to 1d6 + your Strength modifier, instead of the bludgeoning damage normal for an unarmed strike.'
        },
        {
            name: 'Cunning Artisan',
            description: 'As part of a short rest, you can harvest bone and hide from a slain beast, construct, dragon, monstrosity, or plant creature of size Small or larger to create one of the following items: a shield, a club, a javelin, or 1d4 darts or blowgun needles. To use this trait, you need a blade, such as a dagger, or appropriate artisan\'s tools, such as leatherworker\'s tools.'
        },
        {
            name: 'Hold Breath',
            description: 'You can hold your breath for up to 15 minutes at a time.'
        },
        {
            name: 'Hungry Jaws',
            description: 'You can make a special attack with your bite. If you hit with it, you gain temporary hit points equal to your Constitution modifier (minimum 1). You can use this trait a number of times equal to your Constitution modifier (minimum of once), and you regain all expended uses when you finish a long rest.'
        },
        {
            name: 'Natural Armor',
            description: 'You have tough, scaly skin. When you aren\'t wearing armor, your AC is 13 + your Dexterity modifier. You can use your natural armor to determine your AC if the armor you wear would leave you with a lower AC. A shield\'s benefits apply as normal while you use your natural armor.'
        }
    ],
    Tabaxi: [
        {
            name: 'Cat\'s Claws',
            description: 'You have a climbing speed of 20 feet. In addition, your claws are natural weapons, which you can use to make unarmed strikes. If you hit with them, you deal slashing damage equal to 1d4 + your Strength modifier, instead of the bludgeoning damage normal for an unarmed strike.'
        },
        {
            name: 'Cat\'s Talent',
            description: 'You have proficiency in the Perception and Stealth skills.'
        },
        {
            name: 'Feline Agility',
            description: 'Your reflexes and agility allow you to move with a burst of speed. When you move on your turn in combat, you can double your speed until the end of the turn. Once you use this trait, you can\'t use it again until you move 0 feet on one of your turns.'
        }
    ],
    Tortle: [
        {
            name: 'Claws',
            description: 'Your claws are natural weapons, which you can use to make unarmed strikes. If you hit with them, you deal slashing damage equal to 1d4 + your Strength modifier, instead of the bludgeoning damage normal for an unarmed strike.'
        },
        {
            name: 'Hold Breath',
            description: 'You can hold your breath for up to 1 hour at a time.'
        },
        {
            name: 'Natural Armor',
            description: 'Due to your shell and the shape of your body, you are ill-suited to wearing armor. Your shell provides ample protection, however; it gives you a base AC of 17 (your Dexterity modifier doesn\'t affect this number). You gain no benefit from wearing armor, but if you are using a shield, you can apply the shield\'s bonus as normal.'
        },
        {
            name: 'Shell Defense',
            description: 'You can withdraw into your shell as an action. Until you emerge, you gain a +4 bonus to AC, and you have advantage on Strength and Constitution saving throws. While in your shell, you are prone, your speed is 0 and can\'t increase, you have disadvantage on Dexterity saving throws, you can\'t take reactions, and the only action you can take is a bonus action to emerge from your shell.'
        }
    ]
};