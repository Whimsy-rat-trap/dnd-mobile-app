import { Character, InventoryItem } from '../types/Character';

// Данные о доспехах (базовый AC, модификатор ловкости, ограничение)
interface ArmorData {
    baseAC: number;
    dexMod?: boolean;
    maxDex?: number;
    strengthRequirement?: number;
    stealthDisadvantage?: boolean;
}

const ARMOR_DATA: Record<string, ArmorData> = {
    // Лёгкие
    'Leather Armor': { baseAC: 11, dexMod: true },
    'Studded Leather Armor': { baseAC: 12, dexMod: true },
    'Studded Leather +1': { baseAC: 13, dexMod: true },
    // Средние
    'Hide Armor': { baseAC: 12, dexMod: true, maxDex: 2 },
    'Chain Shirt': { baseAC: 13, dexMod: true, maxDex: 2 },
    'Scale Mail': { baseAC: 14, dexMod: true, maxDex: 2 },
    'Breastplate': { baseAC: 14, dexMod: true, maxDex: 2 },
    'Half Plate': { baseAC: 15, dexMod: true, maxDex: 2 },
    // Тяжёлые
    'Ring Mail': { baseAC: 14, dexMod: false },
    'Chain Mail': { baseAC: 16, dexMod: false, strengthRequirement: 13, stealthDisadvantage: true },
    'Splint Armor': { baseAC: 17, dexMod: false, strengthRequirement: 15, stealthDisadvantage: true },
    'Plate Armor': { baseAC: 18, dexMod: false, strengthRequirement: 15, stealthDisadvantage: true },
    'Plate Armor +2': { baseAC: 20, dexMod: false, strengthRequirement: 15, stealthDisadvantage: true },
};

function getArmorData(item: InventoryItem): ArmorData | null {
    if (ARMOR_DATA[item.name]) return ARMOR_DATA[item.name];
    for (const [key, data] of Object.entries(ARMOR_DATA)) {
        if (item.name.includes(key)) return data;
    }
    return null;
}

export function recalculateAC(character: Character): number {
    const equippedArmor = character.inventory.find(item => item.type === 'armor' && item.equipped);
    const equippedShield = character.inventory.find(item => item.type === 'shield' && item.equipped);
    const acBonusItems = character.inventory.filter(item =>
        item.equipped && (item.type === 'ring' || item.type === 'wand' || item.type === 'other') &&
        (item.name.toLowerCase().includes('protection') || item.description.toLowerCase().includes('+1 to ac'))
    );

    const dexMod = Math.floor((character.abilities.dex - 10) / 2);
    let ac = 10 + dexMod;

    if (equippedArmor) {
        const armorData = getArmorData(equippedArmor);
        if (armorData) {
            ac = armorData.baseAC;
            if (armorData.dexMod) {
                const maxDex = armorData.maxDex ?? Infinity;
                ac += Math.min(dexMod, maxDex);
            }
        } else {
            // Если доспех не найден в словаре, используем 10 + Dex (как в базовом)
        }
    }

    if (equippedShield) {
        ac += 2;
    }

    let bonusFromItems = 0;
    for (const item of acBonusItems) {
        const match = item.description.match(/\+(\d+)\s+to AC/i) || item.name.match(/\+(\d+)/i);
        if (match) {
            bonusFromItems += parseInt(match[1], 10);
        }
    }
    ac += bonusFromItems;

    // Если есть natural armor (например, Tortle) и нет доспехов, используем его
    // Для простоты пропустим, но можно добавить проверку по расе

    return ac;
}