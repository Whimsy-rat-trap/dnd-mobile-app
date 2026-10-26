/**
 * Battle Master maneuvers.
 *
 * Каждый манёвр описывает:
 *   - как он применяется (actionType),
 *   - к чему добавляется кубик (addsTo),
 *   - есть ли saving throw,
 *   - какие проверки навыка усиливает (affectedChecks).
 *
 * Стоимость всегда 1 superiority die (кроме случаев, когда указано иное в description).
 */

export type ManeuverActionType =
    | 'attack'
    | 'on-hit'
    | 'on-miss'
    | 'bonus'
    | 'reaction'
    | 'when-moving'
    | 'free';

export type ManeuverAddsTo =
    | 'attack'
    | 'damage'
    | 'ac'
    | 'check'
    | 'temp-hp'
    | 'damage-reduction'
    | 'none';

export interface ManeuverSave {
    ability: 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';
    effect: string;
}

export interface Maneuver {
    id: string;
    name: string;
    source: 'PHB' | 'TCE';
    actionType: ManeuverActionType;
    addsTo: ManeuverAddsTo;
    save?: ManeuverSave;
    /** Какие проверки навыка усиливает (для addsTo === 'check'). */
    affectedChecks?: string[];
    description: string;
}

export const MANEUVERS: Maneuver[] = [
    // PHB
    {
        id: 'commanders-strike',
        name: "Commander's Strike",
        source: 'PHB',
        actionType: 'bonus',
        addsTo: 'damage',
        description:
            'When you take the Attack action, you can forgo one of your attacks and use a bonus action to direct one of your companions to strike. That ally can immediately use its reaction to make one weapon attack, adding your superiority die to the damage roll.',
    },
    {
        id: 'disarming-attack',
        name: 'Disarming Attack',
        source: 'PHB',
        actionType: 'on-hit',
        addsTo: 'damage',
        save: { ability: 'str', effect: 'drop one item of your choice' },
        description:
            'When you hit a creature with a weapon attack, you can expend a superiority die to add it to the damage roll. The target must make a Strength save or drop one item of your choice.',
    },
    {
        id: 'distracting-strike',
        name: 'Distracting Strike',
        source: 'PHB',
        actionType: 'on-hit',
        addsTo: 'damage',
        description:
            'When you hit a creature with a weapon attack, you can add a superiority die to the damage roll. The next attack roll against the target by an attacker other than you has advantage if it\'s made before the start of your next turn.',
    },
    {
        id: 'evasive-footwork',
        name: 'Evasive Footwork',
        source: 'PHB',
        actionType: 'when-moving',
        addsTo: 'ac',
        description:
            'When you move, you can expend a superiority die, adding it to your AC until you stop moving.',
    },
    {
        id: 'feinting-attack',
        name: 'Feinting Attack',
        source: 'PHB',
        actionType: 'bonus',
        addsTo: 'damage',
        description:
            'As a bonus action, choose a creature within 5 feet. You have advantage on your next attack roll against it this turn. If that attack hits, add the superiority die to the damage roll.',
    },
    {
        id: 'goading-attack',
        name: 'Goading Attack',
        source: 'PHB',
        actionType: 'on-hit',
        addsTo: 'damage',
        save: { ability: 'wis', effect: 'disadvantage on attacks against creatures other than you' },
        description:
            'When you hit a creature with a weapon attack, you can add a superiority die to the damage roll. The target must make a Wisdom save or have disadvantage on attack rolls against creatures other than you until the end of your next turn.',
    },
    {
        id: 'lunging-attack',
        name: 'Lunging Attack',
        source: 'PHB',
        actionType: 'attack',
        addsTo: 'damage',
        description:
            'When you make a melee weapon attack, you can increase your reach for that attack by 5 feet. If you hit, add the superiority die to the damage roll.',
    },
    {
        id: 'maneuvering-attack',
        name: 'Maneuvering Attack',
        source: 'PHB',
        actionType: 'on-hit',
        addsTo: 'damage',
        description:
            'When you hit a creature with a weapon attack, you can add a superiority die to the damage roll. You can then choose a friendly creature who can see or hear you. That creature can use its reaction to move up to half its speed without provoking opportunity attacks.',
    },
    {
        id: 'menacing-attack',
        name: 'Menacing Attack',
        source: 'PHB',
        actionType: 'on-hit',
        addsTo: 'damage',
        save: { ability: 'wis', effect: 'frightened until the end of your next turn' },
        description:
            'When you hit a creature with a weapon attack, you can add a superiority die to the damage roll. The target must make a Wisdom save or be frightened of you until the end of your next turn.',
    },
    {
        id: 'parry',
        name: 'Parry',
        source: 'PHB',
        actionType: 'reaction',
        addsTo: 'damage-reduction',
        description:
            'When another creature damages you with a melee attack, you can use your reaction and expend a superiority die to reduce the damage by the number you roll + your Dexterity modifier.',
    },
    {
        id: 'precision-attack',
        name: 'Precision Attack',
        source: 'PHB',
        actionType: 'attack',
        addsTo: 'attack',
        description:
            'When you make a weapon attack roll against a creature, you can expend a superiority die to add it to the roll. You can use this before or after the roll but before any effects.',
    },
    {
        id: 'pushing-attack',
        name: 'Pushing Attack',
        source: 'PHB',
        actionType: 'on-hit',
        addsTo: 'damage',
        save: { ability: 'str', effect: 'pushed up to 15 feet away' },
        description:
            'When you hit a creature with a weapon attack, you can add a superiority die to the damage roll. If the target is Large or smaller, it must make a Strength save or be pushed up to 15 feet away.',
    },
    {
        id: 'rally',
        name: 'Rally',
        source: 'PHB',
        actionType: 'bonus',
        addsTo: 'temp-hp',
        description:
            'As a bonus action, choose a friendly creature who can see or hear you. That creature gains temporary hit points equal to the superiority die roll + your Charisma modifier.',
    },
    {
        id: 'riposte',
        name: 'Riposte',
        source: 'PHB',
        actionType: 'on-miss',
        addsTo: 'damage',
        description:
            'When a creature misses you with a melee attack, you can use your reaction and expend a superiority die to make a melee weapon attack against that creature. If you hit, add the superiority die to the damage roll.',
    },
    {
        id: 'sweeping-attack',
        name: 'Sweeping Attack',
        source: 'PHB',
        actionType: 'on-hit',
        addsTo: 'damage',
        description:
            'When you hit a creature with a melee weapon attack, you can expend a superiority die to attempt to damage another creature with the same attack. Choose another creature within 5 feet of the original target and within reach. If the original attack roll would hit that second creature, it takes damage equal to the superiority die roll (same damage type).',
    },
    {
        id: 'trip-attack',
        name: 'Trip Attack',
        source: 'PHB',
        actionType: 'on-hit',
        addsTo: 'damage',
        save: { ability: 'str', effect: 'knocked prone' },
        description:
            'When you hit a creature with a weapon attack, you can add a superiority die to the damage roll. If the target is Large or smaller, it must make a Strength save or be knocked prone.',
    },

    // Tasha's Cauldron of Everything
    {
        id: 'ambush',
        name: 'Ambush',
        source: 'TCE',
        actionType: 'free',
        addsTo: 'check',
        affectedChecks: ['Stealth', 'Initiative'],
        description:
            'When you make a Stealth check or roll initiative, you can expend a superiority die and add it to the roll.',
    },
    {
        id: 'bait-and-switch',
        name: 'Bait and Switch',
        source: 'TCE',
        actionType: 'bonus',
        addsTo: 'ac',
        description:
            'As a bonus action, choose a friendly creature within 5 feet. You swap places, and both of you gain +1d8 to AC until the start of your next turn (or until you\'re incapacitated).',
    },
    {
        id: 'brace',
        name: 'Brace',
        source: 'TCE',
        actionType: 'reaction',
        addsTo: 'damage',
        description:
            'When a creature you can see moves into your reach, you can use your reaction to make one melee weapon attack against it, adding the superiority die to the damage roll if you hit.',
    },
    {
        id: 'commanding-presence',
        name: 'Commanding Presence',
        source: 'TCE',
        actionType: 'free',
        addsTo: 'check',
        affectedChecks: ['Intimidation', 'Performance', 'Persuasion'],
        description:
            'When you make a Charisma (Intimidation), Charisma (Performance), or Charisma (Persuasion) check, you can expend a superiority die and add it to the roll.',
    },
    {
        id: 'grappling-strike',
        name: 'Grappling Strike',
        source: 'TCE',
        actionType: 'on-hit',
        addsTo: 'damage',
        description:
            'Immediately after you hit a creature with a melee attack, you can use a bonus action to try to grapple the target, adding the superiority die to your Strength (Athletics) check.',
    },
    {
        id: 'quick-toss',
        name: 'Quick Toss',
        source: 'TCE',
        actionType: 'bonus',
        addsTo: 'damage',
        description:
            'As a bonus action, you can draw and throw a weapon with the thrown property, adding the superiority die to the damage roll if you hit.',
    },
    {
        id: 'tactical-assessment',
        name: 'Tactical Assessment',
        source: 'TCE',
        actionType: 'free',
        addsTo: 'check',
        affectedChecks: ['Investigation', 'Insight', 'History'],
        description:
            'When you make an Intelligence (Investigation), Wisdom (Insight), or Intelligence (History) check, you can expend a superiority die and add it to the roll.',
    },
];

export function getManeuverById(id: string): Maneuver | undefined {
    return MANEUVERS.find(m => m.id === id);
}

/**
 * Сколько манёвров знает Battle Master на данном уровне Fighter'а.
 * 3 → 3, 7 → 5, 10 → 7, 15 → 9.
 */
export function getManeuversKnownCount(fighterLevel: number): number {
    if (fighterLevel < 3) return 0;
    if (fighterLevel >= 15) return 9;
    if (fighterLevel >= 10) return 7;
    if (fighterLevel >= 7) return 5;
    return 3;
}