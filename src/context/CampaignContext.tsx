import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Campaign } from '../types/Character';

interface CampaignContextType {
    campaigns: Campaign[];
    addCampaign: (campaign: Omit<Campaign, 'id' | 'characterIds'>) => void;
    updateCampaign: (id: string, data: Partial<Campaign>) => void;
    deleteCampaign: (id: string) => void;
    getCampaign: (id: string) => Campaign | undefined;
    // Работа с персонажами
    addCharacterToCampaign: (campaignId: string, characterId: string) => void;
    removeCharacterFromCampaign: (campaignId: string, characterId: string) => void;
    getCampaignsForCharacter: (characterId: string) => Campaign[];
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);
const STORAGE_KEY = 'dnd_campaigns';
const MIGRATION_KEY = 'dnd_campaigns_migration_v1';

export const CampaignProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];
        try {
            const parsed = JSON.parse(stored);
            // Защита: гарантируем наличие characterIds
            return parsed.map((c: any) => ({
                ...c,
                characterIds: Array.isArray(c.characterIds) ? c.characterIds : [],
            }));
        } catch {
            return [];
        }
    });

    // Миграция: перенос character.campaigns → campaign.characterIds
    useEffect(() => {
        if (localStorage.getItem(MIGRATION_KEY) === 'done') return;

        try {
            const charsStored = localStorage.getItem('dnd_characters');
            if (!charsStored) {
                localStorage.setItem(MIGRATION_KEY, 'done');
                return;
            }

            const characters = JSON.parse(charsStored);

            // Собираем map: campaignId → Set<characterId>
            const campaignToCharacters: Record<string, Set<string>> = {};
            for (const char of characters) {
                if (Array.isArray(char.campaigns)) {
                    for (const camp of char.campaigns) {
                        if (camp?.id) {
                            if (!campaignToCharacters[camp.id]) {
                                campaignToCharacters[camp.id] = new Set();
                            }
                            campaignToCharacters[camp.id].add(char.id);
                        }
                    }
                }
            }

            // Обновляем кампании, добавляя найденных персонажей
            setCampaigns(prev =>
                prev.map(camp => {
                    const existing = new Set(camp.characterIds || []);
                    const fromMigration = campaignToCharacters[camp.id];
                    if (fromMigration) {
                        fromMigration.forEach(cid => existing.add(cid));
                    }
                    return { ...camp, characterIds: Array.from(existing) };
                })
            );

            localStorage.setItem(MIGRATION_KEY, 'done');
        } catch (e) {
            console.error('Campaign migration failed', e);
        }
    }, []);

    // Сохранение в localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
    }, [campaigns]);

    // CRUD
    const addCampaign = (campaign: Omit<Campaign, 'id' | 'characterIds'>) => {
        const newCampaign: Campaign = {
            ...campaign,
            id: Date.now().toString(),
            characterIds: [],
            dm: campaign.dm || 'Dungeon Master',
            players: campaign.players || 4,
            sessions: campaign.sessions || 0,
        };
        setCampaigns(prev => [...prev, newCampaign]);
    };

    const updateCampaign = (id: string, data: Partial<Campaign>) => {
        setCampaigns(prev => prev.map(c => (c.id === id ? { ...c, ...data } : c)));
    };

    const deleteCampaign = (id: string) => {
        setCampaigns(prev => prev.filter(c => c.id !== id));
    };

    const getCampaign = (id: string) => campaigns.find(c => c.id === id);

    // Работа с персонажами
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

    const getCampaignsForCharacter = (characterId: string) =>
        campaigns.filter(c => (c.characterIds || []).includes(characterId));

    return (
        <CampaignContext.Provider
            value={{
                campaigns,
                addCampaign,
                updateCampaign,
                deleteCampaign,
                getCampaign,
                addCharacterToCampaign,
                removeCharacterFromCampaign,
                getCampaignsForCharacter,
            }}
        >
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