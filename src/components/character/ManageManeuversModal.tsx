import React from 'react';
import Modal from '../Modal';
import { Character } from '../../types/Character';
import {
    getKnownManeuvers,
    getAvailableManeuvers,
    getKnownManeuversLimit,
} from '../../utils/maneuvers';
import { MANEUVERS } from '../../constants/maneuvers';
import { useCharacters } from '../../context/CharacterContext';
import './ManageManeuversModal.css';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    character: Character;
}

const ManageManeuversModal: React.FC<Props> = ({ isOpen, onClose, character }) => {
    const { learnManeuver, forgetManeuver } = useCharacters();
    if (!isOpen) return null;

    const limit = getKnownManeuversLimit(character);
    const known = getKnownManeuvers(character);
    const available = getAvailableManeuvers(character);
    const isFull = known.length >= limit;

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="mmm-modal">
            <div className="mmm-body">
                <h3 className="mmm-title">Maneuvers</h3>
                <p className="mmm-subtitle">
                    Choose your maneuvers. You know <strong>{known.length} / {limit}</strong>.
                </p>

                <div className="mmm-section">
                    <div className="mmm-section-title">Known ({known.length})</div>
                    {known.length === 0 ? (
                        <div className="mmm-empty">None yet.</div>
                    ) : (
                        <div className="mmm-list">
                            {known.map(m => (
                                <div key={m.id} className="mmm-row mmm-row-known">
                                    <div className="mmm-info">
                                        <span className="mmm-name">{m.name}</span>
                                        <span className="mmm-desc">{m.description}</span>
                                    </div>
                                    <button
                                        type="button"
                                        className="mmm-btn mmm-btn-remove"
                                        onClick={() => forgetManeuver(character.id, m.id)}
                                        title="Forget this maneuver"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mmm-section">
                    <div className="mmm-section-title">
                        Available ({available.length}) {isFull && '— limit reached, remove one to add another'}
                    </div>
                    <div className="mmm-list mmm-list-scroll">
                        {available.map(m => (
                            <div key={m.id} className="mmm-row">
                                <div className="mmm-info">
                                    <span className="mmm-name">
                                        {m.name}
                                        <span className="mmm-source">
                                            {m.source === 'TCE' ? 'TCE' : 'PHB'}
                                        </span>
                                    </span>
                                    <span className="mmm-desc">{m.description}</span>
                                </div>
                                <button
                                    type="button"
                                    className="mmm-btn mmm-btn-add"
                                    disabled={isFull}
                                    onClick={() => learnManeuver(character.id, m.id)}
                                    title={isFull ? 'Maneuver limit reached' : 'Learn this maneuver'}
                                >
                                    +
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ManageManeuversModal;