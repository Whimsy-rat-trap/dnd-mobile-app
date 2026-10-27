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
    LevelUpPayload,
} from '../utils/leveling';
import './LevelUpModal.css';

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

const LevelUpModal: React.FC<Props> = ({ isOpen, onClose, character, onApply }) => {
    const [classIndex, setClassIndex] = useState(0);
    const [hpMethod, setHpMethod] = useState<'average' | 'roll'>('average');
    const [hpRoll, setHpRoll] = useState<number | null>(null);
    const [asiType, setAsiType] = useState<'asi' | 'feat'>('asi');
    const [asiBonuses, setAsiBonuses] = useState<Partial<Record<Abilities, number>>>({});
    const [selectedFeat, setSelectedFeat] = useState('');
    const [subclass, setSubclass] = useState('');

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
        // ASI: +2 в одну или +1/+1 в две
        const sum = asiAlreadySet;
        if (sum !== 2) return false;
        for (const [k, v] of Object.entries(asiBonuses)) {
            if ((v || 0) > 2) return false;
            if ((character.abilities[k as Abilities] + (v || 0)) > 20) return false;
        }
        return true;
    }, [getsASI, asiType, asiBonuses, selectedFeat, asiAlreadySet, character.abilities]);

    const canSubmit =
        !!currentClass &&
        (!needsSubclass || !!subclass) &&
        (hpMethod === 'average' || hpRoll !== null) &&
        asiValid;

    const handleRoll = () => {
        setHpRoll(Math.floor(Math.random() * hitDie) + 1);
    };

    const adjustAsi = (ability: Abilities, delta: number) => {
        setAsiBonuses(prev => {
            const cur = prev[ability] || 0;
            const next = Math.max(0, Math.min(2, cur + delta));
            const newBonuses = { ...prev, [ability]: next };
            // Сумма не должна превышать 2
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

        if (onApply(payload)) {
            onClose();
        }
    };

    if (!isOpen) return null;

    const xpToNext = getXpToNextLevel(character.level);
    const asiLevels = currentClass ? getAsiLevelsForClass(currentClass.className) : [];

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