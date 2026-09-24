import React from 'react';
import { Character } from '../../types/Character';
import { getSavingThrowBonus } from '../../utils/characterUtils';
import './SavingThrowsSection.css';

interface Props {
    abilities: Character['abilities'];
    proficiencies: string[];
    proficiencyBonus: number;
    rollMode: boolean;
    onToggleRollMode: () => void;
    onClick: (attr: string) => void;
}

const SavingThrowsSection: React.FC<Props> = ({
                                                  abilities, proficiencies, proficiencyBonus, rollMode, onToggleRollMode, onClick,
                                              }) => {
    const attrs = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as const;

    return (
        <div className="cc-section-saving-throws">
            <div className="cc-saving-throws-header">
                <span className="cc-saving-throws-title">Saving Throws</span>
                <button
                    className={`cc-roll-mode-toggle ${rollMode ? 'cc-active' : ''}`}
                    onClick={onToggleRollMode}
                >
                    {rollMode ? 'Roll Mode ON' : 'Roll Mode OFF'}
                </button>
            </div>
            <div className="cc-saving-throws-grid">
                {attrs.map(name => {
                    const isProf = proficiencies.includes(name);
                    const bonus = getSavingThrowBonus(
                        name.toLowerCase() as keyof Character['abilities'],
                        abilities, proficiencies, proficiencyBonus
                    );
                    return (
                        <div key={name}
                             className={`cc-saving-throw-card ${isProf ? 'cc-proficient' : ''} ${rollMode ? 'cc-rollable' : ''}`}
                             onClick={() => onClick(name)}>
                            <span className="cc-saving-throw-name">{name}</span>
                            <span className="cc-saving-throw-bonus">{bonus >= 0 ? `+${bonus}` : bonus}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SavingThrowsSection;