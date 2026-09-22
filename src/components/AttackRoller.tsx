import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import {
    rollD20,
    parseMultiDiceFormula,
    rollMultiDice,
    getPrimaryDiceSides,
    D20RollResult,
    DiceRollResult,
    RollMode,
} from '../utils/diceUtils';
import { DAMAGE_BUFFS, getBuffById } from '../constants/damageBuffs';
import './DiceRoller.css';
import './AttackRoller.css';

type BonusMode = 'default' | 'custom';

interface AppliedBuff {
    /** Уникальный ключ, чтобы можно было добавить один и тот же бафф дважды. */
    key: string;
    buffId: string;
    rank?: number;
}

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

    // Баффы
    const [appliedBuffs, setAppliedBuffs] = useState<AppliedBuff[]>([]);
    const [buffToAdd, setBuffToAdd] = useState<string>('');

    // Результаты
    const [attackResult, setAttackResult] = useState<D20RollResult | null>(null);
    const [damageResult, setDamageResult] = useState<DiceRollResult | null>(null);
    const [spinningAttack, setSpinningAttack] = useState(false);
    const [spinningDamage, setSpinningDamage] = useState(false);

    const [critPending, setCritPending] = useState(false);

    const damageSides = getPrimaryDiceSides(damageDice);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => {
        setIsOpen(false);
        setAttackResult(null);
        setDamageResult(null);
        setCritPending(false);
        setAppliedBuffs([]);
        setBuffToAdd('');
    };

    // Сброс крита при смене режима броска или бонуса
    useEffect(() => {
        setCritPending(false);
        setAttackResult(null);
        setDamageResult(null);
    }, [rollMode]);

    useEffect(() => {
        setCritPending(false);
        setAttackResult(null);
    }, [attackBonusMode, customAttackBonus, defaultAttackBonus]);

    const handleRollAttack = () => {
        if (spinningAttack) return;
        setSpinningAttack(true);
        setAttackResult(null);
        setDamageResult(null);

        setTimeout(() => {
            const attackBonus =
                attackBonusMode === 'custom' ? customAttackBonus : defaultAttackBonus;
            const result = rollD20(rollMode, attackBonus);
            setAttackResult(result);
            setCritPending(result.isCrit);
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

            // Собираем все формулы в одну строку: base + buffs
            const parts: string[] = [damageDice.replace(/\s+/g, '')];

            for (const applied of appliedBuffs) {
                const buff = getBuffById(applied.buffId);
                if (!buff) continue;
                const formula = buff.getFormula(applied.rank);
                if (!formula || formula === '0' || formula === '+0') continue;
                parts.push(formula);
            }

            const combined = parts.join('+').replace(/\+\+/g, '+').replace(/\+-/g, '-');
            const parsed = parseMultiDiceFormula(combined);
            if (!parsed) {
                setSpinningDamage(false);
                return;
            }

            // Добавляем плоский бонус от damageBonus (не удваивается на крите)
            const totalModifier = parsed.modifier + damageBonus;

            const result = rollMultiDice(parsed.dice, totalModifier, critPending);
            setDamageResult(result);
            if (onRollDamage) onRollDamage(result);
            setSpinningDamage(false);
        }, 700);
    };

    // Работа с баффами
    const handleAddBuff = () => {
        if (!buffToAdd) return;
        const buff = getBuffById(buffToAdd);
        if (!buff) return;

        const newEntry: AppliedBuff = {
            key: `${buff.id}-${Date.now()}-${Math.random()}`,
            buffId: buff.id,
            rank: buff.defaultRank ?? buff.minRank ?? 1,
        };
        setAppliedBuffs(prev => [...prev, newEntry]);
        setBuffToAdd('');
    };

    const handleRemoveBuff = (key: string) => {
        setAppliedBuffs(prev => prev.filter(b => b.key !== key));
    };

    const handleBuffRankChange = (key: string, rank: number) => {
        setAppliedBuffs(prev =>
            prev.map(b => (b.key === key ? { ...b, rank } : b))
        );
    };

    const handleClearBuffs = () => {
        setAppliedBuffs([]);
    };

    // Предпросмотр формулы урона с учётом крита и баффов
    const previewFormula = (() => {
        if (!damageDice) return '';

        const parts: string[] = [];

        // Хелпер: парсит формулу, удваивает кости при крите, добавляет модификатор без удвоения
        const pushFormula = (rawFormula: string) => {
            const parsed = parseMultiDiceFormula(rawFormula.replace(/\s+/g, ''));
            if (!parsed) return;

            // Кости (с удвоением при крите)
            for (const group of parsed.dice) {
                const count = critPending ? group.count * 2 : group.count;
                parts.push(`${count}d${group.sides}`);
            }

            // Модификатор (НЕ удваивается при крите — правило D&D 5e)
            if (parsed.modifier !== 0) {
                parts.push(`${parsed.modifier > 0 ? '+' : ''}${parsed.modifier}`);
            }
        };

        // 1. Базовый урон
        pushFormula(damageDice);

        // 2. Баффы
        for (const applied of appliedBuffs) {
            const buff = getBuffById(applied.buffId);
            if (!buff) continue;
            const formula = buff.getFormula(applied.rank);
            if (!formula || formula === '0') continue;
            pushFormula(formula);
        }

        // 3. Плоский бонус от damageBonus (не удваивается при крите)
        const bonus = damageBonusMode === 'custom' ? customDamageBonus : defaultDamageBonus;
        if (bonus !== 0) {
            parts.push(`${bonus > 0 ? '+' : ''}${bonus}`);
        }

        return parts.join('+').replace(/\+\+/g, '+').replace(/\+-/g, '-');
    })();

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

                        {/* ATTACK ROLL */}
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

                            {/* Кнопка Roll Attack */}
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

                        {/* Damage Roll */}
                        {!hideDamage && damageDice && (
                            <div className={`attack-block ${critPending ? 'attack-block-crit' : ''}`}>
                                <div className="attack-block-header">
                                    Damage Roll {damageType ? `(${damageType})` : ''}
                                    {critPending && <span className="attack-crit-badge">CRIT!</span>}
                                </div>

                                {/* Формула */}
                                <div className="attack-section">
                                    <span className="attack-label">
                                        Final Formula
                                        {critPending && <span className="attack-crit-hint"> (dice doubled)</span>}
                                    </span>
                                    <span className="attack-formula">
                                        {previewFormula || damageDice}
                                    </span>
                                </div>

                                {/* Базовый бонус */}
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

                                {/* Buffs */}
                                <div className="attack-section attack-buffs-section">
                                    <span className="attack-label">Buffs</span>

                                    <div className="attack-buff-add-row">
                                        <select
                                            className="attack-buff-select"
                                            value={buffToAdd}
                                            onChange={(e) => setBuffToAdd(e.target.value)}
                                        >
                                            <option value="">— Select buff —</option>
                                            {DAMAGE_BUFFS.map(buff => (
                                                <option key={buff.id} value={buff.id}>
                                                    {buff.name}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            className="attack-buff-add-btn"
                                            onClick={handleAddBuff}
                                            disabled={!buffToAdd}
                                        >
                                            + Add
                                        </button>
                                    </div>

                                    {appliedBuffs.length > 0 && (
                                        <div className="attack-buff-list">
                                            {appliedBuffs.map(applied => {
                                                const buff = getBuffById(applied.buffId);
                                                if (!buff) return null;
                                                const formula = buff.getFormula(applied.rank);

                                                return (
                                                    <div key={applied.key} className="attack-buff-item">
                                                        <div className="attack-buff-info">
                                                            <span className="attack-buff-name">{buff.name}</span>
                                                            {buff.rankLabel && (
                                                                <div className="attack-buff-rank">
                                                                    <span className="attack-buff-rank-label">
                                                                        {buff.rankLabel}:
                                                                    </span>
                                                                    <input
                                                                        type="number"
                                                                        className="attack-buff-rank-input"
                                                                        min={buff.minRank ?? 1}
                                                                        max={buff.maxRank ?? 20}
                                                                        value={applied.rank ?? 1}
                                                                        onChange={(e) =>
                                                                            handleBuffRankChange(
                                                                                applied.key,
                                                                                Number(e.target.value)
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <span className="attack-buff-formula">{formula}</span>
                                                        <button
                                                            type="button"
                                                            className="attack-buff-remove"
                                                            onClick={() => handleRemoveBuff(applied.key)}
                                                            title="Remove buff"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                            <button
                                                type="button"
                                                className="attack-buff-clear"
                                                onClick={handleClearBuffs}
                                            >
                                                Clear all buffs
                                            </button>
                                        </div>
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
                                    {critPending ? 'Roll Crit Damage' : 'Roll Damage'}
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
                                            <span className={`attack-total damage ${critPending ? 'crit' : ''}`}>
                                                {damageResult.total}
                                            </span>
                                        </div>
                                        {critPending && (
                                            <div className="attack-result-hint crit-hint">
                                                Critical damage!
                                            </div>
                                        )}
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