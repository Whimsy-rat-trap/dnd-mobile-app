export type AttackDebuffType = 'flat' | 'dice' | 'disadvantage';

export interface AttackDebuff {
    id: string;
    name: string;
    description: string;
    type: AttackDebuffType;
    /** Для type === 'flat': фиксированный штраф (отрицательное число). */
    value?: number;
    /** Для type === 'dice': формула штрафа, например "1d4". */
    getFormula?: (rank?: number) => string;
    /** Максимальный/минимальный ранг, если штраф масштабируется. */
    maxRank?: number;
    minRank?: number;
    rankLabel?: string;
    defaultRank?: number;
    /** Тип урона (для отображения — например, psychic для Vicious Mockery). */
    damageType?: string;
}

export const ATTACK_DEBUFFS: AttackDebuff[] = [
    {
        id: 'bane',
        name: 'Bane',
        description: 'Subtract 1d4 from attack rolls and saving throws.',
        type: 'dice',
        getFormula: () => '1d4',
    },
    {
        id: 'poisoned',
        name: 'Poisoned',
        description: 'Disadvantage on attack rolls and ability checks.',
        type: 'disadvantage',
    },
    {
        id: 'frightened',
        name: 'Frightened',
        description: 'Disadvantage on attack rolls while source of fear is in line of sight.',
        type: 'disadvantage',
    },
    {
        id: 'blinded',
        name: 'Blinded',
        description: 'Disadvantage on attack rolls.',
        type: 'disadvantage',
    },
    {
        id: 'restrained',
        name: 'Restrained',
        description: 'Disadvantage on attack rolls.',
        type: 'disadvantage',
    },
    {
        id: 'prone-target-ranged',
        name: 'Prone Target (ranged)',
        description: 'Disadvantage on ranged attack rolls against a prone target.',
        type: 'disadvantage',
    },
    {
        id: 'vicious-mockery',
        name: 'Vicious Mockery',
        description: 'Disadvantage on next attack roll.',
        type: 'disadvantage',
        damageType: 'psychic',
    },
    {
        id: 'exhaustion-1',
        name: 'Exhaustion (level 1)',
        description: '−2 to attack rolls (and ability checks).',
        type: 'flat',
        value: -2,
    },
    {
        id: 'exhaustion-3',
        name: 'Exhaustion (level 3)',
        description: 'Disadvantage on attack rolls and saving throws.',
        type: 'disadvantage',
    },
    {
        id: 'half-cover',
        name: 'Half Cover (target)',
        description: '+2 to target AC → −2 to hit.',
        type: 'flat',
        value: -2,
    },
    {
        id: 'three-quarters-cover',
        name: 'Three-Quarters Cover (target)',
        description: '+5 to target AC → −5 to hit.',
        type: 'flat',
        value: -5,
    },
];

export const getDebuffById = (id: string): AttackDebuff | undefined =>
    ATTACK_DEBUFFS.find(d => d.id === id);