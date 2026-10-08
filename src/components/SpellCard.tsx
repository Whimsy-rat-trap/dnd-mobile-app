import React from 'react';
import { Spell } from '../types/Character';
import AttackRoller from './AttackRoller';
import './SpellCard.css';

interface SpellCardProps {
    spell: Spell;
    showAddButton?: boolean;
    onAdd?: () => void;
    showRemoveButton?: boolean;
    onRemove?: () => void;
    isPrepared?: boolean;
    onTogglePrepared?: () => void;
    renderPreparedToggle?: (props: { prepared: boolean; onToggle: () => void }) => React.ReactNode;
    isCustom?: boolean;
    showEdit?: boolean;
    onEdit?: () => void;
    disableToggle?: boolean;
    requiresConcentration?: boolean;
    isConcentrating?: boolean;
    onToggleConcentration?: () => void;
    showConcentrationControl?: boolean;

    /** Бонус к атаке заклинанием (proficiency + spellcasting ability mod). */
    spellAttackBonus?: number;
    /** Бонус к урону заклинанием (обычно = spellcasting ability mod). */
    spellDamageBonus?: number;
    /** Колбэк для логирования броска. */
    onAttackRoll?: (attackTotal: number, damageTotal: number | null, sourceName: string) => void;

    /** Показывать ли кнопку Cast. */
    showCastButton?: boolean;
    /** Колбэк при клике на Cast — обычно открывает модалку. */
    onCastClick?: () => void;
}

const SpellCard: React.FC<SpellCardProps> = ({
                                                 spell,
                                                 showAddButton = false,
                                                 onAdd,
                                                 showRemoveButton = false,
                                                 onRemove,
                                                 isPrepared = false,
                                                 onTogglePrepared,
                                                 renderPreparedToggle,
                                                 isCustom = false,
                                                 showEdit = false,
                                                 onEdit,
                                                 disableToggle = false,
                                                 requiresConcentration = false,
                                                 isConcentrating = false,
                                                 onToggleConcentration,
                                                 showConcentrationControl = false,
                                                 spellAttackBonus = 0,
                                                 spellDamageBonus = 0,
                                                 onAttackRoll,
                                                 showCastButton = false,
                                                 onCastClick,
                                             }) => {
    const elementColors: Record<string, string> = {
        fire: '#ef4444',
        force: '#a855f7',
        necrotic: '#8b5cf6',
        acid: '#22c55e',
        cold: '#38bdf8',
        lightning: '#fbbf24',
        thunder: '#a855f7',
        psychic: '#f472b6',
        radiant: '#fcd34d',
        poison: '#84cc16',
        healing: '#22c55e',
    };

    const getElementColor = (element?: string): string => {
        if (!element) return '#6b7280';
        return elementColors[element.toLowerCase()] || '#6b7280';
    };

    const displayRoll = spell.damageRoll || spell.diceRoll;
    const elementColor = getElementColor(spell.element);

    const canRollAttack =
        Boolean(displayRoll) &&
        spell.damageType !== 'healing' &&
        spell.element !== 'healing';

    return (
        <div className="spell-card">
            <div className="spell-card-header">
                <div className="spell-card-left">
                    <div className="spell-card-icon"></div>
                    <div className="spell-card-info">
                        <div className="spell-name-wrapper">
                            <span className="spell-card-name">{spell.name}</span>
                            {isCustom && <span className="spell-custom-badge" title="Custom spell">✨</span>}
                            {requiresConcentration && <span className="spell-concentration-tag">C</span>}
                        </div>
                        <span className="spell-card-school">{spell.school}</span>
                    </div>
                </div>
                <div className="spell-card-actions">
                    {renderPreparedToggle && !disableToggle && renderPreparedToggle({ prepared: isPrepared, onToggle: onTogglePrepared || (() => {}) })}
                    {disableToggle && <span className="spell-always-prepared" title="Always prepared (racial spell)">✦</span>}
                    {showEdit && onEdit && <button className="spell-edit-btn" onClick={onEdit}>Edit</button>}
                    {showAddButton && onAdd && <button className="btn-add-spell" onClick={onAdd}>+</button>}
                    {showRemoveButton && onRemove && <button className="btn-remove-spell" onClick={onRemove}>✕</button>}
                    {showConcentrationControl && (
                        <button
                            className={`btn-concentration ${isConcentrating ? 'active' : ''}`}
                            onClick={onToggleConcentration}
                            title={isConcentrating ? 'End concentration' : 'Start concentrating'}
                        >
                            {isConcentrating ? '⏳' : '⚡'}
                        </button>
                    )}
                </div>
            </div>

            <div className="spell-card-details">
                <div className="spell-card-row">
                    <div className="spell-detail-item">
                        <span className="spell-detail-label">Casting Time</span>
                        <span className="spell-detail-value">{spell.castingTime || '—'}</span>
                    </div>
                    <div className="spell-detail-item">
                        <span className="spell-detail-label">Range</span>
                        <span className="spell-detail-value">{spell.range || '—'}</span>
                    </div>
                    <div className="spell-detail-item">
                        <span className="spell-detail-label">Components</span>
                        <span className="spell-detail-value">{spell.components || '—'}</span>
                    </div>
                </div>
            </div>

            <div className="spell-card-tags spell-card-tags-hub">
                <span className="spell-tag-level">
                    {spell.level === 0 ? 'Cantrip' : `Lv.${spell.level}`}
                </span>
                <span className="spell-tag-school">{spell.school}</span>
                {spell.element && (
                    <span className="spell-tag-element" style={{ color: elementColor }}>
                        {spell.element}
                    </span>
                )}
                {displayRoll && (
                    <span className="spell-tag-dice" style={{ color: spell.element ? elementColor : '#fff' }}>
                        {displayRoll}
                    </span>
                )}
                {spell.damageType && spell.damageType !== spell.element && (
                    <span className="spell-tag-damage-type">{spell.damageType}</span>
                )}
                {spell.isRitual && (
                    <span className="spell-tag-ritual">Ritual</span>
                )}
                {isCustom && <span className="spell-tag-custom">Custom</span>}
                {spell.isRacial && <span className="spell-tag-racial">Racial</span>}
            </div>

            {(canRollAttack || showCastButton) && (
                <div className="spell-card-attack-row">
                    {showCastButton && onCastClick && (
                        <button
                            className="spell-cast-btn"
                            onClick={onCastClick}
                            type="button"
                        >
                            Cast
                        </button>
                    )}
                    {canRollAttack && (
                        <AttackRoller
                            sourceName={spell.name}
                            damageDice={displayRoll}
                            damageType={spell.damageType || spell.element}
                            defaultAttackBonus={spellAttackBonus}
                            defaultDamageBonus={spellDamageBonus}
                            onRollAttack={(result) => onAttackRoll?.(result.total, null, spell.name)}
                            onRollDamage={(result) => onAttackRoll?.(0, result.total, spell.name)}
                            trigger={
                                <button className="spell-attack-btn" type="button">
                                    Attack
                                </button>
                            }
                        />
                    )}
                </div>
            )}

            <div className="spell-card-description">{spell.description}</div>
        </div>
    );
};

export default SpellCard;