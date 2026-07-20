import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Campaign } from '../types/Character';

interface CampaignContextType {
    campaigns: Campaign[];
    addCampaign: (campaign: Omit<Campaign, 'id'>) => void;
    updateCampaign: (id: string, data: Partial<Campaign>) => void;
    deleteCampaign: (id: string) => void;
    getCampaign: (id: string) => Campaign | undefined;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);
const STORAGE_KEY = 'dnd_campaigns';

export const CampaignProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
    }, [campaigns]);

    const addCampaign = (campaign: Omit<Campaign, 'id'>) => {
        const newCampaign: Campaign = { ...campaign, id: Date.now().toString() };
        setCampaigns(prev => [...prev, newCampaign]);
    };

    const updateCampaign = (id: string, data: Partial<Campaign>) => {
        setCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    };

    const deleteCampaign = (id: string) => {
        setCampaigns(prev => prev.filter(c => c.id !== id));
    };

    const getCampaign = (id: string) => campaigns.find(c => c.id === id);

    return (
        <CampaignContext.Provider value={{ campaigns, addCampaign, updateCampaign, deleteCampaign, getCampaign }}>
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