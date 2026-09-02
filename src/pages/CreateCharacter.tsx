import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCharacters } from '../context/CharacterContext';
import { DND_CLASSES } from '../constants/classes';
import { SUBCLASSES } from '../constants/subclasses';
import { DND_RACES } from '../constants/races';
import { DND_BACKGROUNDS } from '../constants/backgrounds';
import { RACE_DETAILS } from '../constants/raceDetails';
import { RACE_FEATURES } from '../constants/raceFeatures';
import { SUBRACES } from '../constants/subraces';
import { SUBRACE_DETAILS } from '../constants/subraceDetails';
import { RACIAL_SKILLS, RACIAL_TOOLS } from '../constants/raceProficiencies';
import { CLASS_HIT_DICE } from '../constants/classHitDice';
import { RACIAL_BONUSES } from '../constants/racialBonuses';

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
import { buildCharacter } from '../utils/characterCreationUtils';

import './CreateCharacter.css';

const CreateCharacter: React.FC = () => {
    const navigate = useNavigate();
    const { addCharacter } = useCharacters();
    const today = new Date().toISOString().split('T')[0];
    const [searchParams] = useSearchParams();
    const isCreative = searchParams.get('mode') === 'creative';

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

    const [classLevels, setClassLevels] = useState([{ className: DND_CLASSES[0], level: 1 }]);
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

    // useMemo для производных данных
    const raceBonuses = useMemo(() => RACIAL_BONUSES[formData.race] || null, [formData.race]);
    const raceDetails = useMemo(() => RACE_DETAILS[formData.race] || null, [formData.race]);
    const raceFeatures = useMemo(() => RACE_FEATURES[formData.race] || [], [formData.race]);
    const subraceFeatures = useMemo(() =>
            formData.subrace ? SUBRACE_DETAILS[formData.subrace]?.features || [] : [],
        [formData.subrace]
    );
    const subraceBonus = useMemo(() =>
            formData.subrace ? SUBRACE_DETAILS[formData.subrace]?.abilityBonuses || null : null,
        [formData.subrace]
    );
    const racialSkillData = useMemo(() => RACIAL_SKILLS[formData.race], [formData.race]);
    const racialToolData = useMemo(() => RACIAL_TOOLS[formData.race], [formData.race]);
    const sizeOptions = useMemo(() =>
            raceDetails && typeof raceDetails.size === 'object' ? raceDetails.size.options : null,
        [raceDetails]
    );

    // Синхронизация classLevels
    useEffect(() => {
        setClassLevels(prev => {
            const newList = [...prev];
            if (newList.length === 0) newList.push({ className: formData.class, level: formData.level });
            else {
                newList[0].className = formData.class;
                newList[0].level = formData.level;
            }
            return newList;
        });
    }, [formData.class, formData.level]);

    // Обновление уровня при изменении classLevels
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
        if (field === 'className') newList[index].className = value as string;
        else newList[index].level = Math.max(1, Math.min(20, Number(value)));
        setClassLevels(newList);
        updateTotalLevel();
    };

    // При изменении расы сбрасываем подрасу и бонусы
    useEffect(() => {
        let size = 'Medium';
        if (raceDetails) {
            if (typeof raceDetails.size === 'string') size = raceDetails.size;
            else if (raceDetails.size.options) size = raceDetails.size.default || raceDetails.size.options[0] || 'Medium';
            setFormData(prev => ({ ...prev, size, subrace: '' }));
        }
        if (raceBonuses?.choose) {
            setSelectedBonusAttrs(new Array(raceBonuses.choose.count).fill(null));
        } else {
            setSelectedBonusAttrs([]);
        }
        // Сбрасываем выбранную фичу расы
        setSelectedFeature(null);

        // Расовая принадлежность
        if (racialSkillData) {
            if (racialSkillData.fixed) setSelectedRacialSkills(racialSkillData.fixed);
            else if (racialSkillData.choose) setSelectedRacialSkills(new Array(racialSkillData.choose.count).fill(''));
            else setSelectedRacialSkills([]);
        } else setSelectedRacialSkills([]);

        if (racialToolData) {
            if (racialToolData.fixed) setSelectedRacialTools(racialToolData.fixed);
            else if (racialToolData.choose) setSelectedRacialTools(new Array(racialToolData.choose.count).fill(''));
            else setSelectedRacialTools([]);
        } else setSelectedRacialTools([]);
    }, [formData.race, raceDetails, raceBonuses, racialSkillData, racialToolData]);

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

    // Обработчики для HP
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
        setRolledHps(Array.from({ length: additionalLevels }, () => Math.floor(Math.random() * hitDie) + 1));
    };

    // Обобщённые обработчики для расовых навыков/инструментов
    const handleRacialSelect = <T extends string[]>(
        setter: React.Dispatch<React.SetStateAction<T>>,
        current: T,
        index: number,
        value: string
    ) => {
        const newArr = [...current] as T;
        const existingIndex = newArr.indexOf(value);
        if (existingIndex !== -1 && existingIndex !== index) {
            newArr[existingIndex] = '' as T[number];
        }
        newArr[index] = value as T[number];
        setter(newArr);
    };

    const handleBonusSelect = (index: number, attr: string) => {
        const newAttrs = [...selectedBonusAttrs];
        const existingIndex = newAttrs.indexOf(attr);
        if (existingIndex !== -1 && existingIndex !== index) newAttrs[existingIndex] = null;
        newAttrs[index] = attr;
        setSelectedBonusAttrs(newAttrs);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Валидация HP
        if (!isCreative && hpMethod === 'roll' && formData.level > 1) {
            const neededRolls = formData.level - 1;
            if (rolledHps.length < neededRolls) {
                alert(`Please roll HP for all levels (${neededRolls} rolls needed). Currently: ${rolledHps.length}`);
                return;
            }
        }

        // Валидация расовых навыков/инструментов
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

        const finalData = { ...formData };
        if (!isCreative) {
            finalData.ac = 10 + Math.floor((formData.abilities.dex - 10) / 2);
            finalData.speed = 30;
        }

        const newCharacter = buildCharacter(
            finalData,
            classLevels,
            selectedBonusAttrs,
            selectedRacialSkills,
            selectedRacialTools,
            today
        );
        addCharacter(newCharacter);
        navigate('/hub');
    };

    const renderChevron = (isOpen: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
             className={`cr-chevron-icon ${isOpen ? 'cr-open' : ''}`}>
            <g clipPath="url(#clip0_403_3483)">
                <path d="M22.586 5.92896L12.707 15.808C12.5169 15.9904 12.2636 16.0923 12 16.0923C11.7365 16.0923 11.4832 15.9904 11.293 15.808L1.42004 5.93396L0.00604248 7.34796L9.87904 17.222C10.4509 17.767 11.2106 18.071 12.0005 18.071C12.7905 18.071 13.5502 17.767 14.122 17.222L24 7.34296L22.586 5.92896Z" fill="#374957"/>
            </g>
            <defs><clipPath id="clip0_403_3483"><rect width="24" height="24" fill="white"/></clipPath></defs>
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
                    name={formData.name} onNameChange={(v) => setFormData(p => ({ ...p, name: v }))}
                    characterClass={formData.class} onClassChange={(v) => setFormData(p => ({ ...p, class: v }))}
                    classOptions={DND_CLASSES}
                    subclass={formData.subclass} onSubclassChange={(v) => setFormData(p => ({ ...p, subclass: v }))}
                    subclassOptions={SUBCLASSES[formData.class] || []}
                    race={formData.race} onRaceChange={(v) => setFormData(p => ({ ...p, race: v }))}
                    raceOptions={DND_RACES}
                    subrace={formData.subrace} onSubraceChange={(v) => setFormData(p => ({ ...p, subrace: v }))}
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
                    background={formData.background} onBackgroundChange={(v) => setFormData(p => ({ ...p, background: v }))}
                    size={formData.size} onSizeChange={(v) => setFormData(p => ({ ...p, size: v }))}
                    sizeOptions={sizeOptions ?? undefined}
                />

                <HPSection
                    isCreative={isCreative}
                    hp={formData.hp} maxHp={formData.maxHp}
                    level={formData.level}
                    mainClass={classLevels[0]?.className || formData.class}
                    conMod={Math.floor((formData.abilities.con - 10) / 2)}
                    hpMethod={hpMethod} onHpMethodChange={setHpMethod}
                    rolledHps={rolledHps} onRoll={handleRoll} onRerollAll={handleRerollAll}
                    onHpChange={(v) => setFormData(p => ({ ...p, hp: v }))}
                    onMaxHpChange={(v) => setFormData(p => ({ ...p, maxHp: v }))}
                />

                <AbilityScoresSection
                    abilities={formData.abilities}
                    onAbilityChange={(ability, value) => setFormData(p => ({
                        ...p,
                        abilities: { ...p.abilities, [ability]: value }
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
                    onRacialSkillSelect={(i, v) => handleRacialSelect(setSelectedRacialSkills, selectedRacialSkills, i, v)}
                    selectedRacialTools={selectedRacialTools}
                    onRacialToolSelect={(i, v) => handleRacialSelect(setSelectedRacialTools, selectedRacialTools, i, v)}
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