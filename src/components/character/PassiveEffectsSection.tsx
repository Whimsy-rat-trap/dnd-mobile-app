import React from 'react';
import { RacialEffect } from '../../utils/racialFeatures';
import './PassiveEffectsSection.css';

interface PassiveEffectsSectionProps {
    effects: RacialEffect[];
}

const PassiveEffectsSection: React.FC<PassiveEffectsSectionProps> = ({ effects }) => {
    if (!effects || effects.length === 0) {
        return (
            <div className="cc-passive-effects-section">
                <div className="cc-passive-effects-header">
                    <span className="cc-passive-effects-title">Passive Effects</span>
                </div>
                <div className="cc-passive-effects-empty">No passive effects</div>
            </div>
        );
    }

    return (
        <div className="cc-passive-effects-section">
            <div className="cc-passive-effects-header">
                <span className="cc-passive-effects-title">Passive Effects</span>
            </div>
            <div className="cc-passive-effects-list">
                {effects.map((effect, idx) => (
                    <div key={`${effect.name}-${idx}`} className="cc-passive-effect-item">
                        <span className="cc-passive-effect-name">
                            {effect.name}
                            {effect.source && (
                                <span className="cc-passive-effect-source"> ({effect.source})</span>
                            )}
                        </span>
                        <span className="cc-passive-effect-description">
                            {effect.description}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PassiveEffectsSection;