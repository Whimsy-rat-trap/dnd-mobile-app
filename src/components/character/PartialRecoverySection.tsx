import React, { useState } from 'react';
import { Character } from '../../types/Character';
import {
    getAvailablePartialRecoveryFeatures,
} from '../../utils/partialRecovery';
import PartialRecoveryModal from './PartialRecoveryModal';
import './PartialRecoverySection.css';

interface Props {
    character: Character;
    onUse: (
        featureId: string,
        payload?: Array<{ level: number; count: number }>
    ) => boolean;
}

const PartialRecoverySection: React.FC<Props> = ({ character, onUse }) => {
    const features = getAvailablePartialRecoveryFeatures(character);
    const [openFeatureId, setOpenFeatureId] = useState<string | null>(null);

    if (features.length === 0) return null;

    const openFeature = openFeatureId
        ? (features.find(f => f.feature.id === openFeatureId)?.feature ?? null)
        : null;

    const handleUseFeature = (id: string) => {
        const entry = features.find(f => f.feature.id === id);
        if (!entry) return;

        if (entry.feature.target.type === 'spell-slots') {
            setOpenFeatureId(id);
        } else {
            // Resource type — применяем сразу
            onUse(id);
        }
    };

    return (
        <div className="prs-container">
            <div className="prs-header">
                <span className="prs-title">Partial Recovery</span>
            </div>
            <div className="prs-list">
                {features.map(({ feature, cooldown }) => {
                    const disabled = cooldown;
                    return (
                        <div key={feature.id} className="prs-row">
                            <div className="prs-info">
                                <span className="prs-name">{feature.name}</span>
                                <span className="prs-desc">{feature.description}</span>
                            </div>
                            <button
                                type="button"
                                className={`prs-btn ${disabled ? 'disabled' : 'enabled'}`}
                                disabled={disabled}
                                onClick={() => handleUseFeature(feature.id)}
                                title={
                                    disabled
                                        ? 'Already used since last ' +
                                        (feature.cooldown === 'long' ? 'long' : 'short') +
                                        ' rest'
                                        : `Use ${feature.name}`
                                }
                            >
                                {disabled ? 'Used' : 'Use'}
                            </button>
                        </div>
                    );
                })}
            </div>

            <PartialRecoveryModal
                isOpen={openFeature !== null}
                onClose={() => setOpenFeatureId(null)}
                character={character}
                feature={openFeature}
                onSubmit={(payload) =>
                    openFeatureId ? onUse(openFeatureId, payload) : false
                }
            />
        </div>
    );
};

export default PartialRecoverySection;