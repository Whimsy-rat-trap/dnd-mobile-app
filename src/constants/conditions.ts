import { ConditionId } from '../types/Character';

export interface ConditionDefinition {
    id: ConditionId;
    name: string;
    /** Long description. */
    description: string;
    /** Short bullet points for the tooltip. */
    effects: string[];
    /** Chip color. */
    color: string;
    /** Mechanical flags, used to aggregate effects. */
    attackDisadvantage?: boolean;
    checkDisadvantage?: boolean;
    grantsAdvantageOnAttack?: boolean;
    incapacitated?: boolean;
    speedZero?: boolean;
    prone?: boolean;
    autoFailStrSave?: boolean;
    autoFailDexSave?: boolean;
}

export const CONDITIONS: ConditionDefinition[] = [
    {
        id: 'blinded',
        name: 'Blinded',
        description: "Can't see. Auto-fails sight-based checks.",
        effects: [
            "Can't see (auto-fail sight-based checks)",
            'Disadvantage on attack rolls',
            'Attackers have advantage against you',
        ],
        attackDisadvantage: true,
        grantsAdvantageOnAttack: true,
        color: '#6b7280',
    },
    {
        id: 'charmed',
        name: 'Charmed',
        description: "Can't attack the charmer; charmer has advantage on social checks.",
        effects: [
            "Can't attack the charmer",
            'Charmer has advantage on Charisma checks against you',
        ],
        color: '#ec4899',
    },
    {
        id: 'deafened',
        name: 'Deafened',
        description: "Can't hear; auto-fails hearing-based checks.",
        effects: ["Can't hear (auto-fail hearing-based checks)"],
        color: '#6b7280',
    },
    {
        id: 'frightened',
        name: 'Frightened',
        description: 'Disadvantage on attacks and checks while source is in sight.',
        effects: [
            'Disadvantage on attack rolls and ability checks (while source in sight)',
            "Can't willingly move closer to source",
        ],
        attackDisadvantage: true,
        checkDisadvantage: true,
        color: '#a855f7',
    },
    {
        id: 'grappled',
        name: 'Grappled',
        description: 'Speed 0; ends if grappler is incapacitated or moved away.',
        effects: ['Speed becomes 0'],
        speedZero: true,
        color: '#f97316',
    },
    {
        id: 'incapacitated',
        name: 'Incapacitated',
        description: "Can't take actions or reactions.",
        effects: ["Can't take actions or reactions"],
        incapacitated: true,
        color: '#ef4444',
    },
    {
        id: 'invisible',
        name: 'Invisible',
        description: 'Impossible to see without magic or special sense.',
        effects: ['Attackers have disadvantage against you', 'You have advantage on attack rolls'],
        color: '#06b6d4',
    },
    {
        id: 'paralyzed',
        name: 'Paralyzed',
        description: 'Incapacitated, cannot move or speak; auto-fail STR/DEX saves.',
        effects: [
            'Incapacitated (no actions or reactions)',
            "Can't move or speak",
            'Auto-fail Strength and Dexterity saves',
            'Attackers have advantage against you',
            'Melee hits within 5 ft are critical',
        ],
        incapacitated: true,
        autoFailStrSave: true,
        autoFailDexSave: true,
        grantsAdvantageOnAttack: true,
        speedZero: true,
        color: '#ef4444',
    },
    {
        id: 'petrified',
        name: 'Petrified',
        description: 'Transformed to stone, incapacitated, unaware.',
        effects: [
            'Incapacitated',
            'Auto-fail STR/DEX saves',
            'Resistance to all damage',
            'Immune to poison and disease',
        ],
        incapacitated: true,
        autoFailStrSave: true,
        autoFailDexSave: true,
        grantsAdvantageOnAttack: true,
        speedZero: true,
        color: '#6b7280',
    },
    {
        id: 'poisoned',
        name: 'Poisoned',
        description: 'Disadvantage on attacks and ability checks.',
        effects: ['Disadvantage on attack rolls', 'Disadvantage on ability checks'],
        attackDisadvantage: true,
        checkDisadvantage: true,
        color: '#84cc16',
    },
    {
        id: 'prone',
        name: 'Prone',
        description: 'Can only crawl; melee attacks against you have advantage.',
        effects: [
            'Only movement is crawl (or half speed to stand up)',
            'Disadvantage on attack rolls',
            'Melee attackers within 5 ft have advantage',
            'Ranged attackers have disadvantage',
        ],
        attackDisadvantage: true,
        prone: true,
        color: '#f59e0b',
    },
    {
        id: 'restrained',
        name: 'Restrained',
        description: 'Speed 0; attackers have advantage; DEX save disadvantage.',
        effects: [
            'Speed becomes 0',
            'Disadvantage on attack rolls',
            'Disadvantage on Dexterity saves',
            'Attackers have advantage against you',
        ],
        attackDisadvantage: true,
        grantsAdvantageOnAttack: true,
        speedZero: true,
        color: '#f97316',
    },
    {
        id: 'stunned',
        name: 'Stunned',
        description: 'Incapacitated, cannot move; auto-fail STR/DEX saves.',
        effects: [
            'Incapacitated',
            "Can't move",
            'Auto-fail Strength and Dexterity saves',
            'Attackers have advantage against you',
        ],
        incapacitated: true,
        autoFailStrSave: true,
        autoFailDexSave: true,
        grantsAdvantageOnAttack: true,
        speedZero: true,
        color: '#ef4444',
    },
    {
        id: 'unconscious',
        name: 'Unconscious',
        description: 'Incapacitated, prone, unaware; melee hits within 5 ft are crits.',
        effects: [
            'Incapacitated',
            'Prone',
            'Drops held items',
            'Auto-fail STR/DEX saves',
            'Attackers have advantage against you',
            'Melee hits within 5 ft are critical',
        ],
        incapacitated: true,
        prone: true,
        autoFailStrSave: true,
        autoFailDexSave: true,
        grantsAdvantageOnAttack: true,
        speedZero: true,
        color: '#ef4444',
    },
];

export function getConditionById(id: ConditionId): ConditionDefinition | undefined {
    return CONDITIONS.find((c) => c.id === id);
}

// Exhaustion (special — 6 cumulative levels, tracked separately)

export const EXHAUSTION_LEVELS: Array<{ level: number; effect: string }> = [
    { level: 1, effect: 'Disadvantage on ability checks' },
    { level: 2, effect: 'Speed halved' },
    { level: 3, effect: 'Disadvantage on attack rolls and saving throws' },
    { level: 4, effect: 'Hit point maximum halved' },
    { level: 5, effect: 'Speed reduced to 0' },
    { level: 6, effect: 'Death' },
];

export function getExhaustionEffects(level: number): string[] {
    if (level <= 0) return [];
    return EXHAUSTION_LEVELS.slice(0, Math.min(level, 6)).map((l) => l.effect);
}
