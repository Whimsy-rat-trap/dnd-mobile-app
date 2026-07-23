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
        if (autoRoll && initialResult !== undefined && !spinning) {
            const timer = setTimeout(() => {
                roll();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [autoRoll, initialResult]);

    const roll = () => {
        if (spinning) return;
        if (disabled && !autoRoll) return;
        setSpinning(true);
        setResult(null);
        setTimeout(() => {
            const res = initialResult !== undefined ? initialResult : Math.floor(Math.random() * sides) + 1;
            setResult(res);
            setSpinning(false);
            if (onRoll) onRoll(res);
        }, 800);
    };

    return (
        <div className="dice-roller-component">
            {label && <span className="dice-label">{label}</span>}
            {!displayOnly && (
                <button
                    className={`dice-btn ${spinning ? 'spinning' : ''}`}
                    onClick={roll}
                    disabled={spinning || disabled}
                >
                    {result !== null ? result : `D${sides}`}
                </button>
            )}
            {displayOnly && (
                <div className={`dice-btn ${spinning ? 'spinning' : ''}`} style={{ cursor: 'default' }}>
                    {result !== null ? result : `D${sides}`}
                </div>
            )}
        </div>
    );
};

export default DiceRoller;