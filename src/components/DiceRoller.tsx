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
    /** Есть ли у персонажа Inspiration для переброса. */
    rerollAvailable?: boolean;
    /** Колбэк при клике на "Reroll". Возвращает true, если переброс разрешён (inspiration потрачена). */
    onRerollRequest?: () => boolean;
}

const DiceRoller: React.FC<DiceRollerProps> = ({
                                                   sides,
                                                   onRoll,
                                                   label,
                                                   disabled,
                                                   initialResult,
                                                   autoRoll,
                                                   displayOnly,
                                                   rerollAvailable,
                                                   onRerollRequest,
                                               }) => {
    const [result, setResult] = useState<number | null>(initialResult ?? null);
    const [spinning, setSpinning] = useState(false);

    useEffect(() => {
        if (autoRoll && !spinning && result === null) {
            const timer = setTimeout(() => roll(), 100);
            return () => clearTimeout(timer);
        }
    }, [autoRoll]);

    // Синхронизация, если родитель меняет initialResult (например, после reroll)
    useEffect(() => {
        if (initialResult !== undefined) setResult(initialResult);
    }, [initialResult]);

    const roll = () => {
        if (spinning || disabled) return;
        setSpinning(true);
        setResult(null);
        setTimeout(() => {
            const res = initialResult !== undefined
                ? initialResult
                : Math.floor(Math.random() * sides) + 1;
            setResult(res);
            setSpinning(false);
            if (onRoll) onRoll(res);
        }, 800);
    };

    const handleReroll = () => {
        if (!onRerollRequest || spinning || disabled) return;
        const ok = onRerollRequest();
        if (!ok) return;
        if (displayOnly) return;
        setSpinning(true);
        setResult(null);
        setTimeout(() => {
            const res = Math.floor(Math.random() * sides) + 1;
            setResult(res);
            setSpinning(false);
            if (onRoll) onRoll(res);
        }, 800);
    };

    const displayText = result !== null ? result : (sides === 20 ? '20' : `D${sides}`);
    const showReroll = Boolean(
        rerollAvailable && onRerollRequest && sides === 20 && result !== null && !spinning && !disabled
    );

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
                <div
                    className={`dice-btn dice-${sides} ${spinning ? 'spinning' : ''}`}
                    style={{ cursor: 'default' }}
                >
                    <span>{displayText}</span>
                </div>
            )}
            {showReroll && (
                <button
                    type="button"
                    className="dice-inspiration-reroll"
                    onClick={handleReroll}
                    title="Reroll with Inspiration"
                >
                    <span className="dice-inspiration-star">✦</span>
                    <span>Reroll</span>
                </button>
            )}
        </div>
    );
};

export default DiceRoller;