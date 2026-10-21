import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Character, InventoryItem, Spell, Quest, Campaign, Feat } from '../types/Character';
import { getNaturalWeapons } from '../utils/racialFeatures';
import { recalculateAC } from '../utils/armorUtils';
import { getRacialSpells } from '../constants/racialSpells';
import { getFeatsForCharacter } from '../constants/feats';
import { ALL_ITEMS } from '../constants/items';
import {
    getNonPactSpellSlots,
    getUsedSpellSlots,
    getPactMagicInfo,
} from '../utils/spellcasting';
import {
    Currency,
    EMPTY_CURRENCY,
    addCurrency as addCurrencyPure,
    subtractCurrency as subtractCurrencyPure,
    normalizeCurrency,
    resolveItemCurrency,
} from '../utils/currencyUtils';
import {
    rollHitDie,
    restoreHitDiceOnLongRest,
    HitDieRollResult,
} from '../utils/hitDice';
import { getSubclassAlwaysPreparedSpells } from '../utils/classSpellUtils';
import { getBardicInspirationInfo } from '../utils/bardicInspiration';
import { getKiInfo } from '../utils/ki';
import { getClassResourceDefinition, CLASS_RESOURCES } from '../constants/classResources';
import { getClassLevelFor, computeMaxUses } from '../utils/classResources';

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

interface CharacterContextType {
    characters: Character[];
    currentCharacterId: string | null;
    concentrationCheck: { spellId: string; dc: number; conMod: number } | null;
    addCharacter: (character: Omit<Character, 'id'>) => void;
    updateCharacter: (id: string, data: Partial<Character>) => void;
    deleteCharacter: (id: string) => void;
    getCharacter: (id: string) => Character | undefined;
    setCurrentCharacterId: (id: string | null) => void;
    addItemToInventory: (characterId: string, item: Omit<InventoryItem, 'id'> & { id?: string }) => void;
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
    startConcentration: (characterId: string, spellId: string) => void;
    endConcentration: (characterId: string) => void;
    makeConcentrationCheck: (characterId: string, damage: number) => void;
    resolveConcentrationCheck: (characterId: string, success: boolean) => void;
    addFeat: (characterId: string, feat: Omit<Feat, 'id'>) => void;
    removeFeat: (characterId: string, featId: string) => void;
    updateCurrency: (characterId: string, currency: Currency) => void;
    addCurrency: (characterId: string, amount: Currency) => void;
    subtractCurrency: (characterId: string, amount: Currency) => { ok: boolean; result: Currency };
    spendSpellSlot: (characterId: string, level: number) => boolean;
    restoreSpellSlot: (characterId: string, level: number) => void;
    spendPactSlot: (characterId: string) => boolean;
    restorePactSlot: (characterId: string) => void;
    spendHitDie: (characterId: string, sides: number) => HitDieRollResult | null;
    spendBardicInspiration: (characterId: string) => boolean;
    restoreBardicInspiration: (characterId: string) => void;
    restoreHitDie: (characterId: string, sides: number) => void;
    longRest: (characterId: string) => void;
    shortRest: (characterId: string) => void;
    grantInspiration: (characterId: string) => void;
    spendInspiration: (characterId: string) => boolean;
    spendKi: (characterId: string, amount?: number) => boolean;
    restoreKi: (characterId: string, amount?: number) => void;
    spendClassResource: (characterId: string, resourceId: string, amount?: number) => boolean;
    restoreClassResource: (characterId: string, resourceId: string, amount?: number) => void;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);
const STORAGE_KEY = 'dnd_characters';

export const CharacterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [characters, setCharacters] = useState<Character[]>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];
        try {
            const parsed = JSON.parse(stored);
            return parsed.map((char: any) => {
                const updated = { ...char };

                if (typeof updated.class === 'string' && !updated.classes) {
                    updated.classes = [updated.class];
                } else if (!updated.classes) {
                    updated.classes = [updated.class || 'Fighter'];
                }
                if (!updated.class) {
                    updated.class = updated.classes[0] || 'Fighter';
                }

                if (!updated.classLevels || updated.classLevels.length === 0) {
                    if (updated.classes && updated.level) {
                        updated.classLevels = updated.classes.map((cls: string) => ({ className: cls, level: updated.level }));
                    } else if (updated.class) {
                        updated.classLevels = [{ className: updated.class, level: updated.level || 1, subclass: '' }];
                    } else {
                        updated.classLevels = [{ className: 'Fighter', level: 1, subclass: '' }];
                    }
                }
                if (updated.classLevels.length > 0) {
                    updated.level = updated.classLevels.reduce((sum: number, cl: any) => sum + cl.level, 0);
                }

                // Миграция: перенос character.subclass в classLevels[0].subclass
                if (Array.isArray(updated.classLevels) && updated.classLevels.length > 0) {
                    updated.classLevels = updated.classLevels.map((cl: any, idx: number) => {
                        if (idx === 0 && !cl.subclass && updated.subclass) {
                            return { ...cl, subclass: updated.subclass };
                        }
                        return cl;
                    });
                }
                if (updated.classLevels?.[0]?.subclass) {
                    updated.subclass = updated.classLevels[0].subclass;
                }

                if (!updated.skills || updated.skills.length === 0) {
                    updated.skills = defaultSkills;
                }
                if (!updated.diceLogs) updated.diceLogs = {};

                if (updated.deathSuccesses === undefined) updated.deathSuccesses = 0;
                if (updated.deathFailures === undefined) updated.deathFailures = 0;
                if (updated.isStable === undefined) updated.isStable = false;

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

                if (!updated.languages) updated.languages = [];
                if (!updated.size) updated.size = 'Medium';
                if (!updated.creatureType) updated.creatureType = 'Humanoid';
                if (!updated.subrace) updated.subrace = '';
                if (!updated.savingThrowProficiencies) updated.savingThrowProficiencies = [];

                if (updated.activeConcentrationSpellId === undefined) {
                    updated.activeConcentrationSpellId = null;
                }

                // [NEW] inspiration migration
                if (updated.inspiration === undefined) {
                    updated.inspiration = false;
                }

                if (!updated.feats) updated.feats = [];

                if (!Array.isArray(updated.knownInvocations)) updated.knownInvocations = [];

                if (!updated.currency) {
                    updated.currency = { gp: 0, sp: 0, cp: 0 };
                } else {
                    updated.currency = normalizeCurrency(updated.currency);
                }

                // Миграция слотов заклинаний
                if (!Array.isArray(updated.usedSpellSlots) || updated.usedSpellSlots.length !== 9) {
                    updated.usedSpellSlots = Array(9).fill(0);
                }
                if (typeof updated.usedPactSlots !== 'number') {
                    updated.usedPactSlots = 0;
                }

                // Миграция hit dice
                if (!updated.hitDiceUsed || typeof updated.hitDiceUsed !== 'object') {
                    updated.hitDiceUsed = {};
                }

                if (typeof updated.bardicInspirationUsed !== 'number') {
                    updated.bardicInspirationUsed = 0;
                }

                if (typeof updated.kiUsed !== 'number') {
                    updated.kiUsed = 0;
                }

                if (!updated.classResourcesUsed || typeof updated.classResourcesUsed !== 'object') {
                    updated.classResourcesUsed = {};
                }

                // Гарантируем id у предметов инвентаря
                if (Array.isArray(updated.inventory)) {
                    updated.inventory = updated.inventory.map((item: any) => {
                        const withId = {
                            ...item,
                            id: item.id || `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                        };
                        const libraryItem = ALL_ITEMS.find((li: any) => li.name === item.name);
                        if (!libraryItem) return withId;
                        return {
                            ...withId,
                            damageDice: withId.damageDice ?? libraryItem.damageDice,
                            damageType: withId.damageType ?? libraryItem.damageType,
                            healingDice: withId.healingDice ?? libraryItem.healingDice,
                            uses: withId.uses ?? libraryItem.uses,
                            baseAC: withId.baseAC ?? libraryItem.baseAC,
                            acBonus: withId.acBonus ?? libraryItem.acBonus,
                            dexModifierAllowed: withId.dexModifierAllowed ?? libraryItem.dexModifierAllowed,
                            maxDexBonus: withId.maxDexBonus ?? libraryItem.maxDexBonus,
                            strengthRequirement: withId.strengthRequirement ?? libraryItem.strengthRequirement,
                            stealthDisadvantage: withId.stealthDisadvantage ?? libraryItem.stealthDisadvantage,
                        };
                    });
                } else {
                    updated.inventory = [];
                }

                return updated;
            });
        } catch (e) {
            console.error('Failed to parse characters from localStorage', e);
            return [];
        }
    });

    const [currentCharacterId, setCurrentCharacterId] = useState<string | null>(null);
    const [concentrationCheck, setConcentrationCheck] = useState<{ spellId: string; dc: number; conMod: number } | null>(null);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
    }, [characters]);

    // [NEW] One-time миграция: синхронизирует always-prepared subclass заклинания
    // (домены Cleric, клятвы Paladin) у уже существующих персонажей из localStorage.
    const initialSubclassSyncDone = useRef(false);
    useEffect(() => {
        if (initialSubclassSyncDone.current) return;
        initialSubclassSyncDone.current = true;

        setCharacters(prev => {
            let changed = false;
            const next = prev.map(c => {
                const synced = addSubclassSpellsToCharacter(c);
                if (JSON.stringify(synced.spells) !== JSON.stringify(c.spells)) {
                    changed = true;
                    return synced;
                }
                return c;
            });
            return changed ? next : prev;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const addNaturalWeaponsToCharacter = (character: Character): Character => {
        const naturalWeapons = getNaturalWeapons(character.race, character.subrace);
        if (naturalWeapons.length === 0) return character;

        const filteredInventory = character.inventory.filter(item => item.type !== 'natural weapon');
        const newNaturalWeapons = naturalWeapons.map(w => ({
            ...w,
            id: `natural-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        }));
        return {
            ...character,
            inventory: [...filteredInventory, ...newNaturalWeapons],
        };
    };

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

    const updateFeatsForCharacter = (character: Character): Character => {
        const autoFeats = getFeatsForCharacter(
            character.class,
            character.race,
            character.subrace,
            character.background
        );
        const customFeats = character.feats.filter(f => f.source === 'custom');
        const allFeats = [...autoFeats, ...customFeats];
        const uniqueFeats = allFeats.filter((feat, index, self) =>
            index === self.findIndex(f => f.id === feat.id)
        );
        return { ...character, feats: uniqueFeats };
    };

    // [NEW] Синхронизация always-prepared subclass заклинаний
    // (Cleric Domains, Paladin Oaths и т.п.)
    const addSubclassSpellsToCharacter = (character: Character): Character => {
        // 1. Собираем, что ДОЛЖНО быть always-prepared
        const target = new Map<
            string,
            { spell: any; sourceClass: string; sourceSubclass: string }
        >();
        for (const cl of character.classLevels || []) {
            if (!cl.subclass) continue;
            const spells = getSubclassAlwaysPreparedSpells(cl.className, cl.subclass, cl.level);
            for (const spell of spells) {
                const key = spell.name.toLowerCase();
                if (target.has(key)) continue;
                target.set(key, {
                    spell,
                    sourceClass: cl.className,
                    sourceSubclass: cl.subclass,
                });
            }
        }

        // 2. Партиционируем существующие заклинания
        const kept: typeof character.spells = [];
        const promote: Map<string, typeof character.spells[number]> = new Map();

        for (const s of character.spells) {
            const lower = s.name.toLowerCase();

            // Racial имеют приоритет — не промоутим, но и не даём дублировать
            if (s.isRacial) {
                kept.push(s);
                target.delete(lower);
                continue;
            }

            // Заклинание станет/останется always-prepared
            if (target.has(lower)) {
                promote.set(lower, s);
                continue;
            }

            // Старое always-prepared, которое больше не подходит → выкидываем
            if (s.isAlwaysPrepared) continue;

            kept.push(s);
        }

        // 3. Собираем итоговый always-prepared список
        const rebuilt: typeof character.spells = [];
        for (const [key, { spell, sourceClass, sourceSubclass }] of target) {
            const existing = promote.get(key);
            if (existing) {
                rebuilt.push({
                    ...existing,
                    prepared: true,
                    isAlwaysPrepared: true,
                    isMagicalSecret: false,
                    source: 'subclass',
                });
            } else {
                rebuilt.push({
                    ...spell,
                    id: `subclass-${sourceClass}-${sourceSubclass}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                    prepared: true,
                    isCustom: false,
                    isRacial: false,
                    isAlwaysPrepared: true,
                    source: 'subclass',
                    requiresConcentration: spell.requiresConcentration ?? false,
                });
            }
        }

        return { ...character, spells: [...kept, ...rebuilt] };
    };

    const recalculateCharacterStats = (character: Character): Character => {
        let updated = { ...character };
        updated.ac = recalculateAC(updated);
        return updated;
    };

    const addCharacter = (character: Omit<Character, 'id'>) => {
        let newCharacter: Character = {
            ...character,
            id: Date.now().toString(),
            class: character.class || character.classLevels?.[0]?.className || 'Fighter',
            classes: character.classes || character.classLevels?.map(cl => cl.className) || ['Fighter'],
            level: character.level || character.classLevels?.reduce((sum, cl) => sum + cl.level, 0) || 1,
            classLevels: character.classLevels || [{ className: character.class || 'Fighter', level: character.level || 1, subclass: '' }],
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
            inspiration: false, // [NEW]
            feats: character.feats || [],
            currency: normalizeCurrency(character.currency || EMPTY_CURRENCY),
            usedSpellSlots: Array(9).fill(0),
            usedPactSlots: 0,
            hitDiceUsed: {},
        };

        newCharacter.inventory = newCharacter.inventory.map(item => ({
            ...item,
            id: item.id || `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        }));

        newCharacter = addNaturalWeaponsToCharacter(newCharacter);
        newCharacter = addRacialSpellsToCharacter(newCharacter);
        newCharacter = updateFeatsForCharacter(newCharacter);
        newCharacter = addSubclassSpellsToCharacter(newCharacter); // [NEW]
        newCharacter = recalculateCharacterStats(newCharacter);

        setCharacters(prev => [...prev, newCharacter]);
        setCurrentCharacterId(newCharacter.id);
    };

    const updateCharacter = (id: string, data: Partial<Character>) => {
        setCharacters(prev =>
            prev.map(char => {
                if (char.id !== id) return char;
                let updated = { ...char, ...data };

                if (!updated.currency) {
                    updated.currency = { gp: 0, sp: 0, cp: 0 };
                } else {
                    updated.currency = normalizeCurrency(updated.currency);
                }

                // Синхронизация character.subclass с первым классом
                if (data.classLevels !== undefined) {
                    updated.subclass = data.classLevels[0]?.subclass || '';
                }

                if (data.race !== undefined || data.subrace !== undefined || data.class !== undefined || data.background !== undefined) {
                    updated = addNaturalWeaponsToCharacter(updated);
                    updated = addRacialSpellsToCharacter(updated);
                    updated = updateFeatsForCharacter(updated);
                }

                // [NEW] при изменении классов/подкласса — синхронизируем always-prepared
                if (data.classLevels !== undefined || data.class !== undefined) {
                    updated = addSubclassSpellsToCharacter(updated);
                }

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

    const addItemToInventory = (
        characterId: string,
        item: Omit<InventoryItem, 'id'> & { id?: string }
    ) => {
        const char = getCharacter(characterId);
        if (!char) return;

        const money = resolveItemCurrency(item);
        if (money) {
            const current = char.currency || EMPTY_CURRENCY;
            updateCharacter(characterId, {
                currency: addCurrencyPure(current, money),
            });
            return;
        }

        const newItem: InventoryItem = {
            ...item,
            id: item.id || `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        };
        updateCharacter(characterId, { inventory: [...char.inventory, newItem] });
    };

    const removeItemFromInventory = (characterId: string, itemId: string) => {
        if (!itemId) return;
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
        if (!itemId) return;
        const char = getCharacter(characterId);
        if (!char) return;
        updateCharacter(characterId, {
            inventory: char.inventory.map(item =>
                item.id === itemId ? { ...item, ...updates } : item
            ),
        });
    };

    const addSpellToCharacter = (characterId: string, spell: Omit<Spell, 'id'>) => {
        const char = getCharacter(characterId);
        if (!char) return;
        const newSpell: Spell = { ...spell, id: Date.now().toString(), prepared: spell.prepared || false };
        updateCharacter(characterId, { spells: [...char.spells, newSpell] });
    };

    const removeSpellFromCharacter = (characterId: string, spellId: string) => {
        const char = getCharacter(characterId);
        if (!char) return;
        updateCharacter(characterId, { spells: char.spells.filter(spell => spell.id !== spellId) });
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

    const addQuestToCharacter = (characterId: string, quest: Omit<Quest, 'id'>) => {
        const char = getCharacter(characterId);
        if (!char) return;
        const newQuest: Quest = { ...quest, id: Date.now().toString() };
        updateCharacter(characterId, { quests: [...char.quests, newQuest] });
    };

    const removeQuestFromCharacter = (characterId: string, questId: string) => {
        const char = getCharacter(characterId);
        if (!char) return;
        updateCharacter(characterId, { quests: char.quests.filter(q => q.id !== questId) });
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

    const addCampaignToCharacter = (characterId: string, campaign: Omit<Campaign, 'id'>) => {
        const char = getCharacter(characterId);
        if (!char) return;
        const newCampaign: Campaign = { ...campaign, id: Date.now().toString() };
        updateCharacter(characterId, { campaigns: [...char.campaigns, newCampaign] });
    };

    const removeCampaignFromCharacter = (characterId: string, campaignId: string) => {
        const char = getCharacter(characterId);
        if (!char) return;
        updateCharacter(characterId, { campaigns: char.campaigns.filter(c => c.id !== campaignId) });
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

    const startConcentration = (characterId: string, spellId: string) => {
        const char = getCharacter(characterId);
        if (!char) return;
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
        setConcentrationCheck({ spellId: char.activeConcentrationSpellId, dc, conMod });
    };

    const resolveConcentrationCheck = (characterId: string, success: boolean) => {
        if (!success) endConcentration(characterId);
        setConcentrationCheck(null);
    };

    // [NEW] Inspiration
    const grantInspiration = (characterId: string) => {
        updateCharacter(characterId, { inspiration: true });
    };

    const spendInspiration = (characterId: string): boolean => {
        const char = getCharacter(characterId);
        if (!char?.inspiration) return false;
        updateCharacter(characterId, { inspiration: false });
        return true;
    };

    const addFeat = (characterId: string, feat: Omit<Feat, 'id'>) => {
        const char = getCharacter(characterId);
        if (!char) return;
        const newFeat: Feat = { ...feat, id: `custom-${Date.now()}` };
        updateCharacter(characterId, { feats: [...char.feats, newFeat] });
    };

    const removeFeat = (characterId: string, featId: string) => {
        const char = getCharacter(characterId);
        if (!char) return;
        updateCharacter(characterId, { feats: char.feats.filter(f => f.id !== featId) });
    };

    const updateCurrency = (characterId: string, currency: Currency) => {
        updateCharacter(characterId, { currency: normalizeCurrency(currency) });
    };

    const addCurrency = (characterId: string, amount: Currency) => {
        const char = getCharacter(characterId);
        if (!char) return;
        const current = char.currency || EMPTY_CURRENCY;
        updateCharacter(characterId, {
            currency: addCurrencyPure(current, amount),
        });
    };

    const subtractCurrency = (
        characterId: string,
        amount: Currency
    ): { ok: boolean; result: Currency } => {
        const char = getCharacter(characterId);
        if (!char) return { ok: false, result: EMPTY_CURRENCY };
        const current = char.currency || EMPTY_CURRENCY;
        const { result, ok } = subtractCurrencyPure(current, amount);
        if (ok) {
            updateCharacter(characterId, { currency: result });
        }
        return { ok, result };
    };

    // Spell slots
    const spendSpellSlot = (characterId: string, level: number): boolean => {
        const char = getCharacter(characterId);
        if (!char) return false;

        const levelIdx = level - 1;
        if (levelIdx < 0 || levelIdx > 8) return false;

        const total = getNonPactSpellSlots(char);
        const used = getUsedSpellSlots(char);

        if (total[levelIdx] === 0) return false;
        if (used[levelIdx] >= total[levelIdx]) return false;

        const newUsed = [...used];
        newUsed[levelIdx] += 1;
        updateCharacter(characterId, { usedSpellSlots: newUsed });
        return true;
    };

    const restoreSpellSlot = (characterId: string, level: number) => {
        const char = getCharacter(characterId);
        if (!char) return;
        const levelIdx = level - 1;
        if (levelIdx < 0 || levelIdx > 8) return;
        const used = getUsedSpellSlots(char);
        if (used[levelIdx] === 0) return;
        const newUsed = [...used];
        newUsed[levelIdx] -= 1;
        updateCharacter(characterId, { usedSpellSlots: newUsed });
    };

    const spendPactSlot = (characterId: string): boolean => {
        const char = getCharacter(characterId);
        if (!char) return false;
        const pact = getPactMagicInfo(char);
        if (!pact || pact.available <= 0) return false;
        updateCharacter(characterId, { usedPactSlots: (char.usedPactSlots || 0) + 1 });
        return true;
    };

    const restorePactSlot = (characterId: string) => {
        const char = getCharacter(characterId);
        if (!char) return;
        const current = char.usedPactSlots || 0;
        if (current === 0) return;
        updateCharacter(characterId, { usedPactSlots: current - 1 });
    };

    // Hit dice
    const spendHitDie = (characterId: string, sides: number): HitDieRollResult | null => {
        const char = getCharacter(characterId);
        if (!char) return null;

        const result = rollHitDie(char, sides);
        if (!result) return null;

        const usedMap = char.hitDiceUsed || {};
        const currentUsed = usedMap[sides] || 0;

        updateCharacter(characterId, {
            hitDiceUsed: {
                ...usedMap,
                [sides]: currentUsed + 1,
            },
        });

        return result;
    };

    const restoreHitDie = (characterId: string, sides: number) => {
        const char = getCharacter(characterId);
        if (!char) return;
        const usedMap = char.hitDiceUsed || {};
        const currentUsed = usedMap[sides] || 0;
        if (currentUsed === 0) return;
        updateCharacter(characterId, {
            hitDiceUsed: {
                ...usedMap,
                [sides]: currentUsed - 1,
            },
        });
    };

    const spendBardicInspiration = (characterId: string): boolean => {
        const char = getCharacter(characterId);
        if (!char) return false;

        const info = getBardicInspirationInfo(char);
        if (!info.isBard || info.availableUses <= 0) return false;

        updateCharacter(characterId, {
            bardicInspirationUsed: info.usedUses + 1,
        });
        return true;
    };

    const restoreBardicInspiration = (characterId: string) => {
        const char = getCharacter(characterId);
        if (!char) return;

        const info = getBardicInspirationInfo(char);
        if (!info.isBard) return;
        if (info.usedUses === 0) return;

        updateCharacter(characterId, {
            bardicInspirationUsed: info.usedUses - 1,
        });
    };

    const spendKi = (characterId: string, amount: number = 1): boolean => {
        const char = getCharacter(characterId);
        if (!char) return false;

        const info = getKiInfo(char);
        if (!info.hasKi || amount <= 0) return false;
        if (info.availableUses < amount) return false;

        updateCharacter(characterId, {
            kiUsed: info.usedUses + amount,
        });
        return true;
    };

    const restoreKi = (characterId: string, amount: number = 1) => {
        const char = getCharacter(characterId);
        if (!char) return;

        const info = getKiInfo(char);
        if (!info.hasKi || amount <= 0) return;

        const newUsed = Math.max(0, info.usedUses - amount);
        if (newUsed === info.usedUses) return;

        updateCharacter(characterId, { kiUsed: newUsed });
    };

    /**
     * Универсальное списание классового ресурса (Rage, Action Surge, Channel Divinity, Wild Shape).
     * Возвращает true, если удалось списать.
     */
    const spendClassResource = (
        characterId: string,
        resourceId: string,
        amount: number = 1
    ): boolean => {
        const char = getCharacter(characterId);
        if (!char || amount <= 0) return false;

        const def = getClassResourceDefinition(resourceId);
        if (!def) return false;

        const classLevel = getClassLevelFor(char, def.className);
        if (classLevel < def.minClassLevel) return false;

        const maxUses = computeMaxUses(def.maxUses, classLevel);
        if (maxUses === 0) return false;

        const usedMap = char.classResourcesUsed || {};
        const currentUsed = Math.min(usedMap[resourceId] || 0, maxUses);
        const available = maxUses - currentUsed;

        if (available < amount) return false;

        updateCharacter(characterId, {
            classResourcesUsed: {
                ...usedMap,
                [resourceId]: currentUsed + amount,
            },
        });
        return true;
    };

    /**
     * Восстановление классового ресурса (например, вручную, или DM решил дать
     * вне rest).
     */
    const restoreClassResource = (
        characterId: string,
        resourceId: string,
        amount: number = 1
    ) => {
        const char = getCharacter(characterId);
        if (!char || amount <= 0) return;

        const def = getClassResourceDefinition(resourceId);
        if (!def) return;

        const usedMap = char.classResourcesUsed || {};
        const currentUsed = usedMap[resourceId] || 0;
        const newUsed = Math.max(0, currentUsed - amount);
        if (newUsed === currentUsed) return;

        updateCharacter(characterId, {
            classResourcesUsed: {
                ...usedMap,
                [resourceId]: newUsed,
            },
        });
    };

    // Rests
    const longRest = (characterId: string) => {
        const char = getCharacter(characterId);
        if (!char) return;

        // Универсальные классовые ресурсы: сбрасываем все (и short, и long)
        const newResourcesUsed: Record<string, number> = { ...(char.classResourcesUsed || {}) };
        for (const def of CLASS_RESOURCES) {
            if (newResourcesUsed[def.id]) {
                newResourcesUsed[def.id] = 0;
            }
        }

        updateCharacter(characterId, {
            usedSpellSlots: Array(9).fill(0),
            usedPactSlots: 0,
            hitDiceUsed: restoreHitDiceOnLongRest(char),
            hp: char.maxHp,
            tempHp: 0,
            deathSuccesses: 0,
            deathFailures: 0,
            isStable: false,
            bardicInspirationUsed: 0,
            kiUsed: 0,
            classResourcesUsed: newResourcesUsed,
        });
    };

    const shortRest = (characterId: string) => {
        const char = getCharacter(characterId);
        if (!char) return;

        const bardInfo = getBardicInspirationInfo(char);
        // Font of Inspiration (Bard 5+) — восстановление на short rest
        const restoreBardic = bardInfo.isBard && bardInfo.hasFontOfInspiration;

        // Ki полностью восстанавливается на short rest (Monk 2+)
        const kiInfo = getKiInfo(char);
        const restoreKi = kiInfo.hasKi && kiInfo.usedUses > 0;

        // Универсальные классовые ресурсы: сбрасываем те, что recharge === 'short'
        const newResourcesUsed: Record<string, number> = { ...(char.classResourcesUsed || {}) };
        for (const def of CLASS_RESOURCES) {
            if (def.recharge !== 'short') continue;
            if (newResourcesUsed[def.id]) {
                newResourcesUsed[def.id] = 0;
            }
        }

        updateCharacter(characterId, {
            usedPactSlots: 0,
            ...(restoreBardic ? { bardicInspirationUsed: 0 } : {}),
            ...(restoreKi ? { kiUsed: 0 } : {}),
            classResourcesUsed: newResourcesUsed,
        });
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
        addCurrency,
        subtractCurrency,
        spendSpellSlot,
        restoreSpellSlot,
        spendPactSlot,
        restorePactSlot,
        spendHitDie,
        restoreHitDie,
        spendBardicInspiration,
        restoreBardicInspiration,
        spendKi,
        restoreKi,
        spendClassResource,
        restoreClassResource,
        longRest,
        shortRest,
        grantInspiration,
        spendInspiration,
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