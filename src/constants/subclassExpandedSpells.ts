/**
 * «Expanded» списки подклассов.
 *
 * Эти заклинания НЕ добавляются автоматически в character.spells.
 * Они лишь расширяют список того, что персонаж МОЖЕТ выучить/подготовить
 * на level up.
 *
 * Формат:
 *   spellsByLevel: { [spellLevel]: ['Spell Name', ...] }
 *     — гейт по МАКСИМАЛЬНОМУ УРОВНЮ ЗАКЛИНАНИЙ, который персонаж может
 *       кастовать через этот класс на текущем уровне класса.
 *       Для Warlock'а это 1/2/3/4/5 при уровнях класса 1/3/5/7/9 — что
 *       автоматически совпадает с Pact Magic progression.
 *
 *   fromClass: 'Cleric'
 *     — весь список другого класса становится доступен (Divine Soul).
 *       Гейтится тем же maxSpellLevel, что и spellsByLevel.
 *
 * Покрытие в этом файле:
 *   - Warlock: все 5 патронов (PHB + XGE)
 *   - Sorcerer: Divine Soul (XGE)
 *
 * НЕ включены (требуют другого механизма):
 *   - Bard: College of Lore — «Additional Magical Secrets» (выбор с любого класса)
 *   - Warlock: Pact of the Tome — «Book of Ancient Secrets» (ритуалы с любого класса)
 */

export interface SubclassExpandedList {
    /** Заклинания по уровню заклинания. */
    spellsByLevel?: Record<number, string[]>;
    /** Пул другого класса (например, 'Cleric' для Divine Soul). */
    fromClass?: string;
}

export const SUBCLASS_EXPANDED_SPELLS: Record<
    string,
    Record<string, SubclassExpandedList>
> = {
    // WARLOCK PATRONS
    Warlock: {
        Archfey: {
            spellsByLevel: {
                1: ['Faerie Fire', 'Sleep'],
                2: ['Calm Emotions', 'Phantasmal Force'],
                3: ['Blink', 'Plant Growth'],
                4: ['Dominate Beast', 'Greater Invisibility'],
                5: ['Dominate Person', 'Seeming'],
            },
        },
        Fiend: {
            spellsByLevel: {
                1: ['Burning Hands', 'Command'],
                2: ['Blindness/Deafness', 'Scorching Ray'],
                3: ['Fireball', 'Stinking Cloud'],
                4: ['Fire Shield', 'Wall of Fire'],
                5: ['Flame Strike', 'Hallow'],
            },
        },
        'Great Old One': {
            spellsByLevel: {
                1: ['Dissonant Whispers', "Tasha's Hideous Laughter"],
                2: ['Detect Thoughts', 'Phantasmal Force'],
                3: ['Clairvoyance', 'Sending'],
                4: ['Dominate Beast', "Evard's Black Tentacles"],
                5: ['Dominate Person', 'Telekinesis'],
            },
        },
        Celestial: {
            spellsByLevel: {
                1: ['Cure Wounds', 'Guiding Bolt'],
                2: ['Flaming Sphere', 'Lesser Restoration'],
                3: ['Daylight', 'Revivify'],
                4: ['Guardian of Faith', 'Wall of Fire'],
                5: ['Flame Strike', 'Greater Restoration'],
            },
        },
        Hexblade: {
            spellsByLevel: {
                1: ['Shield', 'Wrathful Smite'],
                2: ['Blur', 'Branding Smite'],
                3: ['Blink', 'Elemental Weapon'],
                4: ['Phantasmal Killer', 'Staggering Smite'],
                5: ['Banishing Smite', 'Cone of Cold'],
            },
        },
    },

    // SORCERER — Divine Soul
    Sorcerer: {
        'Divine Soul': {
            // Divine Magic: «when your Spellcasting feature lets you learn
            // a sorcerer cantrip or a sorcerer spell of 1st level or higher,
            // you can choose the new spell from the cleric spell list…»
            fromClass: 'Cleric',
        },
    },
};