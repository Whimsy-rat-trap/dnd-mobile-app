import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Campaign } from '../types/Character';
import { validateCampaign } from '../utils/campaignUtils';

interface CharacterOption {
    id: string;
    name: string;
}

interface CampaignFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<Campaign, 'id'>) => void;
    initialData?: Campaign | null;
    title?: string;
    /** Список персонажей для выбора. Если undefined — селектор не показывается. */
    availableCharacters?: CharacterOption[];
    /** Зафиксированный персонаж — селектор показывается, но disabled. */
    lockedCharacterId?: string;
}

const emptyForm = {
    name: '',
    description: '',
    status: 'active' as Campaign['status'],
    dm: '',
    players: 4,
    sessions: 0,
    lastPlayed: new Date().toISOString().split('T')[0],
    characterId: '',
};

const CampaignFormModal: React.FC<CampaignFormModalProps> = ({
                                                                 isOpen,
                                                                 onClose,
                                                                 onSubmit,
                                                                 initialData,
                                                                 title,
                                                                 availableCharacters,
                                                                 lockedCharacterId,
                                                             }) => {
    const [form, setForm] = useState(emptyForm);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) return;
        if (initialData) {
            setForm({
                name: initialData.name,
                description: initialData.description || '',
                status: initialData.status,
                dm: initialData.dm || '',
                players: initialData.players ?? 4,
                sessions: initialData.sessions ?? 0,
                lastPlayed: initialData.lastPlayed || '',
                characterId: initialData.characterIds?.[0] || '',
            });
        } else {
            setForm({
                ...emptyForm,
                characterId: lockedCharacterId || '',
            });
        }
        setError(null);
    }, [isOpen, initialData, lockedCharacterId]);

    const handleChange = (field: keyof typeof form, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        const validationError = validateCampaign(form);
        if (validationError) {
            setError(validationError);
            return;
        }

        // Определяем characterIds
        let characterIds: string[];
        if (initialData) {
            // Редактирование — сохраняем существующих участников
            characterIds = initialData.characterIds ?? [];
        } else if (lockedCharacterId) {
            // Создание со страницы персонажа — фиксированный персонаж
            characterIds = [lockedCharacterId];
        } else if (form.characterId) {
            // Создание со страницы кампаний — выбранный из дропдауна
            characterIds = [form.characterId];
        } else {
            characterIds = [];
        }

        onSubmit({
            name: form.name.trim(),
            description: form.description.trim(),
            status: form.status,
            dm: form.dm.trim() || 'Dungeon Master',
            players: Math.max(0, form.players || 0),
            sessions: Math.max(0, form.sessions || 0),
            lastPlayed: form.lastPlayed || new Date().toISOString().split('T')[0],
            characterIds,
        });

        onClose();
    };

    if (!isOpen) return null;

    // Селектор показываем только при создании (не при редактировании) и если есть данные
    const showCharacterSelector = !initialData && (!!availableCharacters || !!lockedCharacterId);
    const isCharacterLocked = !!lockedCharacterId;
    const lockedCharacterName = availableCharacters?.find(c => c.id === lockedCharacterId)?.name;

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

                {showCharacterSelector && (
                    <div className="cg-form-group">
                        <label>Character</label>
                        {isCharacterLocked ? (
                            <div className="cg-locked-character">
                                {lockedCharacterName || 'Current character'}
                            </div>
                        ) : (
                            <select
                                value={form.characterId}
                                onChange={(e) => handleChange('characterId', e.target.value)}
                            >
                                <option value="">— None —</option>
                                {availableCharacters?.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        )}
                        <span className="cg-form-hint">
                            {isCharacterLocked
                                ? 'Character is fixed (creating from character page)'
                                : 'Optional — you can add more characters later'}
                        </span>
                    </div>
                )}

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