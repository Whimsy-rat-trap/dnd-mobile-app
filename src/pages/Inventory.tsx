import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCharacters } from '../context/CharacterContext';
import SearchBar from '../components/SearchBar';
import FilterModal, { FilterField } from '../components/FilterModal';
import './Inventory.css';

// Уникальные типы и редкости для фильтров (на основе предметов в инвентаре)
const getTypes = (inventory: any[]) => Array.from(new Set(inventory.map(i => i.type)));
const getRarities = (inventory: any[]) => Array.from(new Set(inventory.map(i => i.rarity)));

const Inventory: React.FC = () => {
    const { currentCharacterId, getCharacter, removeItemFromInventory, updateItemInInventory } = useCharacters();
    const character = currentCharacterId ? getCharacter(currentCharacterId) : undefined;

    const [searchQuery, setSearchQuery] = useState('');
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filters, setFilters] = useState({
        type: '',
        rarity: '',
    });

    if (!character) {
        return (
            <div className="page inventory-page">
                <div className="inventory-empty-state">
                    <p>No character selected. Please go to Dashboard and select one.</p>
                    <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
                </div>
            </div>
        );
    }

    const handleFilterChange = (newFilters: Record<string, any>) => {
        setFilters(newFilters as any);
    };

    // Определяем доступные типы и редкости на основе инвентаря персонажа
    const types = getTypes(character.inventory);
    const rarities = getRarities(character.inventory);

    const filterFields: FilterField[] = [
        {
            key: 'type',
            label: 'Type',
            type: 'select',
            options: [{ value: '', label: 'All' }, ...types.map(t => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))],
        },
        {
            key: 'rarity',
            label: 'Rarity',
            type: 'select',
            options: [{ value: '', label: 'All' }, ...rarities.map(r => ({ value: r, label: r.charAt(0).toUpperCase() + r.slice(1) }))],
        },
    ];

    const filteredItems = character.inventory.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.description || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = !filters.type || item.type === filters.type;
        const matchesRarity = !filters.rarity || item.rarity === filters.rarity;
        return matchesSearch && matchesType && matchesRarity;
    });

    const handleRemove = (itemId: string) => {
        removeItemFromInventory(character.id, itemId);
    };

    const handleEquip = (itemId: string) => {
        const item = character.inventory.find(i => i.id === itemId);
        if (item) {
            updateItemInInventory(character.id, itemId, { equipped: !item.equipped });
        }
    };

    const getRarityColor = (rarity: string) => {
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
        <div className="page inventory-page">
            <div className="inventory-header">
                <div className="header-top">
                    <div className="header-left">
                        <span className="header-title-inventory">Inventory</span>
                        <span className="header-subtitle-inventory">{character.name}</span>
                    </div>
                    <div className="header-actions">
                        <Link to={`/characters/${character.id}`} className="back-to-character-btn">
                            ← Back to Character
                        </Link>
                        <Link to="/items" className="browse-items-btn">
                            Browse Items
                        </Link>
                    </div>
                </div>
            </div>

            <div className="inventory-content">
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search items..."
                    onFilterClick={() => setShowFilterModal(true)}
                />
                <div className="inventory-list">
                    {filteredItems.length === 0 ? (
                        <div className="empty-state">No items in inventory. Browse items to add some!</div>
                    ) : (
                        filteredItems.map(item => (
                            <div key={item.id} className={`inventory-item ${item.equipped ? 'equipped' : ''}`}>
                                <div className="item-info">
                                    <span className="item-name">{item.name}</span>
                                    <span className="item-type">{item.type}</span>
                                    <span className="item-rarity" style={{ color: getRarityColor(item.rarity) }}>
                                        {item.rarity}
                                    </span>
                                    {item.description && (
                                        <span className="item-description">{item.description}</span>
                                    )}
                                </div>
                                <div className="item-actions">
                                    {item.equipped && <span className="equipped-badge">Equipped</span>}
                                    <button
                                        className="action-btn equip-btn"
                                        onClick={() => handleEquip(item.id)}
                                    >
                                        {item.equipped ? 'Unequip' : 'Equip'}
                                    </button>
                                    <button
                                        className="action-btn remove-btn"
                                        onClick={() => handleRemove(item.id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="add-item-container">
                    <Link to="/items" className="add-item-btn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13 14.0002H16V16.0002H13V19.0002H11V16.0002H8V14.0002H11V11.0002H13V14.0002ZM24 6.00024V23.0002H0V4.00024C0 3.20459 0.31607 2.44153 0.87868 1.87892C1.44129 1.31631 2.20435 1.00024 3 1.00024H8.236L12.236 3.00024H21C21.7956 3.00024 22.5587 3.31631 23.1213 3.87892C23.6839 4.44153 24 5.20459 24 6.00024ZM2 4.00024V7.00024H22V6.00024C22 5.73503 21.8946 5.48067 21.7071 5.29314C21.5196 5.1056 21.2652 5.00024 21 5.00024H11.764L7.764 3.00024H3C2.73478 3.00024 2.48043 3.1056 2.29289 3.29314C2.10536 3.48067 2 3.73503 2 4.00024ZM22 21.0002V9.00024H2V21.0002H22Z" fill="#34D399" />
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