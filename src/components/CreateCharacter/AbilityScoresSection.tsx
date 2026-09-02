import React from 'react';
import { useStatGeneration } from '../../hooks/useStatGeneration';
import Modal from '../../components/Modal';
import DiceRoller from '../../components/DiceRoller';
import { DND_BACKGROUNDS } from '../../constants/backgrounds';

type Abilities = { str: number; dex: number; con: number; int: number; wis: number; cha: number };

interface AbilityScoresSectionProps {
    abilities: Abilities;
    onAbilityChange: (ability: keyof Abilities, value: number) => void;
    statGen: ReturnType<typeof useStatGeneration>;
    raceBonuses: any;
    selectedBonusAttrs: (string | null)[];
    onBonusSelect: (index: number, attr: string) => void;
    subraceBonus: any;
    background: string;
}

const AbilityScoresSection: React.FC<AbilityScoresSectionProps> = ({
                                                                       abilities,
                                                                       onAbilityChange,
                                                                       statGen,
                                                                       raceBonuses,
                                                                       selectedBonusAttrs,
                                                                       onBonusSelect,
                                                                       subraceBonus,
                                                                       background,
                                                                   }) => {
    const getBackgroundAbilityBonuses = (bgName: string): { [key: string]: number } => {
        const bg = DND_BACKGROUNDS.find(b => b.name === bgName);
        return bg?.abilityBonuses || {};
    };

    const bgBonuses = getBackgroundAbilityBonuses(background);

    return (
        <>
            {/* Stat Generation (только в rules) */}
            <div className="cr-stat-generation">
                <label>Stat Generation Methods</label>
                <div className="cr-stat-buttons">
                    <button type="button" className="cr-stat-btn" onClick={statGen.applyStandardArray}>
                        Standard Array
                    </button>
                    <button type="button" className="cr-stat-btn" onClick={statGen.handleRollStats}>
                        Roll 4d6
                    </button>
                    <button type="button" className="cr-stat-btn" onClick={statGen.resetPointBuy}>
                        Point Buy
                    </button>
                </div>
            </div>

            {/* Ability Scores */}
            <div className="cr-form-group">
                <label>Ability Scores</label>
                <div className="cr-ability-grid">
                    {Object.entries(abilities).map(([key, value]) => {
                        const attr = key as keyof Abilities;
                        let bonusDisplay = null;
                        if (raceBonuses) {
                            if (raceBonuses.fixed && raceBonuses.fixed[attr]) {
                                const bonus = raceBonuses.fixed[attr];
                                bonusDisplay = <span className="cr-ability-bonus">+{bonus}</span>;
                            } else if (raceBonuses.choose && selectedBonusAttrs.includes(attr)) {
                                const bonus = raceBonuses.choose.bonus;
                                bonusDisplay = <span className="cr-ability-bonus">+{bonus}</span>;
                            }
                        }
                        if (subraceBonus && subraceBonus[attr]) {
                            const bonus = subraceBonus[attr];
                            if (bonusDisplay) {
                                bonusDisplay = (
                                    <>
                                        {bonusDisplay}
                                        <span className="cr-ability-bonus cr-subrace-bonus">+{bonus}</span>
                                    </>
                                );
                            } else {
                                bonusDisplay = <span className="cr-ability-bonus cr-subrace-bonus">+{bonus}</span>;
                            }
                        }
                        if (bgBonuses[attr]) {
                            const bgBonus = bgBonuses[attr];
                            if (bonusDisplay) {
                                bonusDisplay = (
                                    <>
                                        {bonusDisplay}
                                        <span className="cr-ability-bonus cr-bg-bonus">+{bgBonus}</span>
                                    </>
                                );
                            } else {
                                bonusDisplay = <span className="cr-ability-bonus cr-bg-bonus">+{bgBonus}</span>;
                            }
                        }
                        return (
                            <div key={key} className="cr-ability-input">
                                <label>{key.toUpperCase()}</label>
                                <div className="cr-ability-input-wrapper">
                                    <input
                                        type="number"
                                        value={value}
                                        onChange={(e) => onAbilityChange(attr, Number(e.target.value))}
                                        min="1"
                                        max="30"
                                    />
                                    {bonusDisplay}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="cr-ability-scores-legend">
                    <span><span className="cr-legend-color cr-racial"></span> Racial bonus</span>
                    {subraceBonus && Object.keys(subraceBonus).length > 0 && (
                        <span><span className="cr-legend-color cr-subrace"></span> Subrace bonus</span>
                    )}
                    <span><span className="cr-legend-color cr-background"></span> Background bonus</span>
                </div>
            </div>

            {/* Выбор расовых бонусов (если есть) */}
            {raceBonuses && raceBonuses.choose && (() => {
                const choose = raceBonuses.choose;
                return (
                    <div className="cr-form-group">
                        <label>Assign racial bonuses (choose {choose.count} attributes)</label>
                        <div className="cr-bonus-selectors">
                            {selectedBonusAttrs.map((selectedAttr, index) => (
                                <select
                                    key={index}
                                    value={selectedAttr || ''}
                                    onChange={(e) => onBonusSelect(index, e.target.value)}
                                    className="cr-bonus-select"
                                >
                                    <option value="">Select attribute</option>
                                    {choose.options.map((opt: string) => {
                                        const isSelected = selectedBonusAttrs.includes(opt) && selectedBonusAttrs.indexOf(opt) !== index;
                                        return (
                                            <option key={opt} value={opt} disabled={isSelected}>
                                                {opt.toUpperCase()}
                                            </option>
                                        );
                                    })}
                                </select>
                            ))}
                        </div>
                    </div>
                );
            })()}

            {/* Point Buy Modal */}
            <Modal isOpen={statGen.showPointBuy} onClose={() => statGen.setShowPointBuy(false)}>
                <h3>Point Buy</h3>
                <div className="cr-pointbuy-points">Points remaining: <strong>{statGen.getRemainingPoints()}</strong></div>
                <div className="cr-pointbuy-grid">
                    {Object.entries(statGen.pointBuyValues).map(([stat, value]) => (
                        <div key={stat} className="cr-pointbuy-stat">
                            <span className="cr-pointbuy-stat-label">{stat.toUpperCase()}</span>
                            <div className="cr-pointbuy-controls">
                                <button
                                    type="button"
                                    className="cr-pointbuy-btn"
                                    onClick={() => statGen.handlePointBuyChange(stat as keyof typeof statGen.pointBuyValues, -1)}
                                    disabled={!statGen.canDecrease(stat as keyof typeof statGen.pointBuyValues)}
                                >
                                    −
                                </button>
                                <span className="cr-pointbuy-stat-value">{value}</span>
                                <button
                                    type="button"
                                    className="cr-pointbuy-btn"
                                    onClick={() => statGen.handlePointBuyChange(stat as keyof typeof statGen.pointBuyValues, 1)}
                                    disabled={!statGen.canIncrease(stat as keyof typeof statGen.pointBuyValues)}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="cr-modal-actions">
                    <button type="button" className="cr-modal-btn cr-cancel" onClick={() => statGen.setShowPointBuy(false)}>
                        Cancel
                    </button>
                    <button type="button" className="cr-modal-btn cr-apply" onClick={statGen.applyPointBuy}>
                        Apply
                    </button>
                </div>
            </Modal>

            {/* Roll Distribution Modal */}
            <Modal isOpen={statGen.showRollDistribution} onClose={() => statGen.setShowRollDistribution(false)}>
                <h3>Assign Rolled Stats</h3>
                <div className="cr-roll-distribution">
                    <div className="cr-roll-values">
                        {statGen.rollValues.map((value, idx) => (
                            <DiceRoller
                                key={idx}
                                sides={6}
                                initialResult={value}
                                autoRoll={true}
                                displayOnly={true}
                            />
                        ))}
                    </div>
                    <div className="cr-stat-assignment-grid">
                        {Object.entries(statGen.statAssignments).map(([stat, assignedIndex]) => {
                            const usedIndices = Object.values(statGen.statAssignments).filter(v => v !== null) as number[];
                            const availableIndices = statGen.rollValues.map((_, idx) => idx).filter(idx => !usedIndices.includes(idx) || idx === assignedIndex);
                            return (
                                <div key={stat} className="cr-assign-row">
                                    <span className="cr-assign-stat-label">{stat.toUpperCase()}</span>
                                    <select
                                        value={assignedIndex !== null ? assignedIndex : ''}
                                        onChange={(e) => {
                                            const idx = Number(e.target.value);
                                            if (!isNaN(idx)) statGen.assignRollToStat(stat as keyof typeof statGen.statAssignments, idx);
                                        }}
                                        className="cr-assign-select"
                                    >
                                        <option value="">—</option>
                                        {availableIndices.map(idx => (
                                            <option key={idx} value={idx}>{statGen.rollValues[idx]}</option>
                                        ))}
                                    </select>
                                    {assignedIndex !== null && (
                                        <button type="button" className="cr-unassign-btn" onClick={() => statGen.unassignRoll(stat as keyof typeof statGen.statAssignments)}>✕</button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <div className="cr-modal-actions">
                        <button type="button" className="cr-modal-btn cr-cancel" onClick={() => statGen.setShowRollDistribution(false)}>Cancel</button>
                        <button type="button" className="cr-modal-btn cr-apply" onClick={statGen.applyRollDistribution}>Apply</button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default AbilityScoresSection;