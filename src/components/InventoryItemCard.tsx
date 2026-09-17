import React from 'react';
import { InventoryItem } from '../types/Character';
import {
    getRarityColor,
    isNaturalWeapon,
    hasItemStats,
    formatACDescription,
} from '../utils/inventoryUtils';
import AttackRoller from './AttackRoller';

interface InventoryItemCardProps {
    item: InventoryItem;
    onEquip: (itemId: string) => void;
    onRemove: (itemId: string) => void;
    attackBonus?: number;
    damageBonus?: number;
    onAttackRoll?: (attackTotal: number, damageTotal: number | null, sourceName: string) => void;
}

const InventoryItemCard: React.FC<InventoryItemCardProps> = ({
                                                                 item,
                                                                 onEquip,
                                                                 onRemove,
                                                                 attackBonus = 0,
                                                                 damageBonus = 0,
                                                                 onAttackRoll,
                                                             }) => {
    const showStats = hasItemStats(item);

    const canAttack =
        (item.type === 'weapon' || item.type === 'natural weapon') &&
        Boolean(item.damageDice);

    // Собираем итоговые значения для логирования (если оба ролла сделаны — можем вызвать onAttackRoll)
    const handleRollAttack = (attackTotal: number) => {
        // Урон ещё не брошен — вызываем с null
        onAttackRoll?.(attackTotal, null, item.name);
    };

    const handleRollDamage = (damageTotal: number) => {
        // Урон брошен отдельно — можно логировать отдельно (с нулевой атакой)
        onAttackRoll?.(0, damageTotal, item.name);
    };

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

                {canAttack && (
                    <AttackRoller
                        sourceName={item.name}
                        damageDice={item.damageDice}
                        damageType={item.damageType}
                        defaultAttackBonus={attackBonus}
                        defaultDamageBonus={damageBonus}
                        onRollAttack={(result) => handleRollAttack(result.total)}
                        onRollDamage={(result) => handleRollDamage(result.total)}
                        trigger={
                            <button
                                className="inv-action-btn inv-attack-btn"
                                title="Roll attack"
                            >
                                Attack
                            </button>
                        }
                    />
                )}

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