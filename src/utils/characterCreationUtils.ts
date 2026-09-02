import { DND_BACKGROUNDS } from '../constants/backgrounds';

export const POINT_BUY_POINTS = 27;

export const getBackgroundAbilityBonuses = (bgName: string): { [key: string]: number } => {
    const bg = DND_BACKGROUNDS.find(b => b.name === bgName);
    return bg?.abilityBonuses || {};
};

export const roll4d6DropLowest = (): number => {
    const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
    rolls.sort((a, b) => a - b);
    rolls.shift();
    return rolls.reduce((sum, r) => sum + r, 0);
};

export const standardArray = (): { str: number; dex: number; con: number; int: number; wis: number; cha: number } => {
    const array = [15, 14, 13, 12, 10, 8];
    return {
        str: array[0],
        dex: array[1],
        con: array[2],
        int: array[3],
        wis: array[4],
        cha: array[5],
    };
};

export const getPointBuyCost = (value: number): number => {
    if (value < 8 || value > 15) return 0;
    const costMap: Record<number, number> = {
        8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9
    };
    return costMap[value] || 0;
};