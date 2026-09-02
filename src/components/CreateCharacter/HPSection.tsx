import React from 'react';
import DiceRoller from '../../components/DiceRoller';
import { CLASS_HIT_DICE } from '../../constants/classHitDice';

interface HPSectionProps {
    isCreative: boolean;
    hp: number;
    maxHp: number;
    level: number;
    mainClass: string;
    conMod: number;
    hpMethod: 'average' | 'roll';
    onHpMethodChange: (method: 'average' | 'roll') => void;
    rolledHps: number[];
    onRoll: (result: number) => void;
    onRerollAll: () => void;
    onHpChange: (value: number) => void;
    onMaxHpChange: (value: number) => void;
}

const HPSection: React.FC<HPSectionProps> = ({
                                                 isCreative,
                                                 hp,
                                                 maxHp,
                                                 level,
                                                 mainClass,
                                                 conMod,
                                                 hpMethod,
                                                 onHpMethodChange,
                                                 rolledHps,
                                                 onRoll,
                                                 onRerollAll,
                                                 onHpChange,
                                                 onMaxHpChange,
                                             }) => {
    const hitDie = CLASS_HIT_DICE[mainClass] || 6;

    if (isCreative) {
        return (
            <div className="cr-form-row">
                <div className="cr-form-group">
                    <label>HP *</label>
                    <input
                        type="number"
                        name="hp"
                        value={hp}
                        onChange={(e) => onHpChange(Number(e.target.value))}
                        min="0"
                        required
                    />
                </div>
                <div className="cr-form-group">
                    <label>Max HP *</label>
                    <input
                        type="number"
                        name="maxHp"
                        value={maxHp}
                        onChange={(e) => onMaxHpChange(Number(e.target.value))}
                        min="0"
                        required
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="cr-hp-calculator">
            <div className="cr-form-group">
                <label>Hit Points</label>
                {level > 1 && (
                    <div className="cr-hp-method-selector">
                        <button
                            type="button"
                            className={`cr-method-btn ${hpMethod === 'average' ? 'cr-active' : ''}`}
                            onClick={() => onHpMethodChange('average')}
                        >
                            Average
                        </button>
                        <button
                            type="button"
                            className={`cr-method-btn ${hpMethod === 'roll' ? 'cr-active' : ''}`}
                            onClick={() => onHpMethodChange('roll')}
                        >
                            Roll
                        </button>
                    </div>
                )}
            </div>

            {hpMethod === 'roll' && level > 1 && (
                <div className="cr-hp-roll-area">
                    <div className="cr-roll-controls">
                        <DiceRoller
                            sides={hitDie}
                            onRoll={onRoll}
                            label="Roll HP"
                        />
                        {rolledHps.length === level - 1 && (
                            <button type="button" className="cr-reroll-btn" onClick={onRerollAll}>
                                Reroll All
                            </button>
                        )}
                    </div>
                    {rolledHps.length > 0 && (
                        <div className="cr-roll-results">
                            <span>Rolls: {rolledHps.join(', ')} ({rolledHps.length}/{level - 1})</span>
                        </div>
                    )}
                </div>
            )}

            <div className="cr-hp-formula">
                <span>Total HP: <strong>{maxHp}</strong></span>
                {level > 1 && (
                    <span className="cr-formula-details">
                        ({hitDie} + CON) + {level > 1 && (
                        hpMethod === 'average'
                            ? `(${level - 1} × (${Math.floor(hitDie / 2) + 1} + CON))`
                            : `(${rolledHps.length} × (rolls + CON))`
                    )}
                    </span>
                )}
                {level === 1 && (
                    <span className="cr-formula-details">(Level 1: {hitDie} + CON modifier)</span>
                )}
            </div>
        </div>
    );
};

export default HPSection;