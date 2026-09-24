import React from 'react';
import { Link } from 'react-router-dom';
import { Character } from '../../types/Character';
import { getSpellSlots, getMaxPrepared } from '../../utils/spellcasting';
import './SpellcastingSection.css';

interface SpellcastingSectionProps {
    character: Character;
}

const SPELLCASTING_CLASSES = [
    'Bard', 'Cleric', 'Druid', 'Sorcerer', 'Wizard',
    'Paladin', 'Ranger', 'Artificer', 'Warlock',
];

const SpellcastingSection: React.FC<SpellcastingSectionProps> = ({ character }) => {
    const isSpellcaster = character.classLevels?.some(cl =>
        SPELLCASTING_CLASSES.includes(cl.className)
    );
    const hasSpells = character.spells.length > 0;

    if (!isSpellcaster && !hasSpells) return null;

    const spellSlots = getSpellSlots(character);
    const totalSlots = spellSlots.reduce((a, b) => a + b, 0);
    const maxPrepared = getMaxPrepared(character);
    const preparedCount = character.spells.filter(s => s.prepared).length;
    const knownCount = character.spells.length;
    const racialCount = character.spells.filter(s => s.isRacial).length;

    return (
        <div className="cc-section-spellcasting">
            <div className="cc-spellcasting-header">
                <span className="cc-spellcasting-title">Spellcasting</span>
                <Link to="/spellbook" className="cc-view-full-spellbook">
                    View Full Spellbook
                </Link>
            </div>
            <div className="cc-spell-stats">
                <div className="cc-stat-item">
                    <span className="cc-stat-label">Spell Slots</span>
                    <span className="cc-stat-value">{totalSlots}</span>
                </div>
                <div className="cc-stat-item">
                    <span className="cc-stat-label">Prepared</span>
                    <span className="cc-stat-value">
                        {preparedCount} / {maxPrepared}
                    </span>
                </div>
                <div className="cc-stat-item">
                    <span className="cc-stat-label">Racial</span>
                    <span className="cc-stat-value">{racialCount}</span>
                </div>
                <div className="cc-stat-item">
                    <span className="cc-stat-label">Known</span>
                    <span className="cc-stat-value">{knownCount}</span>
                </div>
            </div>
        </div>
    );
};

export default SpellcastingSection;