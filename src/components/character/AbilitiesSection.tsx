import React from 'react';
import { Character } from '../../types/Character';
import { getModifier } from '../../utils/characterUtils';
import './AbilitiesSection.css';

interface Props {
    abilities: Character['abilities'];
}

const AbilitiesSection: React.FC<Props> = ({ abilities }) => {
    const data = [
        { name: 'STR', score: abilities.str },
        { name: 'CON', score: abilities.con },
        { name: 'WIS', score: abilities.wis },
        { name: 'DEX', score: abilities.dex },
        { name: 'INT', score: abilities.int },
        { name: 'CHA', score: abilities.cha },
    ];

    return (
        <div className="cc-section-abilities">
            <div className="cc-abilities-title">Abilities</div>
            <div className="cc-abilities-grid">
                {data.map(a => (
                    <div className="cc-ability-card" key={a.name}>
                        <span className="cc-ability-name">{a.name}</span>
                        <span className="cc-ability-score">{a.score}</span>
                        <span className="cc-ability-modifier">
                            {getModifier(a.score) >= 0 ? `+${getModifier(a.score)}` : getModifier(a.score)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AbilitiesSection;