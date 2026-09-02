import { InventoryItem } from '../types/Character';
import { RACE_FEATURES, Feature } from '../constants/raceFeatures';
import { SUBRACE_DETAILS } from '../constants/subraceDetails';
import { RACE_DETAILS } from '../constants/raceDetails';
import { RACIAL_BONUSES } from '../constants/racialBonuses';

export interface RacialEffect {
    name: string;
    description: string;
    type: 'darkvision' | 'speed' | 'size' | 'resistance' | 'immunity' | 'language' |
        'skill' | 'tool' | 'feat' | 'feature' | 'other';
    value?: string | number;
    source?: string;
}

function getAllFeatures(race: string, subrace?: string): Feature[] {
    const features: Feature[] = [];

    if (RACE_FEATURES[race]) {
        features.push(...RACE_FEATURES[race]);
    }

    if (subrace && SUBRACE_DETAILS[subrace]) {
        features.push(...SUBRACE_DETAILS[subrace].features);
    }

    return features;
}

function isNaturalWeapon(feature: Feature): boolean {
    const lowerName = feature.name.toLowerCase();
    const lowerDesc = feature.description.toLowerCase();
    const keywords = ['claw', 'claws', 'bite', 'talon', 'talons', 'fang', 'fangs', 'natural weapon', 'natural weapons', 'unarmed strike'];
    const phrases = ['are natural weapons', 'is a natural weapon', 'you can use to make unarmed strikes',
        'your fanged maw is a natural weapon', 'your claws are natural weapons', 'your talons are natural weapons'];
    return keywords.some(kw => lowerName.includes(kw) || lowerDesc.includes(kw)) ||
        phrases.some(phrase => lowerDesc.includes(phrase));
}

/**
 * Извлекает название оружия из фичи
 */
function extractWeaponName(feature: Feature): string {
    const name = feature.name;

    // Если в названии уже есть понятное имя оружия (например, "Claws", "Bite")
    if (name.match(/claws?|bite|talons?|fangs?/i)) {
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    // Пытаемся извлечь из описания, если название неочевидно
    const lowerDesc = feature.description.toLowerCase();
    const match = lowerDesc.match(/your (\w+) (?:are|is) a? natural weapon/i);
    if (match) return match[1].charAt(0).toUpperCase() + match[1].slice(1);
    return 'Natural Weapon';
}

/**
 * Возвращает массив natural weapons (в формате Omit<InventoryItem, 'id'>) для данной расы и подрасы
 */
export function getNaturalWeapons(race: string, subrace?: string): Omit<InventoryItem, 'id'>[] {
    const features = getAllFeatures(race, subrace);
    const weapons: Omit<InventoryItem, 'id'>[] = [];

    features.forEach(feature => {
        if (isNaturalWeapon(feature)) {
            const weaponName = extractWeaponName(feature);
            // Проверяем, не добавлено ли уже такое оружие (чтобы избежать дубликатов)
            if (!weapons.some(w => w.name === weaponName)) {
                weapons.push({
                    name: weaponName,
                    type: 'natural weapon',
                    rarity: 'common',
                    description: feature.description,
                    equipped: false,
                });
            }
        }
    });
    return weapons;
}

export function getAllRacialFeatures(race: string, subrace?: string): Feature[] {
    return getAllFeatures(race, subrace);
}

/**
 * Проверяет, есть ли у расы/подрасы resistance или immunity (для отображения в тегах)
 */
export function getResistancesAndImmunities(race: string, subrace?: string): { resistance: string[]; immunity: string[] } {
    const features = getAllFeatures(race, subrace);
    const resistances: string[] = [];
    const immunities: string[] = [];
    features.forEach(feature => {
        if (feature.resistance) {
            const resists = feature.resistance.split(',').map(r => r.trim());
            resists.forEach(r => { if (r && !resistances.includes(r)) resistances.push(r); });
        }
        if (feature.immunity) {
            const immunes = feature.immunity.split(',').map(i => i.trim());
            immunes.forEach(i => { if (i && !immunities.includes(i)) immunities.push(i); });
        }
    });
    return { resistance: resistances, immunity: immunities };
}

// ФУНКЦИИ ДЛЯ ПАССИВНЫХ ЭФФЕКТОВ

export function getRacialEffects(race: string, subrace?: string): RacialEffect[] {
    const effects: RacialEffect[] = [];
    const features = getAllFeatures(race, subrace);
    const sourceLabel = (subrace && SUBRACE_DETAILS[subrace]) ? 'subrace' : 'race';

    // 1. Базовые: размер, тип, скорость (из RACE_DETAILS и фич)
    const details = RACE_DETAILS[race];
    if (details) {
        let size = 'Medium';
        if (typeof details.size === 'string') size = details.size;
        else if (details.size.options) size = details.size.default || details.size.options[0] || 'Medium';
        effects.push({
            name: 'Size',
            description: `Your size is ${size}.`,
            type: 'size',
            value: size,
            source: 'race',
        });
        effects.push({
            name: 'Creature Type',
            description: `Your creature type is ${details.creatureType}.`,
            type: 'other',
            value: details.creatureType,
            source: 'race',
        });
    }

    // Скорость (по умолчанию 30)
    let speed = 30;
    features.forEach(f => {
        const lowerName = f.name.toLowerCase();
        const lowerDesc = f.description.toLowerCase();
        if (lowerName.includes('fleet of foot') || lowerName.includes('speed') || lowerDesc.includes('base walking speed')) {
            const match = f.description.match(/(\d+)\s*feet/);
            if (match) speed = parseInt(match[1], 10);
        }
        if (lowerName.includes('flight') || lowerName.includes('flying')) {
            const match = f.description.match(/(\d+)\s*feet/);
            if (match) {
                effects.push({
                    name: 'Flight',
                    description: `You have a flying speed of ${match[1]} feet.`,
                    type: 'speed',
                    value: parseInt(match[1], 10),
                    source: sourceLabel,
                });
            }
        }
    });
    effects.push({
        name: 'Speed',
        description: `Your base walking speed is ${speed} feet.`,
        type: 'speed',
        value: speed,
        source: 'race',
    });

    // 2. Языки (базовые для расы)
    // В кавычках ключи с дефисом
    const racialLanguages: Record<string, string[]> = {
        Dwarf: ['Common', 'Dwarvish'],
        Elf: ['Common', 'Elvish'],
        Gnome: ['Common', 'Gnomish'],
        Halfling: ['Common', 'Halfling'],
        Human: ['Common'],
        Dragonborn: ['Common', 'Draconic'],
        Tiefling: ['Common', 'Infernal'],
        'Half-Elf': ['Common', 'Elvish'],
        'Half-Orc': ['Common', 'Orc'],
        Aarakocra: ['Common', 'Aarakocra'],
        Aasimar: ['Common', 'Celestial'],
        Firbolg: ['Common', 'Elvish', 'Giant'],
        Goliath: ['Common', 'Giant'],
        Kenku: ['Common'],
        Lizardfolk: ['Common', 'Draconic'],
        Tabaxi: ['Common'],
        Tortle: ['Common'],
    };
    let langs = racialLanguages[race] || ['Common'];
    if (subrace) {
        if (subrace === 'Dark Elf (Drow)') langs.push('Undercommon');
        if (subrace === 'High Elf') langs.push('Elvish'); // уже есть
        // можно добавить другие
    }
    effects.push({
        name: 'Languages',
        description: `You can speak, read, and write: ${langs.join(', ')}.`,
        type: 'language',
        value: langs.join(', '),
        source: 'race',
    });

    // 3. Обрабатываем все фичи для выделения эффектов
    features.forEach(feature => {
        const lowerName = feature.name.toLowerCase();
        const lowerDesc = feature.description.toLowerCase();

        // Darkvision
        if (lowerName.includes('darkvision') || lowerDesc.includes('darkvision')) {
            const match = feature.description.match(/(\d+)\s*feet/);
            const range = match ? `${match[1]} ft` : '60 ft';
            effects.push({
                name: 'Darkvision',
                description: `You can see in dim light within ${range} of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness.`,
                type: 'darkvision',
                value: range,
                source: sourceLabel,
            });
        }

        // Resistance (если явно указано в feature.resistance)
        if (feature.resistance) {
            // Может быть строка с перечислением через запятую
            const resists = feature.resistance.split(',').map(r => r.trim());
            resists.forEach(r => {
                effects.push({
                    name: `Resistance: ${r}`,
                    description: `You have resistance to ${r} damage.`,
                    type: 'resistance',
                    value: r,
                    source: sourceLabel,
                });
            });
        }

        // Immunity (если явно указано в feature.immunity)
        if (feature.immunity) {
            const immunes = feature.immunity.split(',').map(i => i.trim());
            immunes.forEach(i => {
                effects.push({
                    name: `Immunity: ${i}`,
                    description: `You are immune to ${i} damage.`,
                    type: 'immunity',
                    value: i,
                    source: sourceLabel,
                });
            });
        }

        // Другие известные пассивные способности
        const knownPassives: { [key: string]: string } = {
            'fey ancestry': 'You have advantage on saving throws against being charmed, and magic can\'t put you to sleep.',
            'dwarven resilience': 'You have advantage on saving throws against poison, and you have resistance against poison damage.',
            'gnome cunning': 'You have advantage on all Intelligence, Wisdom, and Charisma saving throws against magic.',
            'lucky': 'When you roll a 1 on the d20 for an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll.',
            'brave': 'You have advantage on saving throws against being frightened.',
            'halfling nimbleness': 'You can move through the space of any creature that is of a size larger than yours.',
            'naturally stealthy': 'You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you.',
            'menacing': 'You gain proficiency in the Intimidation skill.',
            'relentless endurance': 'When you are reduced to 0 hit points but not killed outright, you can drop to 1 hit point instead. You can\'t use this feature again until you finish a long rest.',
            'savage attacks': 'When you score a critical hit with a melee weapon attack, you can roll one of the weapon\'s damage dice one additional time and add it to the extra damage of the critical hit.',
            'stonecunning': 'Whenever you make an Intelligence (History) check related to the origin of stonework, you are considered proficient in the History skill and add double your proficiency bonus to the check.',
            'artificer\'s lore': 'Whenever you make an Intelligence (History) check related to magic items, alchemical objects, or technological devices, you can add twice your proficiency bonus.',
            'tinker': 'You have proficiency with artisan\'s tools (tinker\'s tools). Using those tools, you can spend 1 hour and 10 gp worth of materials to construct a Tiny clockwork device.',
            'natural illusionist': 'You know the Minor Illusion cantrip. Intelligence is your spellcasting ability for it.',
            'speak with small beasts': 'Through sounds and gestures, you can communicate simple ideas with Small or smaller beasts.',
            'powerful build': 'You count as one size larger when determining your carrying capacity and the weight you can push, drag, or lift.',
            'mountain born': 'You have resistance to cold damage. You\'re also acclimated to high altitude.',
            'speech of beast and leaf': 'You have the ability to communicate in a limited manner with beasts and plants. They can understand the meaning of your words, though you have no special ability to understand them in return.',
            'healing hands': 'As an action, you can touch a creature and cause it to regain a number of hit points equal to your level. Once you use this trait, you can\'t use it again until you finish a long rest.',
            'radiant soul': 'Starting at 3rd level, you can use your action to unleash the divine energy within yourself, gaining a flying speed of 30 feet and dealing extra radiant damage equal to your level once per turn.',
            'cat\'s claws': 'You have a climbing speed of 20 feet. In addition, your claws are natural weapons.',
            'cat\'s talent': 'You have proficiency in the Perception and Stealth skills.',
            'feline agility': 'Your reflexes and agility allow you to move with a burst of speed. When you move on your turn in combat, you can double your speed until the end of the turn. Once you use this trait, you can\'t use it again until you move 0 feet on one of your turns.',
            'shell defense': 'You can withdraw into your shell as an action. Until you emerge, you gain a +4 bonus to AC, and you have advantage on Strength and Constitution saving throws.',
        };

        for (const [key, desc] of Object.entries(knownPassives)) {
            if (lowerName.includes(key) || lowerDesc.includes(key)) {
                effects.push({
                    name: feature.name,
                    description: desc,
                    type: 'feature',
                    source: sourceLabel,
                });
                break;
            }
        }
    });

    // 4. Добавляем бонусы к способностям (из RACIAL_BONUSES и SUBRACE_DETAILS)
    const bonusObj: Record<string, number> = {};
    const raceBonus = RACIAL_BONUSES[race];
    if (raceBonus) {
        if (raceBonus.fixed) {
            Object.entries(raceBonus.fixed).forEach(([attr, val]) => {
                bonusObj[attr] = (bonusObj[attr] || 0) + val;
            });
        }
        // choose – не фиксированный, пропускаем
    }
    if (subrace && SUBRACE_DETAILS[subrace]?.abilityBonuses) {
        Object.entries(SUBRACE_DETAILS[subrace].abilityBonuses!).forEach(([attr, val]) => {
            bonusObj[attr] = (bonusObj[attr] || 0) + val;
        });
    }
    if (Object.keys(bonusObj).length > 0) {
        const bonusStr = Object.entries(bonusObj)
            .map(([attr, val]) => `${attr.toUpperCase()} +${val}`)
            .join(', ');
        effects.push({
            name: 'Ability Score Bonuses',
            description: `You gain ${bonusStr}.`,
            type: 'other',
            value: bonusStr,
            source: 'race',
        });
    }

    // 5. Удаляем дубликаты (по имени и типу)
    const uniqueMap = new Map<string, RacialEffect>();
    effects.forEach(e => {
        const key = `${e.name}|${e.type}`;
        if (!uniqueMap.has(key)) {
            uniqueMap.set(key, e);
        }
    });
    return Array.from(uniqueMap.values());
}

/**
 * Возвращает список пассивных эффектов для отображения в UI (без очень длинных описаний)
 */
export function getActivePassiveEffects(race: string, subrace?: string): RacialEffect[] {
    return getRacialEffects(race, subrace).filter(e =>
        e.type !== 'other' || e.name === 'Fey Ancestry' || e.name === 'Lucky' ||
        e.name === 'Brave' || e.name === 'Halfling Nimbleness' || e.name === 'Naturally Stealthy' ||
        e.name === 'Menacing' || e.name === 'Relentless Endurance' || e.name === 'Savage Attacks' ||
        e.name === 'Stonecunning' || e.name === 'Artificer\'s Lore' || e.name === 'Tinker' ||
        e.name === 'Natural Illusionist' || e.name === 'Speak with Small Beasts' ||
        e.name === 'Powerful Build' || e.name === 'Mountain Born' ||
        e.name === 'Speech of Beast and Leaf' || e.name === 'Healing Hands' ||
        e.name === 'Radiant Soul' || e.name === 'Cat\'s Claws' || e.name === 'Cat\'s Talent' ||
        e.name === 'Feline Agility' || e.name === 'Shell Defense'
    );
}