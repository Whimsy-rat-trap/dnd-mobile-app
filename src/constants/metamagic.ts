/**
 * Sorcerer Metamagic options.
 *
 * Стоимость:
 *   - 'fixed'        — фиксированная (1, 2, 3 SP).
 *   - 'spell-level'  — равна уровню кастуемого заклинания (Twinned Spell).
 *
 * Применяется при касте заклинания. Некоторые опции можно комбинировать
 * (например, Quickened + Twinned), но одна опция не может быть применена
 * к одному заклинанию дважды.
 */

export type MetamagicCost =
    | { type: 'fixed'; amount: number }
    | { type: 'spell-level' };

export interface Metamagic {
    id: string;
    name: string;
    source: 'PHB' | 'TCE';
    cost: MetamagicCost;
    description: string;
}

export const METAMAGIC: Metamagic[] = [
    {
        id: 'careful-spell',
        name: 'Careful Spell',
        source: 'PHB',
        cost: { type: 'fixed', amount: 1 },
        description:
            'When you cast a spell that forces other creatures to make a saving throw, you can protect some of them. Choose a number of creatures up to your Charisma modifier (min 1). Each chosen creature automatically succeeds on its saving throw against the spell.',
    },
    {
        id: 'distant-spell',
        name: 'Distant Spell',
        source: 'PHB',
        cost: { type: 'fixed', amount: 1 },
        description:
            'When you cast a spell that has a range of 5 feet or greater, you can double the range. When you cast a spell with a range of touch, you can increase its range to 30 feet.',
    },
    {
        id: 'empowered-spell',
        name: 'Empowered Spell',
        source: 'PHB',
        cost: { type: 'fixed', amount: 1 },
        description:
            'When you roll damage for a spell, you can reroll a number of damage dice up to your Charisma modifier (min 1). You must use the new rolls. You can use Empowered Spell even if you have already used a different Metamagic option during the casting of the spell.',
    },
    {
        id: 'extended-spell',
        name: 'Extended Spell',
        source: 'PHB',
        cost: { type: 'fixed', amount: 1 },
        description:
            'When you cast a spell that has a duration of 1 minute or longer, you can double its duration, to a maximum duration of 24 hours.',
    },
    {
        id: 'heightened-spell',
        name: 'Heightened Spell',
        source: 'PHB',
        cost: { type: 'fixed', amount: 3 },
        description:
            'When you cast a spell that forces a creature to make a saving throw to resist its effects, you can give one target of the spell disadvantage on its first saving throw made against the spell.',
    },
    {
        id: 'quickened-spell',
        name: 'Quickened Spell',
        source: 'PHB',
        cost: { type: 'fixed', amount: 2 },
        description:
            'When you cast a spell that has a casting time of 1 action, you can change the casting time to 1 bonus action for this casting.',
    },
    {
        id: 'seeking-spell',
        name: 'Seeking Spell',
        source: 'TCE',
        cost: { type: 'fixed', amount: 2 },
        description:
            'If you make an attack roll for a spell and miss, you can reroll the d20, and you must use the new roll. You can use Seeking Spell even if you have already used a different Metamagic option during the casting of the spell.',
    },
    {
        id: 'subtle-spell',
        name: 'Subtle Spell',
        source: 'PHB',
        cost: { type: 'fixed', amount: 1 },
        description:
            'When you cast a spell, you can cast it without any somatic or verbal components.',
    },
    {
        id: 'transmuted-spell',
        name: 'Transmuted Spell',
        source: 'TCE',
        cost: { type: 'fixed', amount: 1 },
        description:
            'When you cast a spell that deals a type of damage from the following list, you can change that damage type to one other listed damage type: acid, cold, fire, lightning, poison, thunder.',
    },
    {
        id: 'twinned-spell',
        name: 'Twinned Spell',
        source: 'PHB',
        cost: { type: 'spell-level' },
        description:
            'When you cast a spell that targets only one creature and doesn\'t have a range of self, you can spend a number of sorcery points equal to the spell\'s level to target a second creature in range with the same spell. For a cantrip, spend 1 sorcery point to twin it.',
    },
];

export function getMetamagicById(id: string): Metamagic | undefined {
    return METAMAGIC.find(m => m.id === id);
}

/**
 * Сколько опций Metamagic знает Sorcerer на данном уровне.
 *   2 → 2, 10 → 4, 17 → 6.
 */
export function getMetamagicKnownCount(sorcererLevel: number): number {
    if (sorcererLevel < 2) return 0;
    if (sorcererLevel >= 17) return 6;
    if (sorcererLevel >= 10) return 4;
    return 2;
}