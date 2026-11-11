import React, { useState } from 'react';
import { Character } from '../../types/Character';
import { CONDITIONS, getConditionById } from '../../constants/conditions';
import { getConditionEffects } from '../../utils/conditions';
import { useCharacters } from '../../context/CharacterContext';
import Modal from '../Modal';
import './ConditionsTracker.css';

interface Props {
    character: Character;
}

const ConditionsTracker: React.FC<Props> = ({ character }) => {
    const { addCondition, removeCondition, setExhaustionLevel } = useCharacters();
    const [pickerOpen, setPickerOpen] = useState(false);

    const effects = getConditionEffects(character);
    const active = effects.active;
    const available = CONDITIONS.filter((c) => !active.some((a) => a.conditionId === c.id));

    const hasWarnings =
        effects.attackDisadvantageSources.length > 0 ||
        effects.checkDisadvantageSources.length > 0 ||
        effects.incapacitated ||
        effects.speedZero;

    return (
        <div className="cond-container">
            <div className="cond-header">
                <span className="cond-title">Conditions</span>
                <button
                    type="button"
                    className="cond-add-btn"
                    onClick={() => setPickerOpen(true)}
                    disabled={available.length === 0}
                    title={
                        available.length === 0 ? 'All conditions already active' : 'Add condition'
                    }
                >
                    + Add
                </button>
            </div>

            {active.length === 0 ? (
                <div className="cond-empty">No active conditions.</div>
            ) : (
                <div className="cond-chips">
                    {active.map((c) => {
                        const def = getConditionById(c.conditionId);
                        if (!def) return null;
                        return (
                            <div
                                key={c.conditionId}
                                className="cond-chip"
                                style={{ borderColor: def.color, color: def.color }}
                                title={def.effects.join(' · ')}
                            >
                                <span className="cond-chip-name">{def.name}</span>
                                {c.source && (
                                    <span className="cond-chip-source"> ({c.source})</span>
                                )}
                                <button
                                    type="button"
                                    className="cond-chip-remove"
                                    onClick={() => removeCondition(character.id, c.conditionId)}
                                    aria-label={`Remove ${def.name}`}
                                >
                                    ×
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {hasWarnings && (
                <div className="cond-summary">
                    {effects.attackDisadvantageSources.length > 0 && (
                        <div className="cond-summary-line">
                            ⚠ Disadvantage on attacks —{' '}
                            {effects.attackDisadvantageSources.join(', ')}
                        </div>
                    )}
                    {effects.checkDisadvantageSources.length > 0 && (
                        <div className="cond-summary-line">
                            ⚠ Disadvantage on checks — {effects.checkDisadvantageSources.join(', ')}
                        </div>
                    )}
                    {effects.incapacitated && (
                        <div className="cond-summary-line">
                            ⚠ Incapacitated — no actions or reactions
                        </div>
                    )}
                    {effects.speedZero && <div className="cond-summary-line">⚠ Speed is 0</div>}
                </div>
            )}

            <div className="cond-exhaustion">
                <div className="cond-exhaustion-header">
                    <span className="cond-exhaustion-title">Exhaustion</span>
                    <div className="cond-exhaustion-controls">
                        <button
                            type="button"
                            className="cond-exhaustion-btn"
                            onClick={() =>
                                setExhaustionLevel(character.id, effects.exhaustionLevel - 1)
                            }
                            disabled={effects.exhaustionLevel <= 0}
                            aria-label="Decrease exhaustion"
                        >
                            −
                        </button>
                        <span className="cond-exhaustion-value">{effects.exhaustionLevel}</span>
                        <button
                            type="button"
                            className="cond-exhaustion-btn"
                            onClick={() =>
                                setExhaustionLevel(character.id, effects.exhaustionLevel + 1)
                            }
                            disabled={effects.exhaustionLevel >= 6}
                            aria-label="Increase exhaustion"
                        >
                            +
                        </button>
                    </div>
                </div>
                {effects.exhaustionLevel > 0 && (
                    <ul className="cond-exhaustion-effects">
                        {effects.exhaustionEffects.map((effect, i) => (
                            <li key={i}>{effect}</li>
                        ))}
                    </ul>
                )}
            </div>

            <Modal isOpen={pickerOpen} onClose={() => setPickerOpen(false)}>
                <div className="cond-picker">
                    <h3 className="cond-picker-title">Add Condition</h3>
                    {available.length === 0 ? (
                        <div className="cond-picker-empty">All conditions are active.</div>
                    ) : (
                        <div className="cond-picker-list">
                            {available.map((c) => (
                                <button
                                    key={c.id}
                                    type="button"
                                    className="cond-picker-item"
                                    onClick={() => {
                                        addCondition(character.id, c.id);
                                        setPickerOpen(false);
                                    }}
                                >
                                    <span className="cond-picker-name" style={{ color: c.color }}>
                                        {c.name}
                                    </span>
                                    <span className="cond-picker-desc">{c.effects[0]}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default ConditionsTracker;
