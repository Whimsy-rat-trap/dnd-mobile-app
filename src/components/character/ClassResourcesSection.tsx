import React from 'react';
import { Character } from '../../types/Character';
import {
    getAvailableClassResources,
    ClassResourceState,
} from '../../utils/classResources';
import './ClassResourcesSection.css';

interface Props {
    character: Character;
    onUse: (resourceId: string, amount?: number) => void;
    onRestore: (resourceId: string, amount?: number) => void;
}

const ResourceRow: React.FC<{
    state: ClassResourceState;
    onUse: (amount?: number) => void;
    onRestore: (amount?: number) => void;
}> = ({ state, onUse, onRestore }) => {
    const { definition, availableUses, maxUses, recharge, dieSize } = state;
    const color = definition.color || '#34d399';

    return (
        <div className="crs-row">
            <div className="crs-row-header">
                <div className="crs-row-name-wrap">
                    <span className="crs-row-name" style={{ color }}>
                        {definition.name}
                    </span>
                    {dieSize && (
                        <span
                            className="crs-row-die"
                            style={{ background: color, color: '#0f0f0f' }}
                        >
                            d{dieSize}
                        </span>
                    )}
                </div>
                <span className="crs-row-count">
                    {availableUses} / {maxUses}
                </span>
            </div>
            <div className="crs-dots">
                {Array.from({ length: maxUses }, (_, i) => {
                    const isAvailable = i < availableUses;
                    return (
                        <button
                            key={i}
                            type="button"
                            className={`crs-dot ${isAvailable ? 'available' : 'used'}`}
                            style={
                                isAvailable
                                    ? { background: color, borderColor: color }
                                    : undefined
                            }
                            onClick={() => (isAvailable ? onUse(1) : onRestore(1))}
                            title={
                                isAvailable
                                    ? `Spend 1 ${definition.name}`
                                    : `Restore 1 ${definition.name}`
                            }
                            aria-label={isAvailable ? 'Spend' : 'Restore'}
                        />
                    );
                })}
            </div>
            <div className="crs-row-hint">
                {definition.description} ({recharge === 'short' ? 'short' : 'long'} rest)
            </div>
        </div>
    );
};

const ClassResourcesSection: React.FC<Props> = ({ character, onUse, onRestore }) => {
    const resources = getAvailableClassResources(character);
    if (resources.length === 0) return null;

    return (
        <div className="crs-container">
            <div className="crs-header">
                <span className="crs-title">Class Resources</span>
            </div>
            <div className="crs-list">
                {resources.map(state => (
                    <ResourceRow
                        key={state.definition.id}
                        state={state}
                        onUse={(amount) => onUse(state.definition.id, amount)}
                        onRestore={(amount) => onRestore(state.definition.id, amount)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ClassResourcesSection;