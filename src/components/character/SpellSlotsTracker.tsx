import React from 'react';
import { Character } from '../../types/Character';
import {
    getNonPactSpellSlots,
    getUsedSpellSlots,
    getPactMagicInfo,
} from '../../utils/spellcasting';
import './SpellSlotsTracker.css';

interface SpellSlotsTrackerProps {
    character: Character;
    onUseSlot: (level: number) => void;
    onRestoreSlot: (level: number) => void;
    onUsePact: () => void;
    onRestorePact: () => void;
}

const SpellSlotsTracker: React.FC<SpellSlotsTrackerProps> = ({
                                                                 character,
                                                                 onUseSlot,
                                                                 onRestoreSlot,
                                                                 onUsePact,
                                                                 onRestorePact,
                                                             }) => {
    const totals = getNonPactSpellSlots(character);
    const used = getUsedSpellSlots(character);
    const pactInfo = getPactMagicInfo(character);

    const hasRegular = totals.some(n => n > 0);
    const hasAny = hasRegular || !!pactInfo;

    if (!hasAny) return null;

    return (
        <div className="sst-container">
            <div className="sst-header">Spell Slots</div>
            <div className="sst-list">
                {totals.map((total, idx) => {
                    if (total === 0) return null;
                    const usedCount = used[idx] || 0;
                    const available = total - usedCount;

                    return (
                        <div key={idx} className="sst-row">
                            <span className="sst-label">Lv.{idx + 1}</span>
                            <div className="sst-dots">
                                {Array.from({ length: total }, (_, i) => {
                                    const isAvailable = i < available;
                                    return (
                                        <button
                                            key={i}
                                            type="button"
                                            className={`sst-dot ${isAvailable ? 'available' : 'used'}`}
                                            onClick={() =>
                                                isAvailable
                                                    ? onUseSlot(idx + 1)
                                                    : onRestoreSlot(idx + 1)
                                            }
                                            title={isAvailable ? 'Use slot' : 'Restore slot'}
                                            aria-label={isAvailable ? 'Use slot' : 'Restore slot'}
                                        />
                                    );
                                })}
                            </div>
                            <span className="sst-count">
                                {available}/{total}
                            </span>
                        </div>
                    );
                })}

                {pactInfo && (
                    <div className="sst-row sst-row-pact">
                        <span className="sst-label">Pact Lv.{pactInfo.slotLevel}</span>
                        <div className="sst-dots">
                            {Array.from({ length: pactInfo.total }, (_, i) => {
                                const isAvailable = i < pactInfo.available;
                                return (
                                    <button
                                        key={i}
                                        type="button"
                                        className={`sst-dot pact ${isAvailable ? 'available' : 'used'}`}
                                        onClick={() =>
                                            isAvailable ? onUsePact() : onRestorePact()
                                        }
                                        title={isAvailable ? 'Use pact slot' : 'Restore pact slot'}
                                    />
                                );
                            })}
                        </div>
                        <span className="sst-count">
                            {pactInfo.available}/{pactInfo.total}
                        </span>
                    </div>
                )}
            </div>
            <div className="sst-hint">Click a filled dot to use, an empty dot to restore</div>
        </div>
    );
};

export default SpellSlotsTracker;