/**
 * Имена заклинаний, имеющих тег Ritual по правилам 5e.
 *
 * В данных (cantrips.ts, level1.ts, ...) поле `isRitual` сейчас не заполнено —
 * утилиты Book of Ancient Secrets проверяют `spell.isRitual || RITUAL_SPELL_NAMES`,
 * чтобы работать корректно без ручной правки всех файлов.
 *
 * Когда решишь заполнить `isRitual: true` в данных — этот файл можно оставить
 * как fallback или удалить.
 */

export const RITUAL_SPELL_NAMES = new Set<string>([
    // Level 1
    'Alarm',
    'Ceremony',
    'Comprehend Languages',
    'Detect Magic',
    'Detect Poison and Disease',
    'Find Familiar',
    'Identify',
    'Illusory Script',
    'Purify Food and Drink',
    'Speak with Animals',
    "Tenser's Floating Disk",
    'Unseen Servant',

    // Level 2
    'Animal Messenger',
    'Augury',
    'Beast Sense',
    'Continual Flame',
    'Find Traps',
    'Gentle Repose',
    'Locate Animals or Plants',
    'Magic Mouth',
    'Silence',
    'Skywrite',
    'Warding Bond',

    // Level 3
    'Catnap',
    'Clairvoyance',
    'Feign Death',
    "Leomund's Tiny Hut",
    'Meld into Stone',
    'Phantom Steed',
    'Sending',
    'Speak with Dead',
    'Speak with Plants',
    'Water Breathing',
    'Water Walk',

    // Level 4
    'Divination',
    "Mordenkainen's Faithful Hound",
    "Mordenkainen's Private Sanctum",

    // Level 5
    'Commune',
    'Commune with Nature',
    'Contact Other Plane',
    "Rary's Telepathic Bond",
]);

export function isRitualSpell(spell: { name: string; isRitual?: boolean }): boolean {
    if (spell.isRitual) return true;
    return RITUAL_SPELL_NAMES.has(spell.name);
}