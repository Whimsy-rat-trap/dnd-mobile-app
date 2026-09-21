import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Campaign } from '../types/Character';
import { validateCampaign } from '../utils/campaignUtils';

interface CampaignFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<Campaign, 'id' | 'characterIds'>) => void;
    initialData?: Campaign | null;
    title?: string;
}

const emptyForm = {
    name: '',
    description: '',
    status: 'active' as Campaign['status'],
    dm: '',
    players: 4,
    sessions: 0,
    lastPlayed: new Date().toISOString().split('T')[0],
};

const CampaignFormModal: React.FC<CampaignFormModalProps> = ({
                                                                 isOpen,
                                                                 onClose,
                                                                 onSubmit,
                                                                 initialData,
                                                                 title,
                                                             }) => {
    const [form, setForm] = useState(emptyForm);
    const [error, setError] = useState<string | null>(null);

    // Синхронизация с initialData при открытии
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setForm({
                    name: initialData.name,
                    description: initialData.description || '',
                    status: initialData.status,
                    dm: initialData.dm || '',
                    players: initialData.players ?? 4,
                    sessions: initialData.sessions ?? 0,
                    lastPlayed: initialData.lastPlayed || '',
                });
            } else {
                setForm(emptyForm);
            }
            setError(null);
        }
    }, [isOpen, initialData]);

    const handleChange = (field: keyof typeof form, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        const validationError = validateCampaign(form);
        if (validationError) {
            setError(validationError);
            return;
        }

        onSubmit({
            name: form.name.trim(),
            description: form.description.trim(),
            status: form.status,
            dm: form.dm.trim() || 'Dungeon Master',
            players: Math.max(0, form.players || 0),
            sessions: Math.max(0, form.sessions || 0),
            lastPlayed: form.lastPlayed || new Date().toISOString().split('T')[0],
        });

        onClose();
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h3>{title || (initialData ? 'Edit Campaign' : 'Create New Campaign')}</h3>
            <div className="cg-form">
                <div className="cg-form-group">
                    <label>Campaign Name *</label>
                    <input
                        type="text"
                        placeholder="e.g., Curse of Strahd"
                        value={form.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                    />
                </div>

                <div className="cg-form-group">
                    <label>Description</label>
                    <textarea
                        placeholder="Short description of the adventure..."
                        value={form.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        rows={3}
                    />
                </div>

                <div className="cg-form-row">
                    <div className="cg-form-group">
                        <label>DM</label>
                        <input
                            type="text"
                            placeholder="Dungeon Master"
                            value={form.dm}
                            onChange={(e) => handleChange('dm', e.target.value)}
                        />
                    </div>
                    <div className="cg-form-group">
                        <label>Status</label>
                        <select
                            value={form.status}
                            onChange={(e) => handleChange('status', e.target.value as Campaign['status'])}
                        >
                            <option value="active">Active</option>
                            <option value="paused">Paused</option>
                            <option value="ended">Ended</option>
                        </select>
                    </div>
                </div>

                <div className="cg-form-row">
                    <div className="cg-form-group">
                        <label>Players</label>
                        <input
                            type="number"
                            min="0"
                            max="50"
                            value={form.players}
                            onChange={(e) => handleChange('players', Number(e.target.value))}
                        />
                    </div>
                    <div className="cg-form-group">
                        <label>Sessions</label>
                        <input
                            type="number"
                            min="0"
                            value={form.sessions}
                            onChange={(e) => handleChange('sessions', Number(e.target.value))}
                        />
                    </div>
                </div>

                <div className="cg-form-group">
                    <label>Last Played</label>
                    <input
                        type="date"
                        value={form.lastPlayed}
                        onChange={(e) => handleChange('lastPlayed', e.target.value)}
                    />
                </div>

                {error && <div className="cg-form-error">{error}</div>}
            </div>

            <div className="modal-actions">
                <button className="modal-btn cancel" onClick={onClose}>
                    Cancel
                </button>
                <button className="modal-btn apply" onClick={handleSubmit}>
                    {initialData ? 'Save' : 'Create'}
                </button>
            </div>
        </Modal>
    );
};

export default CampaignFormModal;