import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Currency } from '../utils/currencyUtils';
import './CurrencyEditModal.css';

interface CurrencyEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    current: Currency;
    onSave: (newCurrency: Currency) => void;
}

const CurrencyEditModal: React.FC<CurrencyEditModalProps> = ({
                                                                 isOpen,
                                                                 onClose,
                                                                 current,
                                                                 onSave,
                                                             }) => {
    const [gp, setGp] = useState(0);
    const [sp, setSp] = useState(0);
    const [cp, setCp] = useState(0);
    const [mode, setMode] = useState<'set' | 'add'>('set');

    useEffect(() => {
        if (isOpen) {
            setGp(current.gp || 0);
            setSp(current.sp || 0);
            setCp(current.cp || 0);
            setMode('set');
        }
    }, [isOpen, current]);

    const handleSave = () => {
        if (mode === 'set') {
            onSave({ gp, sp, cp });
        } else {
            onSave({
                gp: (current.gp || 0) + gp,
                sp: (current.sp || 0) + sp,
                cp: (current.cp || 0) + cp,
            });
        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="cem-body">
                <h3 className="cem-title">Edit Currency</h3>

                <div className="cem-mode-tabs">
                    <button
                        type="button"
                        className={`cem-mode-btn ${mode === 'set' ? 'active' : ''}`}
                        onClick={() => setMode('set')}
                    >
                        Set
                    </button>
                    <button
                        type="button"
                        className={`cem-mode-btn ${mode === 'add' ? 'active' : ''}`}
                        onClick={() => setMode('add')}
                    >
                        Add / Subtract
                    </button>
                </div>

                <div className="cem-current">
                    Current: <strong>{current.gp} gp • {current.sp} sp • {current.cp} cp</strong>
                </div>

                <div className="cem-inputs">
                    <div className="cem-input-group">
                        <label>GP</label>
                        <input
                            type="number"
                            value={gp}
                            min={mode === 'set' ? 0 : -99999}
                            onChange={(e) => setGp(Number(e.target.value))}
                        />
                    </div>
                    <div className="cem-input-group">
                        <label>SP</label>
                        <input
                            type="number"
                            value={sp}
                            min={mode === 'set' ? 0 : -99999}
                            onChange={(e) => setSp(Number(e.target.value))}
                        />
                    </div>
                    <div className="cem-input-group">
                        <label>CP</label>
                        <input
                            type="number"
                            value={cp}
                            min={mode === 'set' ? 0 : -99999}
                            onChange={(e) => setCp(Number(e.target.value))}
                        />
                    </div>
                </div>

                {mode === 'set' && (
                    <div className="cem-preview">
                        New: <strong>{gp} gp • {sp} sp • {cp} cp</strong>
                    </div>
                )}
                {mode === 'add' && (
                    <div className="cem-preview">
                        After: <strong>
                        {Math.max(0, (current.gp || 0) + gp)} gp •{' '}
                        {Math.max(0, (current.sp || 0) + sp)} sp •{' '}
                        {Math.max(0, (current.cp || 0) + cp)} cp
                    </strong>
                    </div>
                )}

                <div className="modal-actions">
                    <button className="modal-btn cancel" onClick={onClose}>Cancel</button>
                    <button className="modal-btn apply" onClick={handleSave}>Save</button>
                </div>
            </div>
        </Modal>
    );
};

export default CurrencyEditModal;