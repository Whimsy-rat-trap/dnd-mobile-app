import React from 'react';
import { Character } from '../../types/Character';
import { ACInfo } from '../../utils/characterUtils';
import './CharacterInfoSection.css';

interface Props {
    character: Character;
    classDisplay: string;
    proficiencyBonus: number;
    acInfo: ACInfo;
}

const CharacterInfoSection: React.FC<Props> = ({ character, classDisplay, proficiencyBonus, acInfo }) => (
    <div className="cc-section-info">
        <div className="cc-info-title">Character Details</div>
        <div className="cc-info-grid">
            <div className="cc-info-item"><span className="cc-info-label">Level</span><span className="cc-info-value">{character.level}</span></div>
            <div className="cc-info-item"><span className="cc-info-label">Class</span><span className="cc-info-value">{classDisplay}</span></div>
            <div className="cc-info-item"><span className="cc-info-label">Race</span><span className="cc-info-value">{character.race}</span></div>
        </div>
        <div className="cc-info-grid">
            <div className="cc-info-item"><span className="cc-info-label">Background</span><span className="cc-info-value">{character.background}</span></div>
            <div className="cc-info-item"><span className="cc-info-label">Subrace</span><span className="cc-info-value">{character.subrace || '—'}</span></div>
            <div className="cc-info-item">
                <span className="cc-info-label">AC</span>
                <span className="cc-info-value cc-info-ac" title={acInfo.breakdown.join('\n')}>{acInfo.total}</span>
            </div>
        </div>
        <div className="cc-info-grid">
            <div className="cc-info-item"><span className="cc-info-label">Speed</span><span className="cc-info-value">{character.speed ? `${character.speed} ft` : '—'}</span></div>
            <div className="cc-info-item"><span className="cc-info-label">Size</span><span className="cc-info-value">{character.size || 'Medium'}</span></div>
            <div className="cc-info-item"><span className="cc-info-label">Creature Type</span><span className="cc-info-value">{character.creatureType || 'Humanoid'}</span></div>
        </div>
        <div className="cc-info-grid">
            <div className="cc-info-item"><span className="cc-info-label">Proficiency Bonus</span><span className="cc-info-value">+{proficiencyBonus}</span></div>
        </div>
    </div>
);

export default CharacterInfoSection;