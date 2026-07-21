import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Character, InventoryItem, Spell, Quest, Campaign } from '../types/Character';

// Дефолтный список навыков (используется при создании и для миграции старых персонажей)
const defaultSkills = [
    { name: 'Acrobatics', attribute: 'DEX', proficient: false },
    { name: 'Animal Handling', attribute: 'WIS', proficient: false },
    { name: 'Arcana', attribute: 'INT', proficient: false },
    { name: 'Athletics', attribute: 'STR', proficient: false },
    { name: 'Deception', attribute: 'CHA', proficient: false },
    { name: 'History', attribute: 'INT', proficient: false },
    { name: 'Insight', attribute: 'WIS', proficient: false },
    { name: 'Intimidation', attribute: 'CHA', proficient: false },
    { name: 'Investigation', attribute: 'INT', proficient: false },
    { name: 'Medicine', attribute: 'WIS', proficient: false },
    { name: 'Nature', attribute: 'INT', proficient: false },
    { name: 'Perception', attribute: 'WIS', proficient: false },
    { name: 'Performance', attribute: 'CHA', proficient: false },
    { name: 'Persuasion', attribute: 'CHA', proficient: false },
    { name: 'Religion', attribute: 'INT', proficient: false },
    { name: 'Sleight of Hand', attribute: 'DEX', proficient: false },
    { name: 'Stealth', attribute: 'DEX', proficient: false },
    { name: 'Survival', attribute: 'WIS', proficient: false },
];

// Интерфейс контекста
interface CharacterContextType {
    characters: Character[];
    currentCharacterId: string | null;
    addCharacter: (character: Omit<Character, 'id'>) => void;
    updateCharacter: (id: string, data: Partial<Character>) => void;
    deleteCharacter: (id: string) => void;
    getCharacter: (id: string) => Character | undefined;
    setCurrentCharacterId: (id: string | null) => void;
    addItemToInventory: (characterId: string, item: Omit<InventoryItem, 'id'>) => void;
    removeItemFromInventory: (characterId: string, itemId: string) => void;
    updateItemInInventory: (characterId: string, itemId: string, updates: Partial<InventoryItem>) => void;
    addSpellToCharacter: (characterId: string, spell: Omit<Spell, 'id'>) => void;
    removeSpellFromCharacter: (characterId: string, spellId: string) => void;
    updateSpell: (characterId: string, spellId: string, updates: Partial<Spell>) => void;
    addQuestToCharacter: (characterId: string, quest: Omit<Quest, 'id'>) => void;
    removeQuestFromCharacter: (characterId: string, questId: string) => void;
    updateQuest: (characterId: string, questId: string, updates: Partial<Quest>) => void;
    addCampaignToCharacter: (characterId: string, campaign: Omit<Campaign, 'id'>) => void;
    removeCampaignFromCharacter: (characterId: string, campaignId: string) => void;
    updateCampaign: (characterId: string, campaignId: string, updates: Partial<Campaign>) => void;
    addDiceLog: (characterId: string, sides: number, result: number) => void;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);
const STORAGE_KEY = 'dnd_characters';

export const CharacterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Инициализация состояния с миграцией для старых персонажей
    const [characters, setCharacters] = useState<Character[]>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];
        try {
            const parsed = JSON.parse(stored);
            return parsed.map((char: any) => {
                const updated = { ...char };

                // Миграция class -> classes
                if (typeof updated.class === 'string' && !updated.classes) {
                    updated.classes = [updated.class];
                } else if (!updated.classes) {
                    updated.classes = [updated.class || 'Fighter'];
                }
                if (!updated.class) {
                    updated.class = updated.classes[0] || 'Fighter';
                }

                // Навыки (skills)
                if (!updated.skills || updated.skills.length === 0) {
                    updated.skills = defaultSkills;
                }

                // Tool Proficiencies – миграция
                if (!updated.toolProficiencies) {
                    updated.toolProficiencies = [];
                } else {
                    updated.toolProficiencies = updated.toolProficiencies.map((tool: any) => {
                        if (typeof tool === 'string') {
                            // Было: ["Thieves' Tools", "Disguise Kit"] => преобразуем
                            return { name: tool, attribute: 'DEX', proficient: true };
                        }
                        // Уже объект, но без attribute? Добавляем.
                        return { ...tool, attribute: tool.attribute || 'DEX' };
                    });
                }

                // Dice logs
                if (!updated.diceLogs) {
                    updated.diceLogs = {};
                }

                // Death saves
                if (updated.deathSuccesses === undefined) updated.deathSuccesses = 0;
                if (updated.deathFailures === undefined) updated.deathFailures = 0;
                if (updated.isStable === undefined) updated.isStable = false;

                return updated;
            });
        } catch (e) {
            console.error('Failed to parse characters from localStorage', e);
            return [];
        }
    });

    const [currentCharacterId, setCurrentCharacterId] = useState<string | null>(null);

    // Сохранение в localStorage при каждом изменении
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
    }, [characters]);

    // Базовые CRUD операции
    const addCharacter = (character: Omit<Character, 'id'>) => {
        const newCharacter: Character = {
            ...character,
            id: Date.now().toString(),
            class: character.class || 'Fighter',
            classes: character.classes || [character.class || 'Fighter'],
            skills: (character.skills && character.skills.length > 0) ? character.skills : defaultSkills,
            toolProficiencies: character.toolProficiencies ? character.toolProficiencies.map((tool: any) => ({
                name: tool.name || tool,
                attribute: tool.attribute || 'DEX',
                proficient: tool.proficient !== undefined ? tool.proficient : true,
            })) : [],
            diceLogs: character.diceLogs || {},
            deathSuccesses: character.deathSuccesses ?? 0,
            deathFailures: character.deathFailures ?? 0,
            isStable: character.isStable ?? false,
        };
        setCharacters(prev => [...prev, newCharacter]);
        setCurrentCharacterId(newCharacter.id);
    };

    const updateCharacter = (id: string, data: Partial<Character>) => {
        setCharacters(prev =>
            prev.map(char => (char.id === id ? { ...char, ...data } : char))
        );
    };

    const deleteCharacter = (id: string) => {
        setCharacters(prev => prev.filter(char => char.id !== id));
        if (currentCharacterId === id) setCurrentCharacterId(null);
    };

    const getCharacter = (id: string) => characters.find(char => char.id === id);

    // Инвентарь
    const addItemToInventory = (characterId: string, item: Omit<InventoryItem, 'id'>) => {
        const char = getCharacter(characterId);
        if (!char) return;
        const newItem: InventoryItem = { ...item, id: Date.now().toString() };
        updateCharacter(characterId, {
            inventory: [...char.inventory, newItem],
        });
    };

    const removeItemFromInventory = (characterId: string, itemId: string) => {
        const char = getCharacter(characterId);
        if (!char) return;
        updateCharacter(characterId, {
            inventory: char.inventory.filter(item => item.id !== itemId),
        });
    };

    const updateItemInInventory = (characterId: string, itemId: string, updates: Partial<InventoryItem>) => {
        const char = getCharacter(characterId);
        if (!char) return;
        updateCharacter(characterId, {
            inventory: char.inventory.map(item =>
                item.id === itemId ? { ...item, ...updates } : item
            ),
        });
    };

    // Заклинания
    const addSpellToCharacter = (characterId: string, spell: Omit<Spell, 'id'>) => {
        const char = getCharacter(characterId);
        if (!char) return;
        const newSpell: Spell = { ...spell, id: Date.now().toString(), prepared: spell.prepared || false };
        updateCharacter(characterId, {
            spells: [...char.spells, newSpell],
        });
    };

    const removeSpellFromCharacter = (characterId: string, spellId: string) => {
        const char = getCharacter(characterId);
        if (!char) return;
        updateCharacter(characterId, {
            spells: char.spells.filter(spell => spell.id !== spellId),
        });
    };

    const updateSpell = (characterId: string, spellId: string, updates: Partial<Spell>) => {
        const char = getCharacter(characterId);
        if (!char) return;
        updateCharacter(characterId, {
            spells: char.spells.map(spell =>
                spell.id === spellId ? { ...spell, ...updates } : spell
            ),
        });
    };

    // Квесты
    const addQuestToCharacter = (characterId: string, quest: Omit<Quest, 'id'>) => {
        const char = getCharacter(characterId);
        if (!char) return;
        const newQuest: Quest = { ...quest, id: Date.now().toString() };
        updateCharacter(characterId, {
            quests: [...char.quests, newQuest],
        });
    };

    const removeQuestFromCharacter = (characterId: string, questId: string) => {
        const char = getCharacter(characterId);
        if (!char) return;
        updateCharacter(characterId, {
            quests: char.quests.filter(q => q.id !== questId),
        });
    };

    const updateQuest = (characterId: string, questId: string, updates: Partial<Quest>) => {
        const char = getCharacter(characterId);
        if (!char) return;
        updateCharacter(characterId, {
            quests: char.quests.map(q =>
                q.id === questId ? { ...q, ...updates } : q
            ),
        });
    };

    // Кампании
    const addCampaignToCharacter = (characterId: string, campaign: Omit<Campaign, 'id'>) => {
        const char = getCharacter(characterId);
        if (!char) return;
        const newCampaign: Campaign = { ...campaign, id: Date.now().toString() };
        updateCharacter(characterId, {
            campaigns: [...char.campaigns, newCampaign],
        });
    };

    const removeCampaignFromCharacter = (characterId: string, campaignId: string) => {
        const char = getCharacter(characterId);
        if (!char) return;
        updateCharacter(characterId, {
            campaigns: char.campaigns.filter(c => c.id !== campaignId),
        });
    };

    const updateCampaign = (characterId: string, campaignId: string, updates: Partial<Campaign>) => {
        const char = getCharacter(characterId);
        if (!char) return;
        updateCharacter(characterId, {
            campaigns: char.campaigns.map(c =>
                c.id === campaignId ? { ...c, ...updates } : c
            ),
        });
    };

    // Dice Logs
    const addDiceLog = (characterId: string, sides: number, result: number) => {
        const char = getCharacter(characterId);
        if (!char) return;
        const newLog = { result, timestamp: Date.now() };
        const currentLogs = char.diceLogs || {};
        const updatedLogs = {
            ...currentLogs,
            [sides]: [...(currentLogs[sides] || []), newLog],
        };
        updateCharacter(characterId, { diceLogs: updatedLogs });
    };

    // Значения передаваемые в контекст
    const value: CharacterContextType = {
        characters,
        currentCharacterId,
        addCharacter,
        updateCharacter,
        deleteCharacter,
        getCharacter,
        setCurrentCharacterId,
        addItemToInventory,
        removeItemFromInventory,
        updateItemInInventory,
        addSpellToCharacter,
        removeSpellFromCharacter,
        updateSpell,
        addQuestToCharacter,
        removeQuestFromCharacter,
        updateQuest,
        addCampaignToCharacter,
        removeCampaignFromCharacter,
        updateCampaign,
        addDiceLog,
    };

    return (
        <CharacterContext.Provider value={value}>
            {children}
        </CharacterContext.Provider>
    );
};

export const useCharacters = () => {
    const context = useContext(CharacterContext);
    if (!context) {
        throw new Error('useCharacters must be used within a CharacterProvider');
    }
    return context;
};