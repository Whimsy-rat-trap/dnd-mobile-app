import React, { useState } from 'react';
import Modal from '../Modal';
import './HpEditPopup.css';
import './HpEditPopup.css';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    hp: number;
    maxHp: number;
    tempHp: number;
    onAddHp: (amount: number) => void;
    onSubtractHp: (amount: number) => void;
    onAddTempHp: (amount: number) => void;
    onSubtractTempHp: (amount: number) => void;
}

const HpEditPopup: React.FC<Props> = ({
                                          isOpen, onClose, hp, maxHp, tempHp,
                                          onAddHp, onSubtractHp, onAddTempHp, onSubtractTempHp,
                                      }) => {
    const [hpInput, setHpInput] = useState(0);
    const [tempInput, setTempInput] = useState(0);
    const hpPercent = (hp / maxHp) * 100;
    const tempPercent = (tempHp / maxHp) * 100;

    const close = () => {
        setHpInput(0);
        setTempInput(0);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={close}>
            <div className="cc-popup-body">
                <h3 className="cc-popup-title">Edit HP</h3>
                <div className="cc-popup-stat-block">
                    <span className="cc-stat-label">HP</span>
                    <div className="cc-stat-progress">
                        <div className="cc-progress-track">
                            <div className="cc-hp-fill" style={{ width: `${hpPercent}%` }} />
                            {tempHp > 0 && <div className="cc-temp-fill" style={{ width: `${tempPercent}%` }} />}
                        </div>
                    </div>
                    <span className="cc-stat-value-dashboard cc-stat-value-hp">
                        {hp} / {maxHp}
                        {tempHp > 0 && <span className="cc-temp-hp-value"> +{tempHp} temp</span>}
                    </span>
                </div>
                <div className="cc-popup-controls">
                    <div className="cc-control-group">
                        <label>HP Adjustment</label>
                        <div className="cc-input-group">
                            <input type="number" value={hpInput} min="0"
                                   onChange={e => setHpInput(Number(e.target.value))} />
                            <button onClick={() => { onAddHp(hpInput); close(); }}>Add</button>
                            <button onClick={() => { onSubtractHp(hpInput); close(); }}>Subtract</button>
                        </div>
                    </div>
                    <div className="cc-control-group">
                        <label>Temp HP Adjustment</label>
                        <div className="cc-input-group">
                            <input type="number" value={tempInput} min="0"
                                   onChange={e => setTempInput(Number(e.target.value))} />
                            <button onClick={() => { onAddTempHp(tempInput); close(); }}>Add Temp</button>
                            <button onClick={() => { onSubtractTempHp(tempInput); close(); }}>Subtract Temp</button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default HpEditPopup;