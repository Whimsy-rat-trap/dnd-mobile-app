export interface ClassLevel {
    className: string;
    level: number;
    /** Подкласс, выбранный для этого класса (Eldritch Knight и тп) */
    subclass?: string;
}

export interface Character {
    id: string;
    name: string;
    /** @deprecated Основной класс теперь используют classLevels[0].className */
    class: string;
    /** @deprecated Все классы теперь используют classLevels.map(cl => cl.className) */
    classes: string[];
    /** @deprecated Подклассы основного класса теперь используют classLevels[0].subclass */
    subclass?: string;
    level: number;
    classLevels: ClassLevel[];
    race: string;
    subrace?: string;
    background: string;
    hp: number;
    maxHp: number;
    tempHp: number;
    exp: number;
    ac?: number;
    speed?: number;
    status: 'active' | 'dead' | 'archived';
    created: string;
    lastUsed: string;
    died?: string;
    archived?: string;
    abilities: {
        str: number;
        dex: number;
        con: number;
        int: number;
        wis: number;
        cha: number;
    };
    skills: { name: string; attribute: string; proficient: boolean }[];
    savingThrowProficiencies: string[];
    toolProficiencies: { name: string; attribute: string; proficient: boolean }[];
    size: string;
    creatureType: string;
    languages: string[];
    inventory: InventoryItem[];
    spells: Spell[];
    quests: Quest[];
    /**
     * @deprecated Кампании теперь хранятся в Campaign.characterIds.
     * Оставлено для обратной совместимости, использовать не рекомендеутся
     */
    campaigns: Campaign[];
    feats: Feat[];
    currency: {
        gp: number;
        sp: number;
        cp: number;
    };
    diceLogs: Record<number, { result: number; timestamp: number }[]>;
    // Death Saving Throws
    deathSuccesses: number;
    deathFailures: number;
    isStable: boolean;
    activeConcentrationSpellId?: string | null;
    /** Сколько слотов потрачено на каждом уровне (индекс 0 = 1-й уровень, 8 = 9-й). */
    usedSpellSlots?: number[];
    /** Сколько слотов Pact Magic потрачено (для Warlock). */
    usedPactSlots?: number;
}

export interface InventoryItem {
    id: string;
    name: string;
    type: 'weapon' | 'armor' | 'potion' | 'scroll' | 'ring' | 'wand' | 'shield' | 'natural weapon' | 'other';
    rarity: 'common' | 'uncommon' | 'rare' | 'very rare' | 'legendary';
    description: string;
    equipped: boolean;
    damageDice?: string;
    damageType?: string;
    healingDice?: string;
    uses?: { current: number; max: number };
    baseAC?: number;
    acBonus?: number;
    dexModifierAllowed?: boolean;
    maxDexBonus?: number;
    strengthRequirement?: number;
    stealthDisadvantage?: boolean;
    currency?: { gp: number; sp: number; cp: number };
}

export interface Spell {
    id: string;
    name: string;
    level: number;
    school: string;
    castingTime: string;
    range: string;
    components: string;
    description: string;
    prepared: boolean;
    isCustom?: boolean;
    isRacial?: boolean;
    source?: 'race' | 'subrace';
    element?: string;
    requiresConcentration?: boolean;
    classes?: string[];
    diceRoll?: string;
    damageRoll?: string;
    damageType?: string;
}

export interface Quest {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'completed' | 'failed';
    rewardType?: 'text' | 'item' | 'currency';
    rewardText?: string;
    rewardItemId?: string;  // ID предмета из LibraryItem или custom
    rewardCurrency?: {
        gp: number;
        sp: number;
        cp: number;
    };
    rewardVisibleToPlayers?: boolean;   // true – видна всем, false – только DM
}

export interface Campaign {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'paused' | 'ended';
    dm?: string;
    players?: number;
    sessions?: number;
    lastPlayed?: string;
    characterIds: string[];
}

export interface Feat {
    id: string;
    name: string;
    description: string;
    source: 'background' | 'class' | 'race' | 'subrace' | 'custom' | 'level' | 'quest' | 'other';
    prerequisite?: string;
    damageDice?: string;
    damageType?: string;
    /** Уровень, на котором получен фит (для source: 'level'). */
    gainedAtLevel?: number;
    /** Доп. инфа: название квеста, кто дал и т.д. */
    sourceDetail?: string;
}