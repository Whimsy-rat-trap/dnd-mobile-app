import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ALL_ITEMS, LibraryItem } from '../constants/items';
import SearchBar from '../components/SearchBar';
import FilterModal, { FilterField } from '../components/FilterModal';
import './ItemsLibrary.css';

// Уникальные типы и редкости
const TYPES = Array.from(new Set(ALL_ITEMS.map(i => i.type)));
const RARITIES = Array.from(new Set(ALL_ITEMS.map(i => i.rarity)));

const ItemsLibrary: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filters, setFilters] = useState({
        type: '',
        rarity: '',
        attunement: '',
    });

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
    ];

    const filteredItems = ALL_ITEMS.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = !filters.type || item.type === filters.type;
        const matchesRarity = !filters.rarity || item.rarity === filters.rarity;
        const matchesAttunement = !filters.attunement ||
            (filters.attunement === 'required' && item.attunement === true) ||
            (filters.attunement === 'not-required' && !item.attunement);
        return matchesSearch && matchesType && matchesRarity && matchesAttunement;
    });

    const handleAddToInventory = (item: LibraryItem) => {
        // Здесь будет логика добавления к персонажу (пока алерт)
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

    return (
        <div className="il-page">
            <div className="il-header">
                <div className="il-header-top">
                    <span className="il-title">Items Library</span>
                    <Link to="/inventory" className="il-back-btn">← Back to Inventory</Link>
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
                        filteredItems.map(item => (
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
                                    <span className="il-item-description">{item.description}</span>
                                </div>
                                <button
                                    className="il-add-btn"
                                    onClick={() => handleAddToInventory(item)}
                                >
                                    Add to Inventory
                                </button>
                            </div>
                        ))
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
                    onReset={() => setFilters({ type: '', rarity: '', attunement: '' })}
                    title="Filter Items"
                />
            )}
        </div>
    );
};

export default ItemsLibrary;