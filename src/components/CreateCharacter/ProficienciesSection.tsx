import React from 'react';
import { DND_BACKGROUNDS } from '../../constants/backgrounds';
import { RaceSkillProficiency, RaceToolProficiency } from '../../constants/raceProficiencies';

interface ProficienciesSectionProps {
    background: string;
    racialSkillData?: RaceSkillProficiency;
    racialToolData?: RaceToolProficiency;
    selectedRacialSkills: string[];
    onRacialSkillSelect: (index: number, value: string) => void;
    selectedRacialTools: string[];
    onRacialToolSelect: (index: number, value: string) => void;
}

const ProficienciesSection: React.FC<ProficienciesSectionProps> = ({
                                                                       background,
                                                                       racialSkillData,
                                                                       racialToolData,
                                                                       selectedRacialSkills,
                                                                       onRacialSkillSelect,
                                                                       selectedRacialTools,
                                                                       onRacialToolSelect,
                                                                   }) => {
    const bg = DND_BACKGROUNDS.find(b => b.name === background);

    return (
        <>
            {/* Background Skill Proficiencies */}
            <div className="cr-form-group">
                <label>Background Skill Proficiencies</label>
                {bg && bg.skillProficiencies && bg.skillProficiencies.length > 0 ? (
                    <div className="cr-background-skills-display">
                        {bg.skillProficiencies.map(skill => (
                            <span key={skill} className="cr-bg-skill-tag">{skill}</span>
                        ))}
                    </div>
                ) : (
                    <div className="cr-tools-empty">No skill proficiencies</div>
                )}
            </div>

            {/* Background Tool Proficiencies */}
            <div className="cr-form-group">
                <label>Background Tool Proficiencies</label>
                {bg && bg.toolProficiencies && bg.toolProficiencies.length > 0 ? (
                    <div className="cr-background-skills-display">
                        {bg.toolProficiencies.map(tool => (
                            <span key={tool.name} className="cr-bg-skill-tag">{tool.name}</span>
                        ))}
                    </div>
                ) : (
                    <div className="cr-tools-empty">No tool proficiencies</div>
                )}
            </div>

            {/* Background Languages */}
            <div className="cr-form-group">
                <label>Background Languages</label>
                {bg && bg.languages && bg.languages.length > 0 ? (
                    <div className="cr-background-skills-display">
                        {bg.languages.map(lang => (
                            <span key={lang} className="cr-bg-skill-tag">{lang}</span>
                        ))}
                    </div>
                ) : (
                    <div className="cr-tools-empty">No languages</div>
                )}
            </div>

            {/* Racial Skill Proficiencies */}
            {racialSkillData && (racialSkillData.fixed || racialSkillData.choose) && (
                <div className="cr-form-group">
                    <label>Racial Skill Proficiencies</label>
                    <div className="cr-racial-proficiencies">
                        {racialSkillData.fixed && racialSkillData.fixed.length > 0 && (
                            <div className="cr-racial-fixed">
                                <span className="cr-racial-label">Fixed:</span>
                                {racialSkillData.fixed.map(skill => (
                                    <span key={skill} className="cr-racial-tag">{skill}</span>
                                ))}
                            </div>
                        )}
                        {racialSkillData.choose && (() => {
                            const choose = racialSkillData.choose;
                            return (
                                <div className="cr-racial-choice">
                                    <span className="cr-racial-label">Choose {choose.count}:</span>
                                    <div className="cr-racial-selectors">
                                        {Array.from({ length: choose.count }, (_, i) => (
                                            <select
                                                key={i}
                                                value={selectedRacialSkills[i] || ''}
                                                onChange={(e) => onRacialSkillSelect(i, e.target.value)}
                                                className="cr-racial-select"
                                            >
                                                <option value="">Select</option>
                                                {choose.options.map(opt => {
                                                    const isSelected = selectedRacialSkills.includes(opt) && selectedRacialSkills.indexOf(opt) !== i;
                                                    return (
                                                        <option key={opt} value={opt} disabled={isSelected}>
                                                            {opt}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        ))}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            )}

            {/* Racial Tool Proficiencies */}
            {racialToolData && (racialToolData.fixed || racialToolData.choose) && (
                <div className="cr-form-group">
                    <label>Racial Tool Proficiencies</label>
                    <div className="cr-racial-proficiencies">
                        {racialToolData.fixed && racialToolData.fixed.length > 0 && (
                            <div className="cr-racial-fixed">
                                <span className="cr-racial-label">Fixed:</span>
                                {racialToolData.fixed.map(tool => (
                                    <span key={tool} className="cr-racial-tag">{tool}</span>
                                ))}
                            </div>
                        )}
                        {racialToolData.choose && (() => {
                            const choose = racialToolData.choose;
                            return (
                                <div className="cr-racial-choice">
                                    <span className="cr-racial-label">Choose {choose.count}:</span>
                                    <div className="cr-racial-selectors">
                                        {Array.from({ length: choose.count }, (_, i) => (
                                            <select
                                                key={i}
                                                value={selectedRacialTools[i] || ''}
                                                onChange={(e) => onRacialToolSelect(i, e.target.value)}
                                                className="cr-racial-select"
                                            >
                                                <option value="">Select</option>
                                                {choose.options.map(opt => {
                                                    const isSelected = selectedRacialTools.includes(opt) && selectedRacialTools.indexOf(opt) !== i;
                                                    return (
                                                        <option key={opt} value={opt} disabled={isSelected}>
                                                            {opt}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        ))}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            )}
        </>
    );
};

export default ProficienciesSection;