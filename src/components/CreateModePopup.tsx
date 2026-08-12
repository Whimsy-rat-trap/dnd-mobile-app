import React from 'react';
import Modal from './Modal';
import './CreateModePopup.css';

interface CreateModePopupProps {
    onSelect: (mode: 'creative' | 'rules') => void;
    onClose: () => void;
}

const CreateModePopup: React.FC<CreateModePopupProps> = ({ onSelect, onClose }) => {
    return (
        <Modal isOpen={true} onClose={onClose}>
            <h3 className="popup-title">How would you like to create your character?</h3>
            <div className="mode-buttons">
                <button className="mode-btn creative" onClick={() => onSelect('creative')}>
                    Full Creative Freedom
                </button>
                <button className="mode-btn rules" onClick={() => onSelect('rules')}>
                    By the rules
                </button>
            </div>
        </Modal>
    );
};

export default CreateModePopup;