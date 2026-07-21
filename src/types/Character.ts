export interface Character {
    id: string;
    name: string;
    class: string;
    classes: string[];
    level: number;
    race: string;
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
    toolProficiencies: string[];
    inventory: InventoryItem[];
    spells: Spell[];
    quests: Quest[];
    campaigns: Campaign[];
    diceLogs: Record<number, { result: number; timestamp: number }[]>;
    // --- Death Saving Throws ---
    deathSuccesses: number;
    deathFailures: number;
    isStable: boolean;
}

export interface InventoryItem {
    id: string;
    name: string;
    type: 'weapon' | 'armor' | 'potion' | 'scroll' | 'other';
    rarity: 'common' | 'uncommon' | 'rare' | 'very rare' | 'legendary';
    description: string;
    equipped: boolean;
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
}

export interface Quest {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'completed' | 'failed';
}

export interface Campaign {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'paused' | 'ended';
    dm?: string;
    players?: number;
    sessions?: number;
}