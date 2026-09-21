import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Campaign } from '../types/Character';
import { useCharacters } from './CharacterContext';

interface CampaignContextType {
    campaigns: Campaign[];
    addCampaign: (campaign: Omit<Campaign, 'id'>) => string;
    updateCampaign: (id: string, data: Partial<Campaign>) => void;
    deleteCampaign: (id: string) => void;
    getCampaign: (id: string) => Campaign | undefined;
    addCharacterToCampaign: (campaignId: string, characterId: string) => void;
    removeCharacterFromCampaign: (campaignId: string, characterId: string) => void;
    getCampaignsForCharacter: (characterId: string) => Campaign[];
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

const STORAGE_KEY = 'dnd_campaigns';
const CHARACTERS_STORAGE_KEY = 'dnd_characters';
const LEGACY_ATTACHED_KEY = 'dnd_campaigns_legacy_attached';

export const CampaignProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { currentCharacterId } = useCharacters();

    const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        let parsed: any[] = [];
        try {
            parsed = stored ? JSON.parse(stored) : [];
            if (!Array.isArray(parsed)) parsed = [];
        } catch {
            parsed = [];
        }

        // Читаем персонажей чтобы объединить связи character.campaigns → campaign.characterIds
        let characters: any[] = [];
        try {
            const charsRaw = localStorage.getItem(CHARACTERS_STORAGE_KEY);
            characters = charsRaw ? JSON.parse(charsRaw) : [];
            if (!Array.isArray(characters)) characters = [];
        } catch {
            characters = [];
        }

        // Собираем map: campaignId → Set<characterId> из legacy character.campaigns
        const legacyMap: Record<string, Set<string>> = {};
        for (const char of characters) {
            if (!char || !char.id) continue;
            if (Array.isArray(char.campaigns)) {
                for (const camp of char.campaigns) {
                    if (camp?.id) {
                        if (!legacyMap[camp.id]) legacyMap[camp.id] = new Set();
                        legacyMap[camp.id].add(char.id);
                    }
                }
            }
        }

        // Объединяем то, что уже есть в characterIds, с тем, что нашли в character.campaigns
        return parsed.map((c: any) => {
            const existing = new Set<string>(Array.isArray(c.characterIds) ? c.characterIds : []);
            const fromLegacy = legacyMap[c.id];
            if (fromLegacy) {
                fromLegacy.forEach(id => existing.add(id));
            }
            return {
                ...c,
                characterIds: Array.from(existing),
            };
        });
    });

    // Авто-привязка legacy-кампаний к текущему персонажу (один раз)
    useEffect(() => {
        if (!currentCharacterId) return;
        if (localStorage.getItem(LEGACY_ATTACHED_KEY) === 'done') return;
        if (campaigns.length === 0) return;

        // Находим кампании без участников
        const hasLegacy = campaigns.some(c => (c.characterIds || []).length === 0);
        if (!hasLegacy) {
            localStorage.setItem(LEGACY_ATTACHED_KEY, 'done');
            return;
        }

        // Привязываем все legacy-кампании к текущему персонажу
        setCampaigns(prev =>
            prev.map(c => {
                const ids = c.characterIds || [];
                if (ids.length === 0) {
                    return { ...c, characterIds: [currentCharacterId] };
                }
                return c;
            })
        );

        localStorage.setItem(LEGACY_ATTACHED_KEY, 'done');
    }, [currentCharacterId, campaigns]);

    // Сохранение в localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
    }, [campaigns]);

    // CRUD
    const addCampaign = (campaign: Omit<Campaign, 'id'>): string => {
        const newId = Date.now().toString();
        const newCampaign: Campaign = {
            ...campaign,
            id: newId,
            characterIds: campaign.characterIds ?? [],
            dm: campaign.dm || 'Dungeon Master',
            players: campaign.players ?? 4,
            sessions: campaign.sessions ?? 0,
        };
        setCampaigns(prev => [...prev, newCampaign]);
        return newId;
    };

    const updateCampaign = (id: string, data: Partial<Campaign>) => {
        setCampaigns(prev => prev.map(c => (c.id === id ? { ...c, ...data } : c)));
    };

    const deleteCampaign = (id: string) => {
        setCampaigns(prev => prev.filter(c => c.id !== id));
    };

    const getCampaign = (id: string) => campaigns.find(c => c.id === id);

    // Управление участниками
    const addCharacterToCampaign = (campaignId: string, characterId: string) => {
        setCampaigns(prev =>
            prev.map(c => {
                if (c.id !== campaignId) return c;
                const ids = c.characterIds || [];
                if (ids.includes(characterId)) return c;
                return { ...c, characterIds: [...ids, characterId] };
            })
        );
    };

    const removeCharacterFromCampaign = (campaignId: string, characterId: string) => {
        setCampaigns(prev =>
            prev.map(c =>
                c.id === campaignId
                    ? { ...c, characterIds: (c.characterIds || []).filter(id => id !== characterId) }
                    : c
            )
        );
    };

    /**
     * Возвращает кампании для указанного персонажа.
     *
     * Логика:
     * 1. Кампания, где characterId явно указан в characterIds → показываем.
     * 2. Legacy-кампания без участников (characterIds пустой) → показываем всем,
     *    чтобы пользователь мог вручную распределить участников.
     */
    const getCampaignsForCharacter = (characterId: string): Campaign[] =>
        campaigns.filter(c => {
            const ids = c.characterIds || [];
            if (ids.includes(characterId)) return true;
            if (ids.length === 0) return true;
            return false;
        });

    // Значение контекста
    const value: CampaignContextType = {
        campaigns,
        addCampaign,
        updateCampaign,
        deleteCampaign,
        getCampaign,
        addCharacterToCampaign,
        removeCharacterFromCampaign,
        getCampaignsForCharacter,
    };

    return (
        <CampaignContext.Provider value={value}>
            {children}
        </CampaignContext.Provider>
    );
};

export const useCampaigns = () => {
    const context = useContext(CampaignContext);
    if (!context) {
        throw new Error('useCampaigns must be used within a CampaignProvider');
    }
    return context;
};