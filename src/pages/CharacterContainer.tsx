import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCharacters } from '../context/CharacterContext';
import './CharacterContainer.css';

const CharacterContainer: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getCharacter, updateCharacter, setCurrentCharacterId } = useCharacters();
    const character = id ? getCharacter(id) : undefined;

    // Ранний возврат после всех хуков
    if (!character) {
        return <div className="page">Character not found</div>;
    }

    const handleBack = () => navigate(-1);
    const handleSetCurrent = () => {
        setCurrentCharacterId(character.id);
        navigate('/dashboard');
    };

    // Вычисление бонуса мастерства (proficiency) по уровню
    const getProficiencyBonus = (level: number) => {
        if (level <= 4) return 2;
        if (level <= 8) return 3;
        if (level <= 12) return 4;
        if (level <= 16) return 5;
        return 6;
    };

    const proficiencyBonus = getProficiencyBonus(character.level);

    // Получение модификатора способности
    const getModifier = (attr: keyof typeof character.abilities) => {
        const score = character.abilities[attr];
        return Math.floor((score - 10) / 2);
    };

    // Вычисление итогового бонуса навыка с учётом proficiency
    const getSkillBonus = (skill: typeof character.skills[0]) => {
        const attrKey = skill.attribute.toLowerCase() as keyof typeof character.abilities;
        const mod = getModifier(attrKey);
        return skill.proficient ? mod + proficiencyBonus : mod;
    };

    // Переключение состояния proficient для навыка (сохраняется в контекст)
    const toggleProficient = (index: number) => {
        const updatedSkills = character.skills.map((s, i) =>
            i === index ? { ...s, proficient: !s.proficient } : s
        );
        updateCharacter(character.id, { skills: updatedSkills });
    };

    // Данные способностей из персонажа
    const abilitiesData = [
        { name: 'STR', score: character.abilities.str, modifier: getModifier('str') },
        { name: 'CON', score: character.abilities.con, modifier: getModifier('con') },
        { name: 'WIS', score: character.abilities.wis, modifier: getModifier('wis') },
        { name: 'DEX', score: character.abilities.dex, modifier: getModifier('dex') },
        { name: 'INT', score: character.abilities.int, modifier: getModifier('int') },
        { name: 'CHA', score: character.abilities.cha, modifier: getModifier('cha') },
    ];

    // Отображаем классы через слеш
    const classDisplay = character.classes && character.classes.length > 0
        ? character.classes.join(' / ')
        : 'No class';

    return (
        <div className="character-page">
            <header className="character-header-charactercontainer">
                <div className="character-back-btn" onClick={handleBack}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.5 10C17.5 10.1658 17.4342 10.3247 17.3169 10.4419C17.1997 10.5592 17.0408 10.625 16.875 10.625H4.6336L9.19219 15.1828C9.25026 15.2409 9.29632 15.3098 9.32775 15.3857C9.35918 15.4616 9.37535 15.5429 9.37535 15.625C9.37535 15.7071 9.35918 15.7884 9.32775 15.8643C9.29632 15.9402 9.25026 16.0091 9.19219 16.0672C9.13412 16.1253 9.06518 16.1713 8.98931 16.2027C8.91344 16.2342 8.83213 16.2503 8.75 16.2503C8.66788 16.2503 8.58656 16.2342 8.51069 16.2027C8.43482 16.1713 8.36588 16.1253 8.30782 16.0672L2.68282 10.4422C2.62471 10.3841 2.57861 10.3152 2.54715 10.2393C2.5157 10.1635 2.49951 10.0821 2.49951 10C2.49951 9.91787 2.5157 9.83654 2.54715 9.76066C2.57861 9.68479 2.62471 9.61586 2.68282 9.55781L8.30782 3.93281C8.42509 3.81554 8.58415 3.74965 8.75 3.74965C8.91586 3.74965 9.07492 3.81554 9.19219 3.93281C9.30947 4.05009 9.37535 4.20915 9.37535 4.375C9.37535 4.54085 9.30947 4.69991 9.19219 4.81719L4.6336 9.375H16.875C17.0408 9.375 17.1997 9.44085 17.3169 9.55806C17.4342 9.67527 17.5 9.83424 17.5 10Z" fill="#9CA3AF" />
                    </svg>
                </div>
                <div className="character-header-info">
                    <div className="character-title">Character Sheet</div>
                    <div className="character-subtitle">{character.name}</div>
                </div>
                <button
                    className="set-current-btn"
                    onClick={handleSetCurrent}
                    style={{
                        background: '#34d399',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        color: '#fff',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        marginLeft: 'auto',
                    }}
                >
                    Set as current
                </button>
            </header>

            <div className="character-content">
                {/* Character Details */}
                <div className="section-info">
                    <div className="info-title">Character Details</div>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">Level</span>
                            <span className="info-value">{character.level}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Class</span>
                            <span className="info-value">{classDisplay}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Race</span>
                            <span className="info-value">{character.race}</span>
                        </div>
                    </div>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">Background</span>
                            <span className="info-value">{character.background}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">AC</span>
                            <span className="info-value">{character.ac || '—'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Speed</span>
                            <span className="info-value">{character.speed ? `${character.speed} ft` : '—'}</span>
                        </div>
                    </div>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">Proficiency Bonus</span>
                            <span className="info-value">+{proficiencyBonus}</span>
                        </div>
                    </div>
                </div>

                {/* HP */}
                <div className="section-hp">
                    <div className="hp-title">Hit Points</div>
                    <div className="hp-display">
                        <span className="hp-current">{character.hp}</span>
                        <span className="hp-separator">/</span>
                        <span className="hp-max">{character.maxHp}</span>
                    </div>
                    <div className="hp-controls">
                        <button className="hp-button">Take Damage</button>
                        <button className="hp-button">Heal</button>
                    </div>
                </div>

                {/* Abilities */}
                <div className="section-abilities">
                    <div className="abilities-title">Abilities</div>
                    <div className="abilities-grid">
                        {abilitiesData.map((ability) => (
                            <div className="ability-card" key={ability.name}>
                                <span className="ability-name">{ability.name}</span>
                                <span className="ability-score">{ability.score}</span>
                                <span className="ability-modifier">
                                    {ability.modifier >= 0 ? `+${ability.modifier}` : `${ability.modifier}`}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Skills & Proficiencies */}
                <div className="section-skills">
                    <div className="skills-title">Skills & Proficiencies</div>
                    <div className="skills-grid">
                        {character.skills.map((skill, index) => {
                            const bonus = getSkillBonus(skill);
                            return (
                                <div className="skill-card" key={skill.name}>
                                    <div className="skill-left">
                                        <div
                                            className="skill-check"
                                            onClick={() => toggleProficient(index)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {skill.proficient ? (
                                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M12.7143 4.40178L5.7143 11.4018C5.65334 11.463 5.58089 11.5115 5.50112 11.5446C5.42135 11.5777 5.33583 11.5948 5.24946 11.5948C5.16309 11.5948 5.07757 11.5777 4.9978 11.5446C4.91803 11.5115 4.84558 11.463 4.78462 11.4018L1.72212 8.33928C1.66107 8.27823 1.61265 8.20576 1.57961 8.12601C1.54658 8.04625 1.52957 7.96076 1.52957 7.87443C1.52957 7.78811 1.54658 7.70262 1.57961 7.62286C1.61265 7.5431 1.66107 7.47063 1.72212 7.40959C1.78316 7.34855 1.85563 7.30012 1.93539 7.26709C2.01515 7.23405 2.10063 7.21705 2.18696 7.21705C2.27329 7.21705 2.35877 7.23405 2.43853 7.26709C2.51829 7.30012 2.59076 7.34855 2.6518 7.40959L5.25001 10.0078L11.7857 3.47318C11.909 3.3499 12.0762 3.28064 12.2506 3.28064C12.4249 3.28064 12.5921 3.3499 12.7154 3.47318C12.8387 3.59647 12.9079 3.76368 12.9079 3.93803C12.9079 4.11238 12.8387 4.27959 12.7154 4.40287L12.7143 4.40178Z"
                                                        fill="white"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="0.5" y="0.5" width="13" height="13" stroke="white" strokeOpacity="0.5" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className="skill-name">{skill.name} ({skill.attribute})</span>
                                    </div>
                                    <span className="skill-bonus">{bonus >= 0 ? `+${bonus}` : `${bonus}`}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Tool Proficiencies */}
                <div className="section-tools">
                    <div className="tools-title">Tool Proficiencies</div>
                    {character.toolProficiencies && character.toolProficiencies.length > 0 ? (
                        <div className="tools-grid">
                            {character.toolProficiencies.map((tool, index) => (
                                <span key={index} className="tool-tag">{tool}</span>
                            ))}
                        </div>
                    ) : (
                        <div className="tools-empty">No tool proficiencies</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CharacterContainer;