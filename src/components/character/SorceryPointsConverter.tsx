import React from 'react';
import { Character } from '../../types/Character';
import {
    SORCERY_POINT_SLOT_COSTS,
    MAX_CONVERTIBLE_SPELL_LEVEL,
} from '../../constants/classResources';
import { getNonPactSpellSlots, getUsedSpellSlots } from '../../utils/spellcasting';
import './SorceryPointsConverter.css';
import {getClassResourceState} from "../../utils/classResources";

interface Props {
    character: Character;
    onCreateSlot: (level: number) => boolean;
    onConvertToSP: (level: number) => boolean;
}

const ordinal = (n: number): string => {
    if (n === 1) return '1st';
    if (n === 2) return '2nd';
    if (n === 3) return '3rd';
    return `${n}th`;
};

const SorceryPointsConverter: React.FC<Props> = ({
                                                     character,
                                                     onCreateSlot,
                                                     onConvertToSP,
                                                 }) => {
    const spState = getClassResourceState(character, 'sorcery-points');
    if (!spState) return null;

    const totals = getNonPactSpellSlots(character);
    const used = getUsedSpellSlots(character);
    const spAvailable = spState.availableUses;
    const spMax = spState.maxUses;

    const levels = [1, 2, 3, 4, 5];

    return (
        <div className="spc-container">
            <div className="spc-header">
                <span className="spc-title">Sorcery Points Converter</span>
                <span className="spc-sp">
                    {spAvailable} / {spMax} SP
                </span>
            </div>

            {/* Create Spell Slot */}
            <div className="spc-section">
                <div className="spc-section-title">Create Spell Slot (SP → Slot)</div>
                <div className="spc-grid">
                    {levels.map(level => {
                        const cost = SORCERY_POINT_SLOT_COSTS[level];
                        const idx = level - 1;
                        const total = totals[idx] || 0;
                        const usedCount = used[idx] || 0;

                        const canRefresh = usedCount > 0;
                        const canAfford = spAvailable >= cost;
                        const canCreate = total > 0 && canRefresh && canAfford;

                        let reason = '';
                        if (total === 0) reason = `No ${ordinal(level)}-level slots at this level`;
                        else if (!canRefresh) reason = `No expended ${ordinal(level)}-level slot to refresh`;
                        else if (!canAfford) reason = `Need ${cost} SP`;
                        else reason = `Create a ${ordinal(level)}-level slot for ${cost} SP`;

                        return (
                            <button
                                key={`create-${level}`}
                                type="button"
                                className={`spc-btn spc-btn-create ${canCreate ? 'enabled' : 'disabled'}`}
                                disabled={!canCreate}
                                onClick={() => onCreateSlot(level)}
                                title={reason}
                            >
                                <span className="spc-btn-level">Lv.{level}</span>
                                <span className="spc-btn-cost">{cost} SP</span>
                                <span className="spc-btn-hint">
                                    {total > 0 ? `${usedCount}/${total} used` : '—'}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Convert Slot to SP */}
            <div className="spc-section">
                <div className="spc-section-title">Convert Slot to SP (Slot → SP)</div>
                <div className="spc-grid">
                    {levels.map(level => {
                        const idx = level - 1;
                        const total = totals[idx] || 0;
                        const usedCount = used[idx] || 0;
                        const availableSlots = total - usedCount;
                        const gained = level;
                        const wouldExceed = spAvailable + gained > spMax;

                        const canConvert = total > 0 && availableSlots > 0 && !wouldExceed;

                        let reason = '';
                        if (total === 0) reason = `No ${ordinal(level)}-level slots`;
                        else if (availableSlots === 0) reason = `No available ${ordinal(level)}-level slot`;
                        else if (wouldExceed) reason = `Would exceed max Sorcery Points`;
                        else reason = `Convert a ${ordinal(level)}-level slot to ${gained} SP`;

                        return (
                            <button
                                key={`convert-${level}`}
                                type="button"
                                className={`spc-btn spc-btn-convert ${canConvert ? 'enabled' : 'disabled'}`}
                                disabled={!canConvert}
                                onClick={() => onConvertToSP(level)}
                                title={reason}
                            >
                                <span className="spc-btn-level">Lv.{level}</span>
                                <span className="spc-btn-cost">+{gained} SP</span>
                                <span className="spc-btn-hint">
                                    {total > 0 ? `${availableSlots} avail` : '—'}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="spc-footer">
                Slot → SP: level = SP. SP → Slot: 1st = 2, 2nd = 3, 3rd = 5, 4th = 6, 5th = 7. Max spell level for creation: {MAX_CONVERTIBLE_SPELL_LEVEL}.
            </div>
        </div>
    );
};

export default SorceryPointsConverter;