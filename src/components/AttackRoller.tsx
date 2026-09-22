import React, { useState } from 'react';
import Modal from './Modal';
import {
    rollD20,
    rollDice,
    getPrimaryDiceSides,
    D20RollResult,
    DiceRollResult,
    RollMode,
} from '../utils/diceUtils';
import './DiceRoller.css';
import './AttackRoller.css';

type BonusMode = 'default' | 'custom';

interface AttackRollerProps {
    sourceName: string;
    defaultAttackBonus?: number;
    damageDice?: string;
    defaultDamageBonus?: number;
    damageType?: string;
    hideDamage?: boolean;
    onRollAttack?: (result: D20RollResult) => void;
    onRollDamage?: (result: DiceRollResult) => void;
    trigger?: React.ReactNode;
    className?: string;
}

const AttackRoller: React.FC<AttackRollerProps> = ({
                                                       sourceName,
                                                       defaultAttackBonus = 0,
                                                       damageDice,
                                                       defaultDamageBonus = 0,
                                                       damageType,
                                                       hideDamage = false,
                                                       onRollAttack,
                                                       onRollDamage,
                                                       trigger,
                                                       className,
                                                   }) => {
    const [isOpen, setIsOpen] = useState(false);

    const [rollMode, setRollMode] = useState<RollMode>('normal');
    const [attackBonusMode, setAttackBonusMode] = useState<BonusMode>('default');
    const [customAttackBonus, setCustomAttackBonus] = useState<number>(0);
    const [damageBonusMode, setDamageBonusMode] = useState<BonusMode>('default');
    const [customDamageBonus, setCustomDamageBonus] = useState<number>(0);

    const [attackResult, setAttackResult] = useState<D20RollResult | null>(null);
    const [damageResult, setDamageResult] = useState<DiceRollResult | null>(null);
    const [spinningAttack, setSpinningAttack] = useState(false);
    const [spinningDamage, setSpinningDamage] = useState(false);

    const damageSides = getPrimaryDiceSides(damageDice);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => {
        setIsOpen(false);
        setAttackResult(null);
        setDamageResult(null);
    };

    const handleRollAttack = () => {
        if (spinningAttack) return;
        setSpinningAttack(true);
        setAttackResult(null);
        setTimeout(() => {
            const attackBonus =
                attackBonusMode === 'custom' ? customAttackBonus : defaultAttackBonus;
            const result = rollD20(rollMode, attackBonus);
            setAttackResult(result);
            setSpinningAttack(false);
            if (onRollAttack) onRollAttack(result);
        }, 700);
    };

    const handleRollDamage = () => {
        if (spinningDamage || !damageDice) return;
        setSpinningDamage(true);
        setDamageResult(null);
        setTimeout(() => {
            const damageBonus =
                damageBonusMode === 'custom' ? customDamageBonus : defaultDamageBonus;
            const parsed = damageDice.replace(/\s+/g, '');
            const hasModifier = /[+-]\d+$/.test(parsed);
            let formula = parsed;
            if (damageBonus !== 0) {
                if (hasModifier) {
                    formula = parsed.replace(/([+-]\d+)$/, (m) => {
                        const sign = m[0];
                        const val = parseInt(m.slice(1), 10);
                        return `${sign}${val + damageBonus}`;
                    });
                } else {
                    formula = `${parsed}${damageBonus > 0 ? '+' : ''}${damageBonus}`;
                }
            }
            const result = rollDice(formula);
            if (result) {
                setDamageResult(result);
                if (onRollDamage) onRollDamage(result);
            }
            setSpinningDamage(false);
        }, 700);
    };

    const defaultTrigger = (
        <button className="attack-trigger-btn" type="button">
            Attack
        </button>
    );

    const isMultiD20 = attackResult && attackResult.rolls.length > 1;

    return (
        <>
            <span className={className} onClick={handleOpen}>
                {trigger || defaultTrigger}
            </span>

            {isOpen && (
                <Modal isOpen={true} onClose={handleClose}>
                    <div className="attack-roller">
                        <h3 className="attack-title">Attack: {sourceName}</h3>

                        {/* Attack roll */}
                        <div className="attack-block">
                            <div className="attack-block-header">Attack Roll</div>

                            <div className="attack-section">
                                <span className="attack-label">Roll Mode</span>
                                <div className="attack-btn-group">
                                    {(['normal', 'advantage', 'disadvantage'] as RollMode[]).map(mode => (
                                        <button
                                            key={mode}
                                            type="button"
                                            className={`attack-mode-btn ${rollMode === mode ? 'active' : ''}`}
                                            onClick={() => setRollMode(mode)}
                                        >
                                            {mode.charAt(0).toUpperCase() + mode.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

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

                            <div className="attack-dice-wrapper">
                                <button
                                    className={`dice-btn dice-20 ${spinningAttack ? 'spinning' : ''} ${isMultiD20 ? 'dice-btn-wide' : ''}`}
                                    onClick={handleRollAttack}
                                    disabled={spinningAttack}
                                    type="button"
                                    title="Click to roll"
                                >
                                    <span className="dice-btn-values">
                                        {attackResult
                                            ? attackResult.rolls.map((r, i) => (
                                                <span
                                                    key={i}
                                                    className={
                                                        'dice-btn-value' +
                                                        (isMultiD20 && r === attackResult.chosen ? ' chosen' : '') +
                                                        (!isMultiD20 && attackResult.isCrit ? ' crit' : '') +
                                                        (!isMultiD20 && attackResult.isCritFail ? ' crit-fail' : '')
                                                    }
                                                >
                                                    {r}
                                                </span>
                                            ))
                                            : '20'}
                                    </span>
                                </button>
                            </div>

                            {/* Кнопка Roll Attack — под кубиками */}
                            <button
                                className="attack-roll-btn"
                                onClick={handleRollAttack}
                                disabled={spinningAttack}
                                type="button"
                            >
                                Roll Attack
                            </button>

                            {attackResult && (
                                <div className="attack-result-block">
                                    <div className="attack-result-rolls">
                                        {attackResult.rolls.map((r, i) => (
                                            <span
                                                key={i}
                                                className={
                                                    'attack-die' +
                                                    (isMultiD20 && r === attackResult.chosen ? ' chosen' : '')
                                                }
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
                                        <span
                                            className={
                                                'attack-total' +
                                                (attackResult.isCrit ? ' crit' : '') +
                                                (attackResult.isCritFail ? ' crit-fail' : '')
                                            }
                                        >
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
                            )}
                        </div>

                        {/* Damage roll */}
                        {!hideDamage && damageDice && (
                            <div className="attack-block">
                                <div className="attack-block-header">
                                    Damage Roll {damageType ? `(${damageType})` : ''}
                                </div>

                                <div className="attack-section">
                                    <span className="attack-label">Formula</span>
                                    <span className="attack-formula">{damageDice}</span>
                                </div>

                                <div className="attack-section">
                                    <span className="attack-label">Damage Bonus</span>
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

                                {/* Кубики урона */}
                                <div className="attack-dice-wrapper">
                                    <button
                                        className={`dice-btn dice-${damageSides} ${spinningDamage ? 'spinning' : ''} ${damageResult && damageResult.rolls.length > 1 ? 'dice-btn-wide' : ''}`}
                                        onClick={handleRollDamage}
                                        disabled={spinningDamage}
                                        type="button"
                                        title="Click to roll"
                                    >
                                        <span className="dice-btn-values">
                                            {damageResult
                                                ? damageResult.rolls.map((r, i) => (
                                                    <span key={i} className="dice-btn-value">{r}</span>
                                                ))
                                                : `D${damageSides}`}
                                        </span>
                                    </button>
                                </div>

                                {/* Кнопка Roll Damage */}
                                <button
                                    className="attack-roll-btn damage-btn"
                                    onClick={handleRollDamage}
                                    disabled={spinningDamage}
                                    type="button"
                                >
                                    Roll Damage
                                </button>

                                {damageResult && (
                                    <div className="attack-result-block">
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