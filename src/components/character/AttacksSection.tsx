import React from 'react';
import { Character, Feat } from '../../types/Character';
import { Feature } from '../../constants/raceFeatures';
import AttackRoller from '../AttackRoller';
import './AttacksSection.css';

interface Props {
    features: Feature[];
    feats: Feat[];
    attackBonus: number;
    damageBonus: number;
}

const AttacksSection: React.FC<Props> = ({ features, feats, attackBonus, damageBonus }) => {
    const attackingFeatures = features.filter(f => f.damageDice);
    const attackingFeats = feats.filter(f => f.damageDice);

    if (attackingFeatures.length === 0 && attackingFeats.length === 0) return null;

    return (
        <div className="cc-attacks-section">
            <div className="cc-attacks-header">
                <span className="cc-attacks-title">Attacks</span>
            </div>
            <div className="cc-attacks-list">
                {attackingFeatures.map((f, idx) => (
                    <div key={`f-${idx}`} className="cc-attack-item">
                        <span className="cc-attack-name">{f.name}<span className="cc-attack-source"> (race)</span></span>
                        <span className="cc-attack-dice">{f.damageDice}{f.damageType ? ` ${f.damageType}` : ''}</span>
                        <AttackRoller
                            sourceName={f.name}
                            damageDice={f.damageDice}
                            damageType={f.damageType}
                            defaultAttackBonus={attackBonus}
                            defaultDamageBonus={damageBonus}
                            trigger={<button className="cc-attack-btn">Attack</button>}
                        />
                    </div>
                ))}
                {attackingFeats.map(feat => (
                    <div key={feat.id} className="cc-attack-item">
                        <span className="cc-attack-name">{feat.name}<span className="cc-attack-source"> (feat)</span></span>
                        <span className="cc-attack-dice">{feat.damageDice}{feat.damageType ? ` ${feat.damageType}` : ''}</span>
                        <AttackRoller
                            sourceName={feat.name}
                            damageDice={feat.damageDice}
                            damageType={feat.damageType}
                            defaultAttackBonus={attackBonus}
                            defaultDamageBonus={damageBonus}
                            trigger={<button className="cc-attack-btn">Attack</button>}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AttacksSection;