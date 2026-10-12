import React, { useMemo, useState } from 'react';
import Modal from './Modal';
import { useCharacters } from '../context/CharacterContext';
import { getHitDicePools } from '../utils/hitDice';
import './ShortRestModal.css';

interface ShortRestModalProps {
    isOpen: boolean;
    onClose: () => void;
    characterId: string;
}

interface RollLogEntry {
    sides: number;
    roll: number;
    conMod: number;
    heal: number;
    hpBefore: number;
    hpAfter: number;
}

const ShortRestModal: React.FC<ShortRestModalProps> = ({
                                                           isOpen,
                                                           onClose,
                                                           characterId,
                                                       }) => {
    const { getCharacter, spendHitDie, updateCharacter, shortRest } = useCharacters();
    const character = getCharacter(characterId);

    const [rollLog, setRollLog] = useState<RollLogEntry[]>([]);

    const pools = useMemo(
        () => (character ? getHitDicePools(character) : []),
        [character]
    );

    if (!character) return null;

    const handleSpendDie = (sides: number) => {
        const result = spendHitDie(characterId, sides);
        if (!result) return;

        const hpBefore = character.hp;
        const hpAfter = Math.min(hpBefore + result.heal, character.maxHp);
        updateCharacter(characterId, { hp: hpAfter });

        setRollLog(prev => [
            {
                sides,
                roll: result.roll,
                conMod: result.conMod,
                heal: result.heal,
                hpBefore,
                hpAfter,
            },
            ...prev,
        ]);
    };

    const handleComplete = () => {
        shortRest(characterId);
        setRollLog([]);
        onClose();
    };

    const handleClose = () => {
        setRollLog([]);
        onClose();
    };

    const totalHealed = rollLog.reduce((sum, e) => sum + e.heal, 0);

    return (
        <Modal isOpen={isOpen} onClose={handleClose} className="srm-modal">
            <div className="srm-body">
                <h3 className="srm-title">Short Rest</h3>
                <p className="srm-subtitle">
                    Spend hit dice to recover HP. When you finish, Pact Magic slots are restored.
                </p>

                <div className="srm-hp-display">
                    <span className="srm-hp-label">HP</span>
                    <span className="srm-hp-value">
                        {character.hp} / {character.maxHp}
                        {character.tempHp > 0 && (
                            <span className="srm-temp-hp"> +{character.tempHp} temp</span>
                        )}
                    </span>
                </div>

                {pools.length === 0 ? (
                    <div className="srm-empty">No hit dice available.</div>
                ) : (
                    <div className="srm-pools">
                        {pools.map(pool => (
                            <div key={pool.sides} className="srm-pool-row">
                                <span className="srm-pool-label">d{pool.sides}</span>
                                <div className="srm-pool-dots">
                                    {Array.from({ length: pool.total }, (_, i) => {
                                        const isAvailable = i < pool.available;
                                        return (
                                            <button
                                                key={i}
                                                type="button"
                                                className={`srm-dot ${isAvailable ? 'available' : 'used'}`}
                                                onClick={() => isAvailable && handleSpendDie(pool.sides)}
                                                disabled={!isAvailable}
                                                title={isAvailable ? `Roll d${pool.sides} + CON` : 'Used'}
                                                aria-label={isAvailable ? 'Spend hit die' : 'Used hit die'}
                                            />
                                        );
                                    })}
                                </div>
                                <span className="srm-pool-count">
                                    {pool.available}/{pool.total}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {rollLog.length > 0 && (
                    <div className="srm-log">
                        <div className="srm-log-header">
                            <span className="srm-log-title">Rolls</span>
                            <span className="srm-log-total">+{totalHealed} HP</span>
                        </div>
                        <div className="srm-log-list">
                            {rollLog.map((entry, idx) => (
                                <div key={idx} className="srm-log-entry">
                                    <span className="srm-log-die">d{entry.sides}</span>
                                    <span className="srm-log-formula">
                                        {entry.roll}
                                        {entry.conMod >= 0 ? ` + ${entry.conMod}` : ` − ${Math.abs(entry.conMod)}`}
                                        {' = '}
                                        <strong>{entry.heal}</strong>
                                    </span>
                                    <span className="srm-log-hp">
                                        {entry.hpBefore} → {entry.hpAfter}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="srm-actions">
                    <button className="srm-btn srm-btn-secondary" onClick={handleClose}>
                        Cancel
                    </button>
                    <button className="srm-btn srm-btn-primary" onClick={handleComplete}>
                        Complete Short Rest
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ShortRestModal;