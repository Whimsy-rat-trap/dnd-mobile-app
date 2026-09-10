import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ALL_ITEMS, LibraryItem } from '../constants/items';
import { useItems } from '../context/ItemContext';
import { useCharacters } from '../context/CharacterContext';
import SearchBar from '../components/SearchBar';
import FilterModal, { FilterField } from '../components/FilterModal';
import Modal from '../components/Modal';
import './ItemsLibrary.css';
import {InventoryItem} from "../types/Character";

// Уникальные типы и редкости
const TYPES = [
    'weapon',
    'armor',
    'potion',
    'scroll',
    'ring',
    'wand',
    'shield',
    'natural weapon',
    'other'
];
const RARITIES = Array.from(new Set(ALL_ITEMS.map(i => i.rarity)));

// Опции для типов урона
const DAMAGE_TYPES = [
    'slashing', 'piercing', 'bludgeoning',
    'fire', 'cold', 'lightning', 'thunder',
    'acid', 'poison', 'necrotic', 'radiant',
    'force', 'psychic'
];

const ItemsLibrary: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { customItems, addCustomItem } = useItems();
    const { addItemToInventory, getCharacter } = useCharacters();
    const [targetCharacterId, setTargetCharacterId] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filters, setFilters] = useState({
        type: '',
        rarity: '',
        attunement: '',
        itemType: '',
    });

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newItem, setNewItem] = useState<Omit<LibraryItem, 'id'>>({
        name: '',
        type: 'other',
        rarity: 'common',
        description: '',
        attunement: false,
        damageDice: '',
        damageType: '',
        healingDice: '',
        uses: undefined,
    });

    // Автоматическое открытие модалки при ?create=true
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('create') === 'true') {
            setShowCreateModal(true);
            navigate('/items', { replace: true });
        }
    }, [location, navigate]);

    // Получаем characterId из URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const charId = params.get('characterId');
        if (charId) {
            setTargetCharacterId(charId);
        }
    }, [location]);

    const handleFilterChange = (newFilters: Record<string, any>) => {
        setFilters(newFilters as any);
    };

    const filterFields: FilterField[] = [
        {
            key: 'type',
            label: 'Type',
            type: 'select',
            options: [{ value: '', label: 'All' }, ...TYPES.map(t => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))],
        },
        {
            key: 'rarity',
            label: 'Rarity',
            type: 'select',
            options: [{ value: '', label: 'All' }, ...RARITIES.map(r => ({ value: r, label: r.charAt(0).toUpperCase() + r.slice(1) }))],
        },
        {
            key: 'attunement',
            label: 'Attunement',
            type: 'select',
            options: [
                { value: '', label: 'All' },
                { value: 'required', label: 'Requires Attunement' },
                { value: 'not-required', label: 'No Attunement' },
            ],
        },
        {
            key: 'itemType',
            label: 'Type',
            type: 'select',
            options: [
                { value: '', label: 'All' },
                { value: 'standard', label: 'Standard' },
                { value: 'custom', label: 'Custom' },
            ],
        },
    ];

    const allItems = [...ALL_ITEMS, ...customItems];

    const filteredItems = allItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = !filters.type || item.type === filters.type;
        const matchesRarity = !filters.rarity || item.rarity === filters.rarity;
        const matchesAttunement = !filters.attunement ||
            (filters.attunement === 'required' && item.attunement === true) ||
            (filters.attunement === 'not-required' && !item.attunement);
        const matchesItemType = !filters.itemType ||
            (filters.itemType === 'custom' && customItems.some(ci => ci.id === item.id)) ||
            (filters.itemType === 'standard' && ALL_ITEMS.some(ai => ai.id === item.id));
        return matchesSearch && matchesType && matchesRarity && matchesAttunement && matchesItemType;
    });

    const handleAddToInventory = (item: LibraryItem) => {
        if (!targetCharacterId) {
            alert('No character selected. Please go to Inventory first.');
            return;
        }
        const character = getCharacter(targetCharacterId);
        if (!character) {
            alert('Character not found.');
            return;
        }

        // Преобразуем LibraryItem в InventoryItem, КОПИРУЯ все новые поля
        const inventoryItem: Omit<InventoryItem, 'id'> = {
            name: item.name,
            type: item.type,
            rarity: item.rarity,
            description: item.description,
            equipped: false,
            damageDice: item.damageDice,
            damageType: item.damageType,
            healingDice: item.healingDice,
            uses: item.uses,
            baseAC: item.baseAC,
            acBonus: item.acBonus,
            dexModifierAllowed: item.dexModifierAllowed,
            maxDexBonus: item.maxDexBonus,
            strengthRequirement: item.strengthRequirement,
            stealthDisadvantage: item.stealthDisadvantage,
        };
        addItemToInventory(targetCharacterId, inventoryItem);
        alert(`Added "${item.name}" to inventory!`);
    };

    const getRarityColor = (rarity: LibraryItem['rarity']) => {
        switch (rarity) {
            case 'common': return '#9ca3af';
            case 'uncommon': return '#34d399';
            case 'rare': return '#60a5fa';
            case 'very rare': return '#a78bfa';
            case 'legendary': return '#fbbf24';
            default: return '#fff';
        }
    };

    const handleCreateItem = () => {
        if (!newItem.name.trim()) {
            alert('Please enter an item name.');
            return;
        }

        // Обрабатываем поле uses, если заданы max и current
        const itemToSave = { ...newItem };
        if (itemToSave.uses && itemToSave.uses.max <= 0) {
            itemToSave.uses = undefined;
        }

        addCustomItem(itemToSave);
        setShowCreateModal(false);
        setNewItem({
            name: '',
            type: 'other',
            rarity: 'common',
            description: '',
            attunement: false,
            damageDice: '',
            damageType: '',
            healingDice: '',
            uses: undefined,
        });
    };

    // Обновление полей uses в форме
    const handleUsesChange = (field: 'current' | 'max', value: number) => {
        setNewItem(prev => ({
            ...prev,
            uses: {
                current: field === 'current' ? Math.max(0, value) : (prev.uses?.current ?? 0),
                max: field === 'max' ? Math.max(0, value) : (prev.uses?.max ?? 0),
            },
        }));
    };

    return (
        <div className="il-page">
            <div className="il-header">
                <div className="il-header-top">
                    <span className="il-title">Items Library</span>
                    <div className="il-header-actions">
                        <button className="il-create-btn" onClick={() => setShowCreateModal(true)}>
                            + Create Item
                        </button>
                        <Link to="/inventory" className="il-back-btn">← Back to Inventory</Link>
                    </div>
                </div>
                <div className="il-subtitle">Browse all available D&D items</div>
            </div>

            <div className="il-content">
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search items..."
                    onFilterClick={() => setShowFilterModal(true)}
                />
                <div className="il-list">
                    {filteredItems.length === 0 ? (
                        <div className="il-empty">No items match your filters.</div>
                    ) : (
                        filteredItems.map(item => {
                            const isCustom = customItems.some(ci => ci.id === item.id);
                            return (
                                <div key={item.id} className="il-item">
                                    <div className="il-item-info">
                                        <span className="il-item-name">{item.name}</span>
                                        <span className="il-item-type">{item.type}</span>
                                        <span className="il-item-rarity" style={{ color: getRarityColor(item.rarity) }}>
                                            {item.rarity}
                                        </span>
                                        {item.attunement !== undefined && (
                                            <span className="il-item-attunement">
                                                {item.attunement ? 'Requires Attunement' : 'No Attunement'}
                                            </span>
                                        )}
                                        {isCustom && (
                                            <span className="il-item-custom-tag">Custom</span>
                                        )}
                                        <span className="il-item-description">{item.description}</span>

                                        {/* Блок с характеристиками предмета */}
                                        {(item.damageDice || item.healingDice || item.uses || item.baseAC || item.acBonus || item.strengthRequirement) && (
                                            <div className="inv-item-stats">
                                                {/* Урон */}
                                                {item.damageDice && (
                                                    <span className="inv-item-stat inv-item-stat-damage">
                                                    Damage: {item.damageDice}
                                                        {item.damageType ? ` ${item.damageType}` : ''}
                                                </span>
                                                )}
                                                {item.healingDice && (
                                                    <span className="inv-item-stat inv-item-stat-healing">
                                                    Healing: {item.healingDice}
                                                </span>
                                                )}
                                                {item.baseAC !== undefined && (
                                                    <span className="inv-item-stat inv-item-stat-ac">
                                                    AC {item.baseAC}
                                                        {item.dexModifierAllowed && (
                                                            item.maxDexBonus !== undefined ? ` + Dex (max ${item.maxDexBonus})` : ' + Dex'
                                                        )}
                                                </span>
                                                )}
                                                {item.acBonus !== undefined && (
                                                    <span className="inv-item-stat inv-item-stat-ac">
                                                    Bonus +{item.acBonus} AC
                                                </span>
                                                )}
                                                {item.strengthRequirement !== undefined && (
                                                    <span className="inv-item-stat inv-item-stat-strength">
                                                    Str: {item.strengthRequirement}
                                                </span>
                                                )}
                                                {item.stealthDisadvantage && (
                                                    <span className="inv-item-stat inv-item-stat-stealth">
                                                    Stealth Disadv.
                                                </span>
                                                )}
                                                {item.uses && (
                                                    <span className="inv-item-stat inv-item-stat-uses">
                                                    Uses: {item.uses.current}/{item.uses.max}
                                                </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        className="il-add-btn"
                                        onClick={() => handleAddToInventory(item)}
                                    >
                                        Add to Inventory
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {showFilterModal && (
                <FilterModal
                    isOpen={showFilterModal}
                    onClose={() => setShowFilterModal(false)}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    fields={filterFields}
                    onReset={() => setFilters({ type: '', rarity: '', attunement: '', itemType: '' })}
                    title="Filter Items"
                />
            )}

            <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)}>
                <h3>Create Custom Item</h3>
                <div className="il-create-form">
                    <div className="il-form-group">
                        <label>Item Name *</label>
                        <input
                            type="text"
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            placeholder="Enter item name"
                        />
                    </div>
                    <div className="il-form-group">
                        <label>Type</label>
                        <select
                            value={newItem.type}
                            onChange={(e) => setNewItem({ ...newItem, type: e.target.value as any })}
                        >
                            {TYPES.map(t => (
                                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                    <div className="il-form-group">
                        <label>Rarity</label>
                        <select
                            value={newItem.rarity}
                            onChange={(e) => setNewItem({ ...newItem, rarity: e.target.value as any })}
                        >
                            {RARITIES.map(r => (
                                <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                    <div className="il-form-group">
                        <label>Attunement</label>
                        <select
                            value={newItem.attunement ? 'true' : 'false'}
                            onChange={(e) => setNewItem({ ...newItem, attunement: e.target.value === 'true' })}
                        >
                            <option value="false">No Attunement</option>
                            <option value="true">Requires Attunement</option>
                        </select>
                    </div>

                    {/* Поля для урона */}
                    <div className="il-form-row">
                        <div className="il-form-group">
                            <label>Damage Dice</label>
                            <input
                                type="text"
                                value={newItem.damageDice || ''}
                                onChange={(e) => setNewItem({ ...newItem, damageDice: e.target.value })}
                                placeholder="e.g., 2d6"
                            />
                        </div>
                        <div className="il-form-group">
                            <label>Damage Type</label>
                            <select
                                value={newItem.damageType || ''}
                                onChange={(e) => setNewItem({ ...newItem, damageType: e.target.value })}
                            >
                                <option value="">None</option>
                                {DAMAGE_TYPES.map(dt => (
                                    <option key={dt} value={dt}>{dt.charAt(0).toUpperCase() + dt.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Поле для исцеления */}
                    <div className="il-form-group">
                        <label>Healing Dice</label>
                        <input
                            type="text"
                            value={newItem.healingDice || ''}
                            onChange={(e) => setNewItem({ ...newItem, healingDice: e.target.value })}
                            placeholder="e.g., 2d4+2"
                        />
                    </div>

                    {/* Поля для зарядов */}
                    <div className="il-form-row">
                        <div className="il-form-group">
                            <label>Uses (current)</label>
                            <input
                                type="number"
                                min="0"
                                value={newItem.uses?.current ?? 0}
                                onChange={(e) => handleUsesChange('current', Number(e.target.value))}
                            />
                        </div>
                        <div className="il-form-group">
                            <label>Uses (max)</label>
                            <input
                                type="number"
                                min="0"
                                value={newItem.uses?.max ?? 0}
                                onChange={(e) => handleUsesChange('max', Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="il-form-group">
                        <label>Description</label>
                        <textarea
                            value={newItem.description}
                            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                            placeholder="Enter item description"
                            rows={3}
                        />
                    </div>
                </div>
                <div className="il-modal-actions">
                    <button className="il-modal-btn il-cancel" onClick={() => setShowCreateModal(false)}>Cancel</button>
                    <button className="il-modal-btn il-apply" onClick={handleCreateItem}>Create</button>
                </div>
            </Modal>
        </div>
    );
};

export default ItemsLibrary;