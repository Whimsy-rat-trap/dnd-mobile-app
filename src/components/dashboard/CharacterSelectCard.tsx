import React from 'react';
import { Character } from '../../types/Character';

interface CharacterSelectCardProps {
    character: Character;
    onClick: () => void;
    needsDeathSave: boolean;
}

const CharacterSelectCard: React.FC<CharacterSelectCardProps> = ({ character, onClick, needsDeathSave }) => {
    return (
        <div
            className={`db-character-select-card ${needsDeathSave ? 'db-needs-death-save' : ''}`}
            onClick={onClick}
            style={{ cursor: 'pointer' }}
        >
            <div className="db-character-select-info">
                <div className="db-character-select-name">{character.name}</div>
                <div className="db-character-select-class">
                    {character.classes.join(' / ')} • Level {character.level}
                    {character.subrace && <span className="db-character-select-subrace"> ({character.subrace})</span>}
                </div>
                <div className="db-character-select-details">
                    <span>Created: {character.created || 'N/A'}</span>
                    <span>Last used: {character.lastUsed || 'N/A'}</span>
                </div>
                <div className={`db-character-select-status ${character.status || 'active'}`}>
                    {character.status === 'active' ? 'Active' : character.status === 'dead' ? 'Deceased' : 'Archived'}
                </div>
                {needsDeathSave && (
                    <div className="db-death-saves-indicator">
                        <span>Death Saves: </span>
                        <span>{(character.deathSuccesses || 0)}/3 successes, {(character.deathFailures || 0)}/3 failures</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CharacterSelectCard;