import React, { useState } from 'react';
import { Feature } from '../../constants/raceFeatures';
import './RaceFeaturesSection.css';

interface Props {
    features: Feature[];
}

const Chevron: React.FC<{ open: boolean }> = ({ open }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
         className={`cc-chevron-icon ${open ? 'cc-open' : ''}`}>
        <path d="M22.586 5.92896L12.707 15.808C12.5169 15.9904 12.2636 16.0923 12 16.0923C11.7365 16.0923 11.4832 15.9904 11.293 15.808L1.42004 5.93396L0.00604248 7.34796L9.87904 17.222C10.4509 17.767 11.2106 18.071 12.0005 18.071C12.7905 18.071 13.5502 17.767 14.122 17.222L24 7.34296L22.586 5.92896Z" fill="#374957" />
    </svg>
);

const RaceFeaturesSection: React.FC<Props> = ({ features }) => {
    const [open, setOpen] = useState(true);
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <div className="cc-race-features-section">
            <div className="cc-race-features-header" onClick={() => setOpen(o => !o)}>
                <span className="cc-race-features-title">Race Features</span>
                <Chevron open={open} />
            </div>
            {open && (
                <>
                    <div className="cc-race-features-list">
                        {features.length > 0 ? features.map((f, idx) => (
                            <span
                                key={idx}
                                className={`cc-race-feature-tag ${selected === f.name ? 'cc-active' : ''}`}
                                onClick={() => setSelected(s => s === f.name ? null : f.name)}
                            >
                                {f.name}
                                {f.resistance && ` (Resist: ${f.resistance})`}
                                {f.immunity && ` (Immune: ${f.immunity})`}
                            </span>
                        )) : <span className="cc-race-features-empty">No features for this race</span>}
                    </div>
                    {selected && (
                        <div className="cc-race-feature-description">
                            {features.find(f => f.name === selected)?.description}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default RaceFeaturesSection;