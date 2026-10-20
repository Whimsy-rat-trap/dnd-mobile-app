import React from 'react';
import { Character } from '../../types/Character';
import { getBardicInspirationInfo } from '../../utils/bardicInspiration';
import './BardicInspirationTracker.css';

interface Props {
    character: Character;
    onUse: () => void;
    onRestore: () => void;
}

const BardicInspirationTracker: React.FC<Props> = ({ character, onUse, onRestore }) => {
    const info = getBardicInspirationInfo(character);
    if (!info.isBard) return null;

    return (
        <div className="bit-container">
            <div className="bit-header">
                <span className="bit-title">Bardic Inspiration</span>
                <span className="bit-die-badge">d{info.dieSize}</span>
            </div>

            <div className="bit-uses">
                <span className="bit-label">Uses</span>
                <div className="bit-dots">
                    {Array.from({ length: info.maxUses }, (_, i) => {
                        const isAvailable = i < info.availableUses;
                        return (
                            <button
                                key={i}
                                type="button"
                                className={`bit-dot ${isAvailable ? 'available' : 'used'}`}
                                onClick={() =>
                                    isAvailable ? onUse() : onRestore()
                                }
                                title={
                                    isAvailable
                                        ? 'Click to grant a die (spend one use)'
                                        : 'Click to restore one use (override)'
                                }
                                aria-label={isAvailable ? 'Spend use' : 'Restore use'}
                            />
                        );
                    })}
                </div>
                <span className="bit-count">
                    {info.availableUses}/{info.maxUses}
                </span>
            </div>

            <div className="bit-hint">
                Recharges on{' '}
                {info.recharge === 'short' ? 'short or long rest' : 'long rest'}
                {info.hasFontOfInspiration ? ' (Font of Inspiration)' : ''}
                {' '}• Uses = max(1, CHA modifier)
            </div>
        </div>
    );
};

export default BardicInspirationTracker;