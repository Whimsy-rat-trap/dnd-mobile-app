import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Character, InventoryItem, Spell, Quest, Campaign, Feat, ClassLevel } from '../types/Character';
import { getNaturalWeapons } from '../utils/racialFeatures';
import { recalculateAC } from '../utils/armorUtils';
import { getRacialSpells } from '../constants/racialSpells';
import { getFeatsForCharacter } from '../constants/feats';
import { ALL_ITEMS } from '../constants/items';

// Default skills
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

// Context type
interface CharacterContextType {
    characters: Character[];
    currentCharacterId: string | null;
    concentrationCheck: { spellId: string; dc: number; conMod: number } | null;
    addCharacter: (character: Omit<Character, 'id'>) => void;
    updateCharacter: (id: string, data: Partial<Character>) => void;
    deleteCharacter: (id: string) => void;
    getCharacter: (id: string) => Character | undefined;
    setCurrentCharacterId: (id: string | null) => void;

    // Инвентарь
    addItemToInventory: (characterId: string, item: Omit<InventoryItem, 'id'>) => void;
    removeItemFromInventory: (characterId: string, itemId: string) => void;
    updateItemInInventory: (characterId: string, itemId: string, updates: Partial<InventoryItem>) => void;

    // Заклинания
    addSpellToCharacter: (characterId: string, spell: Omit<Spell, 'id'>) => void;
    removeSpellFromCharacter: (characterId: string, spellId: string) => void;
    updateSpell: (characterId: string, spellId: string, updates: Partial<Spell>) => void;

    // Квесты
    addQuestToCharacter: (characterId: string, quest: Omit<Quest, 'id'>) => void;
    removeQuestFromCharacter: (characterId: string, questId: string) => void;
    updateQuest: (characterId: string, questId: string, updates: Partial<Quest>) => void;

    // Кампании
    addCampaignToCharacter: (characterId: string, campaign: Omit<Campaign, 'id'>) => void;
    removeCampaignFromCharacter: (characterId: string, campaignId: string) => void;
    updateCampaign: (characterId: string, campaignId: string, updates: Partial<Campaign>) => void;

    // Кости
    addDiceLog: (characterId: string, sides: number, result: number) => void;

    // Концентрация
    startConcentration: (characterId: string, spellId: string) => void;
    endConcentration: (characterId: string) => void;
    makeConcentrationCheck: (characterId: string, damage: number) => void;
    resolveConcentrationCheck: (characterId: string, success: boolean) => void;

    // Feats
    addFeat: (characterId: string, feat: Omit<Feat, 'id'>) => void;
    removeFeat: (characterId: string, featId: string) => void;

    // Валюта
    updateCurrency: (characterId: string, currency: { gp: number; sp: number; cp: number }) => void;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);
const STORAGE_KEY = 'dnd_characters';

// Provider
export const CharacterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [characters, setCharacters] = useState<Character[]>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];
        try {
            const parsed = JSON.parse(stored);
            return parsed.map((char: any) => {
                const updated = { ...char };

                // Миграция class → classes
                if (typeof updated.class === 'string' && !updated.classes) {
                    updated.classes = [updated.class];
                } else if (!updated.classes) {
                    updated.classes = [updated.class || 'Fighter'];
                }
                if (!updated.class) {
                    updated.class = updated.classes[0] || 'Fighter';
                }

                // Миграция classLevels
                if (!updated.classLevels || updated.classLevels.length === 0) {
                    if (updated.classes && updated.level) {
                        updated.classLevels = updated.classes.map((cls: string) => ({
                            className: cls,
                            level: updated.level,
                        }));
                    } else if (updated.class) {
                        updated.classLevels = [{ className: updated.class, level: updated.level || 1 }];
                    } else {
                        updated.classLevels = [{ className: 'Fighter', level: 1 }];
                    }
                }

                // Миграция subclass → classLevels[0].subclass
                if (Array.isArray(updated.classLevels) && updated.classLevels.length > 0) {
                    updated.classLevels = updated.classLevels.map((cl: any, idx: number) => {
                        // Первый класс получает подкласс из character.subclass, если у него ещё нет своего
                        if (idx === 0 && !cl.subclass && updated.subclass) {
                            return { ...cl, subclass: updated.subclass };
                        }
                        return cl;
                    });
                }

                // Синхронизация character.subclass с первым классом
                if (updated.classLevels?.[0]?.subclass) {
                    updated.subclass = updated.classLevels[0].subclass;
                }

                // Пересчёт общего уровня
                if (updated.classLevels.length > 0) {
                    updated.level = updated.classLevels.reduce(
                        (sum: number, cl: ClassLevel) => sum + cl.level,
                        0
                    );
                }

                // Навыки
                if (!updated.skills || updated.skills.length === 0) {
                    updated.skills = defaultSkills;
                }

                // Dice logs
                if (!updated.diceLogs) {
                    updated.diceLogs = {};
                }

                // Death saves
                if (updated.deathSuccesses === undefined) updated.deathSuccesses = 0;
                if (updated.deathFailures === undefined) updated.deathFailures = 0;
                if (updated.isStable === undefined) updated.isStable = false;

                // Tool proficiencies
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

                // Languages, size, creatureType, subrace
                if (!updated.languages) updated.languages = [];
                if (!updated.size) updated.size = 'Medium';
                if (!updated.creatureType) updated.creatureType = 'Humanoid';
                if (!updated.subrace) updated.subrace = '';
                if (!updated.savingThrowProficiencies) updated.savingThrowProficiencies = [];

                // Concentration
                if (updated.activeConcentrationSpellId === undefined) {
                    updated.activeConcentrationSpellId = null;
                }

                // Feats
                if (!updated.feats) {
                    updated.feats = [];
                }

                // Currency
                if (!updated.currency) {
                    updated.currency = { gp: 0, sp: 0, cp: 0 };
                }

                // Inventory migration: enrich items with data from ALL_ITEMS
                if (updated.inventory && Array.isArray(updated.inventory)) {
                    updated.inventory = updated.inventory.map((invItem: any) => {
                        const libraryItem = ALL_ITEMS.find((li: any) => li.name === invItem.name);
                        if (!libraryItem) return invItem;
                        return {
                            ...invItem,
                            damageDice: invItem.damageDice ?? libraryItem.damageDice,
                            damageType: invItem.damageType ?? libraryItem.damageType,
                            healingDice: invItem.healingDice ?? libraryItem.healingDice,
                            uses: invItem.uses ?? libraryItem.uses,
                            baseAC: invItem.baseAC ?? libraryItem.baseAC,
                            acBonus: invItem.acBonus ?? libraryItem.acBonus,
                            dexModifierAllowed: invItem.dexModifierAllowed ?? libraryItem.dexModifierAllowed,
                            maxDexBonus: invItem.maxDexBonus ?? libraryItem.maxDexBonus,
                            strengthRequirement: invItem.strengthRequirement ?? libraryItem.strengthRequirement,
                            stealthDisadvantage: invItem.stealthDisadvantage ?? libraryItem.stealthDisadvantage,
                        };
                    });
                }

                return updated;
            });
        } catch (e) {
            console.error('Failed to parse characters from localStorage', e);
            return [];
        }
    });

    const [currentCharacterId, setCurrentCharacterId] = useState<string | null>(null);
    const [concentrationCheck, setConcentrationCheck] = useState<{
        spellId: string;
        dc: number;
        conMod: number;
    } | null>(null);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
    }, [characters]);

    // Вспомогательные функции
    const addNaturalWeaponsToCharacter = (character: Character): Character => {
        const naturalWeapons = getNaturalWeapons(character.race, character.subrace);
        if (naturalWeapons.length === 0) return character;

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

    // Вспомогательная функция для добавления расовых заклинаний
    const addRacialSpellsToCharacter = (character: Character): Character => {
        const racialSpellData = getRacialSpells(character.race, character.subrace);
        if (racialSpellData.length === 0) return character;

        const nonRacialSpells = character.spells.filter(s => !s.isRacial);
        const newRacialSpells = racialSpellData.map((data, index) => ({
            ...data,
            id: `racial-${Date.now()}-${index}`,
            prepared: true,
            isRacial: true,
            isCustom: false,
            source: 'race' as const,
            requiresConcentration: data.requiresConcentration ?? false,
        }));

        return {
            ...character,
            spells: [...nonRacialSpells, ...newRacialSpells],
        };
    };

    // Обновление черт
    const updateFeatsForCharacter = (character: Character): Character => {
        const autoFeats = getFeatsForCharacter(
            character.class,
            character.race,
            character.subrace,
            character.background
        );
        const customFeats = character.feats.filter(f => f.source !== 'race' && f.source !== 'subrace' && f.source !== 'class' && f.source !== 'background');
        const allFeats = [...autoFeats, ...customFeats];
        const uniqueFeats = allFeats.filter(
            (feat, index, self) => index === self.findIndex(f => f.id === feat.id)
        );
        return {
            ...character,
            feats: uniqueFeats,
        };
    };

    const recalculateCharacterStats = (character: Character): Character => {
        const updated = { ...character };
        updated.ac = recalculateAC(updated);
        return updated;
    };

    // CRUD
    const addCharacter = (character: Omit<Character, 'id'>) => {
        // Формируем classLevels с поддержкой subclass у каждого класса
        const classLevels = (character.classLevels || []).map((cl: any) => ({
            className: cl.className,
            level: cl.level,
            subclass: cl.subclass || '',
        }));

        const mainClass = classLevels[0]?.className || character.class || 'Fighter';
        const mainSubclass = classLevels[0]?.subclass || character.subclass || '';

        let newCharacter: Character = {
            ...character,
            id: Date.now().toString(),
            class: mainClass,
            classes: classLevels.map(cl => cl.className) || ['Fighter'],
            level: classLevels.reduce((sum, cl) => sum + cl.level, 0) || 1,
            classLevels: classLevels.length > 0
                ? classLevels
                : [{ className: 'Fighter', level: 1, subclass: '' }],
            subclass: mainSubclass,
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
            activeConcentrationSpellId: null,
            feats: character.feats || [],
            currency: character.currency || { gp: 0, sp: 0, cp: 0 },
        };

        newCharacter = addNaturalWeaponsToCharacter(newCharacter);
        newCharacter = addRacialSpellsToCharacter(newCharacter);
        newCharacter = updateFeatsForCharacter(newCharacter);
        newCharacter = recalculateCharacterStats(newCharacter);

        setCharacters(prev => [...prev, newCharacter]);
        setCurrentCharacterId(newCharacter.id);
    };

    const updateCharacter = (id: string, data: Partial<Character>) => {
        setCharacters(prev =>
            prev.map(char => {
                if (char.id !== id) return char;
                let updated = { ...char, ...data };

                // Синхронизация character.subclass с первым классом
                if (data.classLevels !== undefined) {
                    updated.subclass = data.classLevels[0]?.subclass || '';
                }
                // Если подкласс обновляется напрямую, синхронизируем classLevels[0].subclass
                if (data.subclass !== undefined && data.classLevels === undefined) {
                    updated.classLevels = updated.classLevels.map((cl, idx) =>
                        idx === 0 ? { ...cl, subclass: data.subclass } : cl
                    );
                }

                // Currency fallback
                if (!updated.currency) {
                    updated.currency = { gp: 0, sp: 0, cp: 0 };
                }

                // Feats/natural weapons/racial spells при изменении расы/подрасы/класса/фона
                if (
                    data.race !== undefined ||
                    data.subrace !== undefined ||
                    data.class !== undefined ||
                    data.classLevels !== undefined ||
                    data.background !== undefined
                ) {
                    updated = addNaturalWeaponsToCharacter(updated);
                    updated = addRacialSpellsToCharacter(updated);
                    updated = updateFeatsForCharacter(updated);
                }

                // Recalculate AC при изменении инвентаря или способностей
                if (data.inventory !== undefined || data.abilities !== undefined) {
                    updated = recalculateCharacterStats(updated);
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

    // Инвентарь
    const addItemToInventory = (characterId: string, item: Omit<InventoryItem, 'id'>) => {
        const char = getCharacter(characterId);
        if (!char) return;
        const newItem: InventoryItem = { ...item, id: Date.now().toString() };
        updateCharacter(characterId, { inventory: [...char.inventory, newItem] });
    };

    const removeItemFromInventory = (characterId: string, itemId: string) => {
        const char = getCharacter(characterId);
        if (!char) return;
        updateCharacter(characterId, {
            inventory: char.inventory.filter(item => item.id !== itemId),
        });
    };

    const updateItemInInventory = (
        characterId: string,
        itemId: string,
        updates: Partial<InventoryItem>
    ) => {
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
        const newSpell: Spell = {
            ...spell,
            id: Date.now().toString(),
            prepared: spell.prepared || false,
        };
        updateCharacter(characterId, { spells: [...char.spells, newSpell] });
    };

    const removeSpellFromCharacter = (characterId: string, spellId: string) => {
        const char = getCharacter(characterId);
        if (!char) return;
        updateCharacter(characterId, {
            spells: char.spells.filter(spell => spell.id !== spellId),
        });
    };

    const updateSpell = (
        characterId: string,
        spellId: string,
        updates: Partial<Spell>
    ) => {
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
        updateCharacter(characterId, { quests: [...char.quests, newQuest] });
    };

    const removeQuestFromCharacter = (characterId: string, questId: string) => {
        const char = getCharacter(characterId);
        if (!char) return;
        updateCharacter(characterId, {
            quests: char.quests.filter(q => q.id !== questId),
        });
    };

    const updateQuest = (
        characterId: string,
        questId: string,
        updates: Partial<Quest>
    ) => {
        const char = getCharacter(characterId);
        if (!char) return;
        updateCharacter(characterId, {
            quests: char.quests.map(q =>
                q.id === questId ? { ...q, ...updates } : q
            ),
        });
    };

    // Кампании

    const addCampaignToCharacter = (
        characterId: string,
        campaign: Omit<Campaign, 'id'>
    ) => {
        const char = getCharacter(characterId);
        if (!char) return;
        const newCampaign: Campaign = { ...campaign, id: Date.now().toString() };
        updateCharacter(characterId, { campaigns: [...char.campaigns, newCampaign] });
    };

    const removeCampaignFromCharacter = (characterId: string, campaignId: string) => {
        const char = getCharacter(characterId);
        if (!char) return;
        updateCharacter(characterId, {
            campaigns: char.campaigns.filter(c => c.id !== campaignId),
        });
    };

    const updateCampaign = (
        characterId: string,
        campaignId: string,
        updates: Partial<Campaign>
    ) => {
        const char = getCharacter(characterId);
        if (!char) return;
        updateCharacter(characterId, {
            campaigns: char.campaigns.map(c =>
                c.id === campaignId ? { ...c, ...updates } : c
            ),
        });
    };

    // Dice logs
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

    // Концентрация
    const startConcentration = (characterId: string, spellId: string) => {
        const char = getCharacter(characterId);
        if (!char) return;
        // Если уже есть активная концентрация — она будет перезаписана (можно уведомить пользователя)
        updateCharacter(characterId, { activeConcentrationSpellId: spellId });
    };

    const endConcentration = (characterId: string) => {
        updateCharacter(characterId, { activeConcentrationSpellId: null });
    };

    const makeConcentrationCheck = (characterId: string, damage: number) => {
        const char = getCharacter(characterId);
        if (!char || !char.activeConcentrationSpellId) return;
        const dc = Math.max(10, Math.floor(damage / 2));
        const conMod = Math.floor((char.abilities.con - 10) / 2);
        setConcentrationCheck({
            spellId: char.activeConcentrationSpellId,
            dc,
            conMod,
        });
    };

    const resolveConcentrationCheck = (characterId: string, success: boolean) => {
        if (!success) endConcentration(characterId);
        setConcentrationCheck(null);
    };

    // Feats

    const addFeat = (characterId: string, feat: Omit<Feat, 'id'>) => {
        const char = getCharacter(characterId);
        if (!char) return;
        const newFeat: Feat = { ...feat, id: `custom-${Date.now()}` };
        updateCharacter(characterId, { feats: [...char.feats, newFeat] });
    };

    const removeFeat = (characterId: string, featId: string) => {
        const char = getCharacter(characterId);
        if (!char) return;
        updateCharacter(characterId, {
            feats: char.feats.filter(f => f.id !== featId),
        });
    };

    // Currency

    const updateCurrency = (
        characterId: string,
        currency: { gp: number; sp: number; cp: number }
    ) => {
        updateCharacter(characterId, { currency });
    };

    const value: CharacterContextType = {
        characters,
        currentCharacterId,
        concentrationCheck,
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
        startConcentration,
        endConcentration,
        makeConcentrationCheck,
        resolveConcentrationCheck,
        addFeat,
        removeFeat,
        updateCurrency,
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