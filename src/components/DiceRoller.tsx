import React, { useState } from 'react';
import './DiceRoller.css';

interface DiceRollerProps {
    sides: number;
    onRoll?: (result: number) => void;
    label?: string;
    disabled?: boolean;
}

const DiceRoller: React.FC<DiceRollerProps> = ({ sides, onRoll, label, disabled }) => {
    const [result, setResult] = useState<number | null>(null);
    const [spinning, setSpinning] = useState(false);

    const roll = () => {
        if (spinning || disabled) return;
        setSpinning(true);
        setResult(null);
        setTimeout(() => {
            const res = Math.floor(Math.random() * sides) + 1;
            setResult(res);
            setSpinning(false);
            if (onRoll) onRoll(res);
        }, 800);
    };

    return (
        <div className="dice-roller-component">
            {label && <span className="dice-label">{label}</span>}
            <button
                className={`dice-btn ${spinning ? 'spinning' : ''}`}
                onClick={roll}
                disabled={spinning || disabled}
            >
                {result !== null ? result : `D${sides}`}
            </button>
        </div>
    );
};

export default DiceRoller;