import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ALL_ITEMS, LibraryItem } from '../constants/items';
import { useItems } from '../context/ItemContext';
import SearchBar from '../components/SearchBar';
import FilterModal, { FilterField } from '../components/FilterModal';
import Modal from '../components/Modal';
import './ItemsLibrary.css';

// Уникальные типы и редкости
const TYPES = Array.from(new Set(ALL_ITEMS.map(i => i.type)));
const RARITIES = Array.from(new Set(ALL_ITEMS.map(i => i.rarity)));

const ItemsLibrary: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { customItems, addCustomItem } = useItems();
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filters, setFilters] = useState({
        type: '',
        rarity: '',
        attunement: '',
        itemType: '', // 'standard' | 'custom'
    });

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newItem, setNewItem] = useState<Omit<LibraryItem, 'id'>>({
        name: '',
        type: 'other',
        rarity: 'common',
        description: '',
        attunement: false,
    });

    // Автоматическое открытие модалки при переходе с ?create=true
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('create') === 'true') {
            setShowCreateModal(true);
            navigate('/items', { replace: true });
        }
    }, [location, navigate]);

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
        addCustomItem(newItem);
        setShowCreateModal(false);
        setNewItem({
            name: '',
            type: 'other',
            rarity: 'common',
            description: '',
            attunement: false,
        });
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