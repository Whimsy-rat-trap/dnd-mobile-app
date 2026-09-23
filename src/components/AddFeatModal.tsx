import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Feat } from '../types/Character';
import { GENERAL_FEATS, getGeneralFeatById } from '../constants/generalFeats';
import './AddFeatModal.css';

type FeatSource = 'level' | 'quest' | 'custom' | 'other';

interface AddFeatModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (feat: Omit<Feat, 'id'>) => void;
    characterLevel?: number;
    existingLevelFeats?: Feat[];
}

const ASI_LEVELS = [4, 8, 12, 16, 19];

const AddFeatModal: React.FC<AddFeatModalProps> = ({
                                                       isOpen,
                                                       onClose,
                                                       onAdd,
                                                       characterLevel = 1,
                                                       existingLevelFeats = [],
                                                   }) => {
    const [mode, setMode] = useState<'catalog' | 'custom'>('catalog');

    // Catalog
    const [selectedFeatId, setSelectedFeatId] = useState('');

    // Custom
    const [customName, setCustomName] = useState('');
    const [customDescription, setCustomDescription] = useState('');
    const [customPrereq, setCustomPrereq] = useState('');
    const [customDamageDice, setCustomDamageDice] = useState('');
    const [customDamageType, setCustomDamageType] = useState('');

    // Source
    const [source, setSource] = useState<FeatSource>('level');
    const [gainedAtLevel, setGainedAtLevel] = useState<number>(characterLevel);
    const [sourceDetail, setSourceDetail] = useState('');

    const [error, setError] = useState<string | null>(null);

    const availableFeatLevels = ASI_LEVELS.filter(l => l <= characterLevel);
    const usedLevels = new Set(existingLevelFeats.map(f => f.gainedAtLevel));

    useEffect(() => {
        if (isOpen) {
            setMode('catalog');
            setSelectedFeatId('');
            setCustomName('');
            setCustomDescription('');
            setCustomPrereq('');
            setCustomDamageDice('');
            setCustomDamageType('');
            setSource('level');
            setSourceDetail('');

            const firstAvailable = availableFeatLevels.find(l => !usedLevels.has(l));
            setGainedAtLevel(firstAvailable ?? characterLevel);
            setError(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, characterLevel]);

    const handleSubmit = () => {
        let featData: Omit<Feat, 'id'>;

        if (mode === 'catalog') {
            const catalog = getGeneralFeatById(selectedFeatId);
            if (!catalog) {
                setError('Please select a feat from the catalog.');
                return;
            }
            featData = {
                name: catalog.name,
                description: catalog.description,
                prerequisite: catalog.prerequisite,
                source: source,
            };
        } else {
            if (!customName.trim() || !customDescription.trim()) {
                setError('Name and description are required.');
                return;
            }
            featData = {
                name: customName.trim(),
                description: customDescription.trim(),
                prerequisite: customPrereq.trim() || undefined,
                damageDice: customDamageDice.trim() || undefined,
                damageType: customDamageType.trim() || undefined,
                source: source,
            };
        }

        if (source === 'level') {
            if (!availableFeatLevels.includes(gainedAtLevel)) {
                setError(`Feats are only available at levels ${availableFeatLevels.join(', ')}.`);
                return;
            }
            if (usedLevels.has(gainedAtLevel)) {
                setError(`You already have a feat from level ${gainedAtLevel}.`);
                return;
            }
            featData.gainedAtLevel = gainedAtLevel;
        } else if (source === 'quest' || source === 'other') {
            if (sourceDetail.trim()) {
                featData.sourceDetail = sourceDetail.trim();
            }
        }

        onAdd(featData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h3>Add Feat</h3>

            <div className="afm-form">
                <div className="afm-tabs">
                    <button
                        type="button"
                        className={`afm-tab ${mode === 'catalog' ? 'active' : ''}`}
                        onClick={() => setMode('catalog')}
                    >
                        From Catalog
                    </button>
                    <button
                        type="button"
                        className={`afm-tab ${mode === 'custom' ? 'active' : ''}`}
                        onClick={() => setMode('custom')}
                    >
                        Custom
                    </button>
                </div>

                {mode === 'catalog' && (
                    <div className="afm-group">
                        <label>Feat</label>
                        <select
                            value={selectedFeatId}
                            onChange={(e) => setSelectedFeatId(e.target.value)}
                        >
                            <option value="">— Select feat —</option>
                            {GENERAL_FEATS.map(f => (
                                <option key={f.id} value={f.id}>
                                    {f.name}{f.prerequisite ? ` — ${f.prerequisite}` : ''}
                                </option>
                            ))}
                        </select>
                        {selectedFeatId && (
                            <div className="afm-feat-preview">
                                {getGeneralFeatById(selectedFeatId)?.description}
                            </div>
                        )}
                    </div>
                )}

                {mode === 'custom' && (
                    <>
                        <div className="afm-group">
                            <label>Name *</label>
                            <input
                                type="text"
                                value={customName}
                                onChange={(e) => setCustomName(e.target.value)}
                                placeholder="e.g., Dragon Slayer"
                            />
                        </div>
                        <div className="afm-group">
                            <label>Description *</label>
                            <textarea
                                value={customDescription}
                                onChange={(e) => setCustomDescription(e.target.value)}
                                placeholder="Describe the feat..."
                                rows={3}
                            />
                        </div>
                        <div className="afm-group">
                            <label>Prerequisite (optional)</label>
                            <input
                                type="text"
                                value={customPrereq}
                                onChange={(e) => setCustomPrereq(e.target.value)}
                                placeholder="e.g., Strength 13+"
                            />
                        </div>
                        <div className="afm-row">
                            <div className="afm-group">
                                <label>Damage Dice (optional)</label>
                                <input
                                    type="text"
                                    value={customDamageDice}
                                    onChange={(e) => setCustomDamageDice(e.target.value)}
                                    placeholder="e.g., 2d6"
                                />
                            </div>
                            <div className="afm-group">
                                <label>Damage Type (optional)</label>
                                <input
                                    type="text"
                                    value={customDamageType}
                                    onChange={(e) => setCustomDamageType(e.target.value)}
                                    placeholder="e.g., fire"
                                />
                            </div>
                        </div>
                    </>
                )}

                <div className="afm-group">
                    <label>Source</label>
                    <select
                        value={source}
                        onChange={(e) => setSource(e.target.value as FeatSource)}
                    >
                        <option value="level">Level Up (ASI)</option>
                        <option value="quest">Quest Reward</option>
                        <option value="custom">Custom (DM)</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                {source === 'level' && (
                    <div className="afm-group">
                        <label>Gained at Level</label>
                        <select
                            value={gainedAtLevel}
                            onChange={(e) => setGainedAtLevel(Number(e.target.value))}
                        >
                            {availableFeatLevels.map(l => (
                                <option
                                    key={l}
                                    value={l}
                                    disabled={usedLevels.has(l)}
                                >
                                    Level {l}{usedLevels.has(l) ? ' (already used)' : ''}
                                </option>
                            ))}
                        </select>
                        <span className="afm-hint">
                            ASI/feat levels for your class: {availableFeatLevels.join(', ')}
                        </span>
                    </div>
                )}

                {(source === 'quest' || source === 'other') && (
                    <div className="afm-group">
                        <label>Details (optional)</label>
                        <input
                            type="text"
                            value={sourceDetail}
                            onChange={(e) => setSourceDetail(e.target.value)}
                            placeholder="e.g., Reward for defeating the Ancient Dragon"
                        />
                    </div>
                )}

                {error && <div className="afm-error">{error}</div>}
            </div>

            <div className="modal-actions">
                <button className="modal-btn cancel" onClick={onClose}>
                    Cancel
                </button>
                <button className="modal-btn apply" onClick={handleSubmit}>
                    Add Feat
                </button>
            </div>
        </Modal>
    );
};

export default AddFeatModal;