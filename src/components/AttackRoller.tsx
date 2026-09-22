import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import {
    rollD20,
    rollDice,
    parseMultiDiceFormula,
    rollMultiDice,
    getPrimaryDiceSides,
    resolveRollMode,
    D20RollResult,
    DiceRollResult,
    RollMode,
} from '../utils/diceUtils';
import { DAMAGE_BUFFS, getBuffById } from '../constants/damageBuffs';
import { ATTACK_DEBUFFS, getDebuffById } from '../constants/attackDebuffs';
import './DiceRoller.css';
import './AttackRoller.css';

type BonusMode = 'default' | 'custom';

interface AppliedBuff {
    /** Уникальный ключ, чтобы можно было добавить один и тот же бафф дважды. */
    key: string;
    buffId: string;
    rank?: number;
}

interface AppliedDebuff {
    key: string;
    debuffId: string;
    rank?: number;
}

interface ExtendedAttackResult extends D20RollResult {
    /** Итоговый режим с учётом всех источников adv/dis. */
    effectiveMode: RollMode;
    /** Суммарный плоский штраф (отрицательный). */
    flatPenalty: number;
    /** Результаты бросков кубиков-штрафов (например, Bane 1d4). */
    dicePenalties: { name: string; rolls: number[]; total: number }[];
    /** Итоговое значение после всех штрафов. */
    finalTotal: number;
}

interface AttackRollerProps {
    sourceName: string;
    defaultAttackBonus?: number;
    damageDice?: string;
    defaultDamageBonus?: number;
    damageType?: string;
    hideDamage?: boolean;
    onRollAttack?: (result: ExtendedAttackResult) => void;
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

    const [appliedBuffs, setAppliedBuffs] = useState<AppliedBuff[]>([]);
    const [buffToAdd, setBuffToAdd] = useState<string>('');

    const [appliedDebuffs, setAppliedDebuffs] = useState<AppliedDebuff[]>([]);
    const [debuffToAdd, setDebuffToAdd] = useState<string>('');

    const [attackResult, setAttackResult] = useState<ExtendedAttackResult | null>(null);
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
        setAppliedDebuffs([]);
        setDebuffToAdd('');
    };

    useEffect(() => {
        setCritPending(false);
        setAttackResult(null);
        setDamageResult(null);
    }, [rollMode]);

    useEffect(() => {
        setCritPending(false);
        setAttackResult(null);
    }, [attackBonusMode, customAttackBonus, defaultAttackBonus]);

    // Предрасчёт effective mode и штрафов
    const hasDisadvantageSource = appliedDebuffs.some(
        a => getDebuffById(a.debuffId)?.type === 'disadvantage'
    );
    const effectiveMode = resolveRollMode(rollMode, false, hasDisadvantageSource);

    const flatPenalty = appliedDebuffs.reduce((sum, a) => {
        const d = getDebuffById(a.debuffId);
        if (!d || d.type !== 'flat') return sum;
        return sum + (d.value ?? 0);
    }, 0);

    // Обработчики броска
    const handleRollAttack = () => {
        if (spinningAttack) return;
        setSpinningAttack(true);
        setAttackResult(null);
        setDamageResult(null);

        setTimeout(() => {
            const baseBonus =
                attackBonusMode === 'custom' ? customAttackBonus : defaultAttackBonus;

            // 1. Роллим d20 с учётом effectiveMode
            const d20 = rollD20(effectiveMode, baseBonus);

            // 2. Считаем dice penalties (Bane и т.п.)
            const dicePenalties: { name: string; rolls: number[]; total: number }[] = [];
            for (const applied of appliedDebuffs) {
                const d = getDebuffById(applied.debuffId);
                if (!d || d.type !== 'dice' || !d.getFormula) continue;
                const formula = d.getFormula(applied.rank);
                const res = rollDice(formula);
                if (res) {
                    dicePenalties.push({ name: d.name, rolls: res.rolls, total: res.total });
                }
            }

            // 3. Собираем итог
            const dicePenaltyTotal = dicePenalties.reduce((s, x) => s + x.total, 0);
            const finalTotal = d20.total + flatPenalty - dicePenaltyTotal;

            const extended: ExtendedAttackResult = {
                ...d20,
                effectiveMode,
                flatPenalty,
                dicePenalties,
                finalTotal,
            };

            setAttackResult(extended);
            setCritPending(d20.isCrit);
            setSpinningAttack(false);
            if (onRollAttack) onRollAttack(extended);
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

    // Buffs
    const handleAddBuff = () => {
        if (!buffToAdd) return;
        const buff = getBuffById(buffToAdd);
        if (!buff) return;
        setAppliedBuffs(prev => [
            ...prev,
            {
                key: `${buff.id}-${Date.now()}-${Math.random()}`,
                buffId: buff.id,
                rank: buff.defaultRank ?? buff.minRank ?? 1,
            },
        ]);
        setBuffToAdd('');
    };

    const handleRemoveBuff = (key: string) =>
        setAppliedBuffs(prev => prev.filter(b => b.key !== key));

    const handleBuffRankChange = (key: string, rank: number) =>
        setAppliedBuffs(prev => prev.map(b => (b.key === key ? { ...b, rank } : b)));

    const handleClearBuffs = () => setAppliedBuffs([]);

    // Debuffs
    const handleAddDebuff = () => {
        if (!debuffToAdd) return;
        const debuff = getDebuffById(debuffToAdd);
        if (!debuff) return;
        setAppliedDebuffs(prev => [
            ...prev,
            {
                key: `${debuff.id}-${Date.now()}-${Math.random()}`,
                debuffId: debuff.id,
                rank: debuff.defaultRank ?? debuff.minRank ?? 1,
            },
        ]);
        setDebuffToAdd('');
        // Сбрасываем прошлый бросок атаки, т.к.условия изменились
        setAttackResult(null);
        setCritPending(false);
    };

    const handleRemoveDebuff = (key: string) => {
        setAppliedDebuffs(prev => prev.filter(d => d.key !== key));
        setAttackResult(null);
        setCritPending(false);
    };

    const handleDebuffRankChange = (key: string, rank: number) => {
        setAppliedDebuffs(prev => prev.map(d => (d.key === key ? { ...d, rank } : d)));
    };

    const handleClearDebuffs = () => {
        setAppliedDebuffs([]);
        setAttackResult(null);
        setCritPending(false);
    };

    // Preview формулы урона
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
        if (bonus !== 0) parts.push(`${bonus > 0 ? '+' : ''}${bonus}`);

        return parts.join('+').replace(/\+\+/g, '+').replace(/\+-/g, '-');
    })();

    const defaultTrigger = (
        <button className="attack-trigger-btn" type="button">
            Attack
        </button>
    );

    const isMultiD20 = attackResult && attackResult.rolls.length > 1;
    const effectiveModeDiffers = effectiveMode !== rollMode;

    return (
        <>
            <span className={className} onClick={handleOpen}>
                {trigger || defaultTrigger}
            </span>

            {isOpen && (
                <Modal isOpen={true} onClose={handleClose}>
                    <div className="attack-roller">
                        <h3 className="attack-title">Attack: {sourceName}</h3>

                        {/* Attack Roll */}
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
                                {effectiveModeDiffers && (
                                    <div className="attack-effective-mode">
                                        Effective: <strong>{effectiveMode}</strong>
                                        {hasDisadvantageSource && ' (disadvantage source active)'}
                                    </div>
                                )}
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

                            {/* Debuffs */}
                            <div className="attack-section attack-debuffs-section">
                                <span className="attack-label">Debuffs</span>

                                <div className="attack-buff-add-row">
                                    <select
                                        className="attack-debuff-select"
                                        value={debuffToAdd}
                                        onChange={(e) => setDebuffToAdd(e.target.value)}
                                    >
                                        <option value="">— Select debuff —</option>
                                        {ATTACK_DEBUFFS.map(d => (
                                            <option key={d.id} value={d.id}>
                                                {d.name} ({d.type})
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        className="attack-debuff-add-btn"
                                        onClick={handleAddDebuff}
                                        disabled={!debuffToAdd}
                                    >
                                        + Add
                                    </button>
                                </div>

                                {appliedDebuffs.length > 0 && (
                                    <div className="attack-buff-list">
                                        {appliedDebuffs.map(applied => {
                                            const d = getDebuffById(applied.debuffId);
                                            if (!d) return null;
                                            const label =
                                                d.type === 'flat' ? `${d.value}` :
                                                    d.type === 'dice' ? (d.getFormula?.(applied.rank) ?? '') :
                                                        'disadvantage';
                                            return (
                                                <div key={applied.key} className="attack-buff-item attack-debuff-item">
                                                    <div className="attack-buff-info">
                                                        <span className="attack-buff-name">{d.name}</span>
                                                        {d.rankLabel && (
                                                            <div className="attack-buff-rank">
                                                                <span className="attack-buff-rank-label">{d.rankLabel}:</span>
                                                                <input
                                                                    type="number"
                                                                    className="attack-buff-rank-input"
                                                                    min={d.minRank ?? 1}
                                                                    max={d.maxRank ?? 20}
                                                                    value={applied.rank ?? 1}
                                                                    onChange={(e) => handleDebuffRankChange(applied.key, Number(e.target.value))}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="attack-debuff-formula">{label}</span>
                                                    <button
                                                        type="button"
                                                        className="attack-buff-remove"
                                                        onClick={() => handleRemoveDebuff(applied.key)}
                                                        title="Remove debuff"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            );
                                        })}
                                        <button
                                            type="button"
                                            className="attack-buff-clear"
                                            onClick={handleClearDebuffs}
                                        >
                                            Clear all debuffs
                                        </button>
                                    </div>
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
                                        {attackResult.flatPenalty !== 0 && (
                                            <span className="attack-penalty">
                                                {attackResult.flatPenalty}
                                            </span>
                                        )}
                                        {attackResult.dicePenalties.map((dp, i) => (
                                            <span key={i} className="attack-penalty" title={dp.name}>
                                                −{dp.total}
                                            </span>
                                        ))}
                                        <span className="attack-equals">=</span>
                                        <span
                                            className={
                                                'attack-total' +
                                                (attackResult.isCrit ? ' crit' : '') +
                                                (attackResult.isCritFail ? ' crit-fail' : '')
                                            }
                                        >
                                            {attackResult.finalTotal}
                                        </span>
                                    </div>
                                    {attackResult.dicePenalties.length > 0 && (
                                        <div className="attack-result-hint">
                                            {attackResult.dicePenalties.map((dp, i) => (
                                                <span key={i}>
                                                    {dp.name}: {dp.rolls.join('+')} = {dp.total}
                                                    {i < attackResult.dicePenalties.length - 1 ? ' • ' : ''}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="attack-result-hint">
                                        {attackResult.isCrit && 'Critical hit!'}
                                        {attackResult.isCritFail && 'Critical miss!'}
                                        {!attackResult.isCrit && !attackResult.isCritFail && (
                                            attackResult.effectiveMode === 'advantage' ? 'Advantage' :
                                                attackResult.effectiveMode === 'disadvantage' ? 'Disadvantage' :
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
                                            {DAMAGE_BUFFS.map(b => (
                                                <option key={b.id} value={b.id}>{b.name}</option>
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
                                                return (
                                                    <div key={applied.key} className="attack-buff-item">
                                                        <div className="attack-buff-info">
                                                            <span className="attack-buff-name">{buff.name}</span>
                                                            {buff.rankLabel && (
                                                                <div className="attack-buff-rank">
                                                                    <span className="attack-buff-rank-label">{buff.rankLabel}:</span>
                                                                    <input
                                                                        type="number"
                                                                        className="attack-buff-rank-input"
                                                                        min={buff.minRank ?? 1}
                                                                        max={buff.maxRank ?? 20}
                                                                        value={applied.rank ?? 1}
                                                                        onChange={(e) => handleBuffRankChange(applied.key, Number(e.target.value))}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <span className="attack-buff-formula">
                                                            {buff.getFormula(applied.rank)}
                                                        </span>
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