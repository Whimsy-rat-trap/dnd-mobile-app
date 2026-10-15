/**
 * Единый source of truth для списков заклинаний каждого класса.
 *
 * Ключи в CLASS_SPELL_LISTS:
 *   - просто название класса: 'Wizard', 'Cleric', ...
 *   - составные (для подклассов с отдельным списком): 'Fighter:Eldritch Knight',
 *     'Rogue:Arcane Trickster'. Отдельный список означает, что подкласс кастует
 *     СВОИ заклинания, а не заклинания базового класса.
 *
 * Имена должны точно совпадать с `name` в `constants/spells`. Если заклинания
 * нет в ALL_SPELLS — оно будет проигнорировано (Map lookup), но останется
 * в списке на случай, если его добавят позже.
 */

export type SpellcastingAbility = 'int' | 'wis' | 'cha';
export type CasterType = 'prepared' | 'known';

export interface ClassSpellListData {
    /** Способность кастования. */
    ability: SpellcastingAbility;
    /** Prepared (готовит из списка) или Known (учит на level up). */
    casterType: CasterType;
    /** На каком уровне КЛАССА появляется Spellcasting (1, 2 или 3). */
    startsAtClassLevel: number;
    /** Заклинания по уровням (0 = cantrips). */
    spellsByLevel: Record<number, string[]>;
}

export const CLASS_SPELL_LISTS: Record<string, ClassSpellListData> = {
    // ARTIFICER (INT, prepared, с 1-го уровня)
    Artificer: {
        ability: 'int',
        casterType: 'prepared',
        startsAtClassLevel: 1,
        spellsByLevel: {
            0: [
                'Acid Splash', 'Booming Blade', 'Create Bonfire', 'Dancing Lights',
                'Fire Bolt', 'Frostbite', 'Green-Flame Blade', 'Guidance', 'Light',
                'Lightning Lure', 'Mage Hand', 'Magic Stone', 'Mending', 'Message',
                'Poison Spray', 'Prestidigitation', 'Ray of Frost', 'Resistance',
                'Shocking Grasp', 'Sword Burst', 'Thorn Whip', 'Thunderclap', 'True Strike',
            ],
            1: [
                'Absorb Elements', 'Alarm', 'Catapult', 'Cure Wounds', 'Detect Magic',
                'Disguise Self', 'Expeditious Retreat', 'Faerie Fire', 'False Life',
                'Feather Fall', 'Grease', 'Heroism', 'Identify', 'Jump', 'Longstrider',
                'Purify Food and Drink', 'Sanctuary', 'Snare', "Tasha's Caustic Brew",
            ],
            2: [
                'Aid', 'Alter Self', 'Arcane Lock', 'Blur', 'Continual Flame', 'Darkvision',
                'Enhance Ability', 'Enlarge/Reduce', 'Heat Metal', 'Invisibility',
                'Kinetic Jaunt', 'Lesser Restoration', 'Levitate', 'Magic Mouth',
                'Magic Weapon', 'Mirror Image', 'Protection from Poison', 'Pyrotechnics',
                'Rope Trick', 'See Invisibility', 'Skywrite', 'Spider Climb',
                'Vortex Warp', 'Web',
            ],
            3: [
                'Blink', 'Catnap', 'Create Food and Water', 'Dispel Magic',
                'Elemental Weapon', 'Flame Arrows', 'Fly', 'Glyph of Warding', 'Haste',
                'Intellect Fortress', 'Protection from Energy', 'Revivify',
                'Tiny Servant', 'Water Breathing', 'Water Walk',
            ],
            4: [
                'Arcane Eye', 'Elemental Bane', 'Fabricate', 'Freedom of Movement',
                "Leomund's Secret Chest", "Mordenkainen's Faithful Hound",
                "Mordenkainen's Private Sanctum", "Otiluke's Resilient Sphere",
                'Stone Shape', 'Stoneskin', 'Summon Construct',
            ],
            5: [
                'Animate Objects', "Bigby's Hand", 'Creation', 'Greater Restoration',
                'Skill Empowerment', 'Transmute Rock', 'Wall of Stone',
            ],
        },
    },

    // BARD (CHA, known, с 1-го уровня)
    Bard: {
        ability: 'cha',
        casterType: 'known',
        startsAtClassLevel: 1,
        spellsByLevel: {
            0: [
                'Blade Ward', 'Dancing Lights', 'Friends', 'Light', 'Mage Hand',
                'Mending', 'Message', 'Minor Illusion', 'Prestidigitation',
                'Thunderclap', 'True Strike', 'Vicious Mockery',
            ],
            1: [
                'Animal Friendship', 'Bane', 'Charm Person', 'Color Spray',
                'Comprehend Languages', 'Cure Wounds', 'Detect Magic', 'Disguise Self',
                'Dissonant Whispers', 'Earth Tremor', 'Expeditious Retreat', 'Faerie Fire',
                'Feather Fall', 'Healing Word', 'Heroism', 'Identify', 'Illusory Script',
                'Longstrider', 'Silent Image', 'Sleep', 'Speak with Animals',
                "Tasha's Hideous Laughter", 'Thunderwave', 'Unseen Servant',
            ],
            2: [
                'Aid', 'Animal Messenger', 'Blindness/Deafness', 'Calm Emotions',
                'Cloud of Daggers', 'Crown of Madness', 'Detect Thoughts',
                'Enhance Ability', 'Enlarge/Reduce', 'Enthrall', 'Heat Metal',
                'Hold Person', 'Invisibility', 'Knock', 'Lesser Restoration',
                'Locate Animals or Plants', 'Locate Object', 'Magic Mouth',
                'Mirror Image', 'Phantasmal Force', 'Pyrotechnics', 'See Invisibility',
                'Shatter', 'Silence', 'Skywrite', 'Suggestion', 'Warding Wind',
                'Zone of Truth',
            ],
            3: [
                'Bestow Curse', 'Catnap', 'Clairvoyance', 'Dispel Magic',
                'Enemies Abound', 'Fear', 'Feign Death', 'Glyph of Warding',
                'Hypnotic Pattern', 'Intellect Fortress', "Leomund's Tiny Hut",
                'Major Image', 'Nondetection', 'Plant Growth', 'Sending',
                'Speak with Dead', 'Speak with Plants', 'Stinking Cloud', 'Tongues',
            ],
            4: [
                'Charm Monster', 'Compulsion', 'Confusion', 'Dimension Door',
                'Freedom of Movement', 'Greater Invisibility', 'Hallucinatory Terrain',
                'Locate Creature', 'Phantasmal Killer', 'Polymorph',
            ],
            5: [
                'Animate Objects', 'Awaken', 'Dominate Person', 'Dream', 'Geas',
                'Greater Restoration', 'Hold Monster', 'Legend Lore',
                'Mass Cure Wounds', 'Mislead', 'Modify Memory', 'Planar Binding',
                'Raise Dead', 'Scrying', 'Seeming', 'Teleportation Circle',
            ],
        },
    },

    // CLERIC (WIS, prepared, с 1-го уровня)
    Cleric: {
        ability: 'wis',
        casterType: 'prepared',
        startsAtClassLevel: 1,
        spellsByLevel: {
            0: [
                'Guidance', 'Light', 'Mending', 'Resistance', 'Sacred Flame',
                'Spare the Dying', 'Thaumaturgy', 'Toll the Dead', 'Word of Radiance',
            ],
            1: [
                'Bane', 'Bless', 'Command', 'Create or Destroy Water', 'Cure Wounds',
                'Detect Evil and Good', 'Detect Magic', 'Detect Poison and Disease',
                'Guiding Bolt', 'Healing Word', 'Inflict Wounds',
                'Protection from Evil and Good', 'Purify Food and Drink', 'Sanctuary',
                'Shield of Faith',
            ],
            2: [
                'Aid', 'Augury', 'Blindness/Deafness', 'Calm Emotions',
                'Continual Flame', 'Enhance Ability', 'Find Traps', 'Gentle Repose',
                'Hold Person', 'Lesser Restoration', 'Locate Object', 'Prayer of Healing',
                'Protection from Poison', 'Silence', 'Spiritual Weapon', 'Warding Bond',
                'Zone of Truth',
            ],
            3: [
                'Animate Dead', 'Aura of Vitality', 'Beacon of Hope', 'Bestow Curse',
                'Clairvoyance', 'Create Food and Water', 'Daylight', 'Dispel Magic',
                'Feign Death', 'Glyph of Warding', 'Magic Circle', 'Mass Healing Word',
                'Meld into Stone', 'Protection from Energy', 'Remove Curse', 'Revivify',
                'Sending', 'Speak with Dead', 'Spirit Guardians', 'Tongues', 'Water Walk',
            ],
            4: [
                'Banishment', 'Control Water', 'Death Ward', 'Divination',
                'Freedom of Movement', 'Guardian of Faith', 'Locate Creature',
                'Stone Shape',
            ],
            5: [
                'Commune', 'Contagion', 'Dispel Evil and Good', 'Flame Strike', 'Geas',
                'Greater Restoration', 'Hallow', 'Insect Plague', 'Legend Lore',
                'Mass Cure Wounds', 'Planar Binding', 'Raise Dead', 'Scrying',
            ],
        },
    },

    // DRUID (WIS, prepared, с 1-го уровня)
    Druid: {
        ability: 'wis',
        casterType: 'prepared',
        startsAtClassLevel: 1,
        spellsByLevel: {
            0: [
                'Control Flames', 'Create Bonfire', 'Druidcraft', 'Frostbite',
                'Guidance', 'Gust', 'Infestation', 'Magic Stone', 'Mending',
                'Mold Earth', 'Poison Spray', 'Primal Savagery', 'Produce Flame',
                'Resistance', 'Shape Water', 'Shillelagh', 'Thorn Whip', 'Thunderclap',
            ],
            1: [
                'Absorb Elements', 'Animal Friendship', 'Beast Bond', 'Charm Person',
                'Create or Destroy Water', 'Cure Wounds', 'Detect Magic',
                'Detect Poison and Disease', 'Earth Tremor', 'Entangle', 'Faerie Fire',
                'Fog Cloud', 'Goodberry', 'Healing Word', 'Ice Knife', 'Jump',
                'Longstrider', 'Purify Food and Drink', 'Snare', 'Speak with Animals',
                'Thunderwave',
            ],
            2: [
                'Animal Messenger', 'Barkskin', 'Beast Sense', 'Darkvision', 'Dust Devil',
                'Earthbind', 'Enhance Ability', 'Find Traps', 'Flame Blade',
                'Flaming Sphere', 'Gust of Wind', 'Heat Metal', 'Hold Person',
                'Lesser Restoration', 'Locate Animals or Plants', 'Locate Object',
                'Moonbeam', 'Pass without Trace', 'Protection from Poison', 'Skywrite',
                'Spike Growth', 'Warding Wind',
            ],
            3: [
                'Call Lightning', 'Conjure Animals', 'Daylight', 'Dispel Magic',
                'Erupting Earth', 'Feign Death', 'Flame Arrows', 'Meld into Stone',
                'Plant Growth', 'Protection from Energy', 'Sleet Storm',
                'Speak with Plants', 'Tidal Wave', 'Wall of Water', 'Water Breathing',
                'Water Walk', 'Wind Wall',
            ],
            4: [
                'Blight', 'Charm Monster', 'Confusion', 'Conjure Minor Elementals',
                'Conjure Woodland Beings', 'Control Water', 'Dominate Beast',
                'Elemental Bane', 'Freedom of Movement', 'Giant Insect', 'Grasping Vine',
                'Guardian of Nature', 'Hallucinatory Terrain', 'Ice Storm',
                'Locate Creature', 'Polymorph', 'Stone Shape', 'Stoneskin',
                'Wall of Fire', 'Watery Sphere',
            ],
            5: [
                'Antilife Shell', 'Awaken', 'Commune with Nature', 'Cone of Cold',
                'Conjure Elemental', 'Contagion', 'Control Winds', 'Geas',
                'Greater Restoration', 'Insect Plague', 'Maelstrom', 'Mass Cure Wounds',
                'Planar Binding', 'Reincarnate', 'Scrying', 'Tree Stride', 'Wall of Stone',
                'Wrath of Nature',
            ],
        },
    },

    // SORCERER (CHA, known, с 1-го уровня)
    Sorcerer: {
        ability: 'cha',
        casterType: 'known',
        startsAtClassLevel: 1,
        spellsByLevel: {
            0: [
                'Acid Splash', 'Blade Ward', 'Chill Touch', 'Control Flames',
                'Create Bonfire', 'Dancing Lights', 'Fire Bolt', 'Friends', 'Frostbite',
                'Gust', 'Infestation', 'Light', 'Mage Hand', 'Mending', 'Message',
                'Mind Sliver', 'Minor Illusion', 'Mold Earth', 'Poison Spray',
                'Prestidigitation', 'Ray of Frost', 'Shape Water', 'Shocking Grasp',
                'Sword Burst', 'Thunderclap', 'True Strike',
            ],
            1: [
                'Absorb Elements', 'Burning Hands', 'Catapult', 'Chaos Bolt',
                'Charm Person', 'Chromatic Orb', 'Color Spray', 'Comprehend Languages',
                'Detect Magic', 'Disguise Self', 'Earth Tremor', 'Expeditious Retreat',
                'False Life', 'Feather Fall', 'Fog Cloud', 'Ice Knife', 'Jump',
                'Mage Armor', 'Magic Missile', 'Ray of Sickness', 'Shield',
                'Silent Image', 'Sleep', 'Thunderwave', 'Witch Bolt',
            ],
            2: [
                "Aganazzar's Scorcher", 'Alter Self', 'Blindness/Deafness', 'Blur',
                'Cloud of Daggers', 'Crown of Madness', 'Darkness', 'Darkvision',
                'Detect Thoughts', "Dragon's Breath", 'Dust Devil', 'Earthbind',
                'Enhance Ability', 'Enlarge/Reduce', 'Flame Blade', 'Flaming Sphere',
                'Gust of Wind', 'Hold Person', 'Invisibility', 'Kinetic Jaunt', 'Knock',
                'Levitate', 'Magic Weapon', "Maximilian's Earthen Grasp", 'Mirror Image',
                'Misty Step', 'Phantasmal Force', 'Pyrotechnics', 'Scorching Ray',
                'See Invisibility', 'Shadow Blade', 'Shatter',
                "Snilloc's Snowball Swarm", 'Spider Climb', 'Suggestion', 'Web',
                'Warding Wind',
            ],
            3: [
                'Blink', 'Catnap', 'Clairvoyance', 'Counterspell', 'Daylight',
                'Dispel Magic', 'Enemies Abound', 'Erupting Earth', 'Fear', 'Fireball',
                'Flame Arrows', 'Fly', 'Gaseous Form', 'Haste', 'Hypnotic Pattern',
                'Intellect Fortress', 'Lightning Bolt', 'Major Image',
                "Melf's Minute Meteors", 'Protection from Energy', 'Sleet Storm', 'Slow',
                'Stinking Cloud', 'Thunder Step', 'Tongues', 'Vampiric Touch',
                'Wall of Water', 'Water Breathing', 'Water Walk',
            ],
            4: [
                'Banishment', 'Blight', 'Charm Monster', 'Confusion', 'Dimension Door',
                'Dominate Beast', 'Fire Shield', 'Greater Invisibility', 'Ice Storm',
                'Polymorph', 'Sickening Radiance', 'Stoneskin', 'Storm Sphere',
                'Vitriolic Sphere', 'Wall of Fire', 'Watery Sphere',
            ],
            5: [
                'Animate Objects', "Bigby's Hand", 'Cloudkill', 'Cone of Cold',
                'Control Winds', 'Creation', 'Dominate Person', 'Enervation',
                'Far Step', 'Hold Monster', 'Immolation', 'Insect Plague', 'Seeming',
                'Skill Empowerment', 'Synaptic Static', 'Telekinesis', 'Wall of Light',
                'Wall of Stone',
            ],
        },
    },

    // WARLOCK (CHA, known, Pact Magic, с 1-го уровня)
    Warlock: {
        ability: 'cha',
        casterType: 'known',
        startsAtClassLevel: 1,
        spellsByLevel: {
            0: [
                'Blade Ward', 'Chill Touch', 'Create Bonfire', 'Eldritch Blast',
                'Friends', 'Frostbite', 'Green-Flame Blade', 'Infestation',
                'Lightning Lure', 'Magic Stone', 'Mage Hand', 'Minor Illusion',
                'Poison Spray', 'Prestidigitation', 'Sword Burst', 'Thunderclap',
                'Toll the Dead', 'True Strike',
            ],
            1: [
                'Arms of Hadar', 'Cause Fear', 'Charm Person', 'Comprehend Languages',
                'Expeditious Retreat', 'Hellish Rebuke', 'Hex', 'Illusory Script',
                'Protection from Evil and Good', 'Unseen Servant', 'Witch Bolt',
            ],
            2: [
                'Cloud of Daggers', 'Crown of Madness', 'Darkness', 'Earthbind',
                'Enthrall', 'Hold Person', 'Invisibility', 'Mind Spike', 'Mirror Image',
                'Misty Step', 'Ray of Enfeeblement', 'Shadow Blade', 'Shatter',
                'Spider Climb', 'Suggestion',
            ],
            3: [
                'Counterspell', 'Dispel Magic', 'Enemies Abound', 'Fear', 'Fly',
                'Gaseous Form', 'Hunger of Hadar', 'Hypnotic Pattern', 'Magic Circle',
                'Major Image', 'Remove Curse', 'Summon Fey', 'Summon Lesser Demons',
                'Summon Shadowspawn', 'Summon Undead', 'Thunder Step', 'Tongues',
                'Vampiric Touch',
            ],
            4: [
                'Banishment', 'Blight', 'Charm Monster', 'Dimension Door',
                'Elemental Bane', 'Hallucinatory Terrain', 'Sickening Radiance',
                'Summon Aberration', 'Summon Greater Demon',
            ],
            5: [
                'Cloudkill', 'Danse Macabre', 'Enervation', 'Far Step', 'Hold Monster',
                'Infernal Calling', 'Negative Energy Flood', 'Scrying',
                'Synaptic Static', 'Teleportation Circle', 'Wall of Light',
            ],
        },
    },

    // WIZARD (INT, prepared, с 1-го уровня)
    Wizard: {
        ability: 'int',
        casterType: 'prepared',
        startsAtClassLevel: 1,
        spellsByLevel: {
            0: [
                'Acid Splash', 'Blade Ward', 'Chill Touch', 'Control Flames',
                'Create Bonfire', 'Dancing Lights', 'Fire Bolt', 'Friends', 'Frostbite',
                'Gust', 'Infestation', 'Light', 'Mage Hand', 'Mending', 'Message',
                'Mind Sliver', 'Minor Illusion', 'Mold Earth', 'Poison Spray',
                'Prestidigitation', 'Ray of Frost', 'Shape Water', 'Shocking Grasp',
                'Sword Burst', 'Thunderclap', 'Toll the Dead', 'True Strike',
            ],
            1: [
                'Absorb Elements', 'Alarm', 'Burning Hands', 'Catapult', 'Cause Fear',
                'Charm Person', 'Chromatic Orb', 'Color Spray', 'Comprehend Languages',
                'Detect Magic', 'Disguise Self', 'Earth Tremor', 'Expeditious Retreat',
                'False Life', 'Feather Fall', 'Find Familiar', 'Fog Cloud', 'Grease',
                'Ice Knife', 'Identify', 'Illusory Script', 'Jump', 'Longstrider',
                'Mage Armor', 'Magic Missile', 'Protection from Evil and Good',
                'Ray of Sickness', 'Shield', 'Silent Image', 'Sleep', 'Snare',
                "Tasha's Caustic Brew", "Tasha's Hideous Laughter",
                "Tenser's Floating Disk", 'Thunderwave', 'Unseen Servant', 'Witch Bolt',
            ],
            2: [
                "Aganazzar's Scorcher", 'Alter Self', 'Arcane Lock', 'Augury',
                'Blindness/Deafness', 'Blur', 'Cloud of Daggers', 'Continual Flame',
                'Crown of Madness', 'Darkness', 'Darkvision', 'Detect Thoughts',
                "Dragon's Breath", 'Dust Devil', 'Earthbind', 'Enhance Ability',
                'Enlarge/Reduce', 'Flaming Sphere', 'Gentle Repose', 'Gust of Wind',
                'Hold Person', 'Invisibility', 'Kinetic Jaunt', 'Knock', 'Levitate',
                'Locate Object', 'Magic Mouth', 'Magic Weapon', "Melf's Acid Arrow",
                'Mirror Image', 'Misty Step', "Nystul's Magic Aura", 'Phantasmal Force',
                'Pyrotechnics', 'Ray of Enfeeblement', "Rime's Binding Ice",
                'Rope Trick', 'Scorching Ray', 'See Invisibility', 'Shadow Blade',
                'Skywrite', "Snilloc's Snowball Swarm", 'Spider Climb', 'Suggestion',
                "Tasha's Mind Whip", 'Web',
            ],
            3: [
                'Animate Dead', 'Bestow Curse', 'Blink', 'Clairvoyance', 'Counterspell',
                'Dispel Magic', 'Enemies Abound', 'Erupting Earth', 'Fear', 'Feign Death',
                'Fireball', 'Flame Arrows', 'Fly', 'Gaseous Form', 'Glyph of Warding',
                'Haste', 'Hypnotic Pattern', 'Intellect Fortress', "Leomund's Tiny Hut",
                'Life Transference', 'Lightning Bolt', 'Magic Circle', 'Major Image',
                "Melf's Minute Meteors", 'Nondetection', 'Phantom Steed',
                'Protection from Energy', 'Remove Curse', 'Sending', 'Sleet Storm',
                'Slow', 'Speak with Dead', 'Stinking Cloud', 'Summon Fey',
                'Summon Lesser Demons', 'Summon Shadowspawn', 'Summon Undead',
                'Thunder Step', 'Tidal Wave', 'Tiny Servant', 'Tongues',
                'Vampiric Touch', 'Wall of Sand', 'Wall of Water', 'Water Breathing',
            ],
            4: [
                'Arcane Eye', 'Banishment', 'Blight', 'Charm Monster', 'Confusion',
                'Conjure Minor Elementals', 'Control Water', 'Dimension Door',
                'Divination', 'Elemental Bane', "Evard's Black Tentacles", 'Fabricate',
                'Fire Shield', 'Greater Invisibility', 'Hallucinatory Terrain',
                'Ice Storm', "Leomund's Secret Chest", 'Locate Creature',
                "Mordenkainen's Faithful Hound", "Mordenkainen's Private Sanctum",
                "Otiluke's Resilient Sphere", 'Phantasmal Killer', 'Polymorph',
                'Sickening Radiance', 'Stone Shape', 'Stoneskin', 'Storm Sphere',
                'Summon Aberration', 'Summon Construct', 'Summon Elemental',
                'Vitriolic Sphere', 'Wall of Fire', 'Watery Sphere',
            ],
            5: [
                'Animate Objects', "Bigby's Hand", 'Cloudkill', 'Cone of Cold',
                'Conjure Elemental', 'Contact Other Plane', 'Control Winds', 'Creation',
                'Danse Macabre', 'Dawn', 'Dominate Person', 'Dream', 'Enervation',
                'Far Step', 'Geas', 'Hold Monster', 'Immolation', 'Legend Lore',
                'Mislead', 'Modify Memory', 'Negative Energy Flood', 'Passwall',
                'Planar Binding', "Rary's Telepathic Bond", 'Scrying', 'Seeming',
                'Skill Empowerment', 'Steel Wind Strike', 'Synaptic Static',
                'Telekinesis', 'Teleportation Circle', 'Transmute Rock', 'Wall of Force',
                'Wall of Light', 'Wall of Stone',
            ],
        },
    },

    // PALADIN (CHA, prepared, с 1-го уровня СПИСКА = 2-го уровня класса)
    Paladin: {
        ability: 'cha',
        casterType: 'prepared',
        startsAtClassLevel: 2,
        spellsByLevel: {
            1: [
                'Bless', 'Command', 'Compelled Duel', 'Cure Wounds',
                'Detect Evil and Good', 'Detect Magic', 'Detect Poison and Disease',
                'Divine Favor', 'Heroism', 'Protection from Evil and Good',
                'Purify Food and Drink', 'Searing Smite', 'Shield of Faith',
                'Thunderous Smite', 'Wrathful Smite',
            ],
            2: [
                'Aid', 'Branding Smite', 'Find Steed', 'Lesser Restoration',
                'Locate Object', 'Magic Weapon', 'Protection from Poison',
                'Zone of Truth',
            ],
            3: [
                'Aura of Vitality', 'Blinding Smite', 'Create Food and Water',
                "Crusader's Mantle", 'Daylight', 'Dispel Magic', 'Elemental Weapon',
                'Magic Circle', 'Remove Curse', 'Revivify',
            ],
            4: [
                'Aura of Life', 'Aura of Purity', 'Banishment', 'Death Ward',
                'Locate Creature', 'Staggering Smite',
            ],
            5: [
                'Banishing Smite', 'Circle of Power', 'Destructive Wave',
                'Dispel Evil and Good', 'Geas', 'Greater Restoration', 'Raise Dead',
                'Summon Celestial',
            ],
        },
    },

    // RANGER (WIS, known, с 1-го уровня СПИСКА = 2-го уровня класса)
    Ranger: {
        ability: 'wis',
        casterType: 'known',
        startsAtClassLevel: 2,
        spellsByLevel: {
            1: [
                'Absorb Elements', 'Alarm', 'Animal Friendship', 'Beast Bond',
                'Cure Wounds', 'Detect Magic', 'Detect Poison and Disease',
                'Ensnaring Strike', 'Fog Cloud', 'Goodberry', 'Hail of Thorns',
                "Hunter's Mark", 'Jump', 'Longstrider', 'Searing Smite', 'Snare',
                'Speak with Animals', 'Zephyr Strike',
            ],
            2: [
                'Aid', 'Animal Messenger', 'Barkskin', 'Beast Sense',
                'Cordon of Arrows', 'Darkvision', 'Enhance Ability', 'Find Traps',
                'Healing Spirit', 'Lesser Restoration', 'Locate Animals or Plants',
                'Locate Object', 'Magic Weapon', 'Pass without Trace',
                'Protection from Poison', 'Silence', 'Spike Growth', 'Summon Beast',
            ],
            3: [
                'Conjure Animals', 'Conjure Barrage', 'Daylight', 'Elemental Weapon',
                'Flame Arrows', 'Lightning Arrow', 'Meld into Stone', 'Nondetection',
                'Plant Growth', 'Protection from Energy', 'Revivify',
                'Speak with Plants', 'Water Breathing', 'Water Walk', 'Wind Wall',
            ],
            4: [
                'Conjure Woodland Beings', 'Dominate Beast', 'Freedom of Movement',
                'Grasping Vine', 'Guardian of Nature', 'Locate Creature', 'Stoneskin',
                'Summon Elemental',
            ],
            5: [
                'Commune with Nature', 'Conjure Volley', 'Greater Restoration',
                'Steel Wind Strike', 'Swift Quiver', 'Tree Stride', 'Wrath of Nature',
            ],
        },
    },

    // FIGHTER: ELDRITCH KNIGHT (INT, known, треть-кастер, с 3-го уровня класса)
    //   — берёт из списка Wizard (в основном Abjuration + Evocation)
    //   — на 3/8/14/20 уровнях может взять 1 заклинание из любой школы
    // Здесь указан полный допустимый набор (все школы включены) —
    // ограничение "2 школы" можно ввести позже как отдельную фичу подкласса.
    'Fighter:Eldritch Knight': {
        ability: 'int',
        casterType: 'known',
        startsAtClassLevel: 3,
        spellsByLevel: {
            // Кантрипы EK берёт из списка Wizard (обычно 2 штуки)
            0: [
                'Acid Splash', 'Blade Ward', 'Chill Touch', 'Control Flames',
                'Create Bonfire', 'Dancing Lights', 'Fire Bolt', 'Friends', 'Frostbite',
                'Gust', 'Infestation', 'Light', 'Mage Hand', 'Mending', 'Message',
                'Mind Sliver', 'Minor Illusion', 'Mold Earth', 'Poison Spray',
                'Prestidigitation', 'Ray of Frost', 'Shape Water', 'Shocking Grasp',
                'Sword Burst', 'Thunderclap', 'Toll the Dead', 'True Strike',
            ],
            1: [
                'Absorb Elements', 'Alarm', 'Burning Hands', 'Catapult', 'Cause Fear',
                'Charm Person', 'Chromatic Orb', 'Color Spray', 'Comprehend Languages',
                'Detect Magic', 'Disguise Self', 'Earth Tremor', 'Expeditious Retreat',
                'False Life', 'Feather Fall', 'Find Familiar', 'Fog Cloud', 'Grease',
                'Ice Knife', 'Identify', 'Illusory Script', 'Jump', 'Longstrider',
                'Mage Armor', 'Magic Missile', 'Protection from Evil and Good',
                'Ray of Sickness', 'Shield', 'Silent Image', 'Sleep', 'Snare',
                "Tasha's Caustic Brew", "Tasha's Hideous Laughter",
                "Tenser's Floating Disk", 'Thunderwave', 'Unseen Servant', 'Witch Bolt',
            ],
            2: [
                "Aganazzar's Scorcher", 'Alter Self', 'Arcane Lock', 'Blindness/Deafness',
                'Blur', 'Cloud of Daggers', 'Continual Flame', 'Crown of Madness',
                'Darkness', 'Darkvision', 'Detect Thoughts', "Dragon's Breath",
                'Dust Devil', 'Earthbind', 'Enhance Ability', 'Enlarge/Reduce',
                'Flaming Sphere', 'Gust of Wind', 'Hold Person', 'Invisibility',
                'Kinetic Jaunt', 'Knock', 'Levitate', 'Magic Mouth', 'Magic Weapon',
                "Melf's Acid Arrow", 'Mirror Image', 'Misty Step', 'Phantasmal Force',
                'Pyrotechnics', 'Ray of Enfeeblement', "Rime's Binding Ice",
                'Rope Trick', 'Scorching Ray', 'See Invisibility', 'Shadow Blade',
                'Shatter', "Snilloc's Snowball Swarm", 'Spider Climb', 'Suggestion',
                "Tasha's Mind Whip", 'Web',
            ],
            3: [
                'Animate Dead', 'Bestow Curse', 'Blink', 'Clairvoyance', 'Counterspell',
                'Dispel Magic', 'Fear', 'Feign Death', 'Fireball', 'Fly',
                'Gaseous Form', 'Glyph of Warding', 'Haste', 'Hypnotic Pattern',
                'Intellect Fortress', 'Lightning Bolt', 'Magic Circle', 'Major Image',
                'Nondetection', 'Phantom Steed', 'Protection from Energy', 'Remove Curse',
                'Sending', 'Sleet Storm', 'Slow', 'Stinking Cloud', 'Tongues',
                'Vampiric Touch', 'Water Breathing',
            ],
            4: [
                'Arcane Eye', 'Banishment', 'Blight', 'Charm Monster', 'Confusion',
                'Conjure Minor Elementals', 'Control Water', 'Dimension Door',
                'Divination', 'Elemental Bane', "Evard's Black Tentacles", 'Fabricate',
                'Fire Shield', 'Greater Invisibility', 'Hallucinatory Terrain',
                'Ice Storm', "Leomund's Secret Chest", 'Locate Creature',
                "Mordenkainen's Faithful Hound", "Mordenkainen's Private Sanctum",
                "Otiluke's Resilient Sphere", 'Phantasmal Killer', 'Polymorph',
                'Sickening Radiance', 'Stone Shape', 'Stoneskin', 'Storm Sphere',
                'Vitriolic Sphere', 'Wall of Fire', 'Watery Sphere',
            ],
        },
    },

    // ROGUE: ARCANE TRICKSTER (INT, known, треть-кастер, с 3-го уровня класса)
    //   — Mage Hand обязателен
    //   — берёт из списка Wizard (в основном Enchantment + Illusion)
    'Rogue:Arcane Trickster': {
        ability: 'int',
        casterType: 'known',
        startsAtClassLevel: 3,
        spellsByLevel: {
            0: [
                'Acid Splash', 'Blade Ward', 'Chill Touch', 'Control Flames',
                'Create Bonfire', 'Dancing Lights', 'Fire Bolt', 'Friends', 'Frostbite',
                'Gust', 'Infestation', 'Light', 'Mage Hand', 'Mending', 'Message',
                'Mind Sliver', 'Minor Illusion', 'Mold Earth', 'Poison Spray',
                'Prestidigitation', 'Ray of Frost', 'Shape Water', 'Shocking Grasp',
                'Sword Burst', 'Thunderclap', 'Toll the Dead', 'True Strike',
            ],
            1: [
                'Absorb Elements', 'Alarm', 'Burning Hands', 'Catapult', 'Cause Fear',
                'Charm Person', 'Chromatic Orb', 'Color Spray', 'Comprehend Languages',
                'Detect Magic', 'Disguise Self', 'Earth Tremor', 'Expeditious Retreat',
                'False Life', 'Feather Fall', 'Find Familiar', 'Fog Cloud', 'Grease',
                'Ice Knife', 'Identify', 'Illusory Script', 'Jump', 'Longstrider',
                'Mage Armor', 'Magic Missile', 'Protection from Evil and Good',
                'Ray of Sickness', 'Shield', 'Silent Image', 'Sleep', 'Snare',
                "Tasha's Caustic Brew", "Tasha's Hideous Laughter",
                "Tenser's Floating Disk", 'Thunderwave', 'Unseen Servant', 'Witch Bolt',
            ],
            2: [
                "Aganazzar's Scorcher", 'Alter Self', 'Arcane Lock', 'Blindness/Deafness',
                'Blur', 'Cloud of Daggers', 'Continual Flame', 'Crown of Madness',
                'Darkness', 'Darkvision', 'Detect Thoughts', "Dragon's Breath",
                'Dust Devil', 'Earthbind', 'Enhance Ability', 'Enlarge/Reduce',
                'Flaming Sphere', 'Gust of Wind', 'Hold Person', 'Invisibility',
                'Kinetic Jaunt', 'Knock', 'Levitate', 'Magic Mouth', 'Magic Weapon',
                "Melf's Acid Arrow", 'Mirror Image', 'Misty Step', 'Phantasmal Force',
                'Pyrotechnics', 'Ray of Enfeeblement', "Rime's Binding Ice",
                'Rope Trick', 'Scorching Ray', 'See Invisibility', 'Shadow Blade',
                'Shatter', "Snilloc's Snowball Swarm", 'Spider Climb', 'Suggestion',
                "Tasha's Mind Whip", 'Web',
            ],
            3: [
                'Animate Dead', 'Bestow Curse', 'Blink', 'Catnap', 'Clairvoyance',
                'Counterspell', 'Dispel Magic', 'Enemies Abound', 'Fear', 'Feign Death',
                'Fireball', 'Fly', 'Gaseous Form', 'Glyph of Warding', 'Haste',
                'Hypnotic Pattern', 'Intellect Fortress', 'Lightning Bolt',
                'Magic Circle', 'Major Image', "Melf's Minute Meteors", 'Nondetection',
                'Phantom Steed', 'Protection from Energy', 'Remove Curse', 'Sending',
                'Sleet Storm', 'Slow', 'Speak with Dead', 'Stinking Cloud', 'Tongues',
                'Vampiric Touch', 'Water Breathing',
            ],
            4: [
                'Arcane Eye', 'Banishment', 'Blight', 'Charm Monster', 'Confusion',
                'Conjure Minor Elementals', 'Control Water', 'Dimension Door',
                'Divination', 'Elemental Bane', "Evard's Black Tentacles", 'Fabricate',
                'Fire Shield', 'Greater Invisibility', 'Hallucinatory Terrain',
                'Ice Storm', "Leomund's Secret Chest", 'Locate Creature',
                "Mordenkainen's Faithful Hound", "Mordenkainen's Private Sanctum",
                "Otiluke's Resilient Sphere", 'Phantasmal Killer', 'Polymorph',
                'Sickening Radiance', 'Stone Shape', 'Stoneskin', 'Storm Sphere',
                'Vitriolic Sphere', 'Wall of Fire', 'Watery Sphere',
            ],
        },
    },
};