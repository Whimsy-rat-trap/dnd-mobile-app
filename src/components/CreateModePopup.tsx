import React from 'react';
import './CreateModePopup.css';

interface CreateModePopupProps {
    onSelect: (mode: 'creative' | 'rules') => void;
    onClose: () => void;
}

const CreateModePopup: React.FC<CreateModePopupProps> = ({ onSelect, onClose }) => {
    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <button className="popup-close" onClick={onClose}>✕</button>
                <h3 className="popup-title">How would you like to create your character?</h3>
                <div className="mode-buttons">
                    <button className="mode-btn creative" onClick={() => onSelect('creative')}>
                        Full Creative Freedom
                    </button>
                    <button className="mode-btn rules" onClick={() => onSelect('rules')}>
                        By the rules
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateModePopup;