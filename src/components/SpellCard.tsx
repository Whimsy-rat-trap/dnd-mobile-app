import React from 'react';
import { Spell } from '../types/Character';
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
                                             }) => {
    // Цвет элемента (для тега)
    const getElementColor = (element?: string): string => {
        const colors: Record<string, string> = {
            fire: '#ef4444',
            cold: '#38bdf8',
            lightning: '#fbbf24',
            acid: '#22c55e',
            poison: '#84cc16',
            force: '#a855f7',
            necrotic: '#8b5cf6',
            radiant: '#fcd34d',
            psychic: '#f472b6',
            healing: '#22c55e',
            thunder: '#a855f7',
        };
        return element ? colors[element] || '#6b7280' : '#6b7280';
    };

    return (
        <div className="spell-card">
            {/* Верхняя часть: заголовок с названием и действиями */}
            <div className="spell-card-header">
                <div className="spell-card-left">
                    {/* Иконка (квадрат с градиентом – можно оставить или убрать) */}
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

            {/* Детали заклинания (casting time, range, components) */}
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

            {/* Теги (уровень, школа, элемент, кастомность, расовость) */}
            <div className="spell-card-tags">
                <span className="spell-tag-level">{spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`}</span>
                <span className="spell-tag-school">{spell.school}</span>
                {spell.element && <span className="spell-tag-element" style={{ color: getElementColor(spell.element) }}>{spell.element}</span>}
                {isCustom && <span className="spell-tag-custom">Custom</span>}
                {spell.isRacial && <span className="spell-tag-racial">Racial</span>}
            </div>
            <div className="spell-card-description">{spell.description}</div>
        </div>
    );
};

export default SpellCard;