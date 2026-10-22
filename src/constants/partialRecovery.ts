/**
 * «Частичное» восстановление — features, которые возвращают ЧАСТЬ ресурсов
 * или slots, а не всё, и/или требуют выбора игрока.
 *
 * Два типа:
 *   1. Manual (PARTIAL_RECOVERY_FEATURES) — игрок выбирает, что восстановить.
 *      Пример: Arcane Recovery, Natural Recovery.
 *   2. Automatic (AUTO_REST_RECOVERY) — срабатывает на rest без UI.
 *      Пример: Sorcerous Restoration.
 */

export type PartialRecoveryTarget =
    | {
    type: 'spell-slots';
    /** Бюджет = ceil(classLevel / divisor). По умолчанию 2. */
    divisor?: number;
    /** Максимальный уровень восстанавливаемого слота. */
    maxSlotLevel: number;
}
    | {
    type: 'resource';
    /** id из CLASS_RESOURCES ('sorcery-points', 'ki', ...). */
    resourceId: string;
    /** Сколько восстанавливать: число или 'class-level'. */
    amount: number | 'class-level';
};

export interface PartialRecoveryFeature {
    id: string;
    name: string;
    className: string;
    minClassLevel: number;
    /** Требуемый подкласс (например, 'Land' для Natural Recovery). */
    subclass?: string;
    /** На каком rest можно использовать. */
    restType: 'short' | 'long';
    /** Кулдаун: после использования недоступен до rest этого типа. */
    cooldown: 'long' | 'short';
    description: string;
    target: PartialRecoveryTarget;
}

export interface AutoRestRecoveryFeature {
    id: string;
    name: string;
    className: string;
    minClassLevel: number;
    subclass?: string;
    restType: 'short' | 'long';
    target: PartialRecoveryTarget;
}

// MANUAL — требует выбора игрока
export const PARTIAL_RECOVERY_FEATURES: PartialRecoveryFeature[] = [
    {
        id: 'arcane-recovery',
        name: 'Arcane Recovery',
        className: 'Wizard',
        minClassLevel: 2,
        restType: 'short',
        cooldown: 'long',
        description:
            'Once per day, when you finish a short rest, recover expended spell slots totaling no more than half your wizard level (rounded up). None can be 6th level or higher.',
        target: { type: 'spell-slots', divisor: 2, maxSlotLevel: 5 },
    },
    {
        id: 'natural-recovery',
        name: 'Natural Recovery',
        className: 'Druid',
        minClassLevel: 2,
        subclass: 'Land',
        restType: 'short',
        cooldown: 'long',
        description:
            'Once per day, when you finish a short rest, recover expended spell slots totaling no more than half your druid level (rounded up). None can be 6th level or higher.',
        target: { type: 'spell-slots', divisor: 2, maxSlotLevel: 5 },
    },
];

// AUTOMATIC — срабатывает без UI
export const AUTO_REST_RECOVERY: AutoRestRecoveryFeature[] = [
    {
        id: 'sorcerous-restoration',
        name: 'Sorcerous Restoration',
        className: 'Sorcerer',
        minClassLevel: 20,
        restType: 'short',
        target: { type: 'resource', resourceId: 'sorcery-points', amount: 4 },
    },
];