import React, { useState, useMemo, useEffect } from 'react';
import Modal from '../Modal';
import { Character } from '../../types/Character';
import { useCharacters } from '../../context/CharacterContext';
import {
    getForgettableSpells,
    getLearnableSpellsForSwap,
} from '../../utils/spellSwap';
import './SwapSpellModal.css';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    character: Character;
}

const SwapSpellModal: React.FC<Props> = ({ isOpen, onClose, character }) => {
    const { updateCharacter } = useCharacters();
    const [forgetId, setForgetId] = useState<string | null>(null);
    const [learnName, setLearnName] = useState<string | null>(null);

    // Сброс при закрытии
    useEffect(() => {
        if (!isOpen) {
            setForgetId(null);
            setLearnName(null);
        }
    }, [isOpen]);

    const forgettable = useMemo(
        () => getForgettableSpells(character),
        [character]
    );

    const forgotten = useMemo(
        () => (forgetId ? forgettable.find(s => s.id === forgetId) ?? null : null),
        [forgetId, forgettable]
    );

    const maxLevel = forgotten?.level ?? 0;

    const learnable = useMemo(() => {
        if (!forgotten) return [];
        return getLearnableSpellsForSwap(character, maxLevel);
    }, [character, forgotten, maxLevel]);

    if (!isOpen) return null;

    const canConfirm = !!forgotten && !!learnName;

    const handleConfirm = () => {
        if (!forgotten || !learnName) return;

        const newSpell = learnable.find(s => s.name === learnName);
        if (!newSpell) return;

        const updatedSpells = character.spells
            .filter(s => s.id !== forgotten.id)
            .concat({
                ...newSpell,
                id: `swap-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                prepared: true,
                isCustom: false,
            });

        updateCharacter(character.id, { spells: updatedSpells });
        setForgetId(null);
        setLearnName(null);
        onClose();
    };

    // Группировка
    const groupByLevel = <T extends { level: number; name: string }>(items: T[]) => {
        const map = new Map<number, T[]>();
        for (const s of items) {
            if (!map.has(s.level)) map.set(s.level, []);
            map.get(s.level)!.push(s);
        }
        return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
    };

    const forgetGroups = groupByLevel(forgettable);
    const learnGroups = groupByLevel(learnable);

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="ssm-modal">
            <div className="ssm-body">
                <h3 className="ssm-title">Swap Spell</h3>
                <p className="ssm-subtitle">
                    Replace one spell you know with another spell.
                    The new spell's level cannot exceed the replaced spell's level.
                </p>

                <div className="ssm-columns">
                    {/* Forget column */}
                    <div className="ssm-column">
                        <div className="ssm-column-header">
                            <span className="ssm-column-title">Forget</span>
                            {forgotten && (
                                <span className="ssm-column-selected">
                                    ✓ {forgotten.name}
                                </span>
                            )}
                        </div>
                        <div className="ssm-column-body">
                            {forgetGroups.length === 0 ? (
                                <div className="ssm-empty">
                                    No swappable spells.
                                </div>
                            ) : (
                                forgetGroups.map(([level, spells]) => (
                                    <div key={level} className="ssm-group">
                                        <div className="ssm-group-title">Lv.{level}</div>
                                        {spells.map(s => {
                                            const isSelected = forgetId === s.id;
                                            return (
                                                <button
                                                    key={s.id}
                                                    type="button"
                                                    className={`ssm-row ${isSelected ? 'selected' : ''}`}
                                                    onClick={() => {
                                                        setForgetId(s.id);
                                                        setLearnName(null);
                                                    }}
                                                >
                                                    <span className="ssm-row-name">{s.name}</span>
                                                    <span className="ssm-row-school">{s.school}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Learn column */}
                    <div className="ssm-column">
                        <div className="ssm-column-header">
                            <span className="ssm-column-title">Learn</span>
                            {learnName && (
                                <span className="ssm-column-selected">
                                    ✓ {learnName}
                                </span>
                            )}
                        </div>
                        <div className="ssm-column-body">
                            {!forgotten ? (
                                <div className="ssm-empty">
                                    Select a spell to forget first.
                                </div>
                            ) : learnGroups.length === 0 ? (
                                <div className="ssm-empty">
                                    No eligible spells (Lv.{maxLevel} or lower).
                                </div>
                            ) : (
                                learnGroups.map(([level, spells]) => (
                                    <div key={level} className="ssm-group">
                                        <div className="ssm-group-title">Lv.{level}</div>
                                        {spells.map(s => {
                                            const isSelected = learnName === s.name;
                                            return (
                                                <button
                                                    key={s.name}
                                                    type="button"
                                                    className={`ssm-row ${isSelected ? 'selected' : ''}`}
                                                    onClick={() => setLearnName(s.name)}
                                                >
                                                    <span className="ssm-row-name">{s.name}</span>
                                                    <span className="ssm-row-school">{s.school}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Preview */}
                {forgotten && learnName && (
                    <div className="ssm-preview">
                        <span className="ssm-preview-from">{forgotten.name}</span>
                        <span className="ssm-preview-arrow">→</span>
                        <span className="ssm-preview-to">{learnName}</span>
                    </div>
                )}

                <div className="ssm-actions">
                    <button className="ssm-btn ssm-btn-cancel" onClick={onClose}>
                        Skip
                    </button>
                    <button
                        className="ssm-btn ssm-btn-confirm"
                        onClick={handleConfirm}
                        disabled={!canConfirm}
                    >
                        Confirm Swap
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default SwapSpellModal;