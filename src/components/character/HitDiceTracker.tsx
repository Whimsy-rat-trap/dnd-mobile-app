import React from 'react';
import { Character } from '../../types/Character';
import { getHitDicePools, getTotalHitDice } from '../../utils/hitDice';
import './HitDiceTracker.css';

interface HitDiceTrackerProps {
    character: Character;
    onSpendDie: (sides: number) => void;
    onRestoreDie: (sides: number) => void;
}

const HitDiceTracker: React.FC<HitDiceTrackerProps> = ({
                                                           character,
                                                           onSpendDie,
                                                           onRestoreDie,
                                                       }) => {
    const pools = getHitDicePools(character);
    const summary = getTotalHitDice(character);

    if (pools.length === 0) return null;

    return (
        <div className="hdt-container">
            <div className="hdt-header">
                <span className="hdt-title">Hit Dice</span>
                <span className="hdt-summary">
                    {summary.available} / {summary.total}
                </span>
            </div>
            <div className="hdt-list">
                {pools.map(pool => (
                    <div key={pool.sides} className="hdt-row">
                        <span className="hdt-label">d{pool.sides}</span>
                        <div className="hdt-dots">
                            {Array.from({ length: pool.total }, (_, i) => {
                                const isAvailable = i < pool.available;
                                return (
                                    <button
                                        key={i}
                                        type="button"
                                        className={`hdt-dot ${isAvailable ? 'available' : 'used'}`}
                                        onClick={() =>
                                            isAvailable
                                                ? onSpendDie(pool.sides)
                                                : onRestoreDie(pool.sides)
                                        }
                                        title={
                                            isAvailable
                                                ? `Spend d${pool.sides} (roll + CON)`
                                                : `Restore d${pool.sides}`
                                        }
                                        aria-label={isAvailable ? 'Spend hit die' : 'Restore hit die'}
                                    />
                                );
                            })}
                        </div>
                        <span className="hdt-count">
                            {pool.available}/{pool.total}
                        </span>
                    </div>
                ))}
            </div>
            <div className="hdt-hint">
                Click a filled die to spend (restores HP), an empty die to restore manually.
            </div>
        </div>
    );
};

export default HitDiceTracker;