import React from 'react';
import { Character } from '../../types/Character';
import SkillCheck from '../SkillCheck';
import { getToolBonus } from '../../utils/characterUtils';
import './ToolsSection.css';

interface ToolsSectionProps {
    tools: Character['toolProficiencies'];
    abilities: Character['abilities'];
    proficiencyBonus: number;
    rollMode: boolean;
    useVariant: boolean;
    onToggle: (index: number) => void;
    onAttributeChange: (index: number, attr: string) => void;
    onRoll: (tool: Character['toolProficiencies'][0]) => void;
}

const ToolsSection: React.FC<ToolsSectionProps> = ({
                                                       tools,
                                                       abilities,
                                                       proficiencyBonus,
                                                       rollMode,
                                                       useVariant,
                                                       onToggle,
                                                       onAttributeChange,
                                                       onRoll,
                                                   }) => {
    if (!tools || tools.length === 0) {
        return (
            <div className="cc-section-tools">
                <div className="cc-tools-title">Tool Proficiencies</div>
                <div className="cc-tools-empty">No tool proficiencies</div>
            </div>
        );
    }

    return (
        <div className="cc-section-tools">
            <div className="cc-tools-title">Tool Proficiencies</div>
            <div className="cc-skills-grid">
                {tools.map((tool, index) => {
                    const bonus = getToolBonus(tool, abilities, proficiencyBonus);
                    return (
                        <div
                            key={`${tool.name}-${index}`}
                            className={`cc-skill-card ${rollMode ? 'cc-rollable' : ''}`}
                            onClick={rollMode ? () => onRoll(tool) : undefined}
                        >
                            <div className="cc-skill-left">
                                {!rollMode && (
                                    <SkillCheck
                                        proficient={tool.proficient}
                                        onToggle={() => onToggle(index)}
                                    />
                                )}
                                <span className="cc-skill-name">
                                    {tool.name} ({tool.attribute || 'DEX'})
                                </span>
                            </div>
                            <div className="cc-skill-right">
                                {useVariant && (
                                    <select
                                        value={tool.attribute || 'DEX'}
                                        onChange={(e) => onAttributeChange(index, e.target.value)}
                                        className="cc-attr-select"
                                    >
                                        {['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map(attr => (
                                            <option key={attr} value={attr}>{attr}</option>
                                        ))}
                                    </select>
                                )}
                                <span className="cc-skill-bonus">
                                    {bonus >= 0 ? `+${bonus}` : `${bonus}`}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ToolsSection;