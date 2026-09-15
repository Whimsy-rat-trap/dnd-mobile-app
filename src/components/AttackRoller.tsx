import React, { useState } from 'react';
import Modal from './Modal';
import {
    rollD20,
    rollDice,
    D20RollResult,
    DiceRollResult,
    RollMode,
} from '../utils/diceUtils';
import './AttackRoller.css';

type BonusMode = 'default' | 'custom';

interface AttackRollerProps {
    /** Название источника (оружие, заклинание, фича). */
    sourceName: string;

    /** Бонус к попаданию по умолчанию (proficiency + ability mod). */
    defaultAttackBonus?: number;

    /** Формула урона, например "1d8" или "2d6+3". */
    damageDice?: string;

    /** Бонус к урону по умолчанию. */
    defaultDamageBonus?: number;

    /** Тип урона (для отображения). */
    damageType?: string;

    /** Если true — не показываем урон (например, для utility-эффекта). */
    hideDamage?: boolean;

    /** Колбэк, вызываемый после броска. */
    onRoll?: (payload: {
        attack: D20RollResult;
        damage: DiceRollResult | null;
    }) => void;

    /** Кнопка, при нажатии на которую открывается окно броска. */
    trigger?: React.ReactNode;

    /** Опционально: класс для обёртки. */
    className?: string;
}

const AttackRoller: React.FC<AttackRollerProps> = ({
                                                       sourceName,
                                                       defaultAttackBonus = 0,
                                                       damageDice,
                                                       defaultDamageBonus = 0,
                                                       damageType,
                                                       hideDamage = false,
                                                       onRoll,
                                                       trigger,
                                                       className,
                                                   }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Состояния
    const [rollMode, setRollMode] = useState<RollMode>('normal');
    const [attackBonusMode, setAttackBonusMode] = useState<BonusMode>('default');
    const [customAttackBonus, setCustomAttackBonus] = useState<number>(0);
    const [damageBonusMode, setDamageBonusMode] = useState<BonusMode>('default');
    const [customDamageBonus, setCustomDamageBonus] = useState<number>(0);

    // Результаты
    const [attackResult, setAttackResult] = useState<D20RollResult | null>(null);
    const [damageResult, setDamageResult] = useState<DiceRollResult | null>(null);

    const resetResults = () => {
        setAttackResult(null);
        setDamageResult(null);
    };

    const handleOpen = () => {
        setIsOpen(true);
        resetResults();
    };

    const handleClose = () => {
        setIsOpen(false);
        resetResults();
    };

    const handleRoll = () => {
        const attackBonus =
            attackBonusMode === 'custom' ? customAttackBonus : defaultAttackBonus;
        const damageBonus =
            damageBonusMode === 'custom' ? customDamageBonus : defaultDamageBonus;

        const attack = rollD20(rollMode, attackBonus);
        setAttackResult(attack);

        // Урон бросаем только если есть формула и урон не скрыт
        if (!hideDamage && damageDice) {
            // Если в формуле уже есть модификатор, добавляем damageBonus сверху
            const parsed = damageDice.replace(/\s+/g, '');
            const hasModifier = /[+-]\d+$/.test(parsed);
            const formula = damageBonus !== 0
                ? hasModifier
                    ? parsed.replace(/([+-]\d+)$/, (m, sign) =>
                        `${sign}${Math.abs(parseInt(m, 10)) + damageBonus}`)
                    : `${parsed}${damageBonus > 0 ? '+' : ''}${damageBonus}`
                : parsed;

            const damage = rollDice(formula);
            setDamageResult(damage);

            if (onRoll) onRoll({ attack, damage });
        } else {
            if (onRoll) onRoll({ attack, damage: null });
        }
    };

    // Кнопка-триггер
    const defaultTrigger = (
        <button className="attack-trigger-btn" onClick={handleOpen} type="button">
            Attack
        </button>
    );

    return (
        <>
            <span className={className} onClick={handleOpen}>
                {trigger || defaultTrigger}
            </span>

            {isOpen && (
                <Modal isOpen={true} onClose={handleClose}>
                    <div className="attack-roller">
                        <h3 className="attack-title">Attack: {sourceName}</h3>

                        {/* Режим броска */}
                        <div className="attack-section">
                            <span className="attack-label">Roll Mode</span>
                            <div className="attack-btn-group">
                                <button
                                    type="button"
                                    className={`attack-mode-btn ${rollMode === 'normal' ? 'active' : ''}`}
                                    onClick={() => setRollMode('normal')}
                                >
                                    Normal
                                </button>
                                <button
                                    type="button"
                                    className={`attack-mode-btn ${rollMode === 'advantage' ? 'active' : ''}`}
                                    onClick={() => setRollMode('advantage')}
                                >
                                    Advantage
                                </button>
                                <button
                                    type="button"
                                    className={`attack-mode-btn ${rollMode === 'disadvantage' ? 'active' : ''}`}
                                    onClick={() => setRollMode('disadvantage')}
                                >
                                    Disadvantage
                                </button>
                            </div>
                        </div>

                        {/* Бонус к попаданию */}
                        <div className="attack-section">
                            <span className="attack-label">Attack Bonus</span>
                            <div className="attack-btn-group">
                                <button
                                    type="button"
                                    className={`attack-mode-btn ${attackBonusMode === 'default' ? 'active' : ''}`}
                                    onClick={() => setAttackBonusMode('default')}
                                >
                                    Modifier ({defaultAttackBonus >= 0 ? '+' : ''}{defaultAttackBonus})
                                </button>
                                <button
                                    type="button"
                                    className={`attack-mode-btn ${attackBonusMode === 'custom' ? 'active' : ''}`}
                                    onClick={() => setAttackBonusMode('custom')}
                                >
                                    Custom
                                </button>
                            </div>
                            {attackBonusMode === 'custom' && (
                                <input
                                    type="number"
                                    className="attack-bonus-input"
                                    value={customAttackBonus}
                                    onChange={(e) => setCustomAttackBonus(Number(e.target.value))}
                                    placeholder="Enter bonus"
                                />
                            )}
                        </div>

                        {/* Урон */}
                        {!hideDamage && damageDice && (
                            <div className="attack-section">
                                <span className="attack-label">
                                    Damage {damageType ? `(${damageType})` : ''}
                                </span>
                                <div className="attack-damage-info">
                                    Formula: <strong>{damageDice}</strong>
                                </div>
                                <div className="attack-btn-group">
                                    <button
                                        type="button"
                                        className={`attack-mode-btn ${damageBonusMode === 'default' ? 'active' : ''}`}
                                        onClick={() => setDamageBonusMode('default')}
                                    >
                                        Bonus ({defaultDamageBonus >= 0 ? '+' : ''}{defaultDamageBonus})
                                    </button>
                                    <button
                                        type="button"
                                        className={`attack-mode-btn ${damageBonusMode === 'custom' ? 'active' : ''}`}
                                        onClick={() => setDamageBonusMode('custom')}
                                    >
                                        Custom
                                    </button>
                                </div>
                                {damageBonusMode === 'custom' && (
                                    <input
                                        type="number"
                                        className="attack-bonus-input"
                                        value={customDamageBonus}
                                        onChange={(e) => setCustomDamageBonus(Number(e.target.value))}
                                        placeholder="Enter bonus"
                                    />
                                )}
                            </div>
                        )}

                        {/* Кнопка броска */}
                        <button className="attack-roll-btn" onClick={handleRoll} type="button">
                            Roll Attack
                        </button>

                        {/* Результаты */}
                        {attackResult && (
                            <div className="attack-results">
                                <div className="attack-result-block">
                                    <div className="attack-result-label">Attack Roll</div>
                                    <div className="attack-result-rolls">
                                        {attackResult.rolls.map((r, i) => (
                                            <span
                                                key={i}
                                                className={`attack-die ${
                                                    attackResult.rolls.length > 1 && r === attackResult.chosen
                                                        ? 'chosen'
                                                        : ''
                                                }`}
                                            >
                                                {r}
                                            </span>
                                        ))}
                                        {attackResult.bonus !== 0 && (
                                            <span className="attack-bonus">
                                                {attackResult.bonus > 0 ? '+' : ''}{attackResult.bonus}
                                            </span>
                                        )}
                                        <span className="attack-equals">=</span>
                                        <span className={`attack-total ${attackResult.isCrit ? 'crit' : ''} ${attackResult.isCritFail ? 'crit-fail' : ''}`}>
                                            {attackResult.total}
                                        </span>
                                    </div>
                                    <div className="attack-result-hint">
                                        {attackResult.isCrit && 'Critical hit!'}
                                        {attackResult.isCritFail && 'Critical miss!'}
                                        {!attackResult.isCrit && !attackResult.isCritFail && (
                                            attackResult.mode === 'advantage' ? 'Advantage' :
                                                attackResult.mode === 'disadvantage' ? 'Disadvantage' :
                                                    'Normal'
                                        )}
                                    </div>
                                </div>

                                {damageResult && (
                                    <div className="attack-result-block">
                                        <div className="attack-result-label">
                                            Damage {damageType ? `(${damageType})` : ''}
                                        </div>
                                        <div className="attack-result-rolls">
                                            {damageResult.rolls.map((r, i) => (
                                                <span key={i} className="attack-die">{r}</span>
                                            ))}
                                            {damageResult.modifier !== 0 && (
                                                <span className="attack-bonus">
                                                    {damageResult.modifier > 0 ? '+' : ''}{damageResult.modifier}
                                                </span>
                                            )}
                                            <span className="attack-equals">=</span>
                                            <span className="attack-total damage">{damageResult.total}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </Modal>
            )}
        </>
    );
};

export default AttackRoller;