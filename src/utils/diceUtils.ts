/**
 * Результат одного броска кубика.
 */
export interface DiceRollResult {
    rolls: number[];
    modifier: number;
    total: number;
    formula: string;
}

/**
 * Парсит формулу урона вида "2d6+3", "1d8", "4d4-1", "1d10".
 * Возвращает null, если формула некорректна.
 */
export function parseDiceFormula(formula: string): { count: number; sides: number; modifier: number } | null {
    const cleaned = formula.replace(/\s+/g, '').toLowerCase();
    const match = cleaned.match(/^(\d+)d(\d+)([+-]\d+)?$/);
    if (!match) return null;

    const count = parseInt(match[1], 10);
    const sides = parseInt(match[2], 10);
    const modifier = match[3] ? parseInt(match[3], 10) : 0;

    if (count <= 0 || sides <= 0) return null;
    return { count, sides, modifier };
}

/**
 * Бросок кубиков по формуле.
 * Например: rollDice('2d6+3') → { rolls: [4, 5], modifier: 3, total: 12, formula: '2d6+3' }
 */
export function rollDice(formula: string): DiceRollResult | null {
    const parsed = parseDiceFormula(formula);
    if (!parsed) return null;

    const rolls = Array.from({ length: parsed.count }, () =>
        Math.floor(Math.random() * parsed.sides) + 1
    );
    const total = rolls.reduce((a, b) => a + b, 0) + parsed.modifier;

    return {
        rolls,
        modifier: parsed.modifier,
        total,
        formula,
    };
}

/**
 * Бросок d20 с учётом преимущества/помехи.
 */
export type RollMode = 'normal' | 'advantage' | 'disadvantage';

export interface D20RollResult {
    rolls: number[];
    chosen: number;
    mode: RollMode;
    bonus: number;
    total: number;
    isCrit: boolean;
    isCritFail: boolean;
}

export function rollD20(mode: RollMode, bonus: number): D20RollResult {
    if (mode === 'normal') {
        const roll = Math.floor(Math.random() * 20) + 1;
        return {
            rolls: [roll],
            chosen: roll,
            mode,
            bonus,
            total: roll + bonus,
            isCrit: roll === 20,
            isCritFail: roll === 1,
        };
    }

    const roll1 = Math.floor(Math.random() * 20) + 1;
    const roll2 = Math.floor(Math.random() * 20) + 1;
    const chosen = mode === 'advantage' ? Math.max(roll1, roll2) : Math.min(roll1, roll2);

    return {
        rolls: [roll1, roll2],
        chosen,
        mode,
        bonus,
        total: chosen + bonus,
        isCrit: chosen === 20,
        isCritFail: chosen === 1,
    };
}

/**
 * Красивое отображение формулы.
 */
export function formatDiceResult(result: DiceRollResult): string {
    const rollsStr = result.rolls.join(' + ');
    const modStr = result.modifier !== 0
        ? ` ${result.modifier > 0 ? '+' : '-'} ${Math.abs(result.modifier)}`
        : '';
    return `${rollsStr}${modStr} = ${result.total}`;
}