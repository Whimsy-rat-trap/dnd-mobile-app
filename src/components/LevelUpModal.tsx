import React, { useState, useMemo } from 'react';
import Modal from './Modal';
import { Character } from '../types/Character';
import { CLASS_HIT_DICE } from '../constants/classHitDice';
import { GENERAL_FEATS } from '../constants/generalFeats';
import { SUBCLASSES } from '../constants/subclasses';
import {
    getXpToNextLevel,
    getAsiLevelsForClass,
    shouldGetASI,
    needsSubclassChoice,
    computeHpGain,
    getClassOptionsForLevelUp,
    computeLevelUpPreview,
    LevelUpPayload,
    LevelUpPreview,
} from '../utils/leveling';
import { getSpellCandidates } from '../utils/spellLearning';
import './LevelUpModal.css';
import {ordinal} from "../utils/format";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    character: Character;
    onApply: (payload: LevelUpPayload) => boolean;
}

type Abilities = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';
const ABILITY_KEYS: Abilities[] = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
const ABILITY_LABELS: Record<Abilities, string> = {
    str: 'STR', dex: 'DEX', con: 'CON', int: 'INT', wis: 'WIS', cha: 'CHA',
};

// Preview block
interface PreviewBlockProps {
    preview: LevelUpPreview | null;
    hpGain: number | null;
    chosenSubclass: string;
    hasASI: boolean;
    asiType: 'asi' | 'feat';
}

const PreviewBlock: React.FC<PreviewBlockProps> = ({
                                                       preview,
                                                       hpGain,
                                                       chosenSubclass,
                                                       hasASI,
                                                       asiType,
                                                   }) => {
    if (!preview) return null;

    const rows: React.ReactNode[] = [];

    // Level
    rows.push(
        <div key="level" className="lum-preview-row lum-preview-row-title">
            <span className="lum-preview-label">Level</span>
            <span className="lum-preview-value lum-preview-highlight">
                {preview.levelFrom} → {preview.levelTo}
                {preview.classLevelFrom !== preview.classLevelTo && (
                    <span className="lum-preview-sub">
                        {' '}({preview.className} {preview.classLevelFrom} → {preview.classLevelTo})
                    </span>
                )}
            </span>
        </div>
    );

    // HP
    if (hpGain !== null) {
        rows.push(
            <div key="hp" className="lum-preview-row">
                <span className="lum-preview-label">HP</span>
                <span className="lum-preview-value lum-preview-positive">
                    +{hpGain}
                </span>
            </div>
        );
    }

    // Proficiency
    if (preview.proficiency.from !== preview.proficiency.to) {
        rows.push(
            <div key="prof" className="lum-preview-row">
                <span className="lum-preview-label">Proficiency</span>
                <span className="lum-preview-value lum-preview-positive">
                    +{preview.proficiency.from} → +{preview.proficiency.to}
                </span>
            </div>
        );
    }

    // Spell Save DC
    if (preview.spellSaveDC) {
        rows.push(
            <div key="spdc" className="lum-preview-row">
                <span className="lum-preview-label">Spell Save DC</span>
                <span className="lum-preview-value lum-preview-positive">
                    {preview.spellSaveDC.from} → {preview.spellSaveDC.to}
                </span>
            </div>
        );
    }

    // Spell Attack
    if (preview.spellAttackBonus) {
        rows.push(
            <div key="spatk" className="lum-preview-row">
                <span className="lum-preview-label">Spell Attack</span>
                <span className="lum-preview-value lum-preview-positive">
                    {preview.spellAttackBonus.from >= 0 ? '+' : ''}
                    {preview.spellAttackBonus.from} →{' '}
                    {preview.spellAttackBonus.to >= 0 ? '+' : ''}
                    {preview.spellAttackBonus.to}
                </span>
            </div>
        );
    }

    // New spell level
    if (preview.maxSpellLevel) {
        rows.push(
            <div key="msl" className="lum-preview-row">
                <span className="lum-preview-label">New spell level</span>
                <span className="lum-preview-value lum-preview-positive">
                    {preview.maxSpellLevel.from > 0
                        ? `${preview.maxSpellLevel.from} → ${preview.maxSpellLevel.to}`
                        : preview.maxSpellLevel.to}
                    {preview.maxSpellLevel.to > 0 &&
                        ` (up to ${ordinal(preview.maxSpellLevel.to)})`}
                </span>
            </div>
        );
    }

    // Spell slots
    if (preview.spellSlots.length > 0) {
        rows.push(
            <div key="slots" className="lum-preview-row lum-preview-row-multi">
                <span className="lum-preview-label">Spell Slots</span>
                <span className="lum-preview-value">
                    {preview.spellSlots.map((s, i) => (
                        <span key={s.level} className="lum-preview-chip lum-preview-chip-green">
                            Lv.{s.level} {s.delta > 0 ? `+${s.delta}` : s.delta}
                            {s.from === 0 && s.to > 0 && ' (new)'}
                            {i < preview.spellSlots.length - 1 ? ' · ' : ''}
                        </span>
                    ))}
                </span>
            </div>
        );
    }

    // Pact slots
    if (preview.pactSlots) {
        const ps = preview.pactSlots;
        rows.push(
            <div key="pact" className="lum-preview-row">
                <span className="lum-preview-label">Pact Magic</span>
                <span className="lum-preview-value lum-preview-positive">
                    {ps.from === 0 ? `${ps.to}` : `${ps.from} → ${ps.to}`} slots
                    {ps.slotLevel > 0 && ` @ Lv.${ps.slotLevel}`}
                </span>
            </div>
        );
    }

    // Max prepared
    if (preview.maxPrepared) {
        rows.push(
            <div key="prep" className="lum-preview-row">
                <span className="lum-preview-label">Max prepared</span>
                <span className="lum-preview-value lum-preview-positive">
                    {preview.maxPrepared.from} → {preview.maxPrepared.to}
                </span>
            </div>
        );
    }

    // Learn spells (known casters)
    if (preview.spellLearning) {
        const parts: string[] = [];
        if (preview.spellLearning.spellsToLearn > 0) {
            parts.push(`${preview.spellLearning.spellsToLearn} spell${preview.spellLearning.spellsToLearn > 1 ? 's' : ''}`);
        }
        if (preview.spellLearning.cantripsToLearn > 0) {
            parts.push(`${preview.spellLearning.cantripsToLearn} cantrip${preview.spellLearning.cantripsToLearn > 1 ? 's' : ''}`);
        }
        rows.push(
            <div key="learn" className="lum-preview-row">
                <span className="lum-preview-label">Learn spells</span>
                <span className="lum-preview-value lum-preview-positive">
                    {parts.join(' + ')}
                    {preview.spellLearning.maxSpellLevel > 0 &&
                        ` (≤ Lv.${preview.spellLearning.maxSpellLevel})`}
                </span>
            </div>
        );
    }

    for (const res of preview.classResources) {
        const parts: string[] = [];
        for (const ch of res.changes) {
            if (ch.kind === 'new') {
                parts.push(`new (${ch.maxUses}${ch.dieSize ? `, d${ch.dieSize}` : ''})`);
            } else if (ch.kind === 'maxUses') {
                parts.push(`${ch.from} → ${ch.to}`);
            } else if (ch.kind === 'dieSize') {
                if (ch.from === undefined && ch.to !== undefined) {
                    parts.push(`d${ch.to}`);
                } else if (ch.from !== undefined && ch.to !== undefined) {
                    parts.push(`d${ch.from} → d${ch.to}`);
                }
            } else if (ch.kind === 'recharge') {
                parts.push(`recharge ${ch.from} → ${ch.to}`);
            }
        }
        rows.push(
            <div key={`res-${res.id}`} className="lum-preview-row lum-preview-row-multi">
                <span className="lum-preview-label">{res.name}</span>
                <span className="lum-preview-value lum-preview-positive">
                    {parts.join(' · ')}
                </span>
            </div>
        );
    }

    // Subclass
    if (preview.hasSubclassChoice && chosenSubclass) {
        rows.push(
            <div key="subclass" className="lum-preview-row">
                <span className="lum-preview-label">Subclass</span>
                <span className="lum-preview-value lum-preview-highlight">
                    {preview.className}: {chosenSubclass}
                </span>
            </div>
        );
    }

    // ASI
    if (hasASI) {
        rows.push(
            <div key="asi" className="lum-preview-row">
                <span className="lum-preview-label">ASI</span>
                <span className="lum-preview-value lum-preview-highlight">
                    {asiType === 'asi' ? 'Ability Score Improvement' : 'Feat (DM allowed)'}
                </span>
            </div>
        );
    }

    return (
        <div className="lum-preview">
            <div className="lum-preview-header">
                <span className="lum-preview-title">Preview</span>
            </div>
            {rows}
        </div>
    );
};

// Main modal

const LevelUpModal: React.FC<Props> = ({ isOpen, onClose, character, onApply }) => {
    const [classIndex, setClassIndex] = useState(0);
    const [hpMethod, setHpMethod] = useState<'average' | 'roll'>('average');
    const [hpRoll, setHpRoll] = useState<number | null>(null);
    const [asiType, setAsiType] = useState<'asi' | 'feat'>('asi');
    const [asiBonuses, setAsiBonuses] = useState<Partial<Record<Abilities, number>>>({});
    const [selectedFeat, setSelectedFeat] = useState('');
    const [subclass, setSubclass] = useState('');
    const [selectedSpells, setSelectedSpells] = useState<string[]>([]);
    const [selectedCantrips, setSelectedCantrips] = useState<string[]>([]);

    const classOptions = getClassOptionsForLevelUp(character);
    const currentClass = classOptions[classIndex];
    const newClassLevel = currentClass ? currentClass.currentLevel + 1 : 1;

    const conMod = Math.floor((character.abilities.con - 10) / 2);
    const hitDie = currentClass ? (CLASS_HIT_DICE[currentClass.className] || 8) : 8;

    const needsSubclass = currentClass
        ? needsSubclassChoice(character, classIndex, newClassLevel)
        : false;

    const getsASI = currentClass
        ? shouldGetASI(currentClass.className, newClassLevel)
        : false;

    const asiAlreadySet =
        Object.values(asiBonuses).reduce((s, v) => s + (v || 0), 0);

    const subclassOptions = currentClass
        ? (SUBCLASSES[currentClass.className] || [])
        : [];

    const asiValid = useMemo(() => {
        if (!getsASI) return true;
        if (asiType === 'feat') return !!selectedFeat;
        const sum = asiAlreadySet;
        if (sum !== 2) return false;
        for (const [k, v] of Object.entries(asiBonuses)) {
            if ((v || 0) > 2) return false;
            if ((character.abilities[k as Abilities] + (v || 0)) > 20) return false;
        }
        return true;
    }, [getsASI, asiType, asiBonuses, selectedFeat, asiAlreadySet, character.abilities]);

    const preview = useMemo(
        () => computeLevelUpPreview(character, classIndex, subclass || undefined),
        [character, classIndex, subclass]
    );

    // --- Spell learning ---
    const spellLearning = preview?.spellLearning || null;

    const spellCandidates = useMemo(() => {
        if (!spellLearning || !currentClass) return [];
        if (spellLearning.spellsToLearn === 0) return [];
        return getSpellCandidates(
            character,
            currentClass.className,
            spellLearning.maxSpellLevel,
            false
        );
    }, [character, currentClass, spellLearning]);

    const cantripCandidates = useMemo(() => {
        if (!spellLearning || !currentClass) return [];
        if (spellLearning.cantripsToLearn === 0) return [];
        return getSpellCandidates(
            character,
            currentClass.className,
            spellLearning.maxSpellLevel,
            true
        );
    }, [character, currentClass, spellLearning]);

    const toggleSpell = (name: string) => {
        setSelectedSpells(prev => {
            if (prev.includes(name)) return prev.filter(n => n !== name);
            if (spellLearning && prev.length >= spellLearning.spellsToLearn) return prev;
            return [...prev, name];
        });
    };

    const toggleCantrip = (name: string) => {
        setSelectedCantrips(prev => {
            if (prev.includes(name)) return prev.filter(n => n !== name);
            if (spellLearning && prev.length >= spellLearning.cantripsToLearn) return prev;
            return [...prev, name];
        });
    };

    const spellsValid = !spellLearning
        ? true
        : selectedSpells.length === spellLearning.spellsToLearn;

    const cantripsValid = !spellLearning
        ? true
        : selectedCantrips.length === spellLearning.cantripsToLearn;

    const canSubmit =
        !!currentClass &&
        (!needsSubclass || !!subclass) &&
        (hpMethod === 'average' || hpRoll !== null) &&
        asiValid &&
        spellsValid &&
        cantripsValid;

    const handleRoll = () => {
        setHpRoll(Math.floor(Math.random() * hitDie) + 1);
    };

    const adjustAsi = (ability: Abilities, delta: number) => {
        setAsiBonuses(prev => {
            const cur = prev[ability] || 0;
            const next = Math.max(0, Math.min(2, cur + delta));
            const newBonuses = { ...prev, [ability]: next };
            const total = Object.values(newBonuses).reduce((s, v) => s + (v || 0), 0);
            if (total > 2) return prev;
            return newBonuses;
        });
    };

    const handleSubmit = () => {
        if (!canSubmit || !currentClass) return;

        const payload: LevelUpPayload = {
            classIndex,
            hp: {
                method: hpMethod,
                roll: hpMethod === 'roll' ? hpRoll ?? undefined : undefined,
            },
            subclass: needsSubclass ? subclass : undefined,
        };

        if (getsASI) {
            if (asiType === 'asi') {
                payload.asi = { type: 'asi', bonuses: asiBonuses };
            } else {
                payload.asi = { type: 'feat', featId: selectedFeat };
            }
        }

        if (spellLearning) {
            if (selectedSpells.length > 0) {
                payload.spellsToLearn = selectedSpells;
            }
            if (selectedCantrips.length > 0) {
                payload.cantripsToLearn = selectedCantrips;
            }
        }

        if (onApply(payload)) {
            // Сбрасываем локальный state после успеха
            setSelectedSpells([]);
            setSelectedCantrips([]);
            onClose();
        }
    };

    if (!isOpen) return null;

    const xpToNext = getXpToNextLevel(character.level);
    const asiLevels = currentClass ? getAsiLevelsForClass(currentClass.className) : [];

    const hpGainForPreview =
        hpMethod === 'average'
            ? computeHpGain(
                currentClass?.className || 'Fighter',
                conMod,
                'average'
            ).gain
            : hpRoll !== null
                ? computeHpGain(
                    currentClass?.className || 'Fighter',
                    conMod,
                    'roll',
                    hpRoll
                ).gain
                : null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="lum-modal">
            <div className="lum-body">
                <h3 className="lum-title">Level Up</h3>
                <p className="lum-subtitle">
                    Level {character.level} → {character.level + 1}
                    {character.levelingMode !== 'milestone' && (
                        <span className="lum-xp">
                            {' '}· XP {character.exp.toLocaleString()} / {xpToNext.toLocaleString()}
                        </span>
                    )}
                </p>

                {/* Class choice */}
                {classOptions.length > 1 && (
                    <div className="lum-section">
                        <span className="lum-label">Level up which class?</span>
                        <select
                            className="lum-select"
                            value={classIndex}
                            onChange={(e) => {
                                setClassIndex(Number(e.target.value));
                                setSubclass('');
                                setAsiBonuses({});
                                setSelectedFeat('');
                                setSelectedSpells([]);
                                setSelectedCantrips([]);
                            }}
                        >
                            {classOptions.map((opt) => (
                                <option key={opt.index} value={opt.index}>
                                    {opt.className} ({opt.currentLevel} → {opt.currentLevel + 1})
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Subclass */}
                {needsSubclass && currentClass && subclassOptions.length > 0 && (
                    <div className="lum-section lum-section-highlight">
                        <span className="lum-label">
                            Choose {currentClass.className} subclass (required at level {newClassLevel})
                        </span>
                        <select
                            className="lum-select"
                            value={subclass}
                            onChange={(e) => setSubclass(e.target.value)}
                        >
                            <option value="">— Select —</option>
                            {subclassOptions.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* HP */}
                <div className="lum-section">
                    <span className="lum-label">HP increase</span>
                    <div className="lum-hp-methods">
                        <button
                            type="button"
                            className={`lum-hp-btn ${hpMethod === 'average' ? 'active' : ''}`}
                            onClick={() => { setHpMethod('average'); setHpRoll(null); }}
                        >
                            Average
                            <span className="lum-hp-preview">
                                +{computeHpGain(currentClass?.className || 'Fighter', conMod, 'average').gain}
                            </span>
                        </button>
                        <button
                            type="button"
                            className={`lum-hp-btn ${hpMethod === 'roll' ? 'active' : ''}`}
                            onClick={() => setHpMethod('roll')}
                        >
                            Roll d{hitDie}
                            {hpRoll !== null && (
                                <span className="lum-hp-preview">
                                    +{computeHpGain(currentClass?.className || 'Fighter', conMod, 'roll', hpRoll).gain}
                                </span>
                            )}
                        </button>
                    </div>
                    {hpMethod === 'roll' && (
                        <div className="lum-roll-row">
                            {hpRoll === null ? (
                                <button
                                    type="button"
                                    className="lum-roll-btn"
                                    onClick={handleRoll}
                                >
                                    Roll d{hitDie}
                                </button>
                            ) : (
                                <span className="lum-roll-result">
                                    d{hitDie} → <strong>{hpRoll}</strong>
                                    {conMod !== 0 && (
                                        <span className="lum-con">
                                            {' '}{conMod > 0 ? '+' : ''}{conMod} CON
                                            {' = '}
                                            {Math.max(1, hpRoll + conMod)} HP
                                        </span>
                                    )}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* ASI / Feat */}
                {getsASI && (
                    <div className="lum-section lum-section-highlight">
                        <span className="lum-label">
                            Ability Score Improvement (level {newClassLevel} of {currentClass?.className})
                            {asiLevels.length > 0 && (
                                <span className="lum-asi-levels">
                                    {' '}· ASI at {asiLevels.join(', ')}
                                </span>
                            )}
                        </span>

                        <div className="lum-asi-tabs">
                            <button
                                type="button"
                                className={`lum-asi-tab ${asiType === 'asi' ? 'active' : ''}`}
                                onClick={() => setAsiType('asi')}
                            >
                                +2 / +1+1
                            </button>
                            {character.allowFeatInsteadOfASI && (
                                <button
                                    type="button"
                                    className={`lum-asi-tab ${asiType === 'feat' ? 'active' : ''}`}
                                    onClick={() => setAsiType('feat')}
                                >
                                    Feat
                                </button>
                            )}
                        </div>

                        {asiType === 'asi' ? (
                            <div className="lum-asi-grid">
                                {ABILITY_KEYS.map(ab => (
                                    <div key={ab} className="lum-asi-row">
                                        <span className="lum-asi-name">
                                            {ABILITY_LABELS[ab]}
                                            <span className="lum-asi-score">
                                                {' '}({character.abilities[ab]})
                                            </span>
                                        </span>
                                        <div className="lum-asi-controls">
                                            <button
                                                type="button"
                                                className="lum-asi-btn"
                                                onClick={() => adjustAsi(ab, -1)}
                                                disabled={(asiBonuses[ab] || 0) <= 0}
                                            >
                                                −
                                            </button>
                                            <span className="lum-asi-value">
                                                {asiBonuses[ab] ? `+${asiBonuses[ab]}` : '0'}
                                            </span>
                                            <button
                                                type="button"
                                                className="lum-asi-btn"
                                                onClick={() => adjustAsi(ab, 1)}
                                                disabled={
                                                    (asiBonuses[ab] || 0) >= 2 ||
                                                    asiAlreadySet >= 2 ||
                                                    character.abilities[ab] + (asiBonuses[ab] || 0) >= 20
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <select
                                className="lum-select"
                                value={selectedFeat}
                                onChange={(e) => setSelectedFeat(e.target.value)}
                            >
                                <option value="">— Select feat —</option>
                                {GENERAL_FEATS.map(f => (
                                    <option key={f.id} value={f.id}>
                                        {f.name}
                                        {f.prerequisite ? ` (${f.prerequisite})` : ''}
                                    </option>
                                ))}
                            </select>
                        )}

                        {asiType === 'asi' && asiAlreadySet !== 2 && (
                            <div className="lum-asi-hint">
                                Distribute exactly 2 points (+2 to one or +1/+1 to two).
                            </div>
                        )}
                    </div>
                )}

                {/* Spell Learning (known casters) */}
                {spellLearning && (
                    <div className="lum-section lum-section-highlight">
                        <span className="lum-label">
                            Learn new spells
                            <span className="lum-asi-levels">
                                {' '}· {currentClass?.className} at level {newClassLevel}
                            </span>
                        </span>

                        {spellLearning.spellsToLearn > 0 && (
                            <div className="lum-spells-block">
                                <span className="lum-spells-title">
                                    Spells (≤ Lv.{spellLearning.maxSpellLevel}) ·{' '}
                                    <span className={
                                        spellsValid
                                            ? 'lum-spells-count-ok'
                                            : 'lum-spells-count-pending'
                                    }>
                                        {selectedSpells.length}/{spellLearning.spellsToLearn}
                                    </span>
                                </span>
                                <div className="lum-spells-list">
                                    {spellCandidates.length === 0 ? (
                                        <div className="lum-spells-empty">
                                            No eligible spells available.
                                        </div>
                                    ) : (
                                        spellCandidates.map(spell => {
                                            const isSelected = selectedSpells.includes(spell.name);
                                            const canPick =
                                                isSelected ||
                                                selectedSpells.length < spellLearning.spellsToLearn;
                                            return (
                                                <label
                                                    key={spell.name}
                                                    className={`lum-spell-row ${isSelected ? 'selected' : ''} ${!canPick ? 'disabled' : ''}`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        disabled={!canPick}
                                                        onChange={() => toggleSpell(spell.name)}
                                                    />
                                                    <span className="lum-spell-name">{spell.name}</span>
                                                    <span className="lum-spell-level">Lv.{spell.level}</span>
                                                </label>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        )}

                        {spellLearning.cantripsToLearn > 0 && (
                            <div className="lum-spells-block">
                                <span className="lum-spells-title">
                                    Cantrips ·{' '}
                                    <span className={
                                        cantripsValid
                                            ? 'lum-spells-count-ok'
                                            : 'lum-spells-count-pending'
                                    }>
                                        {selectedCantrips.length}/{spellLearning.cantripsToLearn}
                                    </span>
                                </span>
                                <div className="lum-spells-list">
                                    {cantripCandidates.length === 0 ? (
                                        <div className="lum-spells-empty">
                                            No eligible cantrips available.
                                        </div>
                                    ) : (
                                        cantripCandidates.map(spell => {
                                            const isSelected = selectedCantrips.includes(spell.name);
                                            const canPick =
                                                isSelected ||
                                                selectedCantrips.length < spellLearning.cantripsToLearn;
                                            return (
                                                <label
                                                    key={spell.name}
                                                    className={`lum-spell-row ${isSelected ? 'selected' : ''} ${!canPick ? 'disabled' : ''}`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        disabled={!canPick}
                                                        onChange={() => toggleCantrip(spell.name)}
                                                    />
                                                    <span className="lum-spell-name">{spell.name}</span>
                                                    <span className="lum-spell-level">Cantrip</span>
                                                </label>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Preview */}
                <PreviewBlock
                    preview={preview}
                    hpGain={hpGainForPreview}
                    chosenSubclass={subclass}
                    hasASI={getsASI}
                    asiType={asiType}
                />

                <div className="lum-actions">
                    <button className="lum-btn lum-btn-cancel" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="lum-btn lum-btn-confirm"
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                        title={!canSubmit ? 'Fill all required fields' : 'Apply level up'}
                    >
                        Level Up
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default LevelUpModal;