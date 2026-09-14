import React from 'react';
import { InventoryItem } from '../types/Character';
import {
    getRarityColor,
    isNaturalWeapon,
    hasItemStats,
    formatACDescription,
} from '../utils/inventoryUtils';

interface InventoryItemCardProps {
    item: InventoryItem;
    onEquip: (itemId: string) => void;
    onRemove: (itemId: string) => void;
}

const InventoryItemCard: React.FC<InventoryItemCardProps> = ({
                                                                 item,
                                                                 onEquip,
                                                                 onRemove,
                                                             }) => {
    const showStats = hasItemStats(item);

    return (
        <div
            className={`inv-item ${item.equipped ? 'inv-equipped' : ''} ${
                isNaturalWeapon(item.type) ? 'inv-natural-weapon' : ''
            }`}
        >
            <div className="inv-item-info">
                <span className="inv-item-name">{item.name}</span>
                <span className="inv-item-type">{item.type}</span>
                <span
                    className="inv-item-rarity"
                    style={{ color: getRarityColor(item.rarity) }}
                >
                    {item.rarity}
                </span>
                {item.description && (
                    <span className="inv-item-description">{item.description}</span>
                )}

                {showStats && (
                    <div className="inv-item-stats">
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
                                {formatACDescription(item)}
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

            <div className="inv-item-actions">
                {item.equipped && <span className="inv-equipped-badge">Equipped</span>}
                <button
                    className="inv-action-btn inv-equip-btn"
                    onClick={() => onEquip(item.id)}
                >
                    {item.equipped ? 'Unequip' : 'Equip'}
                </button>
                <button
                    className="inv-action-btn inv-remove-btn"
                    onClick={() => onRemove(item.id)}
                >
                    Remove
                </button>
            </div>
        </div>
    );
};

export default InventoryItemCard;