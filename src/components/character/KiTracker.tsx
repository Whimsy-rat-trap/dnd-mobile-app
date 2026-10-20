import React from 'react';
import { Character } from '../../types/Character';
import { getKiInfo } from '../../utils/ki';
import './KiTracker.css';

interface Props {
    character: Character;
    onUse: (amount?: number) => void;
    onRestore: (amount?: number) => void;
}

const KiTracker: React.FC<Props> = ({ character, onUse, onRestore }) => {
    const info = getKiInfo(character);
    if (!info.hasKi) return null;

    return (
        <div className="kt-container">
            <div className="kt-header">
                <span className="kt-title">Ki Points</span>
                <span className="kt-summary">
                    {info.availableUses} / {info.maxUses}
                </span>
            </div>

            <div className="kt-dots">
                {Array.from({ length: info.maxUses }, (_, i) => {
                    const isAvailable = i < info.availableUses;
                    return (
                        <button
                            key={i}
                            type="button"
                            className={`kt-dot ${isAvailable ? 'available' : 'used'}`}
                            onClick={() =>
                                isAvailable ? onUse(1) : onRestore(1)
                            }
                            title={
                                isAvailable
                                    ? 'Click to spend 1 ki'
                                    : 'Click to restore 1 ki'
                            }
                            aria-label={isAvailable ? 'Spend ki' : 'Restore ki'}
                        />
                    );
                })}
            </div>

            <div className="kt-hint">
                Recharges on short or long rest • Monk level {info.monkLevel}
            </div>
        </div>
    );
};

export default KiTracker;