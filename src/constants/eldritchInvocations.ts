/**
 * Eldritch Invocations (сфокусировано только на тех, что нужны для
 * Book of Ancient Secrets и подобных механик, дающих заклинания).
 *
 * Полный список инвокаций — отдельная задача. Сейчас — минимальный,
 * но расширяемый набор.
 */

export type PactBoon = 'chain' | 'blade' | 'tome';

export interface EldritchInvocation {
    id: string;
    name: string;
    description: string;
    /** Требует конкретного Pact Boon. */
    requiresPact?: PactBoon;
    /** Минимальный уровень Warlock'а. */
    minWarlockLevel?: number;
}

export const ELDRITCH_INVOCATIONS: EldritchInvocation[] = [
    {
        id: 'book-of-ancient-secrets',
        name: 'Book of Ancient Secrets',
        description:
            'Your Book of Shadows now contains two 1st-level ritual spells of your choice. On your adventures you can add other ritual spells — as long as the spell level is ≤ half your warlock level (rounded up). You can cast them as rituals.',
        requiresPact: 'tome',
        minWarlockLevel: 3,
    },
];

export const PACT_BOON_OPTIONS: { value: PactBoon; label: string }[] = [
    { value: 'chain', label: 'Pact of the Chain' },
    { value: 'blade', label: 'Pact of the Blade' },
    { value: 'tome', label: 'Pact of the Tome' },
];