export interface Character {
    id: string;
    name: string;
    class: string;
    level: number;
    race: string;
    background: string;
    hp: number;
    maxHp: number;
    tempHp: number;
    exp: number;
    ac?: number;              // добавлено
    speed?: number;           // добавлено
    status?: 'active' | 'dead' | 'archived';  // добавлено
    created?: string;         // добавлено
    lastUsed?: string;        // добавлено
    died?: string;            // добавлено
    archived?: string;        // добавлено
    abilities: {
        str: number;
        dex: number;
        con: number;
        int: number;
        wis: number;
        cha: number;
    };
    skills: { name: string; attribute: string; proficient: boolean }[];
    inventory: InventoryItem[];
    spells: Spell[];
    quests: Quest[];
    campaigns: Campaign[];
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
}