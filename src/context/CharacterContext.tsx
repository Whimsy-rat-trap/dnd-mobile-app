import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Character, InventoryItem, Spell, Quest, Campaign } from '../types/Character';
import { getNaturalWeapons } from '../utils/racialFeatures';
import { getRacialSpells } from '../constants/racialSpells';

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

                // миграция class -> classes
                if (typeof updated.class === 'string' && !updated.classes) {
                    updated.classes = [updated.class];
                } else if (!updated.classes) {
                    updated.classes = [updated.class || 'Fighter'];
                }
                if (!updated.class) {
                    updated.class = updated.classes[0] || 'Fighter';
                }

                // миграция classLevels
                if (!updated.classLevels || updated.classLevels.length === 0) {
                    if (updated.classes && updated.level) {
                        updated.classLevels = updated.classes.map((cls: string) => ({ className: cls, level: updated.level }));
                    } else if (updated.class) {
                        updated.classLevels = [{ className: updated.class, level: updated.level || 1 }];
                    } else {
                        updated.classLevels = [{ className: 'Fighter', level: 1 }];
                    }
                }
                // Пересчитываем общий уровень для обратной совместимости
                if (updated.classLevels.length > 0) {
                    updated.level = updated.classLevels.reduce((sum: number, cl: any) => sum + cl.level, 0);
                }

                // заполняем skills, если их нет или они пустые
                if (!updated.skills || updated.skills.length === 0) {
                    updated.skills = defaultSkills;
                }

                if (!updated.diceLogs) {
                    updated.diceLogs = {};
                }

                if (updated.deathSuccesses === undefined) updated.deathSuccesses = 0;
                if (updated.deathFailures === undefined) updated.deathFailures = 0;
                if (updated.isStable === undefined) updated.isStable = false;

                // toolProficiencies: если массив строк, преобразуем в объекты
                if (Array.isArray(updated.toolProficiencies) && updated.toolProficiencies.length > 0) {
                    if (typeof updated.toolProficiencies[0] === 'string') {
                        updated.toolProficiencies = updated.toolProficiencies.map((name: string) => ({
                            name,
                            attribute: 'DEX',
                            proficient: true,
                        }));
                    } else if (typeof updated.toolProficiencies[0] === 'object') {
                        updated.toolProficiencies = updated.toolProficiencies.map((tool: any) => ({
                            ...tool,
                            attribute: tool.attribute || 'DEX',
                        }));
                    }
                } else {
                    updated.toolProficiencies = updated.toolProficiencies || [];
                }

                // languages
                if (!updated.languages) {
                    updated.languages = [];
                }

                // size и creatureType
                if (!updated.size) updated.size = 'Medium';
                if (!updated.creatureType) updated.creatureType = 'Humanoid';

                // subrace
                if (!updated.subrace) updated.subrace = '';

                // savingThrowProficiencies
                if (!updated.savingThrowProficiencies) {
                    updated.savingThrowProficiencies = [];
                }

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

    // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ ОБНОВЛЕНИЯ РАСОВЫХ ОСОБЕННОСТЕЙ

    // Добавляет / обновляет natural weapons на основе расы / подрасы
    const addNaturalWeaponsToCharacter = (character: Character): Character => {
        const naturalWeapons = getNaturalWeapons(character.race, character.subrace);
        if (naturalWeapons.length === 0) return character;

        // Удаляем старые natural weapon предметы (по типу)
        const filteredInventory = character.inventory.filter(item => item.type !== 'natural weapon');
        const newNaturalWeapons = naturalWeapons.map(w => ({
            ...w,
            id: `natural-${Date.now()}-${Math.random()}`,
        }));
        return {
            ...character,
            inventory: [...filteredInventory, ...newNaturalWeapons],
        };
    };

    // Добавляет / обновляет расовые заклинания на основе расы / подрасы
    const addRacialSpellsToCharacter = (character: Character): Character => {
        const racialSpellData = getRacialSpells(character.race, character.subrace);
        if (racialSpellData.length === 0) return character;

        // Удаляем старые расовые заклинания (по isRacial)
        const nonRacialSpells = character.spells.filter(s => !s.isRacial);
        const newRacialSpells = racialSpellData.map((data, index) => ({
            ...data,
            id: `racial-${Date.now()}-${index}`,
            prepared: true, // всегда подготовлены
            isRacial: true,
            isCustom: false,
            source: 'race' as const,
        }));

        return {
            ...character,
            spells: [...nonRacialSpells, ...newRacialSpells],
        };
    };

    // ОСНОВНЫЕ CRUD ОПЕРАЦИИ

    const addCharacter = (character: Omit<Character, 'id'>) => {
        let newCharacter: Character = {
            ...character,
            id: Date.now().toString(),
            class: character.class || character.classLevels?.[0]?.className || 'Fighter',
            classes: character.classes || character.classLevels?.map(cl => cl.className) || ['Fighter'],
            level: character.level || character.classLevels?.reduce((sum, cl) => sum + cl.level, 0) || 1,
            classLevels: character.classLevels || [{ className: character.class || 'Fighter', level: character.level || 1 }],
            skills: (character.skills && character.skills.length > 0) ? character.skills : defaultSkills,
            toolProficiencies: character.toolProficiencies?.map((tool: any) => ({
                name: tool.name || tool,
                attribute: tool.attribute || 'DEX',
                proficient: tool.proficient !== undefined ? tool.proficient : true,
            })) || [],
            diceLogs: character.diceLogs || {},
            deathSuccesses: character.deathSuccesses ?? 0,
            deathFailures: character.deathFailures ?? 0,
            isStable: character.isStable ?? false,
            languages: character.languages || [],
            size: character.size || 'Medium',
            creatureType: character.creatureType || 'Humanoid',
            subrace: character.subrace || '',
            savingThrowProficiencies: character.savingThrowProficiencies || [],
        };

        // Добавляем natural weapons
        newCharacter = addNaturalWeaponsToCharacter(newCharacter);
        // Добавляем расовые заклинания
        newCharacter = addRacialSpellsToCharacter(newCharacter);

        setCharacters(prev => [...prev, newCharacter]);
        setCurrentCharacterId(newCharacter.id);
    };

    const updateCharacter = (id: string, data: Partial<Character>) => {
        setCharacters(prev =>
            prev.map(char => {
                if (char.id !== id) return char;
                let updated = { ...char, ...data };

                // Если изменилась раса или подраса, обновляем natural weapons и расовые заклинания
                if (data.race !== undefined || data.subrace !== undefined) {
                    updated = addNaturalWeaponsToCharacter(updated);
                    updated = addRacialSpellsToCharacter(updated);
                }

                return updated;
            })
        );
    };

    const deleteCharacter = (id: string) => {
        setCharacters(prev => prev.filter(char => char.id !== id));
        if (currentCharacterId === id) setCurrentCharacterId(null);
    };

    const getCharacter = (id: string) => characters.find(char => char.id === id);

    // ИНВЕНТАРЬ

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

    // ЗАКЛИНАНИЯ

    const addSpellToCharacter = (characterId: string, spell: Omit<Spell, 'id'>) => {
        const char = getCharacter(characterId);
        if (!char) return;
        // Убедимся, что не добавляем дубликат расового заклинания
        if (spell.isRacial) {
            // Если добавляем расовое вручную – игнорируем (или можно пересобрать через addRacialSpellsToCharacter)
            return;
        }
        const newSpell: Spell = { ...spell, id: Date.now().toString(), prepared: spell.prepared || false };
        updateCharacter(characterId, {
            spells: [...char.spells, newSpell],
        });
    };

    const removeSpellFromCharacter = (characterId: string, spellId: string) => {
        const char = getCharacter(characterId);
        if (!char) return;
        const spell = char.spells.find(s => s.id === spellId);
        // Запрещаем удалять расовые заклинания
        if (spell?.isRacial) return;
        updateCharacter(characterId, {
            spells: char.spells.filter(spell => spell.id !== spellId),
        });
    };

    const updateSpell = (characterId: string, spellId: string, updates: Partial<Spell>) => {
        const char = getCharacter(characterId);
        if (!char) return;
        const spell = char.spells.find(s => s.id === spellId);
        // Запрещаем менять prepared у расовых (они всегда true)
        if (spell?.isRacial && updates.prepared !== undefined) {
            // Можно проигнорировать или разрешить, но мы запрещаем
            return;
        }
        updateCharacter(characterId, {
            spells: char.spells.map(spell =>
                spell.id === spellId ? { ...spell, ...updates } : spell
            ),
        });
    };

    // КВЕСТЫ

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

    // КАМПАНИИ

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

    // DICE LOGS

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

    // ЗНАЧЕНИЯ, ПЕРЕДАВАЕМЫЕ В КОНТЕКСТ

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

// Хук для использования контекста
export const useCharacters = () => {
    const context = useContext(CharacterContext);
    if (!context) {
        throw new Error('useCharacters must be used within a CharacterProvider');
    }
    return context;
};