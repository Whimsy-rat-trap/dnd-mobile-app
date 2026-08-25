import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LibraryItem } from '../constants/items';

interface ItemContextType {
    customItems: LibraryItem[];
    addCustomItem: (item: Omit<LibraryItem, 'id'>) => void;
    removeCustomItem: (id: string) => void;
}

const ItemContext = createContext<ItemContextType | undefined>(undefined);
const STORAGE_KEY = 'dnd_custom_items';

export const ItemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [customItems, setCustomItems] = useState<LibraryItem[]>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(customItems));
    }, [customItems]);

    const addCustomItem = (item: Omit<LibraryItem, 'id'>) => {
        const newItem: LibraryItem = {
            ...item,
            id: `custom-${Date.now()}`,
        };
        setCustomItems(prev => [...prev, newItem]);
    };

    const removeCustomItem = (id: string) => {
        setCustomItems(prev => prev.filter(item => item.id !== id));
    };

    return (
        <ItemContext.Provider value={{ customItems, addCustomItem, removeCustomItem }}>
            {children}
        </ItemContext.Provider>
    );
};

export const useItems = () => {
    const context = useContext(ItemContext);
    if (!context) {
        throw new Error('useItems must be used within an ItemProvider');
    }
    return context;
};