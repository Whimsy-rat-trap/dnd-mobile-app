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
import { RACIAL_SKILLS, RACIAL_TOOLS } from '../constants/raceProficiencies';
import { LibraryItem } from '../constants/items';
import { CLASS_STARTING_EQUIPMENT } from '../constants/classStartingEquipment';

// Вынесенные компоненты
import BasicInfoSection from '../components/CreateCharacter/BasicInfoSection';
import ClassLevelsSection from '../components/CreateCharacter/ClassLevelsSection';
import BackgroundSection from '../components/CreateCharacter/BackgroundSection';
import HPSection from '../components/CreateCharacter/HPSection';
import AbilityScoresSection from '../components/CreateCharacter/AbilityScoresSection';
import ProficienciesSection from '../components/CreateCharacter/ProficienciesSection';
import FeaturesSection from '../components/CreateCharacter/FeaturesSection';

// Хуки и утилиты
import { useStatGeneration } from '../hooks/useStatGeneration';
import { getBackgroundAbilityBonuses } from '../utils/characterCreationUtils';

import './CreateCharacter.css';

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

    // Для мультикласса
    const [classLevels, setClassLevels] = useState<{ className: string; level: number }[]>([
        { className: DND_CLASSES[0], level: 1 }
    ]);

    // Для расовых бонусов (выбор атрибутов)
    const [selectedBonusAttrs, setSelectedBonusAttrs] = useState<(string | null)[]>([]);

    // Для расовых навыков и инструментов
    const [selectedRacialSkills, setSelectedRacialSkills] = useState<string[]>([]);
    const [selectedRacialTools, setSelectedRacialTools] = useState<string[]>([]);

    // Для сворачивания фич
    const [isRaceFeaturesOpen, setIsRaceFeaturesOpen] = useState(true);
    const [isSubraceFeaturesOpen, setIsSubraceFeaturesOpen] = useState(true);
    const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
    const [selectedSubraceFeature, setSelectedSubraceFeature] = useState<string | null>(null);

    // HP
    const [hpMethod, setHpMethod] = useState<'average' | 'roll'>('average');
    const [rolledHps, setRolledHps] = useState<number[]>([]);

    // Генерация статов
    const handleApplyAbilities = (newAbilities: typeof formData.abilities) => {
        setFormData(prev => ({ ...prev, abilities: newAbilities }));
    };
    const statGen = useStatGeneration(formData.abilities, handleApplyAbilities);

    // Синхронизация мультикласса с основным классом и уровнем
    useEffect(() => {
        setClassLevels(prev => {
            const newList = [...prev];
            if (newList.length > 0) newList[0].className = formData.class;
            else newList.push({ className: formData.class, level: formData.level || 1 });
            return newList;
        });
    }, [formData.class]);

    // При изменении уровня синхронизируем с classLevels (первым элементом)
    useEffect(() => {
        setClassLevels(prev => {
            const newList = [...prev];
            if (newList.length > 0) newList[0].level = formData.level;
            else newList.push({ className: formData.class, level: formData.level });
            return newList;
        });
    }, [formData.level]);

    const updateTotalLevel = () => {
        const total = classLevels.reduce((sum, cl) => sum + cl.level, 0);
        setFormData(prev => ({ ...prev, level: total }));
    };

    const addExtraClass = () => {
        setClassLevels([...classLevels, { className: DND_CLASSES[0], level: 1 }]);
        // Обновляем общий уровень
        updateTotalLevel();
    };

    const removeExtraClass = (index: number) => {
        if (index === 0) return;
        setClassLevels(classLevels.filter((_, i) => i !== index));
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

    // При изменении расы
    useEffect(() => {
        const details = RACE_DETAILS[formData.race];
        if (details) {
            let size = 'Medium';
            if (typeof details.size === 'string') size = details.size;
            else if (details.size.options) size = details.size.default || details.size.options[0] || 'Medium';
            setFormData(prev => ({ ...prev, size, subrace: '' }));
        }
        // Сбрасываем выбор бонусов
        const raceBonus = RACIAL_BONUSES[formData.race];
        if (raceBonus?.choose) {
            setSelectedBonusAttrs(new Array(raceBonus.choose.count).fill(null));
        } else {
            setSelectedBonusAttrs([]);
        }
        // Сбрасываем выбранную фичу расы
        setSelectedFeature(null);

        // Расовая принадлежность
        const skillData = RACIAL_SKILLS[formData.race];
        if (skillData) {
            if (skillData.fixed) setSelectedRacialSkills(skillData.fixed);
            else if (skillData.choose) setSelectedRacialSkills(new Array(skillData.choose.count).fill(''));
            else setSelectedRacialSkills([]);
        } else {
            setSelectedRacialSkills([]);
        }

        const toolData = RACIAL_TOOLS[formData.race];
        if (toolData) {
            if (toolData.fixed) setSelectedRacialTools(toolData.fixed);
            else if (toolData.choose) setSelectedRacialTools(new Array(toolData.choose.count).fill(''));
            else setSelectedRacialTools([]);
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
        if (hpMethod === 'average') setRolledHps([]);
    }, [hpMethod]);

    // Пересчёт HP
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
            } else if (rolledHps.length > 0) {
                const sumRolls = rolledHps.reduce((sum, r) => sum + r + conMod, 0);
                totalHp += sumRolls;
            }
        }
        setFormData(prev => ({ ...prev, maxHp: totalHp, hp: totalHp }));
    }, [classLevels, formData.abilities.con, hpMethod, rolledHps, isCreative]);

    useEffect(() => {
        if (!isCreative) {
            const dexMod = Math.floor((formData.abilities.dex - 10) / 2);
            setFormData(prev => ({ ...prev, ac: 10 + dexMod }));
        }
    }, [formData.abilities.dex, isCreative]);

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
            setRolledHps([...rolledHps, result]);
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

    const handleBonusSelect = (index: number, attr: string) => {
        const newAttrs = [...selectedBonusAttrs];
        const existingIndex = newAttrs.indexOf(attr);
        if (existingIndex !== -1 && existingIndex !== index) {
            newAttrs[existingIndex] = null;
        }
        newAttrs[index] = attr;
        setSelectedBonusAttrs(newAttrs);
    };

    const handleRacialSkillSelect = (index: number, value: string) => {
        const newSkills = [...selectedRacialSkills];
        const existingIndex = newSkills.indexOf(value);
        if (existingIndex !== -1 && existingIndex !== index) {
            newSkills[existingIndex] = '';
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isCreative && hpMethod === 'roll' && formData.level > 1) {
            const neededRolls = formData.level - 1;
            if (rolledHps.length < neededRolls) {
                alert(`Please roll HP for all levels (${neededRolls} rolls needed). Currently: ${rolledHps.length}`);
                return;
            }
        }

        const skillData = RACIAL_SKILLS[formData.race];
        if (skillData?.choose && selectedRacialSkills.some(s => s === '')) {
            alert(`Please select ${skillData.choose.count} racial skills.`);
            return;
        }
        const toolData = RACIAL_TOOLS[formData.race];
        if (toolData?.choose && selectedRacialTools.some(t => t === '')) {
            alert(`Please select ${toolData.choose.count} racial tools.`);
            return;
        }

        let finalData = { ...formData };
        if (!isCreative) {
            finalData.ac = 10 + Math.floor((formData.abilities.dex - 10) / 2);
            finalData.speed = 30;
        }

        // Стартовое снаряжение класса
        const classEquipData = CLASS_STARTING_EQUIPMENT[finalData.class];
        const classItems: Omit<LibraryItem, 'id'>[] = [];
        if (classEquipData) {
            classItems.push(...classEquipData.mandatory);
            // Для выборов
            if (classEquipData.choices) {
                classEquipData.choices.forEach(choice => {
                    const firstOption = choice.options[0];
                    if (firstOption) classItems.push(...firstOption.items);
                });
            }
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

        // Формируем навыки
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
        const bgItems = bg?.startingEquipment || [];

        const allStartingItems = [...classItems, ...bgItems];
        const allItems = [...classItems, ...bgItems].map(item => ({
            id: `start-${Date.now()}-${Math.random()}`,
            name: item.name,
            type: item.type,
            rarity: item.rarity,
            description: item.description,
            equipped: item.type === 'armor' || item.type === 'shield' ? true : false,
        }));

        const backgroundSkills = bg?.skillProficiencies || [];
        const proficientSkillNames = new Set<string>();
        backgroundSkills.forEach(s => proficientSkillNames.add(s));
        // Добавляем расовые навыки
        if (skillData) {
            if (skillData.fixed) skillData.fixed.forEach(s => proficientSkillNames.add(s));
            else if (skillData.choose) selectedRacialSkills.forEach(s => { if (s) proficientSkillNames.add(s); });
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
            if (toolData.fixed) racialToolNames.push(...toolData.fixed);
            else if (toolData.choose) selectedRacialTools.forEach(t => { if (t) racialToolNames.push(t); });
            racialToolNames.forEach(toolName => {
                if (!toolProficiencies.some(t => t.name === toolName)) {
                    toolProficiencies.push({ name: toolName, attribute: 'DEX', proficient: true });
                }
            });
        }

        const languages = bg?.languages || [];

        const raceDetails = RACE_DETAILS[finalData.race];
        const creatureType = raceDetails?.creatureType || 'Humanoid';
        const size = finalData.size || (typeof raceDetails?.size === 'string' ? raceDetails.size : 'Medium');

        const characterClassLevels = classLevels.map(cl => ({ className: cl.className, level: cl.level }));
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
            toolProficiencies,
            languages,
            creatureType,
            size,
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
            inventory: allItems,
            spells: [],
            quests: [],
            campaigns: [],
        };
        addCharacter(newCharacter);
        navigate('/hub');
    };

    // Вспомогательные данные для рендеринга
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
                <BasicInfoSection
                    name={formData.name}
                    onNameChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
                    characterClass={formData.class}
                    onClassChange={(value) => setFormData(prev => ({ ...prev, class: value }))}
                    classOptions={DND_CLASSES}
                    subclass={formData.subclass}
                    onSubclassChange={(value) => setFormData(prev => ({ ...prev, subclass: value }))}
                    subclassOptions={SUBCLASSES[formData.class] || []}
                    race={formData.race}
                    onRaceChange={(value) => setFormData(prev => ({ ...prev, race: value }))}
                    raceOptions={DND_RACES}
                    subrace={formData.subrace}
                    onSubraceChange={(value) => setFormData(prev => ({ ...prev, subrace: value }))}
                    subraceOptions={SUBRACES[formData.race] || []}
                />

                <ClassLevelsSection
                    classLevels={classLevels}
                    onAddExtraClass={addExtraClass}
                    onRemoveExtraClass={removeExtraClass}
                    onUpdateExtraClass={updateExtraClass}
                    totalLevel={formData.level}
                />

                <BackgroundSection
                    background={formData.background}
                    onBackgroundChange={(value) => setFormData(prev => ({ ...prev, background: value }))}
                    size={formData.size}
                    onSizeChange={(value) => setFormData(prev => ({ ...prev, size: value }))}
                    sizeOptions={sizeOptions ?? undefined}
                />

                <HPSection
                    isCreative={isCreative}
                    hp={formData.hp}
                    maxHp={formData.maxHp}
                    level={formData.level}
                    mainClass={classLevels[0]?.className || formData.class}
                    conMod={Math.floor((formData.abilities.con - 10) / 2)}
                    hpMethod={hpMethod}
                    onHpMethodChange={setHpMethod}
                    rolledHps={rolledHps}
                    onRoll={handleRoll}
                    onRerollAll={handleRerollAll}
                    onHpChange={(value) => setFormData(prev => ({ ...prev, hp: value }))}
                    onMaxHpChange={(value) => setFormData(prev => ({ ...prev, maxHp: value }))}
                />

                <AbilityScoresSection
                    abilities={formData.abilities}
                    onAbilityChange={(ability, value) => setFormData(prev => ({
                        ...prev,
                        abilities: { ...prev.abilities, [ability]: value }
                    }))}
                    statGen={statGen}
                    raceBonuses={raceBonuses}
                    selectedBonusAttrs={selectedBonusAttrs}
                    onBonusSelect={handleBonusSelect}
                    subraceBonus={subraceBonus}
                    background={formData.background}
                />

                <ProficienciesSection
                    background={formData.background}
                    racialSkillData={racialSkillData}
                    racialToolData={racialToolData}
                    selectedRacialSkills={selectedRacialSkills}
                    onRacialSkillSelect={handleRacialSkillSelect}
                    selectedRacialTools={selectedRacialTools}
                    onRacialToolSelect={handleRacialToolSelect}
                />

                <FeaturesSection
                    raceFeatures={raceFeatures}
                    subraceFeatures={subraceFeatures}
                    selectedFeature={selectedFeature}
                    onFeatureToggle={(name) => setSelectedFeature(prev => prev === name ? null : name)}
                    selectedSubraceFeature={selectedSubraceFeature}
                    onSubraceFeatureToggle={(name) => setSelectedSubraceFeature(prev => prev === name ? null : name)}
                    isRaceFeaturesOpen={isRaceFeaturesOpen}
                    onRaceFeaturesToggle={() => setIsRaceFeaturesOpen(!isRaceFeaturesOpen)}
                    isSubraceFeaturesOpen={isSubraceFeaturesOpen}
                    onSubraceFeaturesToggle={() => setIsSubraceFeaturesOpen(!isSubraceFeaturesOpen)}
                    renderChevron={renderChevron}
                />

                <button type="submit" className="cr-submit-btn">Create Character</button>
            </form>
        </div>
    );
};

export default CreateCharacter;