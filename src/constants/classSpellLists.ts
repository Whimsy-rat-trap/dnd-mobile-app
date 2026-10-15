/**
 * Единый source of truth для списков заклинаний каждого класса.
 *
 * Имена должны точно совпадать с `name` в `constants/spells`.
 * Если заклинания нет в ALL_SPELLS — оно будет проигнорировано фильтром,
 * но останется в списке (на случай, если добавят позже).
 *
 * Иерархия уровней:
 *   0 — cantrips
 *   1–9 — spell levels
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
    Artificer: {
        ability: 'int',
        casterType: 'prepared',
        startsAtClassLevel: 1,
        spellsByLevel: {
            0: [
                'Acid Splash',
                'Booming Blade',
                'Create Bonfire',
                'Dancing Lights',
                'Fire Bolt',
                'Frostbite',
                'Green-Flame Blade',
                'Guidance',
                'Light',
                'Lightning Lure',
                'Mage Hand',
                'Magic Stone',
                'Mending',
                'Message',
                'Poison Spray',
                'Prestidigitation',
                'Ray of Frost',
                'Resistance',
                'Shocking Grasp',
                'Sword Burst',
                'Thorn Whip',
                'Thunderclap',
                'True Strike',
            ],
            1: [
                'Absorb Elements',
                'Alarm',
                'Catapult',
                'Cure Wounds',
                'Detect Magic',
                'Disguise Self',
                'Expeditious Retreat',
                'Faerie Fire',
                'False Life',
                'Feather Fall',
                'Grease',
                'Heroism',
                'Identify',
                'Jump',
                'Longstrider',
                'Purify Food and Drink',
                'Sanctuary',
                'Snare',
                "Tasha's Caustic Brew",
            ],
            2: [
                'Aid',
                'Alter Self',
                'Arcane Lock',
                'Blur',
                'Continual Flame',
                'Darkvision',
                'Enhance Ability',
                'Enlarge/Reduce',
                'Heat Metal',
                'Homunculus Servant',
                'Invisibility',
                'Kinetic Jaunt',
                'Lesser Restoration',
                'Levitate',
                'Magic Mouth',
                'Magic Weapon',
                'Mirror Image',
                'Protection from Poison',
                'Pyrotechnics',
                'Rope Trick',
                'See Invisibility',
                'Skywrite',
                'Spider Climb',
                'Vortex Warp',
                'Web',
            ],
            3: [
                'Blink',
                'Catnap',
                'Create Food and Water',
                'Dispel Magic',
                'Elemental Weapon',
                'Flame Arrows',
                'Fly',
                'Glyph of Warding',
                'Haste',
                'Intellect Fortress',
                'Protection from Energy',
                'Revivify',
                'Tiny Servant',
                'Water Breathing',
                'Water Walk',
            ],
            4: [
                'Arcane Eye',
                'Elemental Bane',
                'Fabricate',
                'Freedom of Movement',
                "Leomund's Secret Chest",
                "Mordenkainen's Faithful Hound",
                "Mordenkainen's Private Sanctum",
                "Otiluke's Resilient Sphere",
                'Stone Shape',
                'Stoneskin',
                'Summon Construct',
            ],
            5: [
                'Animate Objects',
                "Bigby's Hand",
                'Creation',
                'Greater Restoration',
                'Skill Empowerment',
                'Transmute Rock',
                'Wall of Stone',
            ],
        },
    },

    // Bard, Cleric, Druid, Paladin, Ranger, Sorcerer, Warlock, Wizard, EK/AT
    // будут добавлены в следующих итерациях
};