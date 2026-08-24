import React, { useState, useEffect } from 'react';
import './DiceRoller.css';

interface DiceRollerProps {
    sides: number;
    onRoll?: (result: number) => void;
    label?: string;
    disabled?: boolean;
    initialResult?: number;
    autoRoll?: boolean;
    displayOnly?: boolean;
}

const DiceRoller: React.FC<DiceRollerProps> = ({
                                                   sides,
                                                   onRoll,
                                                   label,
                                                   disabled,
                                                   initialResult,
                                                   autoRoll,
                                                   displayOnly
                                               }) => {
    const [result, setResult] = useState<number | null>(initialResult || null);
    const [spinning, setSpinning] = useState(false);

    useEffect(() => {
        if (autoRoll && !spinning && !result) {
            const timer = setTimeout(() => {
                roll();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [autoRoll]);

    const roll = () => {
        if (spinning || disabled) return;
        setSpinning(true);
        setResult(null);
        setTimeout(() => {
            const res = initialResult !== undefined ? initialResult : Math.floor(Math.random() * sides) + 1;
            setResult(res);
            setSpinning(false);
            if (onRoll) onRoll(res);
        }, 800);
    };

    const displayText = result !== null ? result : (sides === 20 ? '20' : `D${sides}`);

    return (
        <div className="dice-roller-component">
            {label && <span className="dice-label">{label}</span>}
            {!displayOnly ? (
                <button
                    className={`dice-btn dice-${sides} ${spinning ? 'spinning' : ''}`}
                    onClick={roll}
                    disabled={spinning || disabled}
                >
                    <span>{displayText}</span>
                </button>
            ) : (
                <div className={`dice-btn dice-${sides} ${spinning ? 'spinning' : ''}`} style={{ cursor: 'default' }}>
                    <span>{displayText}</span>
                </div>
            )}
        </div>
    );
};

export default DiceRoller;