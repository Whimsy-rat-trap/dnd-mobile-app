import React, { useState } from 'react';
import Modal from '../Modal';
import { Character } from '../../types/Character';
import { PartialRecoveryFeature } from '../../constants/partialRecovery';
import { getPartialRecoveryBudget } from '../../utils/partialRecovery';
import { getNonPactSpellSlots, getUsedSpellSlots } from '../../utils/spellcasting';
import { getClassLevelFor } from '../../utils/classResources';
import './PartialRecoveryModal.css';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    character: Character;
    feature: PartialRecoveryFeature | null;
    onSubmit: (payload: Array<{ level: number; count: number }>) => boolean;
}

const PartialRecoveryModal: React.FC<Props> = ({
                                                   isOpen,
                                                   onClose,
                                                   character,
                                                   feature,
                                                   onSubmit,
                                               }) => {
    const [picks, setPicks] = useState<Record<number, number>>({});

    if (!isOpen || !feature || feature.target.type !== 'spell-slots') return null;

    const classLevel = getClassLevelFor(character, feature.className);
    const budget = getPartialRecoveryBudget(character, feature.target, feature.className);
    const maxLevel = feature.target.maxSlotLevel;

    const totals = getNonPactSpellSlots(character);
    const used = getUsedSpellSlots(character);

    const getPicked = (level: number): number => picks[level] || 0;
    const getAvailable = (level: number): number => {
        const idx = level - 1;
        return Math.max(0, (used[idx] || 0) - getPicked(level));
    };

    const totalBudgetUsed = Object.entries(picks).reduce(
        (sum, [lvl, count]) => sum + Number(lvl) * count,
        0
    );
    const canSubmit = totalBudgetUsed > 0 && totalBudgetUsed <= budget;

    const handleInc = (level: number) => {
        if (getAvailable(level) <= 0) return;
        if (totalBudgetUsed + level > budget) return;
        setPicks(prev => ({ ...prev, [level]: (prev[level] || 0) + 1 }));
    };

    const handleDec = (level: number) => {
        if (getPicked(level) <= 0) return;
        setPicks(prev => ({
            ...prev,
            [level]: Math.max(0, (prev[level] || 0) - 1),
        }));
    };

    const handleSubmit = () => {
        const payload = Object.entries(picks)
            .filter(([, count]) => count > 0)
            .map(([lvl, count]) => ({ level: Number(lvl), count }));
        if (onSubmit(payload)) {
            setPicks({});
            onClose();
        }
    };

    const handleCancel = () => {
        setPicks({});
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleCancel} className="prm-modal">
            <div className="prm-body">
                <h3 className="prm-title">{feature.name}</h3>
                <p className="prm-subtitle">{feature.description}</p>

                <div className="prm-budget">
                    <span className="prm-budget-label">Budget</span>
                    <span className="prm-budget-value">
                        {totalBudgetUsed} / {budget} levels
                    </span>
                </div>

                <div className="prm-list">
                    {Array.from({ length: maxLevel }, (_, i) => i + 1).map(level => {
                        const idx = level - 1;
                        const total = totals[idx] || 0;
                        const usedCount = used[idx] || 0;
                        if (total === 0) return null;

                        const picked = getPicked(level);
                        const available = getAvailable(level);
                        const canInc = available > 0 && totalBudgetUsed + level <= budget;

                        return (
                            <div key={level} className="prm-row">
                                <span className="prm-level">Lv.{level}</span>
                                <span className="prm-info">
                                    {usedCount} used / {total} total
                                </span>
                                <div className="prm-actions">
                                    <button
                                        type="button"
                                        className="prm-btn"
                                        onClick={() => handleDec(level)}
                                        disabled={picked <= 0}
                                    >
                                        −
                                    </button>
                                    <span className="prm-picked">{picked}</span>
                                    <button
                                        type="button"
                                        className="prm-btn"
                                        onClick={() => handleInc(level)}
                                        disabled={!canInc}
                                        title={!canInc
                                            ? available <= 0
                                                ? 'No expended slots of this level'
                                                : `Would exceed budget (${level} levels)`
                                            : `Recover 1 slot (${level} levels)`}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="prm-footer">
                    <button className="prm-btn-cancel" onClick={handleCancel}>
                        Cancel
                    </button>
                    <button
                        className="prm-btn-confirm"
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                    >
                        Recover
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default PartialRecoveryModal;