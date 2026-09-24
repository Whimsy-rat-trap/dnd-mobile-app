import React from 'react';
import { Character } from '../../types/Character';
import SkillCheck from '../SkillCheck';
import { getSkillBonus } from '../../utils/characterUtils';
import './SkillsSection.css';

interface Props {
    skills: Character['skills'];
    abilities: Character['abilities'];
    proficiencyBonus: number;
    rollMode: boolean;
    useVariant: boolean;
    onToggle: (idx: number) => void;
    onAttributeChange: (idx: number, attr: string) => void;
    onRoll: (skill: Character['skills'][0]) => void;
}

const SkillsSection: React.FC<Props> = ({
                                            skills, abilities, proficiencyBonus, rollMode, useVariant, onToggle, onAttributeChange, onRoll,
                                        }) => (
    <div className="cc-section-skills">
        <div className="cc-skills-header">
            <span className="cc-skills-title">Skills & Proficiencies</span>
            {rollMode && <span className="cc-roll-hint">Click a skill to roll</span>}
        </div>
        <div className="cc-skills-grid">
            {skills.map((skill, index) => {
                const bonus = getSkillBonus(skill, abilities, proficiencyBonus);
                return (
                    <div
                        key={skill.name}
                        className={`cc-skill-card ${rollMode ? 'cc-rollable' : ''}`}
                        onClick={rollMode ? () => onRoll(skill) : undefined}
                    >
                        <div className="cc-skill-left">
                            {!rollMode && <SkillCheck proficient={skill.proficient} onToggle={() => onToggle(index)} />}
                            <span className="cc-skill-name">{skill.name} ({skill.attribute})</span>
                        </div>
                        <div className="cc-skill-right">
                            {useVariant && (
                                <select value={skill.attribute}
                                        onChange={e => onAttributeChange(index, e.target.value)}
                                        className="cc-attr-select">
                                    {['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map(a =>
                                        <option key={a} value={a}>{a}</option>
                                    )}
                                </select>
                            )}
                            <span className="cc-skill-bonus">{bonus >= 0 ? `+${bonus}` : bonus}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
);

export default SkillsSection;