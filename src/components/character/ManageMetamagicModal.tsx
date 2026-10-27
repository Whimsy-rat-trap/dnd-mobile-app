import React from 'react';
import Modal from '../Modal';
import { Character } from '../../types/Character';
import {
    getKnownMetamagic,
    getAvailableMetamagic,
    getKnownMetamagicLimit,
    getMetamagicSpCost,
} from '../../utils/metamagic';
import { useCharacters } from '../../context/CharacterContext';
import './ManageMetamagicModal.css';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    character: Character;
}

const ManageMetamagicModal: React.FC<Props> = ({ isOpen, onClose, character }) => {
    const { learnMetamagic, forgetMetamagic } = useCharacters();
    if (!isOpen) return null;

    const limit = getKnownMetamagicLimit(character);
    const known = getKnownMetamagic(character);
    const available = getAvailableMetamagic(character);
    const isFull = known.length >= limit;

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="mmg-modal">
            <div className="mmg-body">
                <h3 className="mmg-title">Metamagic</h3>
                <p className="mmg-subtitle">
                    Choose your Metamagic. You know <strong>{known.length} / {limit}</strong>.
                </p>

                <div className="mmg-section">
                    <div className="mmg-section-title">Known ({known.length})</div>
                    {known.length === 0 ? (
                        <div className="mmg-empty">None yet.</div>
                    ) : (
                        <div className="mmg-list">
                            {known.map(m => {
                                const cost = getMetamagicSpCost(m);
                                const costLabel = m.cost.type === 'spell-level'
                                    ? '= spell level SP'
                                    : `${cost} SP`;
                                return (
                                    <div key={m.id} className="mmg-row mmg-row-known">
                                        <div className="mmg-info">
                                            <span className="mmg-name">
                                                {m.name}
                                                <span className="mmg-cost">{costLabel}</span>
                                            </span>
                                            <span className="mmg-desc">{m.description}</span>
                                        </div>
                                        <button
                                            type="button"
                                            className="mmg-btn mmg-btn-remove"
                                            onClick={() => forgetMetamagic(character.id, m.id)}
                                            title="Forget this Metamagic"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="mmg-section">
                    <div className="mmg-section-title">
                        Available ({available.length})
                        {isFull && ' — limit reached, remove one to add another'}
                    </div>
                    <div className="mmg-list mmg-list-scroll">
                        {available.map(m => {
                            const cost = getMetamagicSpCost(m);
                            const costLabel = m.cost.type === 'spell-level'
                                ? '= spell level SP'
                                : `${cost} SP`;
                            return (
                                <div key={m.id} className="mmg-row">
                                    <div className="mmg-info">
                                        <span className="mmg-name">
                                            {m.name}
                                            <span className="mmg-cost">{costLabel}</span>
                                            <span className="mmg-source">
                                                {m.source === 'TCE' ? 'TCE' : 'PHB'}
                                            </span>
                                        </span>
                                        <span className="mmg-desc">{m.description}</span>
                                    </div>
                                    <button
                                        type="button"
                                        className="mmg-btn mmg-btn-add"
                                        disabled={isFull}
                                        onClick={() => learnMetamagic(character.id, m.id)}
                                        title={isFull ? 'Metamagic limit reached' : 'Learn this option'}
                                    >
                                        +
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ManageMetamagicModal;