/**
 * Обобщённые классовые ресурсы.
 *
 * maxUses:
 *   - 'fixed'   — фиксированное число.
 *   - 'level'   — max = classLevel * multiplier.
 *   - 'table'   — массив [minLevel, uses], берём последнюю подходящую.
 *   - 'ability' — max = max(min, modifier от ability).
 *
 * recharge:
 *   - 'short' | 'long' — простые.
 *   - { type: 'table', table: [...] } — зависит от уровня класса (Bardic 5+).
 *
 * dieSize (опционально):
 *   - число или таблица по уровню класса. Для Bardic Inspiration.
 */

export type ResourceRecharge = 'short' | 'long';

export interface RechargeTable {
    type: 'table';
    table: Array<{ minLevel: number; recharge: ResourceRecharge }>;
}

export type ResourceRechargeSpec = ResourceRecharge | RechargeTable;

export type ResourceMaxUses =
    | { type: 'fixed'; value: number }
    | { type: 'level'; multiplier: number }
    | { type: 'table'; table: Array<{ minLevel: number; uses: number }> }
    | {
    type: 'ability';
    ability: 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';
    min: number;
};

export type ResourceDieSizeSpec =
    | number
    | { type: 'table'; table: Array<{ minLevel: number; dieSize: number }> };

export interface ClassResourceDefinition {
    id: string;
    name: string;
    className: string;
    minClassLevel: number;
    recharge: ResourceRechargeSpec;
    maxUses: ResourceMaxUses;
    description: string;
    /** Цвет для UI-акцента. */
    color?: string;
    dieSize?: ResourceDieSizeSpec;
}

export const CLASS_RESOURCES: ClassResourceDefinition[] = [
    // BARBARIAN — Rage
    {
        id: 'rage',
        name: 'Rage',
        className: 'Barbarian',
        minClassLevel: 1,
        recharge: 'long',
        maxUses: {
            type: 'table',
            table: [
                { minLevel: 1, uses: 2 },
                { minLevel: 3, uses: 3 },
                { minLevel: 6, uses: 4 },
                { minLevel: 12, uses: 5 },
                { minLevel: 17, uses: 6 },
            ],
        },
        description: 'Enter a rage as a bonus action. Recharges on a long rest.',
        color: '#ef4444',
    },

    // BARD — Bardic Inspiration
    {
        id: 'bardic-inspiration',
        name: 'Bardic Inspiration',
        className: 'Bard',
        minClassLevel: 1,
        recharge: {
            type: 'table',
            table: [
                { minLevel: 1, recharge: 'long' },
                { minLevel: 5, recharge: 'short' },
            ],
        },
        maxUses: { type: 'ability', ability: 'cha', min: 1 },
        dieSize: {
            type: 'table',
            table: [
                { minLevel: 1, dieSize: 6 },
                { minLevel: 5, dieSize: 8 },
                { minLevel: 10, dieSize: 10 },
                { minLevel: 15, dieSize: 12 },
            ],
        },
        description:
            'Grant a Bardic Inspiration die as a bonus action. Recharges on long rest (short rest from Bard 5 — Font of Inspiration).',
        color: '#fbbf24',
    },

    // CLERIC — Channel Divinity (L2+)
    {
        id: 'channel-divinity-cleric',
        name: 'Channel Divinity',
        className: 'Cleric',
        minClassLevel: 2,
        recharge: 'short',
        maxUses: {
            type: 'table',
            table: [
                { minLevel: 2, uses: 1 },
                { minLevel: 6, uses: 2 },
                { minLevel: 18, uses: 3 },
            ],
        },
        description: 'Channel divine energy for various effects. Recharges on short or long rest.',
        color: '#a855f7',
    },

    // DRUID — Wild Shape (L2+)
    {
        id: 'wild-shape',
        name: 'Wild Shape',
        className: 'Druid',
        minClassLevel: 2,
        recharge: 'short',
        maxUses: {
            type: 'table',
            table: [
                { minLevel: 2, uses: 2 },
                { minLevel: 6, uses: 3 },
            ],
        },
        description: 'Transform into a beast. Recharges on short or long rest.',
        color: '#22c55e',
    },

    // FIGHTER — Action Surge (L2+)
    {
        id: 'action-surge',
        name: 'Action Surge',
        className: 'Fighter',
        minClassLevel: 2,
        recharge: 'short',
        maxUses: {
            type: 'table',
            table: [
                { minLevel: 2, uses: 1 },
                { minLevel: 17, uses: 2 },
            ],
        },
        description: 'Take one additional action on your turn. Recharges on short or long rest.',
        color: '#f59e0b',
    },

    // MONK — Ki (L2+)
    {
        id: 'ki',
        name: 'Ki Points',
        className: 'Monk',
        minClassLevel: 2,
        recharge: 'short',
        maxUses: { type: 'level', multiplier: 1 },
        description:
            'Spend ki for Flurry of Blows, Patient Defense, Step of the Wind, and disciplines. Recharges on short or long rest.',
        color: '#06b6d4',
    },

    // SORCERER — Sorcery Points (L2+)
    {
        id: 'sorcery-points',
        name: 'Sorcery Points',
        className: 'Sorcerer',
        minClassLevel: 2,
        recharge: 'long',
        maxUses: { type: 'level', multiplier: 1 },
        description:
            'Spend sorcery points to create spell slots or apply Metamagic. Recharges on a long rest.',
        color: '#ec4899',
    },

    // PALADIN — Channel Divinity (L3+)
    {
        id: 'channel-divinity-paladin',
        name: 'Channel Divinity',
        className: 'Paladin',
        minClassLevel: 3,
        recharge: 'short',
        maxUses: { type: 'fixed', value: 1 },
        description: 'Channel divine energy. Recharges on short or long rest.',
        color: '#a855f7',
    },
];

export function getClassResourceDefinition(
    resourceId: string
): ClassResourceDefinition | undefined {
    return CLASS_RESOURCES.find(r => r.id === resourceId);
}

// Sorcery Points <-> Spell Slots
//
// PHB:
//   Slot → SP: level 1 → 1 SP, ..., level 5 → 5 SP
//   SP → Slot: 1st = 2 SP, 2nd = 3 SP, 3rd = 5 SP, 4th = 6 SP, 5th = 7 SP
//   Создавать слоты 6-го уровня и выше нельзя.

export const SORCERY_POINT_SLOT_COSTS: Record<number, number> = {
    1: 2,
    2: 3,
    3: 5,
    4: 6,
    5: 7,
};

export const MAX_CONVERTIBLE_SPELL_LEVEL = 5;

/** SP, которые даёт конверсия слота в SP. */
export function getSpGainedFromSlot(level: number): number {
    if (level < 1 || level > MAX_CONVERTIBLE_SPELL_LEVEL) return 0;
    return level;
}

/** SP, нужные для создания слота. 0, если уровень недопустим. */
export function getCostForSlot(level: number): number {
    return SORCERY_POINT_SLOT_COSTS[level] ?? 0;
}