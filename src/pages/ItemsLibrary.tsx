import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ItemsLibrary.css';

type ItemType = 'weapon' | 'armor' | 'potion' | 'scroll' | 'other';
type Rarity = 'common' | 'uncommon' | 'rare' | 'very rare' | 'legendary';

interface LibraryItem {
    id: string;
    name: string;
    type: ItemType;
    rarity: Rarity;
    description: string;
}

const ItemsLibrary: React.FC = () => {
    // Предустановленная библиотека D&D предметов
    const [libraryItems] = useState<LibraryItem[]>([
        {
            id: 'lib1',
            name: 'Longsword +1',
            type: 'weapon',
            rarity: 'uncommon',
            description: 'A finely crafted longsword with a faint magical aura.',
        },
        {
            id: 'lib2',
            name: 'Leather Armor',
            type: 'armor',
            rarity: 'common',
            description: 'Standard leather armor, well-worn but sturdy.',
        },
        {
            id: 'lib3',
            name: 'Healing Potion',
            type: 'potion',
            rarity: 'common',
            description: 'Restores 2d4+2 hit points when consumed.',
        },
        {
            id: 'lib4',
            name: 'Scroll of Fireball',
            type: 'scroll',
            rarity: 'rare',
            description: 'Casts Fireball (3rd level) as an action.',
        },
        {
            id: 'lib5',
            name: 'Plate Armor +2',
            type: 'armor',
            rarity: 'very rare',
            description: 'Shining plate armor that grants a +2 bonus to AC.',
        },
        {
            id: 'lib6',
            name: 'Wand of Magic Missiles',
            type: 'other',
            rarity: 'uncommon',
            description: 'A wand with 7 charges. Expends 1 charge to cast Magic Missile.',
        },
        {
            id: 'lib7',
            name: 'Potion of Invisibility',
            type: 'potion',
            rarity: 'rare',
            description: 'Becomes invisible for 1 hour or until you attack/cast a spell.',
        },
        {
            id: 'lib8',
            name: 'Dagger of Venom',
            type: 'weapon',
            rarity: 'rare',
            description: 'On a hit, you can activate the dagger to deal an extra 2d10 poison damage.',
        },
    ]);

    const [filterType, setFilterType] = useState<ItemType | 'all'>('all');
    const [filterRarity, setFilterRarity] = useState<Rarity | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredItems = libraryItems.filter(item => {
        const matchType = filterType === 'all' || item.type === filterType;
        const matchRarity = filterRarity === 'all' || item.rarity === filterRarity;
        const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchType && matchRarity && matchSearch;
    });

    const getRarityColor = (rarity: Rarity) => {
        switch (rarity) {
            case 'common': return '#9ca3af';
            case 'uncommon': return '#34d399';
            case 'rare': return '#60a5fa';
            case 'very rare': return '#a78bfa';
            case 'legendary': return '#fbbf24';
            default: return '#fff';
        }
    };

    const handleAddToInventory = (item: LibraryItem) => {
        // В реальном приложении отправляется запрос на добавление предмета персонажу
        // Пока просто алерт
        alert(`Added "${item.name}" to inventory!`);
    };

    return (
        <div className="page library-page">
            <div className="library-header">
                <div className="header-top">
                    <span className="header-title-library">Items Library</span>
                    <Link to="/inventory" className="back-to-inventory-btn">← Back to Inventory</Link>
                </div>
                <div className="header-subtitle">Browse all available D&D items</div>
            </div>

            <div className="content-wrapper">
                {/* Фильтры */}
                <div className="library-filters">
                    <div className="filter-group">
                        <label>Type</label>
                        <select value={filterType} onChange={(e) => setFilterType(e.target.value as ItemType | 'all')}>
                            <option value="all">All</option>
                            <option value="weapon">Weapon</option>
                            <option value="armor">Armor</option>
                            <option value="potion">Potion</option>
                            <option value="scroll">Scroll</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Rarity</label>
                        <select value={filterRarity} onChange={(e) => setFilterRarity(e.target.value as Rarity | 'all')}>
                            <option value="all">All</option>
                            <option value="common">Common</option>
                            <option value="uncommon">Uncommon</option>
                            <option value="rare">Rare</option>
                            <option value="very rare">Very Rare</option>
                            <option value="legendary">Legendary</option>
                        </select>
                    </div>
                    <div className="filter-group search-group">
                        <input
                            type="text"
                            placeholder="Search items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Список предметов библиотеки */}
                <div className="library-list">
                    {filteredItems.length === 0 ? (
                        <div className="empty-state">No items match your filters.</div>
                    ) : (
                        filteredItems.map(item => (
                            <div key={item.id} className="library-item">
                                <div className="item-info">
                                    <span className="item-name">{item.name}</span>
                                    <span className="item-type">{item.type}</span>
                                    <span className="item-rarity" style={{ color: getRarityColor(item.rarity) }}>
                    {item.rarity}
                  </span>
                                    <span className="item-description">{item.description}</span>
                                </div>
                                <button
                                    className="add-to-inventory-btn"
                                    onClick={() => handleAddToInventory(item)}
                                >
                                    Add to Inventory
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ItemsLibrary;