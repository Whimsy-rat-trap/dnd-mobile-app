import React from 'react';
import { Character } from '../../types/Character';

interface DeathSavesProps {
    character: Character;
    hp: number;
    rollDeathSave: () => void;
}

const DeathSaves: React.FC<DeathSavesProps> = ({ character, hp, rollDeathSave }) => {
    if (hp !== 0 || character.status === 'dead') return null;

    return (
        <div className="db-death-saves-container">
            <div className="db-death-saves-title">Death Saving Throws</div>
            <div className="db-death-saves-status">
                {character.isStable ? (
                    <span className="db-stable-text">✦ Stable</span>
                ) : (
                    <>
                        <div className="db-death-saves-group">
                            <span className="db-death-saves-label">Successes</span>
                            <div className="db-death-saves-dots">
                                {[0, 1, 2].map(i => (
                                    <div key={i} className={`db-dot ${i < (character.deathSuccesses || 0) ? 'db-filled db-success' : 'db-empty'}`} />
                                ))}
                            </div>
                        </div>
                        <div className="db-death-saves-group">
                            <span className="db-death-saves-label">Failures</span>
                            <div className="db-death-saves-dots">
                                {[0, 1, 2].map(i => (
                                    <div key={i} className={`db-dot ${i < (character.deathFailures || 0) ? 'db-filled db-failure' : 'db-empty'}`} />
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
            {!character.isStable && (
                <button className="db-roll-death-save-btn" onClick={rollDeathSave}>
                    Roll Death Save (d20)
                </button>
            )}
            {character.isStable && (
                <div className="db-stable-message">Character is stable. Heal to regain consciousness.</div>
            )}
        </div>
    );
};

export default DeathSaves;