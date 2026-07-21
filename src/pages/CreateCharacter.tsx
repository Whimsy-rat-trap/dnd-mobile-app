import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCharacters } from '../context/CharacterContext';
import { DND_CLASSES } from '../constants/classes';
import { DND_RACES } from '../constants/races';
import { DND_BACKGROUNDS } from '../constants/backgrounds';
import { CLASS_HIT_DICE } from '../constants/classHitDice';
import { RACIAL_BONUSES } from '../constants/racialBonuses';
import './CreateCharacter.css';

const CreateCharacter: React.FC = () => {
    const navigate = useNavigate();
    const { addCharacter } = useCharacters();
    const today = new Date().toISOString().split('T')[0];
    const [searchParams] = useSearchParams();
    const mode = searchParams.get('mode') || 'creative';
    const isCreative = mode === 'creative';

    const [formData, setFormData] = useState({
        name: '',
        class: DND_CLASSES[0],
        race: DND_RACES[0],
        background: DND_BACKGROUNDS[0].name,
        level: 1,
        hp: 10,
        maxHp: 10,
        tempHp: 0,
        exp: 0,
        ac: 10,
        speed: 30,
        abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    });

    const [selectedBonusAttrs, setSelectedBonusAttrs] = useState<(string | null)[]>([]);

    // При изменении расы сбрасываем выбранные бонусы
    useEffect(() => {
        const raceBonus = RACIAL_BONUSES[formData.race];
        if (!raceBonus) {
            setSelectedBonusAttrs([]);
            return;
        }
        if (raceBonus.fixed) {
            setSelectedBonusAttrs([]);
        } else if (raceBonus.choose) {
            setSelectedBonusAttrs(new Array(raceBonus.choose.count).fill(null));
        }
    }, [formData.race]);

    // При изменении класса или CON в режиме rules обновляем maxHp
    useEffect(() => {
        if (!isCreative) {
            const conMod = Math.floor((formData.abilities.con - 10) / 2);
            const hitDie = CLASS_HIT_DICE[formData.class] || 6;
            const calculatedMaxHp = hitDie + conMod;
            setFormData(prev => ({
                ...prev,
                maxHp: calculatedMaxHp,
                hp: calculatedMaxHp,
            }));
        }
    }, [formData.class, formData.abilities.con, isCreative]);

    // При изменении DEX в режиме rules обновляем AC
    useEffect(() => {
        if (!isCreative) {
            const dexMod = Math.floor((formData.abilities.dex - 10) / 2);
            setFormData(prev => ({
                ...prev,
                ac: 10 + dexMod,
            }));
        }
    }, [formData.abilities.dex, isCreative]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: ['level', 'hp', 'maxHp', 'tempHp', 'exp', 'ac', 'speed'].includes(name)
                ? Number(value)
                : value,
        }));
    };

    const handleAbilityChange = (ability: keyof typeof formData.abilities, value: number) => {
        setFormData(prev => ({
            ...prev,
            abilities: { ...prev.abilities, [ability]: value },
        }));
    };

    const handleBonusSelect = (index: number, attr: string) => {
        const newAttrs = [...selectedBonusAttrs];
        const existingIndex = newAttrs.indexOf(attr);
        if (existingIndex !== -1 && existingIndex !== index) {
            newAttrs[existingIndex] = null;
        }
        newAttrs[index] = attr;
        setSelectedBonusAttrs(newAttrs);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let finalData = { ...formData };
        if (!isCreative) {
            const conMod = Math.floor((formData.abilities.con - 10) / 2);
            const hitDie = CLASS_HIT_DICE[formData.class] || 6;
            const calculatedMaxHp = hitDie + conMod;
            finalData.maxHp = calculatedMaxHp;
            finalData.hp = calculatedMaxHp;
            finalData.ac = 10 + Math.floor((formData.abilities.dex - 10) / 2);
            finalData.speed = 30;
        }

        // Применяем расовые бонусы
        const abilitiesWithBonuses = { ...finalData.abilities };
        const raceBonus = RACIAL_BONUSES[finalData.race];
        if (raceBonus) {
            if (raceBonus.fixed) {
                for (const [attr, bonus] of Object.entries(raceBonus.fixed)) {
                    if (abilitiesWithBonuses.hasOwnProperty(attr)) {
                        abilitiesWithBonuses[attr as keyof typeof abilitiesWithBonuses] += bonus;
                    }
                }
            } else if (raceBonus.choose) {
                for (const attr of selectedBonusAttrs) {
                    if (attr && abilitiesWithBonuses.hasOwnProperty(attr)) {
                        abilitiesWithBonuses[attr as keyof typeof abilitiesWithBonuses] += raceBonus.choose.bonus;
                    }
                }
            }
        }

        // ---- ОДНО ОБЪЯВЛЕНИЕ bg ----
        const bg = DND_BACKGROUNDS.find(b => b.name === finalData.background);

        // Применяем бонусы background-a к способностям
        if (bg && bg.abilityBonuses) {
            for (const [attr, bonus] of Object.entries(bg.abilityBonuses)) {
                if (abilitiesWithBonuses.hasOwnProperty(attr)) {
                    abilitiesWithBonuses[attr as keyof typeof abilitiesWithBonuses] += bonus;
                }
            }
        }
        finalData.abilities = abilitiesWithBonuses;

        // Создаём список навыков с учётом выбранных от background-а
        const defaultSkills = [
            { name: 'Acrobatics', attribute: 'DEX', proficient: false },
            { name: 'Animal Handling', attribute: 'WIS', proficient: false },
            { name: 'Arcana', attribute: 'INT', proficient: false },
            { name: 'Athletics', attribute: 'STR', proficient: false },
            { name: 'Deception', attribute: 'CHA', proficient: false },
            { name: 'History', attribute: 'INT', proficient: false },
            { name: 'Insight', attribute: 'WIS', proficient: false },
            { name: 'Intimidation', attribute: 'CHA', proficient: false },
            { name: 'Investigation', attribute: 'INT', proficient: false },
            { name: 'Medicine', attribute: 'WIS', proficient: false },
            { name: 'Nature', attribute: 'INT', proficient: false },
            { name: 'Perception', attribute: 'WIS', proficient: false },
            { name: 'Performance', attribute: 'CHA', proficient: false },
            { name: 'Persuasion', attribute: 'CHA', proficient: false },
            { name: 'Religion', attribute: 'INT', proficient: false },
            { name: 'Sleight of Hand', attribute: 'DEX', proficient: false },
            { name: 'Stealth', attribute: 'DEX', proficient: false },
            { name: 'Survival', attribute: 'WIS', proficient: false },
        ];

        const backgroundSkills = bg ? bg.skillProficiencies : [];
        const skillsWithProficiencies = defaultSkills.map(skill => {
            if (backgroundSkills.includes(skill.name)) {
                return { ...skill, proficient: true };
            }
            return skill;
        });

        // Получаем tool proficiencies из background-а (используем тот же bg)
        const toolProficiencies = bg?.toolProficiencies?.map(tool => ({
            name: tool.name,
            attribute: tool.attribute || 'DEX',
            proficient: true,
        })) || [];

        const newCharacter = {
            ...finalData,
            classes: [finalData.class],
            skills: skillsWithProficiencies,
            toolProficiencies: toolProficiencies,
            status: 'active' as const,
            created: today,
            lastUsed: today,
            died: undefined,
            archived: undefined,
            diceLogs: {},
            deathSuccesses: 0,
            deathFailures: 0,
            isStable: false,
            inventory: [],
            spells: [],
            quests: [],
            campaigns: [],
        };
        addCharacter(newCharacter);
        navigate('/hub');
    };

    // Определяем бонусы для текущей расы
    const raceBonuses = RACIAL_BONUSES[formData.race] || null;

    return (
        <div className="page create-character-page">
            <div className="create-character-header">
                <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
                <h1>Create Character</h1>
            </div>
            <form onSubmit={handleSubmit} className="create-character-form">
                <div className="form-group">
                    <label>Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Class *</label>
                        <select name="class" value={formData.class} onChange={handleChange} required>
                            {DND_CLASSES.map(cls => (
                                <option key={cls} value={cls}>{cls}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Race *</label>
                        <select name="race" value={formData.race} onChange={handleChange} required>
                            {DND_RACES.map(race => (
                                <option key={race} value={race}>{race}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Background *</label>
                        <select name="background" value={formData.background} onChange={handleChange} required>
                            {DND_BACKGROUNDS.map(bg => (
                                <option key={bg.name} value={bg.name}>{bg.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Level *</label>
                        <input type="number" name="level" value={formData.level} onChange={handleChange} min="1" required />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>HP *</label>
                        <input type="number" name="hp" value={formData.hp} onChange={handleChange} min="0" required />
                    </div>
                    {isCreative && (
                        <div className="form-group">
                            <label>Max HP *</label>
                            <input type="number" name="maxHp" value={formData.maxHp} onChange={handleChange} min="0" required />
                        </div>
                    )}
                </div>

                {isCreative ? (
                    <div className="form-row">
                        <div className="form-group">
                            <label>AC</label>
                            <input type="number" name="ac" value={formData.ac} onChange={handleChange} min="0" />
                        </div>
                        <div className="form-group">
                            <label>Speed (ft)</label>
                            <input type="number" name="speed" value={formData.speed} onChange={handleChange} min="0" />
                        </div>
                    </div>
                ) : (
                    <div className="info-text">HP, AC and Speed are calculated automatically based on your class, race and abilities.</div>
                )}

                <div className="form-group">
                    <label>Background Skill Proficiencies</label>
                    {(() => {
                        const bg = DND_BACKGROUNDS.find(b => b.name === formData.background);
                        if (!bg) return null;
                        return (
                            <div className="background-skills-display">
                                {bg.skillProficiencies.map(skill => (
                                    <span key={skill} className="bg-skill-tag">{skill}</span>
                                ))}
                            </div>
                        );
                    })()}
                </div>

                <div className="form-group">
                    <label>Background Tool Proficiencies</label>
                    {(() => {
                        const bg = DND_BACKGROUNDS.find(b => b.name === formData.background);
                        if (!bg || !bg.toolProficiencies || bg.toolProficiencies.length === 0) {
                            return <div className="tools-empty">None</div>;
                        }
                        return (
                            <div className="background-skills-display">
                                {bg.toolProficiencies.map(tool => (
                                    <span key={tool.name} className="bg-skill-tag">{tool.name}</span>
                                ))}
                            </div>
                        );
                    })()}
                </div>

                <div className="form-group">
                    <label>Ability Scores</label>
                    <div className="ability-grid">
                        {Object.entries(formData.abilities).map(([key, value]) => {
                            const attr = key as keyof typeof formData.abilities;
                            let bonusDisplay = null;
                            if (raceBonuses) {
                                if (raceBonuses.fixed && raceBonuses.fixed[attr]) {
                                    const bonus = raceBonuses.fixed[attr];
                                    bonusDisplay = <span className="ability-bonus">+{bonus}</span>;
                                } else if (raceBonuses.choose && selectedBonusAttrs.includes(attr)) {
                                    const bonus = raceBonuses.choose.bonus;
                                    bonusDisplay = <span className="ability-bonus">+{bonus}</span>;
                                }
                            }
                            // Бонусы от background-a
                            const bg = DND_BACKGROUNDS.find(b => b.name === formData.background);
                            if (bg && bg.abilityBonuses && bg.abilityBonuses[attr]) {
                                const bgBonus = bg.abilityBonuses[attr];
                                if (bonusDisplay) {
                                    bonusDisplay = (
                                        <>
                                            {bonusDisplay}
                                            <span className="ability-bonus bg-bonus">+{bgBonus}</span>
                                        </>
                                    );
                                } else {
                                    bonusDisplay = <span className="ability-bonus">+{bgBonus}</span>;
                                }
                            }
                            return (
                                <div key={key} className="ability-input">
                                    <label>{key.toUpperCase()}</label>
                                    <div className="ability-input-wrapper">
                                        <input
                                            type="number"
                                            value={value}
                                            onChange={(e) =>
                                                handleAbilityChange(attr, Number(e.target.value))
                                            }
                                            min="1"
                                            max="30"
                                        />
                                        {bonusDisplay}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {raceBonuses && raceBonuses.choose && (() => {
                    const choose = raceBonuses.choose;
                    return (
                        <div className="form-group">
                            <label>Assign racial bonuses (choose {choose.count} attributes)</label>
                            <div className="bonus-selectors">
                                {selectedBonusAttrs.map((selectedAttr, index) => (
                                    <select
                                        key={index}
                                        value={selectedAttr || ''}
                                        onChange={(e) => handleBonusSelect(index, e.target.value)}
                                        className="bonus-select"
                                    >
                                        <option value="">Select attribute</option>
                                        {choose.options.map(opt => {
                                            const isSelected = selectedBonusAttrs.includes(opt) && selectedBonusAttrs.indexOf(opt) !== index;
                                            return (
                                                <option key={opt} value={opt} disabled={isSelected}>
                                                    {opt.toUpperCase()}
                                                </option>
                                            );
                                        })}
                                    </select>
                                ))}
                            </div>
                        </div>
                    );
                })()}

                <button type="submit" className="submit-btn">Create Character</button>
            </form>
        </div>
    );
};

export default CreateCharacter;