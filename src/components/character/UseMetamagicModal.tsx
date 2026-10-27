import React, { useState } from 'react';
import Modal from '../Modal';
import {
    metamagicNeedsSpellLevel,
    getMetamagicSpCost,
} from '../../utils/metamagic';
import { getMetamagicById } from '../../constants/metamagic';
import './UseMetamagicModal.css';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    metamagicId: string | null;
    onConfirm: (spCost: number) => boolean;
}

const UseMetamagicModal: React.FC<Props> = ({
                                                isOpen,
                                                onClose,
                                                metamagicId,
                                                onConfirm,
                                            }) => {
    const [spellLevel, setSpellLevel] = useState<number>(1);

    const metamagic = metamagicId ? getMetamagicById(metamagicId) : null;
    if (!isOpen || !metamagic) return null;

    const needsLevel = metamagicNeedsSpellLevel(metamagic);
    const spCost = needsLevel
        ? getMetamagicSpCost(metamagic, spellLevel)
        : getMetamagicSpCost(metamagic);

    const handleConfirm = () => {
        if (onConfirm(spCost)) {
            setSpellLevel(1);
            onClose();
        }
    };

    const handleClose = () => {
        setSpellLevel(1);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} className="umg-modal">
            <div className="umg-body">
                <h3 className="umg-title">{metamagic.name}</h3>
                <p className="umg-desc">{metamagic.description}</p>

                {needsLevel && (
                    <div className="umg-level-block">
                        <span className="umg-level-label">Spell level</span>
                        <div className="umg-level-grid">
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(lvl => (
                                <button
                                    key={lvl}
                                    type="button"
                                    className={`umg-level-btn ${spellLevel === lvl ? 'active' : ''}`}
                                    onClick={() => setSpellLevel(lvl)}
                                    title={lvl === 0 ? 'Cantrip (1 SP)' : `Level ${lvl}`}
                                >
                                    {lvl === 0 ? 'C' : lvl}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="umg-cost-block">
                    <span className="umg-cost-label">Cost</span>
                    <span className="umg-cost-value">{spCost} SP</span>
                </div>

                <div className="umg-actions">
                    <button className="umg-btn umg-btn-cancel" onClick={handleClose}>
                        Cancel
                    </button>
                    <button className="umg-btn umg-btn-confirm" onClick={handleConfirm}>
                        Spend {spCost} SP
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default UseMetamagicModal;