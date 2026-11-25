import { InventoryItem } from '../types/Character';

// Rarity tiers in ascending order — used for filters and sorting.
export const RARITIES = ['common', 'uncommon', 'rare', 'very rare', 'legendary'] as const;

export type Rarity = (typeof RARITIES)[number];

const RARITY_COLORS: Record<Rarity, string> = {
    common: '#9ca3af',
    uncommon: '#34d399',
    rare: '#60a5fa',
    'very rare': '#a78bfa',
    legendary: '#fbbf24',
};

export const getRarityColor = (rarity: Rarity | InventoryItem['rarity']): string =>
    RARITY_COLORS[rarity as Rarity] ?? '#fff';
