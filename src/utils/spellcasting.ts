import { Character } from '../types/Character';

// Типы заклинателей
const FULL_CASTER_CLASSES = ['Bard', 'Cleric', 'Druid', 'Sorcerer', 'Wizard'];
const HALF_CASTER_CLASSES = ['Paladin', 'Ranger', 'Artificer'];
const WARLOCK_CLASS = 'Warlock';

// Получение уровня заклинателя для класса
function getCasterLevel(className: string, classLevel: number): number {
    if (FULL_CASTER_CLASSES.includes(className)) return classLevel;
    if (HALF_CASTER_CLASSES.includes(className)) return Math.floor(classLevel / 2);
    if (className === WARLOCK_CLASS) return classLevel; // особый случай
    return 0;
}

// Возвращает общий уровень заклинателя (сумма уровней заклинателей, исключая Warlock)
function getTotalCasterLevel(classLevels: { className: string; level: number }[]): number {
    return classLevels.reduce((total, cl) => {
        if (cl.className !== WARLOCK_CLASS) {
            return total + getCasterLevel(cl.className, cl.level);
        }
        return total;
    }, 0);
}

// Возвращает уровень варлока (если есть)
function getWarlockLevel(classLevels: { className: string; level: number }[]): number {
    const warlock = classLevels.find(cl => cl.className === WARLOCK_CLASS);
    return warlock ? warlock.level : 0;
}

// Таблица слотов для полных заклинателей (по уровням персонажа 1-20)
const FULL_CASTER_SLOTS: Record<number, number[]> = {
    1: [2,0,0,0,0,0,0,0,0],
    2: [3,0,0,0,0,0,0,0,0],
    3: [4,2,0,0,0,0,0,0,0],
    4: [4,3,0,0,0,0,0,0,0],
    5: [4,3,2,0,0,0,0,0,0],
    6: [4,3,3,0,0,0,0,0,0],
    7: [4,3,3,1,0,0,0,0,0],
    8: [4,3,3,2,0,0,0,0,0],
    9: [4,3,3,3,1,0,0,0,0],
    10: [4,3,3,3,2,0,0,0,0],
    11: [4,3,3,3,2,1,0,0,0],
    12: [4,3,3,3,2,1,0,0,0],
    13: [4,3,3,3,2,1,1,0,0],
    14: [4,3,3,3,2,1,1,0,0],
    15: [4,3,3,3,2,1,1,1,0],
    16: [4,3,3,3,2,1,1,1,0],
    17: [4,3,3,3,2,1,1,1,1],
    18: [4,3,3,3,3,1,1,1,1],
    19: [4,3,3,3,3,2,1,1,1],
    20: [4,3,3,3,3,2,2,1,1],
};

// Таблица слотов для варлока (по уровням 1-20)
const WARLOCK_SLOTS: Record<number, number[]> = {
    1: [1,0,0,0,0,0,0,0,0],
    2: [2,0,0,0,0,0,0,0,0],
    3: [0,2,0,0,0,0,0,0,0],
    4: [0,2,0,0,0,0,0,0,0],
    5: [0,0,2,0,0,0,0,0,0],
    6: [0,0,2,0,0,0,0,0,0],
    7: [0,0,0,2,0,0,0,0,0],
    8: [0,0,0,2,0,0,0,0,0],
    9: [0,0,0,0,2,0,0,0,0],
    10: [0,0,0,0,2,0,0,0,0],
    11: [0,0,0,0,3,0,0,0,0],
    12: [0,0,0,0,3,0,0,0,0],
    13: [0,0,0,0,3,0,0,0,0],
    14: [0,0,0,0,3,0,0,0,0],
    15: [0,0,0,0,3,0,0,0,0],
    16: [0,0,0,0,3,0,0,0,0],
    17: [0,0,0,0,4,0,0,0,0],
    18: [0,0,0,0,4,0,0,0,0],
    19: [0,0,0,0,4,0,0,0,0],
    20: [0,0,0,0,4,0,0,0,0],
};

// Возвращает массив слотов для указанного уровня заклинателя (полный заклинатель)
function getFullCasterSlots(level: number): number[] {
    if (level < 1 || level > 20) return Array(9).fill(0);
    return FULL_CASTER_SLOTS[level] || Array(9).fill(0);
}

// Возвращает массив слотов для варлока
function getWarlockSlots(level: number): number[] {
    if (level < 1 || level > 20) return Array(9).fill(0);
    return WARLOCK_SLOTS[level] || Array(9).fill(0);
}

// Основная функция получения слотов для персонажа
export function getSpellSlots(character: Character): number[] {
    const classLevels = character.classLevels || [];
    const totalCasterLevel = getTotalCasterLevel(classLevels);
    const warlockLevel = getWarlockLevel(classLevels);
    const slots = Array(9).fill(0);
    // Слоты от полных и половинных заклинателей
    if (totalCasterLevel > 0) {
        const casterSlots = getFullCasterSlots(totalCasterLevel);
        for (let i = 0; i < 9; i++) {
            slots[i] += casterSlots[i];
        }
    }
    // Слоты от варлока (отдельно)
    if (warlockLevel > 0) {
        const warlockSlots = getWarlockSlots(warlockLevel);
        for (let i = 0; i < 9; i++) {
            slots[i] += warlockSlots[i];
        }
    }
    return slots;
}

// Получение максимума подготовленных заклинаний (для классов, которые готовят)
export function getMaxPrepared(character: Character): number {
    if (!character.classLevels || character.classLevels.length === 0) return 0;
    const mainClass = character.classLevels[0];
    const level = mainClass.level;
    let mod = 0;
    const className = mainClass.className;
    if (['Wizard', 'Artificer'].includes(className)) {
        mod = Math.floor((character.abilities.int - 10) / 2);
    } else if (['Cleric', 'Druid', 'Ranger'].includes(className)) {
        mod = Math.floor((character.abilities.wis - 10) / 2);
    } else if (['Bard', 'Sorcerer', 'Warlock', 'Paladin'].includes(className)) {
        mod = Math.floor((character.abilities.cha - 10) / 2);
    }
    return Math.max(level + mod, 1);
}

// Количество известных заклинаний (для классов, которые знают заклинания)
export function getKnownSpells(character: Character): number {
    return character.spells.length;
}