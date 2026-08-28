import { InventoryItem } from '../types/Character';
import { RACE_FEATURES, Feature } from '../constants/raceFeatures';
import { SUBRACE_DETAILS } from '../constants/subraceDetails';

/**
 * Извлекает все расовые фичи для данной расы и подрасы (если есть)
 */
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

/**
 * Определяет, является ли данная фича естественным оружием (natural weapon)
 */
function isNaturalWeapon(feature: Feature): boolean {
    const lowerName = feature.name.toLowerCase();
    const lowerDesc = feature.description.toLowerCase();

    // Ключевые слова, указывающие на natural weapon
    const keywords = [
        'claw', 'claws',
        'bite',
        'talon', 'talons',
        'fang', 'fangs',
        'natural weapon',
        'natural weapons',
        'unarmed strike', // некоторые описания используют этот термин
    ];

    // Также ищем фразы, явно указывающие на оружие
    const weaponPhrases = [
        'are natural weapons',
        'is a natural weapon',
        'you can use to make unarmed strikes',
        'your fanged maw is a natural weapon',
        'your claws are natural weapons',
        'your talons are natural weapons',
    ];

    const matchesKeyword = keywords.some(kw => lowerName.includes(kw) || lowerDesc.includes(kw));
    const matchesPhrase = weaponPhrases.some(phrase => lowerDesc.includes(phrase));

    return matchesKeyword || matchesPhrase;
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
    if (match) {
        const weapon = match[1];
        return weapon.charAt(0).toUpperCase() + weapon.slice(1);
    }

    // Если ничего не найдено, возвращаем "Natural Weapon" как запасной вариант
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

/**
 * Возвращает все расовые фичи (включая подрасовые) для отображения на странице персонажа
 */
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
            // Может быть строка с перечислением через запятую
            const resists = feature.resistance.split(',').map(r => r.trim());
            resists.forEach(r => {
                if (r && !resistances.includes(r)) resistances.push(r);
            });
        }
        if (feature.immunity) {
            const immunes = feature.immunity.split(',').map(i => i.trim());
            immunes.forEach(i => {
                if (i && !immunities.includes(i)) immunities.push(i);
            });
        }
    });

    return { resistance: resistances, immunity: immunities };
}