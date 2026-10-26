import React, { useState, useEffect, useMemo } from 'react';
import Modal from './Modal';
import { Character } from '../types/Character';
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
import { getKnownManeuvers, getManeuverSaveDC } from '../utils/maneuvers';
import { getClassResourceState } from '../utils/classResources';
import { Maneuver } from '../constants/maneuvers';
import './DiceRoller.css';
import './AttackRoller.css';

type BonusMode = 'default' | 'custom';

interface AppliedBuff {
    key: string;
    buffId: string;
    rank?: number;
}

interface AppliedDebuff {
    key: string;
    debuffId: string;
    rank?: number;
}

interface AppliedManeuver {
    maneuver: Maneuver;
    dieRoll: number;
}

interface ExtendedAttackResult extends D20RollResult {
    effectiveMode: RollMode;
    flatPenalty: number;
    dicePenalties: { name: string; rolls: number[]; total: number }[];
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
    inspirationAvailable?: boolean;
    onSpendInspiration?: () => boolean;
    forceOpen?: boolean;
    onForceOpenHandled?: () => void;
    /** Опционально: если задан и персонаж Battle Master с dice — секция Maneuvers. */
    character?: Character;
    /** Опционально: спенд superiority die, возвращает true при успехе. */
    onSpendSuperiorityDie?: () => boolean;
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
                                                       inspirationAvailable = false,
                                                       onSpendInspiration,
                                                       forceOpen = false,
                                                       onForceOpenHandled,
                                                       character,
                                                       onSpendSuperiorityDie,
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

    const [appliedManeuver, setAppliedManeuver] = useState<AppliedManeuver | null>(null);
    const [selectedManeuverId, setSelectedManeuverId] = useState<string>('');

    const [attackResult, setAttackResult] = useState<ExtendedAttackResult | null>(null);
    const [damageResult, setDamageResult] = useState<DiceRollResult | null>(null);
    const [spinningAttack, setSpinningAttack] = useState(false);
    const [spinningDamage, setSpinningDamage] = useState(false);

    const [critPending, setCritPending] = useState(false);

    const damageSides = getPrimaryDiceSides(damageDice);

    // Superiority dice / maneuvers
    const superiorityInfo = character
        ? getClassResourceState(character, 'superiority-dice')
        : null;
    const dieSize = superiorityInfo?.dieSize ?? 0;
    const availableDice = superiorityInfo?.availableUses ?? 0;

    const availableManeuvers = useMemo<Maneuver[]>(() => {
        if (!character || !onSpendSuperiorityDie) return [];
        if (!superiorityInfo) return [];
        const known = getKnownManeuvers(character);
        // В AttackRoller показываем только те, что дают бонус к атаке или урону.
        return known.filter(m => m.addsTo === 'attack' || m.addsTo === 'damage');
    }, [character, onSpendSuperiorityDie, superiorityInfo]);

    const selectedManeuver = selectedManeuverId
        ? availableManeuvers.find(m => m.id === selectedManeuverId) ?? null
        : null;

    const canShowManeuvers =
        availableManeuvers.length > 0 && !appliedManeuver;

    const canApplySelectedManeuver = (() => {
        if (!selectedManeuver) return false;
        if (appliedManeuver) return false;
        if (!attackResult) return false;
        if (availableDice === 0) return false;
        // Precision (addsTo 'attack') — можно после любого броска.
        if (selectedManeuver.addsTo === 'attack') return true;
        // Damage/on-hit — только после попадания (не crit fail).
        if (attackResult.isCritFail) return false;
        return true;
    })();

    const handleApplyManeuver = () => {
        if (!selectedManeuver || !canApplySelectedManeuver || !onSpendSuperiorityDie) return;
        if (!onSpendSuperiorityDie()) return;

        const roll = Math.floor(Math.random() * dieSize) + 1;

        // Precision: сразу добавляем к итогу атаки.
        if (selectedManeuver.addsTo === 'attack' && attackResult) {
            setAttackResult({
                ...attackResult,
                finalTotal: attackResult.finalTotal + roll,
            });
        }

        setAppliedManeuver({ maneuver: selectedManeuver, dieRoll: roll });
    };

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
        setAppliedManeuver(null);
        setSelectedManeuverId('');
    };

    useEffect(() => {
        if (forceOpen) {
            setIsOpen(true);
            onForceOpenHandled?.();
        }
    }, [forceOpen, onForceOpenHandled]);

    useEffect(() => {
        setCritPending(false);
        setAttackResult(null);
        setDamageResult(null);
        setAppliedManeuver(null);
    }, [rollMode]);

    useEffect(() => {
        setCritPending(false);
        setAttackResult(null);
        setAppliedManeuver(null);
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
        setAppliedManeuver(null);

        setTimeout(() => {
            const baseBonus =
                attackBonusMode === 'custom' ? customAttackBonus : defaultAttackBonus;

            const d20 = rollD20(effectiveMode, baseBonus);

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

    const handleRerollWithInspiration = () => {
        if (!onSpendInspiration) return;
        const ok = onSpendInspiration();
        if (!ok) return;
        setAttackResult(null);
        setDamageResult(null);
        setCritPending(false);
        setAppliedManeuver(null);
        setTimeout(() => handleRollAttack(), 0);
    };

    const handleRollDamage = () => {
        if (spinningDamage || !damageDice) return;
        setSpinningDamage(true);
        setDamageResult(null);

        setTimeout(() => {
            const damageBonus =
                damageBonusMode === 'custom' ? customDamageBonus : defaultDamageBonus;

            const maneuverBonus =
                appliedManeuver && appliedManeuver.maneuver.addsTo === 'damage'
                    ? appliedManeuver.dieRoll
                    : 0;

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

            const totalModifier = parsed.modifier + damageBonus + maneuverBonus;
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
        setAttackResult(null);
        setCritPending(false);
        setAppliedManeuver(null);
    };

    const handleRemoveDebuff = (key: string) => {
        setAppliedDebuffs(prev => prev.filter(d => d.key !== key));
        setAttackResult(null);
        setCritPending(false);
        setAppliedManeuver(null);
    };

    const handleDebuffRankChange = (key: string, rank: number) => {
        setAppliedDebuffs(prev => prev.map(d => (d.key === key ? { ...d, rank } : d)));
    };

    const handleClearDebuffs = () => {
        setAppliedDebuffs([]);
        setAttackResult(null);
        setCritPending(false);
        setAppliedManeuver(null);
    };

    // Preview формулы урона (с учётом манёвра)
    const previewFormula = (() => {
        if (!damageDice) return '';

        const parts: string[] = [];

        const pushFormula = (rawFormula: string) => {
            const parsed = parseMultiDiceFormula(rawFormula.replace(/\s+/g, ''));
            if (!parsed) return;

            for (const group of parsed.dice) {
                const count = critPending ? group.count * 2 : group.count;
                parts.push(`${count}d${group.sides}`);
            }

            if (parsed.modifier !== 0) {
                parts.push(`${parsed.modifier > 0 ? '+' : ''}${parsed.modifier}`);
            }
        };

        pushFormula(damageDice);

        for (const applied of appliedBuffs) {
            const buff = getBuffById(applied.buffId);
            if (!buff) continue;
            const formula = buff.getFormula(applied.rank);
            if (!formula || formula === '0') continue;
            pushFormula(formula);
        }

        const maneuverBonus =
            appliedManeuver && appliedManeuver.maneuver.addsTo === 'damage'
                ? appliedManeuver.dieRoll
                : 0;

        const bonus =
            (damageBonusMode === 'custom' ? customDamageBonus : defaultDamageBonus) +
            maneuverBonus;
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

                        {/* === ATTACK ROLL === */}
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
                                    {inspirationAvailable && onSpendInspiration && (
                                        <button
                                            type="button"
                                            className="attack-inspiration-btn"
                                            onClick={handleRerollWithInspiration}
                                        >
                                            <span className="attack-inspiration-star">✦</span>
                                            Reroll with Inspiration
                                        </button>
                                    )}

                                    {/* === Maneuvers (после броска) === */}
                                    {canShowManeuvers && (
                                        <div className="attack-maneuvers-section">
                                            <span className="attack-label">Maneuver</span>
                                            <div className="attack-buff-add-row">
                                                <select
                                                    className="attack-buff-select"
                                                    value={selectedManeuverId}
                                                    onChange={(e) => setSelectedManeuverId(e.target.value)}
                                                >
                                                    <option value="">— Select maneuver —</option>
                                                    {availableManeuvers.map(m => {
                                                        // Precision — доступен всегда, on-hit — только после попадания
                                                        const isAvailableNow = m.addsTo === 'attack'
                                                            || !attackResult.isCritFail;
                                                        return (
                                                            <option
                                                                key={m.id}
                                                                value={m.id}
                                                                disabled={!isAvailableNow}
                                                            >
                                                                {m.name} ({m.addsTo === 'attack' ? '+attack' : '+damage'})
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                                <button
                                                    type="button"
                                                    className="attack-buff-add-btn attack-maneuver-apply-btn"
                                                    onClick={handleApplyManeuver}
                                                    disabled={!canApplySelectedManeuver}
                                                    title={
                                                        !selectedManeuver
                                                            ? 'Select a maneuver'
                                                            : availableDice === 0
                                                                ? 'No superiority dice left'
                                                                : selectedManeuver.addsTo === 'damage' && attackResult.isCritFail
                                                                    ? 'Cannot apply on-hit maneuver on a miss'
                                                                    : `Spend 1 die (d${dieSize})`
                                                    }
                                                >
                                                    Apply (d{dieSize})
                                                </button>
                                            </div>
                                            {selectedManeuver && (
                                                <div className="attack-maneuver-info">
                                                    {selectedManeuver.description}
                                                    {selectedManeuver.save && character && (
                                                        <div className="attack-maneuver-save-hint">
                                                            DC {getManeuverSaveDC(character)} {selectedManeuver.save.ability.toUpperCase()} — {selectedManeuver.save.effect}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {appliedManeuver && (
                                        <div className="attack-maneuver-applied">
                                            <div className="attack-maneuver-applied-header">
                                                <span className="attack-maneuver-applied-name">
                                                    {appliedManeuver.maneuver.name}
                                                </span>
                                                <span className="attack-maneuver-applied-die">
                                                    d{dieSize} → <strong>{appliedManeuver.dieRoll}</strong>
                                                </span>
                                            </div>
                                            {appliedManeuver.maneuver.save && character && (
                                                <div className="attack-maneuver-applied-save">
                                                    DC {getManeuverSaveDC(character)} {appliedManeuver.maneuver.save.ability.toUpperCase()} — {appliedManeuver.maneuver.save.effect}
                                                </div>
                                            )}
                                            {appliedManeuver.maneuver.addsTo === 'attack' && (
                                                <div className="attack-maneuver-applied-hint">
                                                    +{appliedManeuver.dieRoll} added to attack total
                                                </div>
                                            )}
                                            {appliedManeuver.maneuver.addsTo === 'damage' && (
                                                <div className="attack-maneuver-applied-hint">
                                                    +{appliedManeuver.dieRoll} will be added to damage
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* === DAMAGE ROLL === */}
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
                                        {appliedManeuver && appliedManeuver.maneuver.addsTo === 'damage' && (
                                            <div className="attack-result-hint attack-maneuver-damage-hint">
                                                {appliedManeuver.maneuver.name}: +{appliedManeuver.dieRoll} from superiority die
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