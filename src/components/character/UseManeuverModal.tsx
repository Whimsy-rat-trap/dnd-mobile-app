import React, { useState } from 'react';
import Modal from '../Modal';
import { Character } from '../../types/Character';
import { getManeuverById, Maneuver } from '../../constants/maneuvers';
import './UseManeuverModal.css';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    character: Character;
    maneuverId: string | null;
    dieSize: number;
    saveDC: number;
    onUse: () => boolean;
}

const getAddsToLabel = (addsTo: Maneuver['addsTo']): string => {
    switch (addsTo) {
        case 'attack': return 'attack roll';
        case 'damage': return 'damage roll';
        case 'ac': return 'AC';
        case 'check': return 'ability check';
        case 'temp-hp': return 'temporary HP';
        case 'damage-reduction': return 'damage reduction';
        case 'none': return 'effect';
    }
};

const UseManeuverModal: React.FC<Props> = ({
                                               isOpen,
                                               onClose,
                                               character,
                                               maneuverId,
                                               dieSize,
                                               saveDC,
                                               onUse,
                                           }) => {
    const [rolled, setRolled] = useState<number | null>(null);
    const [used, setUsed] = useState(false);

    const maneuver = maneuverId ? getManeuverById(maneuverId) : null;
    if (!isOpen || !maneuver) return null;

    const needsRoll = maneuver.addsTo !== 'none';

    const handleRoll = () => {
        if (rolled !== null) return;
        setRolled(Math.floor(Math.random() * dieSize) + 1);
    };

    const handleUse = () => {
        if (used) return;
        const ok = onUse();
        if (!ok) return;
        setUsed(true);
        setRolled(null);
        onClose();
    };

    const handleClose = () => {
        setRolled(null);
        setUsed(false);
        onClose();
    };

    const chaMod = Math.floor((character.abilities.cha - 10) / 2);
    const dexMod = Math.floor((character.abilities.dex - 10) / 2);

    return (
        <Modal isOpen={isOpen} onClose={handleClose} className="umm-modal">
            <div className="umm-body">
                <h3 className="umm-title">{maneuver.name}</h3>
                <p className="umm-desc">{maneuver.description}</p>

                {needsRoll && (
                    <div className="umm-roll-block">
                        <span className="umm-roll-label">
                            Add to {getAddsToLabel(maneuver.addsTo)}
                        </span>
                        {rolled === null ? (
                            <button
                                type="button"
                                className="umm-roll-btn"
                                onClick={handleRoll}
                            >
                                Roll d{dieSize}
                            </button>
                        ) : (
                            <span className="umm-roll-result">
                                d{dieSize} → <strong>{rolled}</strong>
                                {maneuver.addsTo === 'temp-hp' && chaMod !== 0 && (
                                    <span className="umm-bonus">
                                        {' '}+ CHA {chaMod >= 0 ? '+' : ''}{chaMod} = {Math.max(1, rolled + chaMod)}
                                    </span>
                                )}
                                {maneuver.addsTo === 'damage-reduction' && dexMod !== 0 && (
                                    <span className="umm-bonus">
                                        {' '}+ DEX {dexMod >= 0 ? '+' : ''}{dexMod} = {Math.max(0, rolled + dexMod)}
                                    </span>
                                )}
                            </span>
                        )}
                    </div>
                )}

                {maneuver.save && (
                    <div className="umm-save-block">
                        <span className="umm-save-label">
                            DC {saveDC} {maneuver.save.ability.toUpperCase()} save
                        </span>
                        <span className="umm-save-effect">{maneuver.save.effect}</span>
                    </div>
                )}

                <div className="umm-actions">
                    <button className="umm-btn umm-btn-cancel" onClick={handleClose}>
                        Cancel
                    </button>
                    <button
                        className="umm-btn umm-btn-use"
                        onClick={handleUse}
                        disabled={used}
                    >
                        Use Maneuver (spend 1 die)
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default UseManeuverModal;