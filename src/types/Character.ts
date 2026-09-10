export interface Character {
    id: string;
    name: string;
    class: string;
    classes: string[];
    subclass?: string;
    level: number;
    classLevels: { className: string; level: number }[];
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
}

export interface InventoryItem {
    id: string;
    name: string;
    type: 'weapon' | 'armor' | 'potion' | 'scroll' | 'ring' | 'wand' | 'shield' | 'natural weapon' | 'other';
    rarity: 'common' | 'uncommon' | 'rare' | 'very rare' | 'legendary';
    description: string;
    equipped: boolean;
    damageDice?: string;    // например 2d6
    damageType?: string;    // fire, slashing
    healingDice?: string;   // 2d4+2
    uses?: { current: number; max: number };
    baseAC?: number;
    acBonus?: number;
    dexModifierAllowed?: boolean;
    maxDexBonus?: number;
    strengthRequirement?: number;
    stealthDisadvantage?: boolean;
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
}

export interface Quest {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'completed' | 'failed';
    rewardType: 'text' | 'item' | 'currency';
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
}

export interface Feat {
    id: string;
    name: string;
    description: string;
    source: 'background' | 'class' | 'race' | 'subrace' | 'custom' | 'other';
    prerequisite?: string;
}