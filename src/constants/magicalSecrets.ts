/**
 * «Magical Secrets» — фичи, дающие барду выбор заклинаний с ЛЮБОГО класса.
 *
 * Base Bard:  Level 10 → +2, Level 14 → +2, Level 18 → +2
 * College of Lore: Level 6 → +2 (Additional Magical Secrets)
 *
 * То есть Bard 18 (Lore) → 8 секретов (2+2+2+2), Bard 18 (Valor) → 6.
 *
 * Секреты:
 *   - не auto-add в character.spells;
 *   - выбираются игроком вручную из пула любого класса;
 *   - гейтятся maxSpellLevel класса, дающего фичу (не character.level).
 */

export interface MagicalSecretsFeature {
    /** Если задан — фича только для этого подкласса. */
    subclass?: string;
    /** Уровень КЛАССА, на котором фича появляется. */
    level: number;
    /** Сколько заклинаний даёт ЭТА фича (суммируется с другими). */
    count: number;
}

export const MAGICAL_SECRETS_FEATURES: Record<string, MagicalSecretsFeature[]> = {
    Bard: [
        // Base Bard (доступно всем подклассам)
        { level: 10, count: 2 },
        { level: 14, count: 2 },
        { level: 18, count: 2 },
        // College of Lore — Additional Magical Secrets
        { subclass: 'Lore', level: 6, count: 2 },
    ],
};