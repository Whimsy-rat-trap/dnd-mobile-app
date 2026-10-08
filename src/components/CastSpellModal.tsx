import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Spell } from '../types/Character';
import {
    getNonPactSpellSlots,
    getUsedSpellSlots,
    getPactMagicInfo,
} from '../utils/spellcasting';
import { Character } from '../types/Character';
import './CastSpellModal.css';

interface CastSpellModalProps {
    isOpen: boolean;
    onClose: () => void;
    spell: Spell | null;
    character: Character;
    onCast: (level: number, options: { usePact: boolean; asRitual: boolean }) => void;
}

const CastSpellModal: React.FC<CastSpellModalProps> = ({
                                                           isOpen,
                                                           onClose,
                                                           spell,
                                                           character,
                                                           onCast,
                                                       }) => {
    const [selectedLevel, setSelectedLevel] = useState<number>(1);
    const [asRitual, setAsRitual] = useState<boolean>(false);

    useEffect(() => {
        if (isOpen && spell) {
            setSelectedLevel(Math.max(1, spell.level));
            setAsRitual(false);
        }
    }, [isOpen, spell]);

    if (!isOpen || !spell) return null;

    const totals = getNonPactSpellSlots(character);
    const used = getUsedSpellSlots(character);
    const pactInfo = getPactMagicInfo(character);

    const isCantrip = spell.level === 0;
    const canBeRitual = Boolean(spell.isRitual);
    const canCastAsRitual = canBeRitual && !isCantrip;

    // Уровни, на которых можно кастовать:
    // - Базовый уровень заклинания
    // - Все уровни выше, где есть доступные слоты
    const availableLevels: number[] = [];
    if (!isCantrip && !asRitual) {
        for (let lvl = spell.level; lvl <= 9; lvl++) {
            const idx = lvl - 1;
            const totalSlots = totals[idx] || 0;
            const usedSlots = used[idx] || 0;
            if (totalSlots > 0 && totalSlots - usedSlots > 0) {
                availableLevels.push(lvl);
            }
        }
    }

    // Pact Magic:
    // - Уровень всегда = slotLevel warlock'а (нельзя выбрать)
    // - Нельзя кастовать ниже уровня pact slot
    const pactLevel = pactInfo?.slotLevel ?? 0;
    const canUsePact =
        !isCantrip &&
        !asRitual &&
        pactInfo !== null &&
        pactInfo!.available > 0 &&
        spell.level <= pactLevel;

    // Итоговые варианты каста
    const canCast = isCantrip || asRitual || availableLevels.length > 0 || canUsePact;

    const handleCast = () => {
        if (isCantrip) {
            onCast(0, { usePact: false, asRitual: false });
            onClose();
            return;
        }
        if (asRitual) {
            onCast(spell.level, { usePact: false, asRitual: true });
            onClose();
            return;
        }
        // Если доступны обычные слоты — используем их; иначе Pact
        if (availableLevels.length > 0) {
            onCast(selectedLevel, { usePact: false, asRitual: false });
            onClose();
            return;
        }
        if (canUsePact) {
            onCast(pactLevel, { usePact: true, asRitual: false });
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="csm-body">
                <h3 className="csm-title">
                    Cast: {spell.name}
                </h3>

                <div className="csm-meta">
                    <span className="csm-tag">
                        {spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`}
                    </span>
                    <span className="csm-tag">{spell.school}</span>
                    {spell.requiresConcentration && (
                        <span className="csm-tag csm-tag-conc">Concentration</span>
                    )}
                </div>

                {/* Cantrip */}
                {isCantrip && (
                    <div className="csm-hint csm-hint-info">
                        Cantrips can be cast at will and do not consume spell slots.
                    </div>
                )}

                {/* Ritual */}
                {canCastAsRitual && (
                    <label className="csm-ritual-toggle">
                        <input
                            type="checkbox"
                            checked={asRitual}
                            onChange={(e) => setAsRitual(e.target.checked)}
                        />
                        <span>Cast as ritual (doesn't consume a spell slot, takes +10 minutes)</span>
                    </label>
                )}

                {/* Slot level selection */}
                {!isCantrip && !asRitual && (
                    <>
                        {availableLevels.length > 0 && (
                            <div className="csm-section">
                                <div className="csm-label">Cast at level</div>
                                <div className="csm-levels">
                                    {availableLevels.map(lvl => {
                                        const idx = lvl - 1;
                                        const total = totals[idx] || 0;
                                        const usedCount = used[idx] || 0;
                                        const avail = total - usedCount;
                                        const isActive = selectedLevel === lvl;
                                        return (
                                            <button
                                                key={lvl}
                                                type="button"
                                                className={`csm-level-btn ${isActive ? 'active' : ''}`}
                                                onClick={() => setSelectedLevel(lvl)}
                                            >
                                                <span className="csm-level-num">
                                                    {lvl === spell.level ? `Lv.${lvl}` : `Lv.${lvl} (upcast)`}
                                                </span>
                                                <span className="csm-level-slots">
                                                    {avail}/{total}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {availableLevels.length === 0 && canUsePact && (
                            <div className="csm-section">
                                <div className="csm-label">Pact Magic</div>
                                <div className="csm-hint csm-hint-pact">
                                    Cast using a Pact slot (level {pactLevel}).
                                    Available: {pactInfo!.available}/{pactInfo!.total}.
                                </div>
                            </div>
                        )}

                        {availableLevels.length === 0 && !canUsePact && (
                            <div className="csm-hint csm-hint-error">
                                No spell slots available. Take a rest to recover slots.
                            </div>
                        )}
                    </>
                )}

                <div className="csm-actions">
                    <button className="csm-btn csm-btn-cancel" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="csm-btn csm-btn-cast"
                        onClick={handleCast}
                        disabled={!canCast}
                    >
                        Cast
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default CastSpellModal;