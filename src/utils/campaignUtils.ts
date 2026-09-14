import { Campaign } from '../types/Character';

/**
 * Форматирует дату последней игры в читаемый вид.
 */
export const formatLastPlayed = (lastPlayed?: string): string => {
    if (!lastPlayed) return 'Never played';
    const diff = Date.now() - new Date(lastPlayed).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days < 0) return 'Scheduled in the future';
    if (days === 0) return 'Played today';
    if (days === 1) return 'Played yesterday';
    if (days < 7) return `Played ${days} days ago`;
    if (days < 30) {
        const weeks = Math.floor(days / 7);
        return `Played ${weeks} week${weeks > 1 ? 's' : ''} ago`;
    }
    if (days < 365) {
        const months = Math.floor(days / 30);
        return `Played ${months} month${months > 1 ? 's' : ''} ago`;
    }
    const years = Math.floor(days / 365);
    return `Played ${years} year${years > 1 ? 's' : ''} ago`;
};

/**
 * Человекочитаемый статус кампании.
 */
export const getStatusLabel = (status: Campaign['status']): string => {
    switch (status) {
        case 'active': return 'ACTIVE';
        case 'paused': return 'PAUSED';
        case 'ended': return 'ENDED';
        default: return 'UNKNOWN';
    }
};

/**
 * Циклическое переключение статуса: active → paused → ended → active.
 */
export const cycleStatus = (current: Campaign['status']): Campaign['status'] => {
    switch (current) {
        case 'active': return 'paused';
        case 'paused': return 'ended';
        case 'ended': return 'active';
        default: return 'active';
    }
};

export interface CampaignFilters {
    dm: string;
    players: { min: number; max: number };
    sessions: { min: number; max: number };
    lastPlayedAfter: string;
    lastPlayedBefore: string;
    status: string;
}

export const DEFAULT_CAMPAIGN_FILTERS: CampaignFilters = {
    dm: '',
    players: { min: 0, max: 20 },
    sessions: { min: 0, max: 100 },
    lastPlayedAfter: '',
    lastPlayedBefore: '',
    status: '',
};

/**
 * Фильтрация кампаний по поиску и фильтрам.
 */
export const filterCampaigns = (
    campaigns: Campaign[],
    searchQuery: string,
    filters: CampaignFilters
): Campaign[] => {
    const query = searchQuery.toLowerCase().trim();

    return campaigns.filter(camp => {
        const matchesSearch = !query ||
            camp.name.toLowerCase().includes(query) ||
            (camp.description || '').toLowerCase().includes(query) ||
            (camp.dm || '').toLowerCase().includes(query);

        const matchesDm = !filters.dm ||
            (camp.dm || '').toLowerCase().includes(filters.dm.toLowerCase());

        const playersCount = camp.players ?? 0;
        const matchesPlayers =
            playersCount >= filters.players.min &&
            playersCount <= filters.players.max;

        const sessionsCount = camp.sessions ?? 0;
        const matchesSessions =
            sessionsCount >= filters.sessions.min &&
            sessionsCount <= filters.sessions.max;

        const lastPlayedTs = camp.lastPlayed ? new Date(camp.lastPlayed).getTime() : null;
        const afterTs = filters.lastPlayedAfter ? new Date(filters.lastPlayedAfter).getTime() : null;
        const beforeTs = filters.lastPlayedBefore ? new Date(filters.lastPlayedBefore).getTime() : null;

        const matchesLastPlayed =
            (afterTs === null || (lastPlayedTs !== null && lastPlayedTs >= afterTs)) &&
            (beforeTs === null || (lastPlayedTs !== null && lastPlayedTs <= beforeTs));

        const matchesStatus = !filters.status || camp.status === filters.status;

        return matchesSearch && matchesDm && matchesPlayers && matchesSessions &&
            matchesLastPlayed && matchesStatus;
    });
};

/**
 * Проверка корректности полей формы кампании.
 */
export const validateCampaign = (campaign: Partial<Campaign>): string | null => {
    if (!campaign.name || !campaign.name.trim()) return 'Name is required';
    if (campaign.players !== undefined && (campaign.players < 0 || campaign.players > 50)) {
        return 'Players must be between 0 and 50';
    }
    if (campaign.sessions !== undefined && campaign.sessions < 0) {
        return 'Sessions cannot be negative';
    }
    return null;
};