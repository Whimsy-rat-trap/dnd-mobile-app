import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Spell } from '../types/Character';

interface SpellContextType {
    customSpells: Spell[];
    addCustomSpell: (spell: Omit<Spell, 'id'>) => void;
    updateCustomSpell: (id: string, spell: Omit<Spell, 'id' | 'isCustom' | 'prepared'>) => void;
    removeCustomSpell: (id: string) => void;
    getCustomSpells: () => Spell[];
}

const SpellContext = createContext<SpellContextType | undefined>(undefined);

const STORAGE_KEY = 'dnd_custom_spells';

export const SpellProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [customSpells, setCustomSpells] = useState<Spell[]>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(customSpells));
    }, [customSpells]);

    const addCustomSpell = (spell: Omit<Spell, 'id'>) => {
        const newSpell: Spell = {
            ...spell,
            id: `custom-${Date.now()}`,
            isCustom: true,
            prepared: false,
        };
        setCustomSpells(prev => [...prev, newSpell]);
    };

    const updateCustomSpell = (id: string, spellData: Omit<Spell, 'id' | 'isCustom' | 'prepared'>) => {
        setCustomSpells(prev => prev.map(s =>
            s.id === id ? { ...s, ...spellData } : s
        ));
    };

    const removeCustomSpell = (id: string) => {
        setCustomSpells(prev => prev.filter(s => s.id !== id));
    };

    const getCustomSpells = () => customSpells;

    return (
        <SpellContext.Provider value={{ customSpells, addCustomSpell, updateCustomSpell, removeCustomSpell, getCustomSpells }}>
            {children}
        </SpellContext.Provider>
    );
};

export const useSpells = () => {
    const context = useContext(SpellContext);
    if (!context) {
        throw new Error('useSpells must be used within a SpellProvider');
    }
    return context;
};