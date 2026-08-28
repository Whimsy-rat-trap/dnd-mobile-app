import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCharacters } from '../context/CharacterContext';
import { DND_CLASSES } from '../constants/classes';
import { SUBCLASSES } from '../constants/subclasses';
import { DND_RACES } from '../constants/races';
import { DND_BACKGROUNDS } from '../constants/backgrounds';
import { CLASS_HIT_DICE } from '../constants/classHitDice';
import { CLASS_SAVING_THROWS } from '../constants/classSavingThrows';
import { RACIAL_BONUSES } from '../constants/racialBonuses';
import { RACE_DETAILS } from '../constants/raceDetails';
import { RACE_FEATURES } from '../constants/raceFeatures';
import { SUBRACES } from '../constants/subraces';
import { SUBRACE_DETAILS } from '../constants/subraceDetails';
import { LANGUAGES } from '../constants/languages';
import { RACIAL_SKILLS, RACIAL_TOOLS, ALL_SKILLS } from '../constants/raceProficiencies'; // <-- новый импорт
import DiceRoller from '../components/DiceRoller';
import Modal from '../components/Modal';
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

    // Основные данные формы
    const [formData, setFormData] = useState({
        name: '',
        class: DND_CLASSES[0],
        subclass: '',
        race: DND_RACES[0],
        subrace: '',
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

    // Для сворачивания фич расы и подрасы
    const [isRaceFeaturesOpen, setIsRaceFeaturesOpen] = useState(true);
    const [isSubraceFeaturesOpen, setIsSubraceFeaturesOpen] = useState(true);
    const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
    const [selectedSubraceFeature, setSelectedSubraceFeature] = useState<string | null>(null);

    // Расовые навыки и инструменты
    const [selectedRacialSkills, setSelectedRacialSkills] = useState<string[]>([]);
    const [selectedRacialTools, setSelectedRacialTools] = useState<string[]>([]);

    // Мультикласс
    const [classLevels, setClassLevels] = useState<{ className: string; level: number }[]>([
        { className: DND_CLASSES[0], level: 1 }
    ]);

    // При изменении основного класса синхронизируем с classLevels (первым элементом)
    useEffect(() => {
        setClassLevels(prev => {
            const newList = [...prev];
            if (newList.length > 0) {
                newList[0].className = formData.class;
            } else {
                newList.push({ className: formData.class, level: formData.level || 1 });
            }
            return newList;
        });
    }, [formData.class]);

    // При изменении уровня синхронизируем с classLevels (первым элементом)
    useEffect(() => {
        setClassLevels(prev => {
            const newList = [...prev];
            if (newList.length > 0) {
                newList[0].level = formData.level;
            } else {
                newList.push({ className: formData.class, level: formData.level });
            }
            return newList;
        });
    }, [formData.level]);

    // Обработчики для дополнительных классов
    const addExtraClass = () => {
        setClassLevels([...classLevels, { className: DND_CLASSES[0], level: 1 }]);
        // Обновляем общий уровень
        updateTotalLevel();
    };

    const removeExtraClass = (index: number) => {
        if (index === 0) return; // не удаляем основной класс
        const newList = classLevels.filter((_, i) => i !== index);
        setClassLevels(newList);
        updateTotalLevel();
    };

    const updateExtraClass = (index: number, field: 'className' | 'level', value: string | number) => {
        const newList = [...classLevels];
        if (field === 'className') {
            newList[index].className = value as string;
        } else {
            newList[index].level = Math.max(1, Math.min(20, Number(value)));
        }
        setClassLevels(newList);
        updateTotalLevel();
    };

    const updateTotalLevel = () => {
        const total = classLevels.reduce((sum, cl) => sum + cl.level, 0);
        setFormData(prev => ({ ...prev, level: total }));
    };

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

    // При изменении расы обновляем размер и creature type, сбрасываем подрасу
    useEffect(() => {
        const details = RACE_DETAILS[formData.race];
        if (details) {
            let size = 'Medium';
            if (typeof details.size === 'string') {
                size = details.size;
            } else if (details.size.options) {
                size = details.size.default || details.size.options[0] || 'Medium';
            }
            setFormData(prev => ({ ...prev, size, subrace: '' }));
        }
        // Сбрасываем выбранные бонусы для расы
        const raceBonus = RACIAL_BONUSES[formData.race];
        if (raceBonus && raceBonus.choose) {
            setSelectedBonusAttrs(new Array(raceBonus.choose.count).fill(null));
        } else {
            setSelectedBonusAttrs([]);
        }
        // Сбрасываем выбранную фичу расы
        setSelectedFeature(null);

        // Расовые навыки и инструменты
        const skillData = RACIAL_SKILLS[formData.race];
        if (skillData) {
            if (skillData.fixed) {
                setSelectedRacialSkills(skillData.fixed);
            } else if (skillData.choose) {
                setSelectedRacialSkills(new Array(skillData.choose.count).fill(''));
            } else {
                setSelectedRacialSkills([]);
            }
        } else {
            setSelectedRacialSkills([]);
        }

        const toolData = RACIAL_TOOLS[formData.race];
        if (toolData) {
            if (toolData.fixed) {
                setSelectedRacialTools(toolData.fixed);
            } else if (toolData.choose) {
                setSelectedRacialTools(new Array(toolData.choose.count).fill(''));
            } else {
                setSelectedRacialTools([]);
            }
        } else {
            setSelectedRacialTools([]);
        }
    }, [formData.race]);

    // При смене класса сбрасываем подкласс
    useEffect(() => {
        setFormData(prev => ({ ...prev, subclass: '' }));
    }, [formData.class]);

    // При переключении метода на Average сбрасываем броски
    useEffect(() => {
        if (hpMethod === 'average') {
            setRolledHps([]);
        }
    }, [hpMethod]);

    // Пересчёт HP в режиме "by rules"
    useEffect(() => {
        if (isCreative) return;

        const mainClass = classLevels[0]?.className || formData.class;
        const conMod = Math.floor((formData.abilities.con - 10) / 2);
        const hitDie = CLASS_HIT_DICE[mainClass] || 6;
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
    }, [classLevels, formData.abilities.con, hpMethod, rolledHps, isCreative]);

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

    // Обработчики выбора расовых навыков и инструментов
    const handleRacialSkillSelect = (index: number, value: string) => {
        const newSkills = [...selectedRacialSkills];
        // Проверяем, не выбран ли уже этот навык в другом слоте
        const existingIndex = newSkills.indexOf(value);
        if (existingIndex !== -1 && existingIndex !== index) {
            newSkills[existingIndex] = ''; // очищаем другой слот
        }
        newSkills[index] = value;
        setSelectedRacialSkills(newSkills);
    };

    const handleRacialToolSelect = (index: number, value: string) => {
        const newTools = [...selectedRacialTools];
        const existingIndex = newTools.indexOf(value);
        if (existingIndex !== -1 && existingIndex !== index) {
            newTools[existingIndex] = '';
        }
        newTools[index] = value;
        setSelectedRacialTools(newTools);
    };

    const handleRoll = (result: number) => {
        if (isCreative) return;
        const mainClass = classLevels[0]?.className || formData.class;
        const hitDie = CLASS_HIT_DICE[mainClass] || 6;
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
        const mainClass = classLevels[0]?.className || formData.class;
        const hitDie = CLASS_HIT_DICE[mainClass] || 6;
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

        // Проверяем, выбраны ли все расовые навыки (если есть выбор)
        const skillData = RACIAL_SKILLS[formData.race];
        if (skillData && skillData.choose) {
            if (selectedRacialSkills.some(s => s === '')) {
                alert(`Please select ${skillData.choose.count} racial skills.`);
                return;
            }
        }
        const toolData = RACIAL_TOOLS[formData.race];
        if (toolData && toolData.choose) {
            if (selectedRacialTools.some(t => t === '')) {
                alert(`Please select ${toolData.choose.count} racial tools.`);
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

        // Применяем бонусы подрасы
        if (finalData.subrace) {
            const subraceBonus = SUBRACE_DETAILS[finalData.subrace]?.abilityBonuses;
            if (subraceBonus) {
                for (const [attr, bonus] of Object.entries(subraceBonus)) {
                    if (abilitiesWithBonuses.hasOwnProperty(attr)) {
                        abilitiesWithBonuses[attr as keyof typeof abilitiesWithBonuses] += bonus;
                    }
                }
            }
        }

        // Применяем бонусы background-а
        const bgBonuses = getBackgroundAbilityBonuses(finalData.background);
        for (const [attr, bonus] of Object.entries(bgBonuses)) {
            if (abilitiesWithBonuses.hasOwnProperty(attr)) {
                abilitiesWithBonuses[attr as keyof typeof abilitiesWithBonuses] += bonus;
            }
        }
        finalData.abilities = abilitiesWithBonuses;

        // Формируем список навыков с учётом background и расы
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

        // Собираем все навыки, которые должны быть proficient (background + расовые)
        const proficientSkillNames = new Set<string>();
        backgroundSkills.forEach(s => proficientSkillNames.add(s));
        // Добавляем расовые навыки
        if (skillData) {
            if (skillData.fixed) {
                skillData.fixed.forEach(s => proficientSkillNames.add(s));
            } else if (skillData.choose) {
                selectedRacialSkills.forEach(s => {
                    if (s) proficientSkillNames.add(s);
                });
            }
        }

        // Создаём список навыков
        const skillsWithProficiencies = defaultSkills.map(skill => {
            if (proficientSkillNames.has(skill.name)) {
                return { ...skill, proficient: true };
            }
            return skill;
        });

        // Формируем список инструментов (background + расовые)
        let toolProficiencies = bg?.toolProficiencies?.map(tool => ({
            name: tool.name,
            attribute: tool.attribute || 'DEX',
            proficient: true,
        })) || [];

        // Добавляем расовые инструменты
        if (toolData) {
            const racialToolNames: string[] = [];
            if (toolData.fixed) {
                racialToolNames.push(...toolData.fixed);
            } else if (toolData.choose) {
                selectedRacialTools.forEach(t => {
                    if (t) racialToolNames.push(t);
                });
            }
            // Добавляем их, если их ещё нет в списке
            racialToolNames.forEach(toolName => {
                if (!toolProficiencies.some(t => t.name === toolName)) {
                    toolProficiencies.push({
                        name: toolName,
                        attribute: 'DEX',
                        proficient: true,
                    });
                }
            });
        }

        const languages = bg?.languages || [];

        const raceDetails = RACE_DETAILS[finalData.race];
        const creatureType = raceDetails ? raceDetails.creatureType : 'Humanoid';
        const size = finalData.size || (typeof raceDetails?.size === 'string' ? raceDetails.size : 'Medium');

        // Формируем classLevels для персонажа
        const characterClassLevels = classLevels.map(cl => ({
            className: cl.className,
            level: cl.level
        }));

        const mainClass = classLevels[0]?.className || finalData.class;
        const allClasses = classLevels.map(cl => cl.className);

        const newCharacter = {
            ...finalData,
            class: mainClass,
            classes: allClasses,
            level: finalData.level,
            classLevels: characterClassLevels,
            subclass: finalData.subclass,
            skills: skillsWithProficiencies,
            toolProficiencies: toolProficiencies,
            languages: languages,
            creatureType: creatureType,
            size: size,
            savingThrowProficiencies: CLASS_SAVING_THROWS[mainClass] || [],
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

    // Получаем фичи расы и подрасы
    const raceFeatures = RACE_FEATURES[formData.race] || [];
    const subraceFeatures = formData.subrace ? SUBRACE_DETAILS[formData.subrace]?.features || [] : [];
    const subraceBonus = formData.subrace ? SUBRACE_DETAILS[formData.subrace]?.abilityBonuses : null;

    // Данные для отображения расовых навыков и инструментов
    const racialSkillData = RACIAL_SKILLS[formData.race];
    const racialToolData = RACIAL_TOOLS[formData.race];

    // Функция рендера шеврона
    const renderChevron = (isOpen: boolean) => (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`cr-chevron-icon ${isOpen ? 'cr-open' : ''}`}
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

    return (
        <div className="page cr-page">
            <div className="cr-header">
                <button className="cr-back-btn" onClick={() => navigate(-1)}>← Back</button>
                <h1>Create Character</h1>
            </div>
            <form onSubmit={handleSubmit} className="cr-form">
                {/* Имя */}
                <div className="cr-form-group">
                    <label>Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>

                {/* Класс и Раса */}
                <div className="cr-form-row">
                    <div className="cr-form-group">
                        <label>Class *</label>
                        <select name="class" value={formData.class} onChange={handleChange} required>
                            {DND_CLASSES.map(cls => (
                                <option key={cls} value={cls}>{cls}</option>
                            ))}
                        </select>
                    </div>
                    <div className="cr-form-group">
                        <label>Race *</label>
                        <select name="race" value={formData.race} onChange={handleChange} required>
                            {DND_RACES.map(race => (
                                <option key={race} value={race}>{race}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Subclass (если есть) */}
                {SUBCLASSES[formData.class] && SUBCLASSES[formData.class].length > 0 && (
                    <div className="cr-form-group">
                        <label>Subclass</label>
                        <select
                            value={formData.subclass}
                            onChange={(e) => setFormData(prev => ({ ...prev, subclass: e.target.value }))}
                        >
                            <option value="">Select subclass</option>
                            {SUBCLASSES[formData.class].map(sub => (
                                <option key={sub} value={sub}>{sub}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Subrace (если есть) */}
                {SUBRACES[formData.race] && SUBRACES[formData.race].length > 0 && (
                    <div className="cr-form-group">
                        <label>Subrace</label>
                        <select
                            value={formData.subrace}
                            onChange={(e) => setFormData(prev => ({ ...prev, subrace: e.target.value }))}
                        >
                            <option value="">Select subrace</option>
                            {SUBRACES[formData.race].map(sub => (
                                <option key={sub} value={sub}>{sub}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Мультикласс */}
                <div className="cr-multiclass-section">
                    <label>Class Levels</label>
                    {classLevels.map((cl, index) => (
                        <div key={index} className="cr-multiclass-row">
                            <select
                                value={cl.className}
                                onChange={(e) => updateExtraClass(index, 'className', e.target.value)}
                                disabled={index === 0}
                            >
                                {DND_CLASSES.map(cls => (
                                    <option key={cls} value={cls}>{cls}</option>
                                ))}
                            </select>
                            <input
                                type="number"
                                min="1"
                                max="20"
                                value={cl.level}
                                onChange={(e) => updateExtraClass(index, 'level', Number(e.target.value))}
                            />
                            {index > 0 && (
                                <button type="button" className="cr-remove-class-btn" onClick={() => removeExtraClass(index)}>✕</button>
                            )}
                        </div>
                    ))}
                    <button type="button" className="cr-add-class-btn" onClick={addExtraClass}>
                        + Add Class
                    </button>
                    <div className="cr-total-level-display">Total Level: {formData.level}</div>
                </div>

                {/* Фон и Уровень */}
                <div className="cr-form-row">
                    <div className="cr-form-group">
                        <label>Background *</label>
                        <select name="background" value={formData.background} onChange={handleChange} required>
                            {DND_BACKGROUNDS.map(bg => (
                                <option key={bg.name} value={bg.name}>{bg.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Размер (если выбор) */}
                {sizeOptions && (
                    <div className="cr-form-group">
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

                {/* HP */}
                {isCreative ? (
                    <div className="cr-form-row">
                        <div className="cr-form-group">
                            <label>HP *</label>
                            <input type="number" name="hp" value={formData.hp} onChange={handleChange} min="0" required />
                        </div>
                        <div className="cr-form-group">
                            <label>Max HP *</label>
                            <input type="number" name="maxHp" value={formData.maxHp} onChange={handleChange} min="0" required />
                        </div>
                    </div>
                ) : (
                    <div className="cr-hp-calculator">
                        <div className="cr-form-group">
                            <label>Hit Points</label>
                            {formData.level > 1 && (
                                <div className="cr-hp-method-selector">
                                    <button
                                        type="button"
                                        className={`cr-method-btn ${hpMethod === 'average' ? 'cr-active' : ''}`}
                                        onClick={() => setHpMethod('average')}
                                    >
                                        Average
                                    </button>
                                    <button
                                        type="button"
                                        className={`cr-method-btn ${hpMethod === 'roll' ? 'cr-active' : ''}`}
                                        onClick={() => setHpMethod('roll')}
                                    >
                                        Roll
                                    </button>
                                </div>
                            )}
                        </div>

                        {hpMethod === 'roll' && formData.level > 1 && (
                            <div className="cr-hp-roll-area">
                                <div className="cr-roll-controls">
                                    <DiceRoller
                                        sides={CLASS_HIT_DICE[classLevels[0]?.className || formData.class] || 6}
                                        onRoll={handleRoll}
                                        label="Roll HP"
                                    />
                                    {rolledHps.length === formData.level - 1 && (
                                        <button type="button" className="cr-reroll-btn" onClick={handleRerollAll}>
                                            Reroll All
                                        </button>
                                    )}
                                </div>
                                {rolledHps.length > 0 && (
                                    <div className="cr-roll-results">
                                        <span>Rolls: {rolledHps.join(', ')} ({rolledHps.length}/{formData.level - 1})</span>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="cr-hp-formula">
                            <span>Total HP: <strong>{formData.maxHp}</strong></span>
                            {formData.level > 1 && (
                                <span className="cr-formula-details">
                                    ({CLASS_HIT_DICE[classLevels[0]?.className || formData.class] || 6} + CON) + {formData.level > 1 && (
                                    hpMethod === 'average'
                                        ? `(${formData.level - 1} × (${Math.floor((CLASS_HIT_DICE[classLevels[0]?.className || formData.class] || 6) / 2) + 1} + CON))`
                                        : `(${rolledHps.length} × (rolls + CON))`
                                )}
                                </span>
                            )}
                            {formData.level === 1 && (
                                <span className="cr-formula-details">(Level 1: {CLASS_HIT_DICE[classLevels[0]?.className || formData.class] || 6} + CON modifier)</span>
                            )}
                        </div>
                    </div>
                )}

                {/* AC и Speed (creative) или инфо (rules) */}
                {!isCreative && (
                    <div className="cr-info-text">AC and Speed are calculated automatically based on your class, race and abilities.</div>
                )}

                {isCreative && (
                    <div className="cr-form-row">
                        <div className="cr-form-group">
                            <label>AC</label>
                            <input type="number" name="ac" value={formData.ac} onChange={handleChange} min="0" />
                        </div>
                        <div className="cr-form-group">
                            <label>Speed (ft)</label>
                            <input type="number" name="speed" value={formData.speed} onChange={handleChange} min="0" />
                        </div>
                    </div>
                )}

                {/* Background Proficiencies */}
                <div className="cr-form-group">
                    <label>Background Skill Proficiencies</label>
                    {(() => {
                        const bg = DND_BACKGROUNDS.find(b => b.name === formData.background);
                        if (!bg) return null;
                        return (
                            <div className="cr-background-skills-display">
                                {bg.skillProficiencies.map(skill => (
                                    <span key={skill} className="cr-bg-skill-tag">{skill}</span>
                                ))}
                            </div>
                        );
                    })()}
                </div>

                <div className="cr-form-group">
                    <label>Background Tool Proficiencies</label>
                    {(() => {
                        const bg = DND_BACKGROUNDS.find(b => b.name === formData.background);
                        if (!bg || !bg.toolProficiencies || bg.toolProficiencies.length === 0) {
                            return <div className="cr-tools-empty">No tool proficiencies</div>;
                        }
                        return (
                            <div className="cr-background-skills-display">
                                {bg.toolProficiencies.map(tool => (
                                    <span key={tool.name} className="cr-bg-skill-tag">{tool.name}</span>
                                ))}
                            </div>
                        );
                    })()}
                </div>

                <div className="cr-form-group">
                    <label>Background Languages</label>
                    {(() => {
                        const bg = DND_BACKGROUNDS.find(b => b.name === formData.background);
                        if (!bg || !bg.languages || bg.languages.length === 0) {
                            return <div className="cr-tools-empty">No languages</div>;
                        }
                        return (
                            <div className="cr-background-skills-display">
                                {bg.languages.map(lang => (
                                    <span key={lang} className="cr-bg-skill-tag">{lang}</span>
                                ))}
                            </div>
                        );
                    })()}
                </div>

                {/* НОВЫЙ БЛОК: Racial Skill Proficiencies */}
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
                                                    onChange={(e) => handleRacialSkillSelect(i, e.target.value)}
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

                {/* НОВЫЙ БЛОК: Racial Tool Proficiencies */}
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
                                                    onChange={(e) => handleRacialToolSelect(i, e.target.value)}
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

                {/* Stat Generation (только в rules) */}
                {!isCreative && (
                    <div className="cr-stat-generation">
                        <label>Stat Generation Methods</label>
                        <div className="cr-stat-buttons">
                            <button type="button" className="cr-stat-btn" onClick={handleStandardArray}>
                                Standard Array
                            </button>
                            <button type="button" className="cr-stat-btn" onClick={handleRollStats}>
                                Roll 4d6
                            </button>
                            <button type="button" className="cr-stat-btn" onClick={() => {
                                setPointBuyValues({ str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 });
                                setShowPointBuy(true);
                            }}>
                                Point Buy
                            </button>
                        </div>
                    </div>
                )}

                {/* Ability Scores */}
                <div className="cr-form-group">
                    <label>Ability Scores</label>
                    <div className="cr-ability-grid">
                        {Object.entries(formData.abilities).map(([key, value]) => {
                            const attr = key as keyof typeof formData.abilities;
                            let bonusDisplay = null;
                            // Расовые бонусы (фиксированные и выбранные)
                            if (raceBonuses) {
                                if (raceBonuses.fixed && raceBonuses.fixed[attr]) {
                                    const bonus = raceBonuses.fixed[attr];
                                    bonusDisplay = <span className="cr-ability-bonus">+{bonus}</span>;
                                } else if (raceBonuses.choose && selectedBonusAttrs.includes(attr)) {
                                    const bonus = raceBonuses.choose.bonus;
                                    bonusDisplay = <span className="cr-ability-bonus">+{bonus}</span>;
                                }
                            }
                            // Бонусы подрасы (синим)
                            if (subraceBonus && subraceBonus[attr]) {
                                const bonus = subraceBonus[attr];
                                if (bonusDisplay) {
                                    bonusDisplay = (
                                        <>
                                            {bonusDisplay}
                                            <span className="cr-ability-bonus cr-subrace-bonus">+{bonus}</span>
                                        </>
                                    );
                                } else {
                                    bonusDisplay = <span className="cr-ability-bonus cr-subrace-bonus">+{bonus}</span>;
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
                                            <span className="cr-ability-bonus cr-bg-bonus">+{bgBonus}</span>
                                        </>
                                    );
                                } else {
                                    bonusDisplay = <span className="cr-ability-bonus cr-bg-bonus">+{bgBonus}</span>;
                                }
                            }
                            return (
                                <div key={key} className="cr-ability-input">
                                    <label>{key.toUpperCase()}</label>
                                    <div className="cr-ability-input-wrapper">
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
                    <div className="cr-ability-scores-legend">
                        <span><span className="cr-legend-color cr-racial"></span> Racial bonus</span>
                        {subraceBonus && Object.keys(subraceBonus).length > 0 && (
                            <span><span className="cr-legend-color cr-subrace"></span> Subrace bonus</span>
                        )}
                        <span><span className="cr-legend-color cr-background"></span> Background bonus</span>
                    </div>
                </div>

                {raceBonuses && raceBonuses.choose && (() => {
                    const choose = raceBonuses.choose;
                    return (
                        <div className="cr-form-group">
                            <label>Assign racial bonuses (choose {choose.count} attributes)</label>
                            <div className="cr-bonus-selectors">
                                {selectedBonusAttrs.map((selectedAttr, index) => (
                                    <select
                                        key={index}
                                        value={selectedAttr || ''}
                                        onChange={(e) => handleBonusSelect(index, e.target.value)}
                                        className="cr-bonus-select"
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

                {/* Race Features */}
                <div className="cr-race-features-section">
                    <div
                        className="cr-race-features-header"
                        onClick={() => setIsRaceFeaturesOpen(!isRaceFeaturesOpen)}
                    >
                        <span className="cr-race-features-title">Race Features</span>
                        {renderChevron(isRaceFeaturesOpen)}
                    </div>
                    {isRaceFeaturesOpen && (
                        <div className="cr-race-features-content">
                            <div className="cr-race-features-list">
                                {raceFeatures.map((feature, idx) => (
                                    <span
                                        key={idx}
                                        className={`cr-race-feature-tag ${selectedFeature === feature.name ? 'cr-active' : ''}`}
                                        onClick={() => setSelectedFeature(selectedFeature === feature.name ? null : feature.name)}
                                    >
                                        {feature.name}
                                    </span>
                                ))}
                            </div>
                            {selectedFeature && (
                                <div className="cr-race-feature-description">
                                    {raceFeatures.find(f => f.name === selectedFeature)?.description}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Subrace Features (если есть) */}
                {formData.subrace && subraceFeatures.length > 0 && (
                    <div className="cr-race-features-section cr-subrace-features">
                        <div
                            className="cr-race-features-header"
                            onClick={() => setIsSubraceFeaturesOpen(!isSubraceFeaturesOpen)}
                        >
                            <span className="cr-race-features-title cr-subrace-features-title">Subrace Features</span>
                            {renderChevron(isSubraceFeaturesOpen)}
                        </div>
                        {isSubraceFeaturesOpen && (
                            <div className="cr-race-features-content">
                                <div className="cr-race-features-list">
                                    {subraceFeatures.map((feature, idx) => (
                                        <span
                                            key={idx}
                                            className={`cr-race-feature-tag ${selectedSubraceFeature === feature.name ? 'cr-active' : ''}`}
                                            onClick={() => setSelectedSubraceFeature(selectedSubraceFeature === feature.name ? null : feature.name)}
                                        >
                                            {feature.name}
                                        </span>
                                    ))}
                                </div>
                                {selectedSubraceFeature && (
                                    <div className="cr-race-feature-description cr-subrace-feature-description">
                                        {subraceFeatures.find(f => f.name === selectedSubraceFeature)?.description}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                <button type="submit" className="cr-submit-btn">Create Character</button>
            </form>

            {/* Point Buy Modal */}
            <Modal isOpen={showPointBuy} onClose={() => setShowPointBuy(false)}>
                <h3>Point Buy</h3>
                <div className="cr-pointbuy-points">Points remaining: <strong>{getRemainingPoints()}</strong></div>
                <div className="cr-pointbuy-grid">
                    {Object.entries(pointBuyValues).map(([stat, value]) => (
                        <div key={stat} className="cr-pointbuy-stat">
                            <span className="cr-pointbuy-stat-label">{stat.toUpperCase()}</span>
                            <div className="cr-pointbuy-controls">
                                <button
                                    type="button"
                                    className="cr-pointbuy-btn"
                                    onClick={() => handlePointBuyChange(stat as keyof typeof pointBuyValues, -1)}
                                    disabled={!canDecrease(stat as keyof typeof pointBuyValues)}
                                >
                                    −
                                </button>
                                <span className="cr-pointbuy-stat-value">{value}</span>
                                <button
                                    type="button"
                                    className="cr-pointbuy-btn"
                                    onClick={() => handlePointBuyChange(stat as keyof typeof pointBuyValues, 1)}
                                    disabled={!canIncrease(stat as keyof typeof pointBuyValues)}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="cr-modal-actions">
                    <button type="button" className="cr-modal-btn cr-cancel" onClick={() => setShowPointBuy(false)}>
                        Cancel
                    </button>
                    <button type="button" className="cr-modal-btn cr-apply" onClick={applyPointBuy}>
                        Apply
                    </button>
                </div>
            </Modal>

            {/* Roll Distribution Modal */}
            <Modal isOpen={showRollDistribution} onClose={() => setShowRollDistribution(false)}>
                <h3>Assign Rolled Stats</h3>
                <div className="cr-roll-distribution">
                    <div className="cr-roll-values">
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
                    <div className="cr-stat-assignment-grid">
                        {Object.entries(statAssignments).map(([stat, assignedIndex]) => {
                            const usedIndices = Object.values(statAssignments).filter(v => v !== null) as number[];
                            const availableIndices = rollValues.map((_, idx) => idx).filter(idx => !usedIndices.includes(idx) || idx === assignedIndex);
                            return (
                                <div key={stat} className="cr-assign-row">
                                    <span className="cr-assign-stat-label">{stat.toUpperCase()}</span>
                                    <select
                                        value={assignedIndex !== null ? assignedIndex : ''}
                                        onChange={(e) => {
                                            const idx = Number(e.target.value);
                                            if (!isNaN(idx)) assignRollToStat(stat as keyof typeof statAssignments, idx);
                                        }}
                                        className="cr-assign-select"
                                    >
                                        <option value="">—</option>
                                        {availableIndices.map(idx => (
                                            <option key={idx} value={idx}>{rollValues[idx]}</option>
                                        ))}
                                    </select>
                                    {assignedIndex !== null && (
                                        <button type="button" className="cr-unassign-btn" onClick={() => unassignRoll(stat as keyof typeof statAssignments)}>✕</button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <div className="cr-modal-actions">
                        <button type="button" className="cr-modal-btn cr-cancel" onClick={() => setShowRollDistribution(false)}>Cancel</button>
                        <button type="button" className="cr-modal-btn cr-apply" onClick={applyRollDistribution}>Apply</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default CreateCharacter;