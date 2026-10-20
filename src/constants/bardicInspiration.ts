/**
 * Таблица Bardic Inspiration по уровню класса Bard.
 *
 * Если у персонажа несколько классов Bard (мультикласс с Bard нельзя, но
 * на случай экзотики — суммируем), берём последнюю подходящую строку.
 */

export interface BardicInspirationRow {
    minLevel: number;
    dieSize: number;
    recharge: 'short' | 'long';
}

export const BARDIC_INSPIRATION_TABLE: BardicInspirationRow[] = [
    { minLevel: 1, dieSize: 6, recharge: 'long' },
    { minLevel: 5, dieSize: 8, recharge: 'short' },  // Font of Inspiration
    { minLevel: 10, dieSize: 10, recharge: 'short' },
    { minLevel: 15, dieSize: 12, recharge: 'short' },
];