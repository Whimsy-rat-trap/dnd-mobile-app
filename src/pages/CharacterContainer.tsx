import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCharacters } from '../context/CharacterContext';
import SkillCheck from '../components/SkillCheck';
import { RACE_FEATURES } from '../constants/raceFeatures';
import DiceRoller from '../components/DiceRoller';
import { getSpellSlots, getMaxPrepared } from '../utils/spellcasting';
import Modal from '../components/Modal';
import './CharacterContainer.css';

const CharacterContainer: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getCharacter, updateCharacter, setCurrentCharacterId } = useCharacters();
    const character = id ? getCharacter(id) : undefined;

    // Состояние для переключателя variant
    const [useVariant, setUseVariant] = useState(false);
    // Состояние для раскрытия списка расовых фич
    const [isRaceFeaturesOpen, setIsRaceFeaturesOpen] = useState(true);
    // Состояние для выбранной расовой фичи (для отображения описания)
    const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
    // Бэкапы для восстановления при выключении variant
    const [backupSkillAttributes, setBackupSkillAttributes] = useState<{ name: string; attribute: string }[]>([]);
    const [backupToolAttributes, setBackupToolAttributes] = useState<{ name: string; attribute: string }[]>([]);

    // Roll mode
    const [rollMode, setRollMode] = useState(false);
    const [rollResultModal, setRollResultModal] = useState<{ type: 'saving' | 'skill'; name: string; modifier: number; result?: number } | null>(null);
    const [isRolling, setIsRolling] = useState(false);

    // Состояния для попапа HP
    const [hpPopupOpen, setHpPopupOpen] = useState(false);
    const [hpInputValue, setHpInputValue] = useState(0);
    const [tempInputValue, setTempInputValue] = useState(0);

    if (!character) {
        return <div className="cc-page">Character not found</div>;
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

    // Вычисление бонуса навыка
    const getSkillBonus = (skill: typeof character.skills[0]) => {
        const attrKey = skill.attribute.toLowerCase() as keyof typeof character.abilities;
        const mod = getModifier(attrKey);
        return skill.proficient ? mod + proficiencyBonus : mod;
    };

    // Вычисление бонуса инструмента
    const getToolBonus = (tool: typeof character.toolProficiencies[0]) => {
        const attrKey = (tool.attribute || 'DEX').toLowerCase() as keyof typeof character.abilities;
        const mod = getModifier(attrKey);
        return tool.proficient ? mod + proficiencyBonus : mod;
    };

    // Получение бонуса спасброска
    const getSavingThrowBonus = (attr: keyof typeof character.abilities) => {
        const mod = getModifier(attr);
        const profs = character.savingThrowProficiencies || [];
        const isProficient = profs.includes(attr.toUpperCase());
        return isProficient ? mod + proficiencyBonus : mod;
    };

    // Данные для спасбросков
    const savingThrowsData = [
        { name: 'STR', bonus: getSavingThrowBonus('str') },
        { name: 'DEX', bonus: getSavingThrowBonus('dex') },
        { name: 'CON', bonus: getSavingThrowBonus('con') },
        { name: 'INT', bonus: getSavingThrowBonus('int') },
        { name: 'WIS', bonus: getSavingThrowBonus('wis') },
        { name: 'CHA', bonus: getSavingThrowBonus('cha') },
    ];

    // Переключение владения спасброском
    const toggleSavingThrowProficiency = (attr: string) => {
        if (rollMode) {
            handleSavingThrowRoll(attr);
            return;
        }
        const profs = character.savingThrowProficiencies || [];
        const updated = profs.includes(attr)
            ? profs.filter(p => p !== attr)
            : [...profs, attr];
        updateCharacter(character.id, { savingThrowProficiencies: updated });
    };

    // Бросок спасброска
    const handleSavingThrowRoll = (attr: string) => {
        const bonus = getSavingThrowBonus(attr.toLowerCase() as keyof typeof character.abilities);
        const roll = Math.floor(Math.random() * 20) + 1;
        setRollResultModal({
            type: 'saving',
            name: `${attr} Saving Throw`,
            modifier: bonus,
            result: roll,
        });
        setIsRolling(true);
    };

    // Бросок навыка
    const handleSkillRoll = (skill: typeof character.skills[0]) => {
        const bonus = getSkillBonus(skill);
        const roll = Math.floor(Math.random() * 20) + 1;
        setRollResultModal({
            type: 'skill',
            name: skill.name,
            modifier: bonus,
            result: roll,
        });
        setIsRolling(true);
    };

    const handleToolRoll = (tool: typeof character.toolProficiencies[0]) => {
        const bonus = getToolBonus(tool);
        const roll = Math.floor(Math.random() * 20) + 1;
        setRollResultModal({
            type: 'skill',
            name: tool.name,
            modifier: bonus,
            result: roll,
        });
        setIsRolling(true);
    };

    const toggleSkillProficient = (index: number) => {
        const updatedSkills = character.skills.map((s, i) =>
            i === index ? { ...s, proficient: !s.proficient } : s
        );
        updateCharacter(character.id, { skills: updatedSkills });
    };

    // Переключение proficient для инструмента
    const toggleToolProficient = (index: number) => {
        const updatedTools = character.toolProficiencies.map((t, i) =>
            i === index ? { ...t, proficient: !t.proficient } : t
        );
        updateCharacter(character.id, { toolProficiencies: updatedTools });
    };

    // Изменение атрибута для навыка (variant mode)
    const handleSkillAttributeChange = (index: number, newAttr: string) => {
        const updatedSkills = character.skills.map((s, i) =>
            i === index ? { ...s, attribute: newAttr } : s
        );
        updateCharacter(character.id, { skills: updatedSkills });
    };

    // Изменение атрибута для инструмента (variant mode)
    const handleToolAttributeChange = (index: number, newAttr: string) => {
        const updatedTools = character.toolProficiencies.map((t, i) =>
            i === index ? { ...t, attribute: newAttr } : t
        );
        updateCharacter(character.id, { toolProficiencies: updatedTools });
    };

    // Переключение variant-режима с сохранением/восстановлением атрибутов
    const handleVariantToggle = () => {
        if (!useVariant) {
            // Включаем variant: сохраняем текущие атрибуты
            const skillAttrs = character.skills.map(s => ({ name: s.name, attribute: s.attribute }));
            const toolAttrs = character.toolProficiencies.map(t => ({ name: t.name, attribute: t.attribute || 'DEX' }));
            setBackupSkillAttributes(skillAttrs);
            setBackupToolAttributes(toolAttrs);
        } else {
            // Выключаем variant: восстанавливаем атрибуты из бэкапа
            const restoredSkills = character.skills.map(skill => {
                const backup = backupSkillAttributes.find(b => b.name === skill.name);
                return backup ? { ...skill, attribute: backup.attribute } : skill;
            });
            const restoredTools = character.toolProficiencies.map(tool => {
                const backup = backupToolAttributes.find(b => b.name === tool.name);
                return backup ? { ...tool, attribute: backup.attribute } : tool;
            });
            updateCharacter(character.id, { skills: restoredSkills, toolProficiencies: restoredTools });
        }
        setUseVariant(!useVariant);
    };

    // Функции для управления HP
    const addHp = (amount: number) => {
        if (amount <= 0) return;
        const newHp = Math.min(character.hp + amount, character.maxHp);
        updateCharacter(character.id, { hp: newHp });
    };

    const subtractHp = (amount: number) => {
        if (amount <= 0) return;
        const newHp = Math.max(character.hp - amount, 0);
        updateCharacter(character.id, { hp: newHp });
    };

    const addTempHp = (amount: number) => {
        if (amount <= 0) return;
        const newTemp = (character.tempHp || 0) + amount;
        updateCharacter(character.id, { tempHp: newTemp });
    };

    const subtractTempHp = (amount: number) => {
        if (amount <= 0) return;
        const newTemp = Math.max((character.tempHp || 0) - amount, 0);
        updateCharacter(character.id, { tempHp: newTemp });
    };

    // Функция для рендера шеврона
    const renderChevron = (isOpen: boolean) => (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`cc-chevron-icon ${isOpen ? 'cc-open' : ''}`}
        >
            <g clipPath="url(#clip0_403_3483)">
                <path
                    d="M22.586 5.92896L12.707 15.808C12.5169 15.9904 12.2636 16.0923 12 16.0923C11.7365 16.0923 11.4832 15.9904 11.293 15.808L1.42004 5.93396L0.00604248 7.34796L9.87904 17.222C10.4509 17.767 11.2106 18.071 12.0005 18.071C12.7905 18.071 13.5502 17.767 14.122 17.222L24 7.34296L22.586 5.92896Z"
                    fill="#374957"
                />
            </g>
            <defs>
                <clipPath id="clip0_403_3483">
                    <rect width="24" height="24" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );

    // Данные способностей из персонажа
    const abilitiesData = [
        { name: 'STR', score: character.abilities.str, modifier: getModifier('str') },
        { name: 'CON', score: character.abilities.con, modifier: getModifier('con') },
        { name: 'WIS', score: character.abilities.wis, modifier: getModifier('wis') },
        { name: 'DEX', score: character.abilities.dex, modifier: getModifier('dex') },
        { name: 'INT', score: character.abilities.int, modifier: getModifier('int') },
        { name: 'CHA', score: character.abilities.cha, modifier: getModifier('cha') },
    ];

    const classDisplay = character.classes && character.classes.length > 0
        ? character.classes.join(' / ')
        : 'No class';

    const raceFeatures = RACE_FEATURES[character.race] || [];

    // Функция для переключения выбранной фичи (toggle)
    const toggleFeature = (featureName: string) => {
        if (selectedFeature === featureName) {
            setSelectedFeature(null);
        } else {
            setSelectedFeature(featureName);
        }
    };

    // Roll mode toggle
    const toggleRollMode = () => setRollMode(!rollMode);

    const closeRollModal = () => {
        setRollResultModal(null);
        setIsRolling(false);
    };

    // Закрытие попапа HP
    const closeHpPopup = () => {
        setHpPopupOpen(false);
        setHpInputValue(0);
        setTempInputValue(0);
    };

    // HP и temp HP для отображения
    const hp = character.hp;
    const maxHp = character.maxHp;
    const tempHp = character.tempHp || 0;
    const hpPercent = (hp / maxHp) * 100;
    const tempPercent = (tempHp / maxHp) * 100;

    // Получение слотов заклинаний (если есть)
    const spellSlots = getSpellSlots(character);
    const maxPrepared = getMaxPrepared(character);
    const totalSlots = spellSlots.reduce((a: number, b: number) => a + b, 0);
    const preparedCount = character.spells.filter(s => s.prepared).length;
    const knownCount = character.spells.length;

    return (
        <div className="cc-page">
            <header className="cc-header">
                <button className="cc-back-btn" onClick={handleBack}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.5 10C17.5 10.1658 17.4342 10.3247 17.3169 10.4419C17.1997 10.5592 17.0408 10.625 16.875 10.625H4.6336L9.19219 15.1828C9.25026 15.2409 9.29632 15.3098 9.32775 15.3857C9.35918 15.4616 9.37535 15.5429 9.37535 15.625C9.37535 15.7071 9.35918 15.7884 9.32775 15.8643C9.29632 15.9402 9.25026 16.0091 9.19219 16.0672C9.13412 16.1253 9.06518 16.1713 8.98931 16.2027C8.91344 16.2342 8.83213 16.2503 8.75 16.2503C8.66788 16.2503 8.58656 16.2342 8.51069 16.2027C8.43482 16.1713 8.36588 16.1253 8.30782 16.0672L2.68282 10.4422C2.62471 10.3841 2.57861 10.3152 2.54715 10.2393C2.5157 10.1635 2.49951 10.0821 2.49951 10C2.49951 9.91787 2.5157 9.83654 2.54715 9.76066C2.57861 9.68479 2.62471 9.61586 2.68282 9.55781L8.30782 3.93281C8.42509 3.81554 8.58415 3.74965 8.75 3.74965C8.91586 3.74965 9.07492 3.81554 9.19219 3.93281C9.30947 4.05009 9.37535 4.20915 9.37535 4.375C9.37535 4.54085 9.30947 4.69991 9.19219 4.81719L4.6336 9.375H16.875C17.0408 9.375 17.1997 9.44085 17.3169 9.55806C17.4342 9.67527 17.5 9.83424 17.5 10Z" fill="#9CA3AF" />
                    </svg>
                </button>
                <div className="cc-header-info">
                    <div className="cc-title">Character Sheet</div>
                    <div className="cc-subtitle">{character.name}</div>
                </div>
                <button
                    className="cc-set-current-btn"
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

            <div className="cc-content">
                <div className="cc-section-info">
                    <div className="cc-info-title">Character Details</div>
                    <div className="cc-info-grid">
                        <div className="cc-info-item">
                            <span className="cc-info-label">Level</span>
                            <span className="cc-info-value">{character.level}</span>
                        </div>
                        <div className="cc-info-item">
                            <span className="cc-info-label">Class</span>
                            <span className="cc-info-value">{classDisplay}</span>
                        </div>
                        <div className="cc-info-item">
                            <span className="cc-info-label">Race</span>
                            <span className="cc-info-value">{character.race}</span>
                        </div>
                    </div>
                    <div className="cc-info-grid">
                        <div className="cc-info-item">
                            <span className="cc-info-label">Background</span>
                            <span className="cc-info-value">{character.background}</span>
                        </div>
                        <div className="cc-info-item">
                            <span className="cc-info-label">Subrace</span>
                            <span className="cc-info-value">{character.subrace || '—'}</span>
                        </div>
                        <div className="cc-info-item">
                            <span className="cc-info-label">AC</span>
                            <span className="cc-info-value">{character.ac || '—'}</span>
                        </div>
                    </div>
                    <div className="cc-info-grid">
                        <div className="cc-info-item">
                            <span className="cc-info-label">Speed</span>
                            <span className="cc-info-value">{character.speed ? `${character.speed} ft` : '—'}</span>
                        </div>
                        <div className="cc-info-item">
                            <span className="cc-info-label">Size</span>
                            <span className="cc-info-value">{character.size || 'Medium'}</span>
                        </div>
                        <div className="cc-info-item">
                            <span className="cc-info-label">Creature Type</span>
                            <span className="cc-info-value">{character.creatureType || 'Humanoid'}</span>
                        </div>
                    </div>
                    <div className="cc-info-grid">
                        <div className="cc-info-item">
                            <span className="cc-info-label">Proficiency Bonus</span>
                            <span className="cc-info-value">+{proficiencyBonus}</span>
                        </div>
                    </div>
                </div>

                {/* HP Section */}
                <div className="cc-section-hp" onClick={() => setHpPopupOpen(true)} style={{ cursor: 'pointer' }}>
                    <div className="cc-hp-title">Hit Points</div>
                    <div className="cc-hp-display">
                        <span className="cc-hp-current">{hp}</span>
                        <span className="cc-hp-separator">/</span>
                        <span className="cc-hp-max">{maxHp}</span>
                        {tempHp > 0 && <span className="cc-temp-hp-value"> +{tempHp} temp</span>}
                    </div>
                    <div className="cc-stat-progress">
                        <div className="cc-progress-track">
                            <div className="cc-hp-fill" style={{ width: `${hpPercent}%` }}></div>
                            {tempHp > 0 && <div className="cc-temp-fill" style={{ width: `${tempPercent}%` }}></div>}
                        </div>
                    </div>
                </div>

                <div className="cc-section-abilities">
                    <div className="cc-abilities-title">Abilities</div>
                    <div className="cc-abilities-grid">
                        {abilitiesData.map((ability) => (
                            <div className="cc-ability-card" key={ability.name}>
                                <span className="cc-ability-name">{ability.name}</span>
                                <span className="cc-ability-score">{ability.score}</span>
                                <span className="cc-ability-modifier">
                                    {ability.modifier >= 0 ? `+${ability.modifier}` : `${ability.modifier}`}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Spellcasting */}
                {(character.classLevels?.some(cl =>
                    ['Bard','Cleric','Druid','Sorcerer','Wizard','Paladin','Ranger','Artificer','Warlock'].includes(cl.className)
                ) || character.spells.length > 0) && (
                    <div className="cc-section-spellcasting">
                        <div className="cc-spellcasting-header">
                            <span className="cc-spellcasting-title">Spellcasting</span>
                            <Link to="/spellbook" className="cc-view-full-spellbook">View Full Spellbook</Link>
                        </div>
                        <div className="cc-spell-stats">
                            <div className="cc-stat-item">
                                <span className="cc-stat-label">Spell Slots</span>
                                <span className="cc-stat-value">{totalSlots}</span>
                            </div>
                            <div className="cc-stat-item">
                                <span className="cc-stat-label">Prepared</span>
                                <span className="cc-stat-value">{preparedCount} / {maxPrepared}</span>
                            </div>
                            <div className="cc-stat-item">
                                <span className="cc-stat-label">Known</span>
                                <span className="cc-stat-value">{knownCount}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Saving Throws */}
                <div className="cc-section-saving-throws">
                    <div className="cc-saving-throws-header">
                        <span className="cc-saving-throws-title">Saving Throws</span>
                        <button
                            className={`cc-roll-mode-toggle ${rollMode ? 'cc-active' : ''}`}
                            onClick={toggleRollMode}
                        >
                            {rollMode ? 'Roll Mode ON' : 'Roll Mode OFF'}
                        </button>
                    </div>
                    <div className="cc-saving-throws-grid">
                        {savingThrowsData.map((st) => {
                            const isProficient = (character.savingThrowProficiencies || []).includes(st.name);
                            return (
                                <div
                                    className={`cc-saving-throw-card ${isProficient ? 'cc-proficient' : ''} ${rollMode ? 'cc-rollable' : ''}`}
                                    key={st.name}
                                    onClick={() => toggleSavingThrowProficiency(st.name)}
                                >
                                    <span className="cc-saving-throw-name">{st.name}</span>
                                    <span className="cc-saving-throw-bonus">
                                        {st.bonus >= 0 ? `+${st.bonus}` : `${st.bonus}`}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Race Features */}
                <div className="cc-race-features-section">
                    <div
                        className="cc-race-features-header"
                        onClick={() => setIsRaceFeaturesOpen(!isRaceFeaturesOpen)}
                    >
                        <span className="cc-race-features-title">Race Features</span>
                        {renderChevron(isRaceFeaturesOpen)}
                    </div>
                    {isRaceFeaturesOpen && (
                        <>
                            <div className="cc-race-features-list">
                                {raceFeatures.length > 0 ? (
                                    raceFeatures.map((feature, idx) => (
                                        <span
                                            key={idx}
                                            className={`cc-race-feature-tag ${selectedFeature === feature.name ? 'cc-active' : ''}`}
                                            onClick={() => toggleFeature(feature.name)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {feature.name}
                                        </span>
                                    ))
                                ) : (
                                    <span className="cc-race-features-empty">No features for this race</span>
                                )}
                            </div>
                            {selectedFeature && (
                                <div className="cc-race-feature-description">
                                    {raceFeatures.find(f => f.name === selectedFeature)?.description}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Переключатель variant */}
                <div className="cc-variant-toggle-container">
                    <label className="cc-variant-toggle">
                        <span className="cc-toggle-label">Use Skills with Different Abilities variant rule?</span>
                        <input
                            type="checkbox"
                            checked={useVariant}
                            onChange={handleVariantToggle}
                        />
                        <span className="cc-toggle-slider"></span>
                    </label>
                </div>

                {/* Skills & Proficiencies */}
                <div className="cc-section-skills">
                    <div className="cc-skills-header">
                        <span className="cc-skills-title">Skills & Proficiencies</span>
                        {rollMode && <span className="cc-roll-hint">Click a skill to roll</span>}
                    </div>
                    <div className="cc-skills-grid">
                        {character.skills.map((skill, index) => {
                            const bonus = getSkillBonus(skill);
                            return (
                                <div
                                    className={`cc-skill-card ${rollMode ? 'cc-rollable' : ''}`}
                                    key={skill.name}
                                    onClick={rollMode ? () => handleSkillRoll(skill) : undefined}
                                >
                                    <div className="cc-skill-left">
                                        {!rollMode && (
                                            <SkillCheck
                                                proficient={skill.proficient}
                                                onToggle={() => toggleSkillProficient(index)}
                                            />
                                        )}
                                        <span className="cc-skill-name">{skill.name} ({skill.attribute})</span>
                                    </div>
                                    <div className="cc-skill-right">
                                        {useVariant && (
                                            <select
                                                value={skill.attribute}
                                                onChange={(e) => handleSkillAttributeChange(index, e.target.value)}
                                                className="cc-attr-select"
                                            >
                                                {['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map(attr => (
                                                    <option key={attr} value={attr}>{attr}</option>
                                                ))}
                                            </select>
                                        )}
                                        <span className="cc-skill-bonus">{bonus >= 0 ? `+${bonus}` : `${bonus}`}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Tool Proficiencies */}
                <div className="cc-section-tools">
                    <div className="cc-tools-title">Tool Proficiencies</div>
                    {character.toolProficiencies && character.toolProficiencies.length > 0 ? (
                        <div className="cc-skills-grid">
                            {character.toolProficiencies.map((tool, index) => {
                                const bonus = getToolBonus(tool);
                                return (
                                    <div
                                        className={`cc-skill-card ${rollMode ? 'cc-rollable' : ''}`}
                                        key={tool.name}
                                        onClick={rollMode ? () => handleToolRoll(tool) : undefined}
                                    >
                                        <div className="cc-skill-left">
                                            {!rollMode && (
                                                <SkillCheck
                                                    proficient={tool.proficient}
                                                    onToggle={() => toggleToolProficient(index)}
                                                />
                                            )}
                                            <span className="cc-skill-name">{tool.name} ({tool.attribute || 'DEX'})</span>
                                        </div>
                                        <div className="cc-skill-right">
                                            {useVariant && (
                                                <select
                                                    value={tool.attribute || 'DEX'}
                                                    onChange={(e) => handleToolAttributeChange(index, e.target.value)}
                                                    className="cc-attr-select"
                                                >
                                                    {['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map(attr => (
                                                        <option key={attr} value={attr}>{attr}</option>
                                                    ))}
                                                </select>
                                            )}
                                            <span className="cc-skill-bonus">{bonus >= 0 ? `+${bonus}` : `${bonus}`}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="cc-tools-empty">No tool proficiencies</div>
                    )}
                </div>

                {/* Languages */}
                <div className="cc-section-languages">
                    <div className="cc-languages-title">Languages</div>
                    {character.languages && character.languages.length > 0 ? (
                        <div className="cc-languages-grid">
                            {character.languages.map((lang, index) => (
                                <span key={index} className="cc-language-tag">{lang}</span>
                            ))}
                        </div>
                    ) : (
                        <div className="cc-languages-empty">No languages</div>
                    )}
                </div>
            </div>

            {/* Roll Result Modal */}
            <Modal isOpen={!!rollResultModal} onClose={closeRollModal}>
                {rollResultModal && (
                    <>
                        <h3 className="cc-roll-modal-title">{rollResultModal.name}</h3>
                        <div className="cc-roll-modal-dice">
                            <DiceRoller
                                sides={20}
                                initialResult={rollResultModal.result}
                                autoRoll={true}
                                displayOnly={true}
                            />
                        </div>
                        <div className="cc-roll-modal-modifier">
                            Modifier: {rollResultModal.modifier >= 0 ? `+${rollResultModal.modifier}` : `${rollResultModal.modifier}`}
                        </div>
                        <div className="cc-roll-modal-total">
                            Total: <strong>{rollResultModal.result !== undefined ? rollResultModal.result + rollResultModal.modifier : 0}</strong>
                        </div>
                    </>
                )}
            </Modal>

            {/* HP Edit Popup */}
            <Modal isOpen={hpPopupOpen} onClose={closeHpPopup}>
                <div className="cc-popup-body">
                    <h3 className="cc-popup-title">Edit HP</h3>
                    <div className="cc-popup-stat-block">
                        <span className="cc-stat-label">HP</span>
                        <div className="cc-stat-progress">
                            <div className="cc-progress-track">
                                <div className="cc-hp-fill" style={{ width: `${hpPercent}%` }}></div>
                                {tempHp > 0 && <div className="cc-temp-fill" style={{ width: `${tempPercent}%` }}></div>}
                            </div>
                        </div>
                        <span className="cc-stat-value-dashboard cc-stat-value-hp">
                            {hp} / {maxHp}
                            {tempHp > 0 && <span className="cc-temp-hp-value"> +{tempHp} temp</span>}
                        </span>
                    </div>
                    <div className="cc-popup-controls">
                        <div className="cc-control-group">
                            <label>HP Adjustment</label>
                            <div className="cc-input-group">
                                <input
                                    type="number"
                                    value={hpInputValue}
                                    onChange={(e) => setHpInputValue(Number(e.target.value))}
                                    min="0"
                                />
                                <button onClick={() => { addHp(hpInputValue); closeHpPopup(); }}>Add</button>
                                <button onClick={() => { subtractHp(hpInputValue); closeHpPopup(); }}>Subtract</button>
                            </div>
                        </div>
                        <div className="cc-control-group">
                            <label>Temp HP Adjustment</label>
                            <div className="cc-input-group">
                                <input
                                    type="number"
                                    value={tempInputValue}
                                    onChange={(e) => setTempInputValue(Number(e.target.value))}
                                    min="0"
                                />
                                <button onClick={() => { addTempHp(tempInputValue); closeHpPopup(); }}>Add Temp</button>
                                <button onClick={() => { subtractTempHp(tempInputValue); closeHpPopup(); }}>Subtract Temp</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default CharacterContainer;