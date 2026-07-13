import React, { useState } from 'react';
import { useCharacters } from '../context/CharacterContext';
import './Inventory.css';

const Inventory: React.FC = () => {
    const { currentCharacterId, getCharacter, addItemToInventory, removeItemFromInventory, updateItemInInventory } = useCharacters();
    const character = currentCharacterId ? getCharacter(currentCharacterId) : undefined;

    const [newItemName, setNewItemName] = useState('');

    if (!character) {
        return <div className="page">No character selected. Please go to Dashboard and select one.</div>;
    }

    const handleAddItem = () => {
        if (!newItemName.trim()) return;
        addItemToInventory(character.id, {
            name: newItemName,
            type: 'other',
            rarity: 'common',
            description: '',
            equipped: false,
        });
        setNewItemName('');
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

    return (
        <div className="page inventory-page">
            <h2>Inventory of {character.name}</h2>
            <div className="add-item">
                <input
                    type="text"
                    placeholder="Item name"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                />
                <button onClick={handleAddItem}>Add Item</button>
            </div>
            <div className="inventory-list">
                {character.inventory.map(item => (
                    <div key={item.id} className={`inventory-item ${item.equipped ? 'equipped' : ''}`}>
                        <span>{item.name}</span>
                        <span>{item.type}</span>
                        <button onClick={() => handleEquip(item.id)}>
                            {item.equipped ? 'Unequip' : 'Equip'}
                        </button>
                        <button onClick={() => handleRemove(item.id)}>Remove</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Inventory;