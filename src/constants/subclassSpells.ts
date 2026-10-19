/**
 * «Всегда подготовленные» заклинания подклассов.
 *
 * Структура: [className][subclassName][classLevel] = ['Spell Name', ...].
 *
 * - Эти заклинания НЕ входят в лимит Prepared (правило 5e).
 * - Они всегда «known» и «prepared», как только персонаж достигает
 *   соответствующего уровня КЛАССА.
 * - Ключ в [classLevel] — это уровень класса (например 5 для Fireball
 *   у Light Domain Cleric), а не уровень ячейки.
 *
 * Покрытие:
 *   - Cleric: все 9 доменов
 *   - Paladin: все 6 клятв (включая Oathbreaker)
 *
 * НЕ включены (требуют отдельной модели):
 *   - Druid: Circle of the Land (зависит от выбора местности — отдельный параметр)
 *   - Warlock: Patrons (это «expanded spell list», а не always prepared)
 *   - Sorcerer: Divine Soul (расширенный список Cleric, а не фикс. набор)
 *   - Bard: Additional Magical Secrets (College of Lore) — выбор игрока
 */

export const SUBCLASS_ALWAYS_PREPARED_SPELLS: Record<
    string,
    Record<string, Record<number, string[]>>
> = {
    // CLERIC DOMAINS
    Cleric: {
        Life: {
            1: ['Bless', 'Cure Wounds'],
            3: ['Lesser Restoration', 'Spiritual Weapon'],
            5: ['Beacon of Hope', 'Revivify'],
            7: ['Death Ward', 'Guardian of Faith'],
            9: ['Mass Cure Wounds', 'Raise Dead'],
        },
        Light: {
            1: ['Burning Hands', 'Faerie Fire'],
            3: ['Flaming Sphere', 'Scorching Ray'],
            5: ['Daylight', 'Fireball'],
            7: ['Guardian of Faith', 'Wall of Fire'],
            9: ['Flame Strike', 'Scrying'],
        },
        Knowledge: {
            1: ['Command', 'Identify'],
            3: ['Augury', 'Suggestion'],
            5: ['Nondetection', 'Speak with Dead'],
            7: ['Arcane Eye', 'Confusion'],
            9: ['Legend Lore', 'Scrying'],
        },
        Nature: {
            1: ['Animal Friendship', 'Speak with Animals'],
            3: ['Barkskin', 'Spike Growth'],
            5: ['Plant Growth', 'Wind Wall'],
            7: ['Dominate Beast', 'Grasping Vine'],
            9: ['Insect Plague', 'Tree Stride'],
        },
        Tempest: {
            1: ['Fog Cloud', 'Thunderwave'],
            3: ['Gust of Wind', 'Shatter'],
            5: ['Call Lightning', 'Sleet Storm'],
            7: ['Control Water', 'Ice Storm'],
            9: ['Destructive Wave', 'Insect Plague'],
        },
        Trickery: {
            1: ['Charm Person', 'Disguise Self'],
            3: ['Mirror Image', 'Pass without Trace'],
            5: ['Blink', 'Dispel Magic'],
            7: ['Dimension Door', 'Polymorph'],
            9: ['Dominate Person', 'Modify Memory'],
        },
        War: {
            1: ['Divine Favor', 'Shield of Faith'],
            3: ['Magic Weapon', 'Spiritual Weapon'],
            5: ["Crusader's Mantle", 'Spirit Guardians'],
            7: ['Freedom of Movement', 'Stoneskin'],
            9: ['Flame Strike', 'Hold Monster'],
        },
        Forge: {
            1: ['Identify', 'Searing Smite'],
            3: ['Heat Metal', 'Magic Weapon'],
            5: ['Elemental Weapon', 'Protection from Energy'],
            7: ['Fabricate', 'Wall of Fire'],
            9: ['Animate Objects', 'Creation'],
        },
        Grave: {
            1: ['Bane', 'False Life'],
            3: ['Gentle Repose', 'Ray of Enfeeblement'],
            5: ['Revivify', 'Vampiric Touch'],
            7: ['Blight', 'Death Ward'],
            9: ['Antilife Shell', 'Raise Dead'],
        },
    },

    // PALADIN OATHS
    Paladin: {
        Devotion: {
            3: ['Protection from Evil and Good', 'Sanctuary'],
            5: ['Lesser Restoration', 'Zone of Truth'],
            9: ['Beacon of Hope', 'Dispel Magic'],
            13: ['Freedom of Movement', 'Guardian of Faith'],
            17: ['Commune', 'Flame Strike'],
        },
        Ancients: {
            3: ['Ensnaring Strike', 'Speak with Animals'],
            5: ['Moonbeam', 'Misty Step'],
            9: ['Plant Growth', 'Protection from Energy'],
            13: ['Ice Storm', 'Stoneskin'],
            17: ['Commune with Nature', 'Tree Stride'],
        },
        Vengeance: {
            3: ['Bane', "Hunter's Mark"],
            5: ['Hold Person', 'Misty Step'],
            9: ['Haste', 'Protection from Energy'],
            13: ['Banishment', 'Dimension Door'],
            17: ['Hold Monster', 'Scrying'],
        },
        Conquest: {
            3: ['Armor of Agathys', 'Command'],
            5: ['Hold Person', 'Spiritual Weapon'],
            9: ['Bestow Curse', 'Fear'],
            13: ['Dominate Beast', 'Stoneskin'],
            17: ['Cloudkill', 'Dominate Person'],
        },
        Redemption: {
            3: ['Sanctuary', 'Sleep'],
            5: ['Calm Emotions', 'Hold Person'],
            9: ['Counterspell', 'Hypnotic Pattern'],
            13: ["Otiluke's Resilient Sphere", 'Stoneskin'],
            17: ['Hold Monster', 'Wall of Force'],
        },
        Oathbreaker: {
            3: ['Hellish Rebuke', 'Inflict Wounds'],
            5: ['Crown of Madness', 'Darkness'],
            9: ['Animate Dead', 'Bestow Curse'],
            13: ['Blight', 'Confusion'],
            17: ['Contagion', 'Dominate Person'],
        },
    },
};