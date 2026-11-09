import React, { useState, useEffect, useMemo } from 'react';
import Modal from '../Modal';
import { Character } from '../../types/Character';
import { useCharacters } from '../../context/CharacterContext';
import { getPreparableSpellsData } from '../../utils/spellPreparation';
import './PrepareSpellsModal.css';
import { groupByLevel } from '../../utils/arrayHelpers';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    character: Character;
}

const PrepareSpellsModal: React.FC<Props> = ({ isOpen, onClose, character }) => {
    const { updateCharacter } = useCharacters();
    const data = useMemo(() => getPreparableSpellsData(character), [character]);

    const [selected, setSelected] = useState<Set<string>>(new Set());

    // Инициализация при открытии
    useEffect(() => {
        if (isOpen) {
            setSelected(new Set(data.spells.filter((s) => s.prepared).map((s) => s.id)));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    if (!isOpen) return null;

    const handleToggle = (id: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                if (next.size >= data.maxPrepared) return prev;
                next.add(id);
            }
            return next;
        });
    };

    const handleSelectAll = () => {
        const allIds = data.spells.slice(0, data.maxPrepared).map((s) => s.id);
        setSelected(new Set(allIds));
    };

    const handleClearAll = () => {
        setSelected(new Set());
    };

    const handleConfirm = () => {
        const newSpells = character.spells.map((s) => {
            // Always-prepared и racial — не трогаем
            if (s.isAlwaysPrepared || s.isRacial) return s;
            // Cantrips — не трогаем (они не считаются, но их состояние не важно)
            if (s.level === 0) return s;
            // Выше max castable — принудительно false
            if (s.level > data.maxCastableLevel) return { ...s, prepared: false };
            // Обычные — по выбору
            return { ...s, prepared: selected.has(s.id) };
        });
        updateCharacter(character.id, { spells: newSpells });
        onClose();
    };

    // Группируем preparable по уровню
    const grouped = groupByLevel(data.spells);
    const levels = Array.from(grouped.keys());

    const total = selected.size;
    const isOverLimit = total > data.maxPrepared;

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="psm-modal">
            <div className="psm-body">
                <h3 className="psm-title">Prepare Spells</h3>
                <p className="psm-subtitle">
                    Choose which spells you have prepared for the day.
                    {data.maxCastableLevel > 0 && (
                        <span className="psm-subtitle-hint">
                            {' '}
                            · up to Lv.{data.maxCastableLevel}
                        </span>
                    )}
                </p>

                <div className="psm-counter">
                    <span className="psm-counter-label">Prepared</span>
                    <span className={`psm-counter-value ${isOverLimit ? 'over' : ''}`}>
                        {total} / {data.maxPrepared}
                    </span>
                </div>

                {data.alwaysPrepared.length > 0 && (
                    <div className="psm-section">
                        <div className="psm-section-title">
                            Always Prepared
                            <span className="psm-section-hint"> — not counted toward limit</span>
                        </div>
                        <div className="psm-always-list">
                            {data.alwaysPrepared.map((s) => (
                                <span key={s.id} className="psm-always-chip">
                                    {s.name}
                                    <span className="psm-always-level">Lv.{s.level}</span>
                                    {s.isRacial && <span className="psm-always-tag">racial</span>}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {data.spells.length === 0 ? (
                    <div className="psm-empty">No spells in your spellbook to prepare.</div>
                ) : (
                    <>
                        <div className="psm-toolbar">
                            <button
                                type="button"
                                className="psm-toolbar-btn"
                                onClick={handleSelectAll}
                                disabled={total >= data.maxPrepared}
                            >
                                Select max
                            </button>
                            <button
                                type="button"
                                className="psm-toolbar-btn"
                                onClick={handleClearAll}
                                disabled={total === 0}
                            >
                                Clear all
                            </button>
                        </div>

                        <div className="psm-levels">
                            {levels.map((level) => (
                                <div key={level} className="psm-section">
                                    <div className="psm-section-title">Level {level}</div>
                                    <div className="psm-list">
                                        {grouped.get(level)!.map((s) => {
                                            const isSelected = selected.has(s.id);
                                            const canAdd = isSelected || total < data.maxPrepared;
                                            return (
                                                <label
                                                    key={s.id}
                                                    className={`psm-row ${isSelected ? 'selected' : ''} ${!canAdd ? 'disabled' : ''}`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        disabled={!canAdd}
                                                        onChange={() => handleToggle(s.id)}
                                                    />
                                                    <span className="psm-spell-name">{s.name}</span>
                                                    <span className="psm-spell-school">
                                                        {s.school}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                <div className="psm-actions">
                    <button className="psm-btn psm-btn-cancel" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="psm-btn psm-btn-confirm"
                        onClick={handleConfirm}
                        disabled={isOverLimit}
                    >
                        Confirm ({total})
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default PrepareSpellsModal;
