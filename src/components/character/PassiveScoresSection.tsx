import React from 'react';
import { Character } from '../../types/Character';
import { getModifier, getProficiencyBonus } from '../../utils/characterUtils';
import './PassiveScoresSection.css';

interface Props {
    character: Character;
}

const getSkillProficient = (character: Character, skillName: string): boolean => {
    const skill = character.skills.find(s => s.name === skillName);
    return skill?.proficient ?? false;
};

const hasFeat = (character: Character, featName: string): boolean =>
    character.feats?.some(f => f.name.toLowerCase() === featName.toLowerCase()) ?? false;

const hasJackOfAllTrades = (character: Character): boolean =>
    (character.classLevels || []).some(
        cl => cl.className === 'Bard' && cl.level >= 2
    );

const PassiveScoresSection: React.FC<Props> = ({ character }) => {
    const profBonus = getProficiencyBonus(character.level);
    const wisMod = getModifier(character.abilities.wis);
    const intMod = getModifier(character.abilities.int);

    const observant = hasFeat(character, 'Observant') ? 5 : 0;
    const joatBonus = hasJackOfAllTrades(character) ? Math.floor(profBonus / 2) : 0;

    const perProf = getSkillProficient(character, 'Perception');
    const insProf = getSkillProficient(character, 'Insight');
    const invProf = getSkillProficient(character, 'Investigation');

    const passivePerception =
        10 + wisMod + (perProf ? profBonus : joatBonus) + observant;

    const passiveInsight =
        10 + wisMod + (insProf ? profBonus : joatBonus);

    const passiveInvestigation =
        10 + intMod + (invProf ? profBonus : joatBonus) + observant;

    const scores: { label: string; value: number; badge?: string }[] = [
        { label: 'Perception', value: passivePerception, badge: observant ? '+5 Observant' : undefined },
        { label: 'Insight', value: passiveInsight },
        { label: 'Investigation', value: passiveInvestigation, badge: observant ? '+5 Observant' : undefined },
    ];

    return (
        <div className="cc-passive-scores-section">
            <div className="cc-passive-scores-header">
                <span className="cc-passive-scores-title">Passive Scores</span>
            </div>
            <div className="cc-passive-scores-grid">
                {scores.map(s => (
                    <div key={s.label} className="cc-passive-score-card">
                        <span className="cc-passive-score-value">{s.value}</span>
                        <span className="cc-passive-score-label">{s.label}</span>
                        {s.badge && <span className="cc-passive-score-badge">{s.badge}</span>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PassiveScoresSection;