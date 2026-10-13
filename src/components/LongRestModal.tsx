import React, { useMemo } from 'react';
import Modal from './Modal';
import { useCharacters } from '../context/CharacterContext';
import {
    getNonPactSpellSlots,
    getUsedSpellSlots,
    getPactMagicInfo,
} from '../utils/spellcasting';
import {
    getHitDicePools,
    restoreHitDiceOnLongRest,
} from '../utils/hitDice';
import './LongRestModal.css';

interface LongRestModalProps {
    isOpen: boolean;
    onClose: () => void;
    characterId: string;
}

const LongRestModal: React.FC<LongRestModalProps> = ({
                                                         isOpen,
                                                         onClose,
                                                         characterId,
                                                     }) => {
    const { getCharacter, longRest } = useCharacters();
    const character = getCharacter(characterId);

    const summary = useMemo(() => {
        if (!character) return null;

        const hpRestored = Math.max(0, character.maxHp - character.hp);
        const tempHpCleared = character.tempHp || 0;

        const totals = getNonPactSpellSlots(character);
        const used = getUsedSpellSlots(character);
        const spellSlotRestores: { level: number; count: number }[] = [];
        totals.forEach((total, idx) => {
            const u = used[idx] || 0;
            if (u > 0) spellSlotRestores.push({ level: idx + 1, count: u });
        });

        const pactInfo = getPactMagicInfo(character);
        const pactRestores = pactInfo?.used || 0;

        const beforeUsedMap = character.hitDiceUsed || {};
        const afterUsedMap = restoreHitDiceOnLongRest(character);
        const pools = getHitDicePools(character);
        const hitDiceRestores: { sides: number; count: number }[] = [];
        pools.forEach(pool => {
            const before = beforeUsedMap[pool.sides] || 0;
            const after = afterUsedMap[pool.sides] || 0;
            const restored = before - after;
            if (restored > 0) hitDiceRestores.push({ sides: pool.sides, count: restored });
        });

        const deathSavesReset =
            (character.deathSuccesses || 0) > 0 ||
            (character.deathFailures || 0) > 0 ||
            !!character.isStable;

        return {
            hpRestored,
            tempHpCleared,
            spellSlotRestores,
            pactRestores,
            pactLevel: pactInfo?.slotLevel,
            hitDiceRestores,
            deathSavesReset,
        };
    }, [character]);

    if (!character || !summary) return null;

    const handleComplete = () => {
        longRest(characterId);
        onClose();
    };

    const hasAnyChange =
        summary.hpRestored > 0 ||
        summary.tempHpCleared > 0 ||
        summary.spellSlotRestores.length > 0 ||
        summary.pactRestores > 0 ||
        summary.hitDiceRestores.length > 0 ||
        summary.deathSavesReset;

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="lrm-modal">
            <div className="lrm-body">
                <h3 className="lrm-title">Long Rest</h3>
                <p className="lrm-subtitle">
                    Restore HP, spell slots, and half of your hit dice. Resets death saves.
                </p>

                {!hasAnyChange ? (
                    <div className="lrm-empty">You are already fully rested.</div>
                ) : (
                    <div className="lrm-summary">
                        {summary.hpRestored > 0 && (
                            <div className="lrm-row">
                                <span className="lrm-row-label">HP</span>
                                <span className="lrm-row-value lrm-hp">
                                    {character.hp}
                                    <span className="lrm-arrow">→</span>
                                    {character.maxHp}
                                    <span className="lrm-positive"> (+{summary.hpRestored})</span>
                                </span>
                            </div>
                        )}

                        {summary.tempHpCleared > 0 && (
                            <div className="lrm-row">
                                <span className="lrm-row-label">Temp HP</span>
                                <span className="lrm-row-value lrm-neutral">
                                    {summary.tempHpCleared}
                                    <span className="lrm-arrow">→</span>
                                    0
                                </span>
                            </div>
                        )}

                        {summary.spellSlotRestores.length > 0 && (
                            <div className="lrm-row">
                                <span className="lrm-row-label">Spell Slots</span>
                                <span className="lrm-row-value">
                                    {summary.spellSlotRestores.map(r => (
                                        <span key={r.level} className="lrm-chip lrm-chip-slot">
                                            Lv.{r.level} +{r.count}
                                        </span>
                                    ))}
                                </span>
                            </div>
                        )}

                        {summary.pactRestores > 0 && summary.pactLevel && (
                            <div className="lrm-row">
                                <span className="lrm-row-label">Pact Slots</span>
                                <span className="lrm-row-value">
                                    <span className="lrm-chip lrm-chip-pact">
                                        Lv.{summary.pactLevel} +{summary.pactRestores}
                                    </span>
                                </span>
                            </div>
                        )}

                        {summary.hitDiceRestores.length > 0 && (
                            <div className="lrm-row">
                                <span className="lrm-row-label">Hit Dice</span>
                                <span className="lrm-row-value">
                                    {summary.hitDiceRestores.map(r => (
                                        <span key={r.sides} className="lrm-chip lrm-chip-hd">
                                            d{r.sides} +{r.count}
                                        </span>
                                    ))}
                                </span>
                            </div>
                        )}

                        {summary.deathSavesReset && (
                            <div className="lrm-row">
                                <span className="lrm-row-label">Death Saves</span>
                                <span className="lrm-row-value lrm-positive">Reset</span>
                            </div>
                        )}
                    </div>
                )}

                <div className="lrm-actions">
                    <button className="lrm-btn lrm-btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="lrm-btn lrm-btn-primary" onClick={handleComplete}>
                        Complete Long Rest
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default LongRestModal;