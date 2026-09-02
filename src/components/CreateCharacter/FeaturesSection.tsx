import React from 'react';
import { Feature } from '../../constants/raceFeatures';

interface FeaturesSectionProps {
    raceFeatures: Feature[];
    subraceFeatures: Feature[];
    selectedFeature: string | null;
    onFeatureToggle: (featureName: string) => void;
    selectedSubraceFeature: string | null;
    onSubraceFeatureToggle: (featureName: string) => void;
    isRaceFeaturesOpen: boolean;
    onRaceFeaturesToggle: () => void;
    isSubraceFeaturesOpen: boolean;
    onSubraceFeaturesToggle: () => void;
    renderChevron: (isOpen: boolean) => React.ReactNode;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({
                                                             raceFeatures,
                                                             subraceFeatures,
                                                             selectedFeature,
                                                             onFeatureToggle,
                                                             selectedSubraceFeature,
                                                             onSubraceFeatureToggle,
                                                             isRaceFeaturesOpen,
                                                             onRaceFeaturesToggle,
                                                             isSubraceFeaturesOpen,
                                                             onSubraceFeaturesToggle,
                                                             renderChevron,
                                                         }) => {
    return (
        <>
            {/* Race Features */}
            <div className="cr-race-features-section">
                <div
                    className="cr-race-features-header"
                    onClick={onRaceFeaturesToggle}
                >
                    <span className="cr-race-features-title">Race Features</span>
                    {renderChevron(isRaceFeaturesOpen)}
                </div>
                {isRaceFeaturesOpen && (
                    <div className="cr-race-features-content">
                        <div className="cr-race-features-list">
                            {raceFeatures.length > 0 ? (
                                raceFeatures.map((feature, idx) => (
                                    <span
                                        key={idx}
                                        className={`cr-race-feature-tag ${selectedFeature === feature.name ? 'cr-active' : ''}`}
                                        onClick={() => onFeatureToggle(feature.name)}
                                    >
                                        {feature.name}
                                    </span>
                                ))
                            ) : (
                                <span className="cr-race-features-empty">No features for this race</span>
                            )}
                        </div>
                        {selectedFeature && (
                            <div className="cr-race-feature-description">
                                {raceFeatures.find(f => f.name === selectedFeature)?.description}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Subrace Features (если есть) */}
            {subraceFeatures.length > 0 && (
                <div className="cr-race-features-section cr-subrace-features">
                    <div
                        className="cr-race-features-header"
                        onClick={onSubraceFeaturesToggle}
                    >
                        <span className="cr-race-features-title cr-subrace-features-title">Subrace Features</span>
                        {renderChevron(isSubraceFeaturesOpen)}
                    </div>
                    {isSubraceFeaturesOpen && (
                        <div className="cr-race-features-content">
                            <div className="cr-race-features-list">
                                {subraceFeatures.map((feature, idx) => (
                                    <span
                                        key={idx}
                                        className={`cr-race-feature-tag ${selectedSubraceFeature === feature.name ? 'cr-active' : ''}`}
                                        onClick={() => onSubraceFeatureToggle(feature.name)}
                                    >
                                        {feature.name}
                                    </span>
                                ))}
                            </div>
                            {selectedSubraceFeature && (
                                <div className="cr-race-feature-description cr-subrace-feature-description">
                                    {subraceFeatures.find(f => f.name === selectedSubraceFeature)?.description}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default FeaturesSection;