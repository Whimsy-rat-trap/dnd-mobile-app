/**
 * Обобщённые классовые ресурсы: Rage, Action Surge, Channel Divinity, Wild Shape...
 *
 * Формула максимума:
 *   - 'table'  — массив [minLevel, uses], берём последнюю подходящую строку.
 *   - 'level'  — max = classLevel * multiplier.
 *   - 'fixed'  — фиксированное число.
 *
 * Recharge:
 *   - 'short'  — восстанавливается на short и long rest.
 *   - 'long'   — только на long rest.
 */

export type ResourceRecharge = 'short' | 'long';

export type ResourceMaxUses =
    | { type: 'fixed'; value: number }
    | { type: 'level'; multiplier: number }
    | { type: 'table'; table: Array<{ minLevel: number; uses: number }> };

export interface ClassResourceDefinition {
    id: string;
    name: string;
    className: string;
    minClassLevel: number;
    recharge: ResourceRecharge;
    maxUses: ResourceMaxUses;
    description: string;
    /** Цвет для UI-акцента. */
    color?: string;
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
];

/**
 * Получить определение ресурса по id.
 */
export function getClassResourceDefinition(
    resourceId: string
): ClassResourceDefinition | undefined {
    return CLASS_RESOURCES.find(r => r.id === resourceId);
}