import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCharacters } from '../context/CharacterContext';
import SearchBar from '../components/SearchBar';
import FilterModal, { FilterField } from '../components/FilterModal';
import InventoryItemCard from '../components/InventoryItemCard';
import { Character, InventoryItem } from '../types/Character';
import {
    getTypes,
    getRarities,
    filterInventoryItems,
} from '../utils/inventoryUtils';
import './Inventory.css';

/**
 * Бонус мастерства по уровню персонажа.
 */
const getProficiencyBonus = (level: number): number => {
    if (level <= 4) return 2;
    if (level <= 8) return 3;
    if (level <= 12) return 4;
    if (level <= 16) return 5;
    return 6;
};

/**
 * Модификатор характеристики.
 */
const getModifier = (score: number): number => Math.floor((score - 10) / 2);

/**
 * Оружие с finesse — можно использовать DEX вместо STR.
 */
const FINESSE_WEAPONS = [
    'dagger', 'rapier', 'shortsword', 'scimitar', 'whip',
];

/**
 * Двуручное/дальнобойное — использует DEX.
 */
const RANGED_WEAPONS = [
    'shortbow', 'longbow', 'crossbow', 'sling', 'dart', 'blowgun',
];

const isFinesse = (name: string): boolean =>
    FINESSE_WEAPONS.some(w => name.toLowerCase().includes(w));

const isRanged = (name: string): boolean =>
    RANGED_WEAPONS.some(w => name.toLowerCase().includes(w));

/**
 * Вычисляет бонус к попаданию для оружия с учётом характеристик персонажа.
 */
const computeAttackBonus = (item: InventoryItem, character: Character): number => {
    const profBonus = getProficiencyBonus(character.level);
    const strMod = getModifier(character.abilities.str);
    const dexMod = getModifier(character.abilities.dex);

    // Natural weapon — обычно STR
    if (item.type === 'natural weapon') {
        return profBonus + strMod;
    }

    // Finesse — максимум из STR/DEX; Ranged — DEX; иначе STR
    const abilityMod = isFinesse(item.name)
        ? Math.max(strMod, dexMod)
        : isRanged(item.name)
            ? dexMod
            : strMod;

    return profBonus + abilityMod;
};

/**
 * Вычисляет бонус к урону (без proficiency).
 */
const computeDamageBonus = (item: InventoryItem, character: Character): number => {
    const strMod = getModifier(character.abilities.str);
    const dexMod = getModifier(character.abilities.dex);

    if (item.type === 'natural weapon') return strMod;

    if (isFinesse(item.name)) return Math.max(strMod, dexMod);
    if (isRanged(item.name)) return dexMod;
    return strMod;
};

const Inventory: React.FC = () => {
    const {
        currentCharacterId,
        getCharacter,
        removeItemFromInventory,
        updateItemInInventory,
        addDiceLog,
    } = useCharacters();

    const character = currentCharacterId ? getCharacter(currentCharacterId) : undefined;

    const [searchQuery, setSearchQuery] = useState('');
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filters, setFilters] = useState({
        type: '',
        rarity: '',
    });

    // Хуки должны вызываться всегда, до early return
    const types = useMemo(
        () => (character ? getTypes(character.inventory) : []),
        [character]
    );
    const rarities = useMemo(
        () => (character ? getRarities(character.inventory) : []),
        [character]
    );

    const filterFields: FilterField[] = useMemo(
        () => [
            {
                key: 'type',
                label: 'Type',
                type: 'select',
                options: [
                    { value: '', label: 'All' },
                    ...types.map(t => ({
                        value: t,
                        label: t.charAt(0).toUpperCase() + t.slice(1),
                    })),
                ],
            },
            {
                key: 'rarity',
                label: 'Rarity',
                type: 'select',
                options: [
                    { value: '', label: 'All' },
                    ...rarities.map(r => ({
                        value: r,
                        label: r.charAt(0).toUpperCase() + r.slice(1),
                    })),
                ],
            },
        ],
        [types, rarities]
    );

    const filteredItems = useMemo(
        () =>
            character
                ? filterInventoryItems(character.inventory, searchQuery, filters)
                : [],
        [character, searchQuery, filters]
    );

    // Early return после всех хуков
    if (!character) {
        return (
            <div className="inv-page">
                <div className="inv-empty-state">
                    <p>No character selected. Please go to Dashboard and select one.</p>
                    <Link to="/dashboard" className="inv-btn-primary">
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const handleFilterChange = (newFilters: Record<string, any>) => {
        setFilters(newFilters as any);
    };

    const handleRemove = (itemId: string) => {
        removeItemFromInventory(character.id, itemId);
    };

    const handleEquip = (itemId: string) => {
        const item = character.inventory.find(i => i.id === itemId);
        if (item) {
            updateItemInInventory(character.id, itemId, { equipped: !item.equipped });
        }
    };

    // Логирование бросков атаки в diceLogs персонажа
    const handleAttackRoll = (
        attackRoll: number,
        damageRoll: number | null,
        sourceName: string
    ) => {
        addDiceLog(character.id, 20, attackRoll);
        if (damageRoll !== null) {
            // Логируем урон как бросок d20 с результатом (показываем в общем логе)
            // В будущем можно расширить diceLogs для произвольных кубиков
            addDiceLog(character.id, 20, damageRoll);
        }
    };

    return (
        <div className="inv-page">
            <div className="inv-header">
                <div className="inv-header-top">
                    <div className="inv-header-left">
                        <span className="inv-title">Inventory</span>
                        <span className="inv-subtitle">{character.name}</span>
                    </div>
                    <div className="inv-header-actions">
                        <Link to={`/characters/${character.id}`} className="inv-back-btn">
                            ← Back to Character
                        </Link>
                        <Link
                            to={`/items?characterId=${character.id}`}
                            className="inv-browse-btn"
                        >
                            Browse Items
                        </Link>
                    </div>
                </div>
            </div>

            <div className="inv-content">
                {/* Блок с деньгами */}
                <div className="inv-currency">
                    <span className="inv-currency-label">Currency:</span>
                    <span className="inv-currency-gp">{character.currency?.gp ?? 0} gp</span>
                    <span className="inv-currency-sp">{character.currency?.sp ?? 0} sp</span>
                    <span className="inv-currency-cp">{character.currency?.cp ?? 0} cp</span>
                </div>

                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search items..."
                    onFilterClick={() => setShowFilterModal(true)}
                />

                <div className="inv-list">
                    {filteredItems.length === 0 ? (
                        <div className="inv-empty">
                            No items in inventory. Browse items to add some!
                        </div>
                    ) : (
                        filteredItems.map(item => (
                            <InventoryItemCard
                                key={item.id}
                                item={item}
                                onEquip={handleEquip}
                                onRemove={handleRemove}
                                attackBonus={computeAttackBonus(item, character)}
                                damageBonus={computeDamageBonus(item, character)}
                                onAttackRoll={handleAttackRoll}
                            />
                        ))
                    )}
                </div>

                <div className="inv-add-container">
                    <Link
                        to={`/items?characterId=${character.id}`}
                        className="inv-add-btn"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M13 14.0002H16V16.0002H13V19.0002H11V16.0002H8V14.0002H11V11.0002H13V14.0002ZM24 6.00024V23.0002H0V4.00024C0 3.20459 0.31607 2.44153 0.87868 1.87892C1.44129 1.31631 2.20435 1.00024 3 1.00024H8.236L12.236 3.00024H21C21.7956 3.00024 22.5587 3.31631 23.1213 3.87892C23.6839 4.44153 24 5.20459 24 6.00024ZM2 4.00024V7.00024H22V6.00024C22 5.73503 21.8946 5.48067 21.7071 5.29314C21.5196 5.1056 21.2652 5.00024 21 5.00024H11.764L7.764 3.00024H3C2.73478 3.00024 2.48043 3.1056 2.29289 3.29314C2.10536 3.48067 2 3.73503 2 4.00024ZM22 21.0002V9.00024H2V21.0002H22Z"
                                fill="#34D399"
                            />
                        </svg>
                        Add from Library
                    </Link>
                </div>
            </div>

            {showFilterModal && (
                <FilterModal
                    isOpen={showFilterModal}
                    onClose={() => setShowFilterModal(false)}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    fields={filterFields}
                    onReset={() => setFilters({ type: '', rarity: '' })}
                    title="Filter Inventory"
                />
            )}
        </div>
    );
};

export default Inventory;