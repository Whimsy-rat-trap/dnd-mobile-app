import React from 'react';
import { Feat } from '../../types/Character';
import './FeatsSection.css';

const ASI_LEVELS = [4, 8, 12, 16, 19];

interface Props {
    feats: Feat[];
    characterLevel: number;
    onAdd: () => void;
    onRemove: (id: string) => void;
}

const FeatsSection: React.FC<Props> = ({ feats, characterLevel, onAdd, onRemove }) => {
    const available = ASI_LEVELS.filter(l => l <= characterLevel);
    const used = feats.filter(f => f.source === 'level' && f.gainedAtLevel).length;

    const getSourceLabel = (feat: Feat): string => {
        if (feat.source === 'level' && feat.gainedAtLevel) return `Lv.${feat.gainedAtLevel}`;
        if (feat.source === 'quest' && feat.sourceDetail) return `Quest: ${feat.sourceDetail}`;
        return feat.source;
    };

    const isAutoSource = (s: Feat['source']) =>
        ['background', 'class', 'race', 'subrace'].includes(s);

    return (
        <div className="cc-feats-section">
            <div className="cc-feats-header">
                <span className="cc-feats-title">
                    Feats
                    {available.length > 0 && (
                        <span className="cc-feats-slots">{used} / {available.length} ASI used</span>
                    )}
                </span>
                <button className="cc-add-feat-btn" onClick={onAdd}>+ Add</button>
            </div>
            <div className="cc-feats-list">
                {feats.length === 0 ? (
                    <div className="cc-feats-empty">No feats</div>
                ) : feats.map(feat => (
                    <div key={feat.id} className={`cc-feat-item cc-feat-source-${feat.source}`}>
                        <div className="cc-feat-info">
                            <span className="cc-feat-name">{feat.name}</span>
                            <span className={`cc-feat-source cc-feat-source-tag-${feat.source}`}>
                                [{getSourceLabel(feat)}]
                            </span>
                        </div>
                        <div className="cc-feat-description">{feat.description}</div>
                        {feat.prerequisite && (
                            <div className="cc-feat-prereq">Requires: {feat.prerequisite}</div>
                        )}
                        {feat.damageDice && (
                            <div className="cc-feat-damage">
                                Damage: <strong>{feat.damageDice}</strong>
                                {feat.damageType ? ` ${feat.damageType}` : ''}
                            </div>
                        )}
                        {!isAutoSource(feat.source) && (
                            <button className="cc-feat-remove" onClick={() => onRemove(feat.id)}>✕</button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeatsSection;