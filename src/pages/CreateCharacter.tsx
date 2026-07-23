import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCharacters } from '../context/CharacterContext';
import { DND_CLASSES } from '../constants/classes';
import { DND_RACES } from '../constants/races';
import { DND_BACKGROUNDS } from '../constants/backgrounds';
import { CLASS_HIT_DICE } from '../constants/classHitDice';
import { RACIAL_BONUSES } from '../constants/racialBonuses';
import { RACE_DETAILS } from '../constants/raceDetails';
import { LANGUAGES } from '../constants/languages';
import DiceRoller from '../components/DiceRoller';
import './CreateCharacter.css';

// Вспомогательная функция для получения бонусов background-а к характеристикам
const getBackgroundAbilityBonuses = (bgName: string): { [key: string]: number } => {
    const bg = DND_BACKGROUNDS.find(b => b.name === bgName);
    return bg?.abilityBonuses || {};
};

// Генерация одного значения 4d6 drop lowest
const roll4d6DropLowest = (): number => {
    const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
    rolls.sort((a, b) => a - b);
    rolls.shift();
    return rolls.reduce((sum, r) => sum + r, 0);
};

// Стандартный набор
const standardArray = (): { str: number; dex: number; con: number; int: number; wis: number; cha: number } => {
    const array = [15, 14, 13, 12, 10, 8];
    return {
        str: array[0],
        dex: array[1],
        con: array[2],
        int: array[3],
        wis: array[4],
        cha: array[5],
    };
};

// Стоимость для Point Buy по правилам D&D 5e
const getPointBuyCost = (value: number): number => {
    if (value < 8 || value > 15) return 0;
    const costMap: Record<number, number> = {
        8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9
    };
    return costMap[value] || 0;
};

const POINT_BUY_POINTS = 27;

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
        size: 'Medium',
    });

    const [selectedBonusAttrs, setSelectedBonusAttrs] = useState<(string | null)[]>([]);

    // Для HP calculation в режиме "by rules"
    const [hpMethod, setHpMethod] = useState<'average' | 'roll'>('average');
    const [rolledHps, setRolledHps] = useState<number[]>([]);

    // Для Point Buy
    const [showPointBuy, setShowPointBuy] = useState(false);
    const [pointBuyValues, setPointBuyValues] = useState<{ str: number; dex: number; con: number; int: number; wis: number; cha: number }>({
        str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8
    });

    // Для Roll Distribution
    const [showRollDistribution, setShowRollDistribution] = useState(false);
    const [rollValues, setRollValues] = useState<number[]>([]);
    const [statAssignments, setStatAssignments] = useState<{ [key: string]: number | null }>({
        str: null, dex: null, con: null, int: null, wis: null, cha: null
    });

    // Вычисляем оставшиеся очки для Point Buy
    const getRemainingPoints = (): number => {
        const totalCost = Object.values(pointBuyValues).reduce((sum, val) => sum + getPointBuyCost(val), 0);
        return POINT_BUY_POINTS - totalCost;
    };

    // Проверка, можно ли увеличить стат
    const canIncrease = (stat: keyof typeof pointBuyValues): boolean => {
        const current = pointBuyValues[stat];
        if (current >= 15) return false;
        const nextCost = getPointBuyCost(current + 1);
        const currentCost = getPointBuyCost(current);
        const diff = nextCost - currentCost;
        return getRemainingPoints() >= diff;
    };

    // Проверка, можно ли уменьшить стат
    const canDecrease = (stat: keyof typeof pointBuyValues): boolean => {
        const current = pointBuyValues[stat];
        return current > 8;
    };

    // Изменение значения stat для Point Buy
    const handlePointBuyChange = (stat: keyof typeof pointBuyValues, delta: number) => {
        if (delta > 0 && !canIncrease(stat)) return;
        if (delta < 0 && !canDecrease(stat)) return;
        const newVal = pointBuyValues[stat] + delta;
        if (newVal < 8 || newVal > 15) return;
        const newCost = getPointBuyCost(newVal);
        const oldCost = getPointBuyCost(pointBuyValues[stat]);
        const diff = newCost - oldCost;
        if (diff > getRemainingPoints()) return;
        setPointBuyValues(prev => ({ ...prev, [stat]: newVal }));
    };

    // Применить Point Buy
    const applyPointBuy = () => {
        setFormData(prev => ({
            ...prev,
            abilities: { ...prev.abilities, ...pointBuyValues }
        }));
        setShowPointBuy(false);
    };

    // Roll Distribution
    const handleRollStats = () => {
        const stats = Array.from({ length: 6 }, () => roll4d6DropLowest());
        setRollValues(stats);
        setStatAssignments({ str: null, dex: null, con: null, int: null, wis: null, cha: null });
        setShowRollDistribution(true);
    };

    const assignRollToStat = (stat: keyof typeof statAssignments, index: number) => {
        // Проверяем, не занят ли этот индекс уже в другом стате
        const usedIndices = Object.values(statAssignments).filter(v => v !== null) as number[];
        if (usedIndices.includes(index)) {
            // Если индекс уже используется, снимаем его с предыдущего стата
            for (const key of Object.keys(statAssignments) as (keyof typeof statAssignments)[]) {
                if (statAssignments[key] === index) {
                    setStatAssignments(prev => ({ ...prev, [key]: null }));
                    break;
                }
            }
        }
        // Назначаем индекс на стат
        setStatAssignments(prev => ({ ...prev, [stat]: index }));
    };

    // Отменить назначение
    const unassignRoll = (stat: keyof typeof statAssignments) => {
        setStatAssignments(prev => ({ ...prev, [stat]: null }));
    };

    // Применить распределение
    const applyRollDistribution = () => {
        const allAssigned = Object.values(statAssignments).every(v => v !== null);
        if (!allAssigned) {
            alert('Please assign all rolled values to ability scores.');
            return;
        }
        const newAbilities = { ...formData.abilities };
        for (const [stat, index] of Object.entries(statAssignments)) {
            if (index !== null) {
                newAbilities[stat as keyof typeof newAbilities] = rollValues[index];
            }
        }
        setFormData(prev => ({ ...prev, abilities: newAbilities }));
        setShowRollDistribution(false);
    };

    // При изменении расы обновляем размер и creature type
    useEffect(() => {
        const details = RACE_DETAILS[formData.race];
        if (details) {
            let size = 'Medium';
            if (typeof details.size === 'string') {
                size = details.size;
            } else if (details.size.options) {
                size = details.size.default || details.size.options[0] || 'Medium';
            }
            setFormData(prev => ({ ...prev, size }));
        }
        // Сбрасываем выбранные бонусы для расы
        const raceBonus = RACIAL_BONUSES[formData.race];
        if (raceBonus && raceBonus.choose) {
            setSelectedBonusAttrs(new Array(raceBonus.choose.count).fill(null));
        } else {
            setSelectedBonusAttrs([]);
        }
    }, [formData.race]);

    // При переключении метода на Average сбрасываем броски
    useEffect(() => {
        if (hpMethod === 'average') {
            setRolledHps([]);
        }
    }, [hpMethod]);

    // Пересчёт HP в режиме "by rules"
    useEffect(() => {
        if (isCreative) return;

        const conMod = Math.floor((formData.abilities.con - 10) / 2);
        const hitDie = CLASS_HIT_DICE[formData.class] || 6;
        const level = formData.level;

        let totalHp = hitDie + conMod;

        if (level > 1) {
            const additionalLevels = level - 1;
            if (hpMethod === 'average') {
                const average = Math.floor(hitDie / 2) + 1;
                totalHp += additionalLevels * (average + conMod);
            } else {
                const currentRolls = rolledHps;
                if (currentRolls.length > 0) {
                    const sumRolls = currentRolls.reduce((sum, r) => sum + r + conMod, 0);
                    totalHp += sumRolls;
                }
            }
        }

        setFormData(prev => ({
            ...prev,
            maxHp: totalHp,
            hp: totalHp,
        }));
    }, [formData.class, formData.level, formData.abilities.con, hpMethod, rolledHps, isCreative]);

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

    const handleRoll = (result: number) => {
        if (isCreative) return;
        const hitDie = CLASS_HIT_DICE[formData.class] || 6;
        const additionalLevels = formData.level - 1;

        if (additionalLevels === 0) return;

        if (rolledHps.length === additionalLevels) {
            const newRolls = Array.from({ length: additionalLevels }, () =>
                Math.floor(Math.random() * hitDie) + 1
            );
            setRolledHps(newRolls);
        } else {
            const newRolls = [...rolledHps, result];
            setRolledHps(newRolls);
        }
    };

    const handleRerollAll = () => {
        if (isCreative) return;
        const hitDie = CLASS_HIT_DICE[formData.class] || 6;
        const additionalLevels = formData.level - 1;
        if (additionalLevels === 0) return;
        const newRolls = Array.from({ length: additionalLevels }, () =>
            Math.floor(Math.random() * hitDie) + 1
        );
        setRolledHps(newRolls);
    };

    const handleStandardArray = () => {
        const stats = standardArray();
        setFormData(prev => ({
            ...prev,
            abilities: { ...prev.abilities, ...stats },
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isCreative && hpMethod === 'roll' && formData.level > 1) {
            const neededRolls = formData.level - 1;
            if (rolledHps.length < neededRolls) {
                alert(`Please roll HP for all levels (${neededRolls} rolls needed). Currently: ${rolledHps.length}`);
                return;
            }
        }

        let finalData = { ...formData };
        if (!isCreative) {
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

        // Применяем бонусы background-а к способностям
        const bgBonuses = getBackgroundAbilityBonuses(finalData.background);
        for (const [attr, bonus] of Object.entries(bgBonuses)) {
            if (abilitiesWithBonuses.hasOwnProperty(attr)) {
                abilitiesWithBonuses[attr as keyof typeof abilitiesWithBonuses] += bonus;
            }
        }
        finalData.abilities = abilitiesWithBonuses;

        // Создаём список навыков
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

        const bg = DND_BACKGROUNDS.find(b => b.name === finalData.background);
        const backgroundSkills = bg ? bg.skillProficiencies : [];
        const skillsWithProficiencies = defaultSkills.map(skill => {
            if (backgroundSkills.includes(skill.name)) {
                return { ...skill, proficient: true };
            }
            return skill;
        });

        const toolProficiencies = bg?.toolProficiencies?.map(tool => ({
            name: tool.name,
            attribute: tool.attribute || 'DEX',
            proficient: true,
        })) || [];

        const languages = bg?.languages || [];

        const raceDetails = RACE_DETAILS[finalData.race];
        const creatureType = raceDetails ? raceDetails.creatureType : 'Humanoid';
        const size = finalData.size || (typeof raceDetails?.size === 'string' ? raceDetails.size : 'Medium');

        const newCharacter = {
            ...finalData,
            classes: [finalData.class],
            skills: skillsWithProficiencies,
            toolProficiencies: toolProficiencies,
            languages: languages,
            creatureType: creatureType,
            size: size,
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

    const raceBonuses = RACIAL_BONUSES[formData.race] || null;
    const raceDetails = RACE_DETAILS[formData.race] || null;
    const sizeOptions = raceDetails && typeof raceDetails.size === 'object' ? raceDetails.size.options : null;

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
                        <input type="number" name="level" value={formData.level} onChange={handleChange} min="1" max="20" required />
                    </div>
                </div>

                {sizeOptions && (
                    <div className="form-group">
                        <label>Size</label>
                        <select
                            value={formData.size}
                            onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
                        >
                            {sizeOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                )}

                {isCreative ? (
                    <div className="form-row">
                        <div className="form-group">
                            <label>HP *</label>
                            <input type="number" name="hp" value={formData.hp} onChange={handleChange} min="0" required />
                        </div>
                        <div className="form-group">
                            <label>Max HP *</label>
                            <input type="number" name="maxHp" value={formData.maxHp} onChange={handleChange} min="0" required />
                        </div>
                    </div>
                ) : (
                    <div className="hp-calculator">
                        <div className="form-group">
                            <label>Hit Points</label>
                            {formData.level > 1 && (
                                <div className="hp-method-selector">
                                    <button
                                        type="button"
                                        className={`method-btn ${hpMethod === 'average' ? 'active' : ''}`}
                                        onClick={() => setHpMethod('average')}
                                    >
                                        Average
                                    </button>
                                    <button
                                        type="button"
                                        className={`method-btn ${hpMethod === 'roll' ? 'active' : ''}`}
                                        onClick={() => setHpMethod('roll')}
                                    >
                                        Roll
                                    </button>
                                </div>
                            )}
                        </div>

                        {hpMethod === 'roll' && formData.level > 1 && (
                            <div className="hp-roll-area">
                                <div className="roll-controls">
                                    <DiceRoller
                                        sides={CLASS_HIT_DICE[formData.class] || 6}
                                        onRoll={handleRoll}
                                        label="Roll HP"
                                    />
                                    {rolledHps.length === formData.level - 1 && (
                                        <button type="button" className="reroll-btn" onClick={handleRerollAll}>
                                            Reroll All
                                        </button>
                                    )}
                                </div>
                                {rolledHps.length > 0 && (
                                    <div className="roll-results">
                                        <span>Rolls: {rolledHps.join(', ')} ({rolledHps.length}/{formData.level - 1})</span>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="hp-formula">
                            <span>Total HP: <strong>{formData.maxHp}</strong></span>
                            {formData.level > 1 && (
                                <span className="formula-details">
                                    ({CLASS_HIT_DICE[formData.class] || 6} + CON) + {formData.level > 1 && (
                                    hpMethod === 'average'
                                        ? `(${formData.level - 1} × (${Math.floor((CLASS_HIT_DICE[formData.class] || 6) / 2) + 1} + CON))`
                                        : `(${rolledHps.length} × (rolls + CON))`
                                )}
                                </span>
                            )}
                            {formData.level === 1 && (
                                <span className="formula-details">(Level 1: {CLASS_HIT_DICE[formData.class] || 6} + CON modifier)</span>
                            )}
                        </div>
                    </div>
                )}

                {!isCreative && (
                    <div className="info-text">AC and Speed are calculated automatically based on your class, race and abilities.</div>
                )}

                {isCreative && (
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
                            return <div className="tools-empty">No tool proficiencies</div>;
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
                    <label>Background Languages</label>
                    {(() => {
                        const bg = DND_BACKGROUNDS.find(b => b.name === formData.background);
                        if (!bg || !bg.languages || bg.languages.length === 0) {
                            return <div className="tools-empty">No languages</div>;
                        }
                        return (
                            <div className="background-skills-display">
                                {bg.languages.map(lang => (
                                    <span key={lang} className="bg-skill-tag">{lang}</span>
                                ))}
                            </div>
                        );
                    })()}
                </div>

                {!isCreative && (
                    <div className="form-group stat-generation">
                        <label>Stat Generation Methods</label>
                        <div className="stat-buttons">
                            <button type="button" className="stat-btn" onClick={handleStandardArray}>
                                Standard Array
                            </button>
                            <button type="button" className="stat-btn" onClick={handleRollStats}>
                                Roll 4d6
                            </button>
                            <button type="button" className="stat-btn" onClick={() => {
                                setPointBuyValues({ str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 });
                                setShowPointBuy(true);
                            }}>
                                Point Buy
                            </button>
                        </div>
                    </div>
                )}

                <div className="form-group">
                    <label>Ability Scores</label>
                    <div className="ability-grid">
                        {Object.entries(formData.abilities).map(([key, value]) => {
                            const attr = key as keyof typeof formData.abilities;
                            let bonusDisplay = null;
                            // Расовые бонусы (фиксированные и выбранные)
                            if (raceBonuses) {
                                if (raceBonuses.fixed && raceBonuses.fixed[attr]) {
                                    const bonus = raceBonuses.fixed[attr];
                                    bonusDisplay = <span className="ability-bonus">+{bonus}</span>;
                                } else if (raceBonuses.choose && selectedBonusAttrs.includes(attr)) {
                                    const bonus = raceBonuses.choose.bonus;
                                    bonusDisplay = <span className="ability-bonus">+{bonus}</span>;
                                }
                            }
                            // Бонусы от background-а
                            const bgBonuses = getBackgroundAbilityBonuses(formData.background);
                            if (bgBonuses[attr]) {
                                const bgBonus = bgBonuses[attr];
                                if (bonusDisplay) {
                                    bonusDisplay = (
                                        <>
                                            {bonusDisplay}
                                            <span className="ability-bonus bg-bonus">+{bgBonus}</span>
                                        </>
                                    );
                                } else {
                                    bonusDisplay = <span className="ability-bonus bg-bonus">+{bgBonus}</span>;
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
                    <div className="ability-scores-legend">
                        <span><span className="legend-color racial"></span> Racial bonus</span>
                        <span><span className="legend-color background"></span> Background bonus</span>
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

            {/* Point Buy Modal */}
            {showPointBuy && (
                <div className="modal-overlay" onClick={() => setShowPointBuy(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Point Buy</h3>
                        <div className="pointbuy-points">Points remaining: <strong>{getRemainingPoints()}</strong></div>
                        <div className="pointbuy-grid">
                            {Object.entries(pointBuyValues).map(([stat, value]) => (
                                <div key={stat} className="pointbuy-stat">
                                    <span className="pointbuy-stat-label">{stat.toUpperCase()}</span>
                                    <div className="pointbuy-controls">
                                        <button
                                            type="button"
                                            className="pointbuy-btn"
                                            onClick={() => handlePointBuyChange(stat as keyof typeof pointBuyValues, -1)}
                                            disabled={!canDecrease(stat as keyof typeof pointBuyValues)}
                                        >
                                            −
                                        </button>
                                        <span className="pointbuy-stat-value">{value}</span>
                                        <button
                                            type="button"
                                            className="pointbuy-btn"
                                            onClick={() => handlePointBuyChange(stat as keyof typeof pointBuyValues, 1)}
                                            disabled={!canIncrease(stat as keyof typeof pointBuyValues)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="modal-actions">
                            <button type="button" className="modal-btn cancel" onClick={() => setShowPointBuy(false)}>
                                Cancel
                            </button>
                            <button type="button" className="modal-btn apply" onClick={applyPointBuy}>
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Roll Distribution Modal */}
            {showRollDistribution && (
                <div className="modal-overlay" onClick={() => setShowRollDistribution(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Assign Rolled Stats</h3>
                        <div className="roll-distribution">
                            <div className="roll-values">
                                {rollValues.map((value, idx) => (
                                    <DiceRoller
                                        key={idx}
                                        sides={6}
                                        initialResult={value}
                                        autoRoll={true}
                                        displayOnly={true}
                                    />
                                ))}
                            </div>
                            <div className="stat-assignment-grid">
                                {Object.entries(statAssignments).map(([stat, assignedIndex]) => {
                                    const usedIndices = Object.values(statAssignments).filter(v => v !== null) as number[];
                                    const availableIndices = rollValues.map((_, idx) => idx).filter(idx => !usedIndices.includes(idx) || idx === assignedIndex);
                                    return (
                                        <div key={stat} className="assign-row">
                                            <span className="assign-stat-label">{stat.toUpperCase()}</span>
                                            <select
                                                value={assignedIndex !== null ? assignedIndex : ''}
                                                onChange={(e) => {
                                                    const idx = Number(e.target.value);
                                                    if (!isNaN(idx)) assignRollToStat(stat as keyof typeof statAssignments, idx);
                                                }}
                                                className="assign-select"
                                            >
                                                <option value="">—</option>
                                                {availableIndices.map(idx => (
                                                    <option key={idx} value={idx}>{rollValues[idx]}</option>
                                                ))}
                                            </select>
                                            {assignedIndex !== null && (
                                                <button type="button" className="unassign-btn" onClick={() => unassignRoll(stat as keyof typeof statAssignments)}>✕</button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="modal-btn cancel" onClick={() => setShowRollDistribution(false)}>Cancel</button>
                                <button type="button" className="modal-btn apply" onClick={applyRollDistribution}>Apply</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateCharacter;