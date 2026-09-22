export interface DamageBuff {
    id: string;
    name: string;
    description: string;
    /**
     * Возвращает формулу для добавления к урону.
     * Например "1d6", "3d8", "+4", "+10".
     * @param rank — уровень/ранг (для апкастов, уровня персонажа и т.д.)
     */
    getFormula: (rank?: number) => string;
    /** Максимальный ранг (например, для upcast до 5-го уровня). */
    maxRank?: number;
    /** Минимальный ранг (обычно 1). */
    minRank?: number;
    /** Подпись к селектору ранга ("Spell Level", "Character Level" и т.д.). */
    rankLabel?: string;
    /** Ранг по умолчанию при добавлении. */
    defaultRank?: number;
    /** Тип урона баффа (если отличается от базового). */
    damageType?: string;
}

export const DAMAGE_BUFFS: DamageBuff[] = [
    {
        id: 'hunters-mark',
        name: "Hunter's Mark",
        description: '1d6 extra damage to the marked target.',
        getFormula: () => '1d6',
        damageType: 'same',
    },
    {
        id: 'hex',
        name: 'Hex',
        description: '1d6 extra necrotic damage to the cursed target.',
        getFormula: () => '1d6',
        damageType: 'necrotic',
    },
    {
        id: 'divine-smite',
        name: 'Divine Smite',
        description: '2d8 radiant + 1d8 per spell level above 1st (max 5d8).',
        getFormula: (rank = 1) => {
            const lvl = Math.max(1, Math.min(rank, 5));
            return `${lvl + 1}d8`;
        },
        minRank: 1,
        maxRank: 4,
        rankLabel: 'Spell Level',
        defaultRank: 1,
        damageType: 'radiant',
    },
    {
        id: 'booming-blade',
        name: 'Booming Blade',
        description: 'Extra thunder damage at 5th (1d8), 11th (2d8), 17th (3d8).',
        getFormula: (rank = 5) => {
            if (rank >= 17) return '3d8';
            if (rank >= 11) return '2d8';
            if (rank >= 5) return '1d8';
            return '0';
        },
        minRank: 1,
        maxRank: 20,
        rankLabel: 'Character Level',
        defaultRank: 5,
        damageType: 'thunder',
    },
    {
        id: 'green-flame-blade',
        name: 'Green-Flame Blade',
        description: 'Extra fire damage at 5th (1d8), 11th (2d8), 17th (3d8).',
        getFormula: (rank = 5) => {
            if (rank >= 17) return '3d8';
            if (rank >= 11) return '2d8';
            if (rank >= 5) return '1d8';
            return '0';
        },
        minRank: 1,
        maxRank: 20,
        rankLabel: 'Character Level',
        defaultRank: 5,
        damageType: 'fire',
    },
    {
        id: 'sneak-attack',
        name: 'Sneak Attack',
        description: '1d6 per 2 rogue levels.',
        getFormula: (rank = 1) => `${Math.max(1, Math.ceil(rank / 2))}d6`,
        minRank: 1,
        maxRank: 20,
        rankLabel: 'Rogue Level',
        defaultRank: 1,
        damageType: 'same',
    },
    {
        id: 'rage',
        name: 'Rage',
        description: '+2 at 1st, +3 at 9th, +4 at 16th barbarian level.',
        getFormula: (rank = 1) => {
            if (rank >= 16) return '+4';
            if (rank >= 9) return '+3';
            return '+2';
        },
        minRank: 1,
        maxRank: 20,
        rankLabel: 'Barbarian Level',
        defaultRank: 1,
        damageType: 'same',
    },
    {
        id: 'gwm',
        name: 'Great Weapon Master',
        description: '+10 flat damage (heavy weapon, -5 to hit).',
        getFormula: () => '+10',
        damageType: 'same',
    },
    {
        id: 'sharpshooter',
        name: 'Sharpshooter',
        description: '+10 flat damage (ranged, -5 to hit).',
        getFormula: () => '+10',
        damageType: 'same',
    },
    {
        id: 'divine-favor',
        name: 'Divine Favor',
        description: '+1d4 radiant damage on weapon attacks.',
        getFormula: () => '1d4',
        damageType: 'radiant',
    },
];

/** Быстрый доступ по id. */
export const getBuffById = (id: string): DamageBuff | undefined =>
    DAMAGE_BUFFS.find(b => b.id === id);