import React from 'react';
import { Spell } from '../types/Character';
import './SpellCard.css';

interface SpellCardProps {
    spell: Spell;
    showAddButton?: boolean;
    onAdd?: () => void;
    showRemoveButton?: boolean;
    onRemove?: () => void;
    showPreparedToggle?: boolean;
    onTogglePrepared?: () => void;
    isPrepared?: boolean;
}

const SpellCard: React.FC<SpellCardProps> = ({
                                                 spell,
                                                 showAddButton,
                                                 onAdd,
                                                 showRemoveButton,
                                                 onRemove,
                                                 showPreparedToggle,
                                                 onTogglePrepared,
                                                 isPrepared,
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

    // Определяем элемент для цвета (если есть в названии или школе)
    const getElement = (spell: Spell): string | undefined => {
        const name = spell.name.toLowerCase();
        if (name.includes('fire')) return 'fire';
        if (name.includes('acid')) return 'acid';
        if (name.includes('cold') || name.includes('frost')) return 'cold';
        if (name.includes('lightning') || name.includes('shock')) return 'lightning';
        if (name.includes('poison')) return 'poison';
        if (name.includes('force')) return 'force';
        if (name.includes('necrotic') || name.includes('chill touch')) return 'necrotic';
        if (name.includes('radiant')) return 'radiant';
        if (name.includes('thunder') || name.includes('sonic')) return 'thunder';
        if (name.includes('psychic')) return 'psychic';
        if (name.includes('cure') || name.includes('heal')) return 'healing';
        return undefined;
    };

    const element = getElement(spell);
    const elementColor = element ? elementColors[element] : undefined;

    return (
        <div className="spell-card">
            <div className="spell-card-header">
                <div className="spell-card-left">
                    <div className="spell-card-icon" />
                    <div className="spell-card-info">
                        <div className="spell-card-name">{spell.name}</div>
                        <div className="spell-card-school">{spell.school}</div>
                    </div>
                </div>
                <div className="spell-card-actions">
                    {showPreparedToggle && (
                        <div
                            className="spell-card-prepared"
                            onClick={onTogglePrepared}
                            style={{ cursor: 'pointer' }}
                        >
                            {isPrepared ? (
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14.5306 5.03063L6.5306 13.0306C6.46092 13.1005 6.37813 13.156 6.28696 13.1939C6.1958 13.2317 6.09806 13.2512 5.99935 13.2512C5.90064 13.2512 5.8029 13.2317 5.71173 13.1939C5.62057 13.156 5.53778 13.1005 5.4681 13.0306L1.9681 9.53063C1.89833 9.46087 1.84299 9.37804 1.80524 9.28689C1.76748 9.19574 1.74805 9.09804 1.74805 8.99938C1.74805 8.90072 1.76748 8.80302 1.80524 8.71187C1.84299 8.62072 1.89833 8.53789 1.9681 8.46813C2.03786 8.39837 2.12069 8.34302 2.21184 8.30527C2.30299 8.26751 2.40069 8.24808 2.49935 8.24808C2.59801 8.24808 2.69571 8.26751 2.78686 8.30527C2.87801 8.34302 2.96083 8.39837 3.0306 8.46813L5.99997 11.4375L13.4693 3.96938C13.6102 3.82848 13.8013 3.74933 14.0006 3.74933C14.1999 3.74933 14.391 3.82848 14.5318 3.96938C14.6727 4.11028 14.7519 4.30137 14.7519 4.50063C14.7519 4.69989 14.6727 4.89098 14.5318 5.03188L14.5306 5.03063Z" fill="#34D399" />
                                </svg>
                            ) : (
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="0.5" y="0.5" width="15" height="15" rx="1.5" stroke="#6B7280" strokeOpacity="0.6" />
                                </svg>
                            )}
                        </div>
                    )}
                    {showAddButton && (
                        <button className="btn-add-spell" onClick={onAdd}>
                            Add
                        </button>
                    )}
                    {showRemoveButton && (
                        <button className="btn-remove-spell" onClick={onRemove}>
                            Remove
                        </button>
                    )}
                </div>
            </div>
            <div className="spell-card-details">
                <div className="spell-card-row">
                    <div className="spell-detail-item">
                        <span className="spell-detail-label">Casting</span>
                        <span className="spell-detail-value">{spell.castingTime}</span>
                    </div>
                    <div className="spell-detail-item">
                        <span className="spell-detail-label">Range</span>
                        <span className="spell-detail-value">{spell.range}</span>
                    </div>
                    <div className="spell-detail-item">
                        <span className="spell-detail-label">Components</span>
                        <span className="spell-detail-value">{spell.components}</span>
                    </div>
                </div>
                <div className="spell-card-tags">
                    <span className="spell-tag-level">
                        {spell.level === 0 ? 'Cantrip' : `Lv.${spell.level}`}
                    </span>
                    <span className="spell-tag-school">{spell.school}</span>
                    {element && (
                        <span className="spell-tag-element" style={{ color: elementColor }}>
                            {element}
                        </span>
                    )}
                </div>
                <div className="spell-card-description">{spell.description}</div>
            </div>
        </div>
    );
};

export default SpellCard;