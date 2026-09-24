import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCharacters } from '../context/CharacterContext';
import DiceRoller from '../components/DiceRoller';
import Modal from '../components/Modal';
import AddFeatModal from '../components/AddFeatModal';
import CharacterInfoSection from '../components/character/CharacterInfoSection';
import AbilitiesSection from '../components/character/AbilitiesSection';
import AttacksSection from '../components/character/AttacksSection';
import SavingThrowsSection from '../components/character/SavingThrowsSection';
import RaceFeaturesSection from '../components/character/RaceFeaturesSection';
import FeatsSection from '../components/character/FeatsSection';
import SkillsSection from '../components/character/SkillsSection';
import ToolsSection from '../components/character/ToolsSection';
import LanguagesSection from '../components/character/LanguagesSection';
import PassiveEffectsSection from '../components/character/PassiveEffectsSection';
import SpellcastingSection from '../components/character/SpellcastingSection';
import HpEditPopup from '../components/character/HpEditPopup';
import { RACE_FEATURES } from '../constants/raceFeatures';
import { SUBRACE_DETAILS } from '../constants/subraceDetails';
import { getActivePassiveEffects } from '../utils/racialFeatures';
import {getProficiencyBonus, getModifier, getACInfo, getAttackBonuses,} from '../utils/characterUtils';
import './CharacterContainer.css';

const CharacterContainer: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {
        getCharacter, updateCharacter, setCurrentCharacterId,
        deleteCharacter, addFeat, removeFeat,
    } = useCharacters();

    const character = id ? getCharacter(id) : undefined;

    // UI state
    const [useVariant, setUseVariant] = useState(false);
    const [rollMode, setRollMode] = useState(false);
    const [rollResultModal, setRollResultModal] = useState<{ name: string; modifier: number; result?: number } | null>(null);
    const [hpPopupOpen, setHpPopupOpen] = useState(false);
    const [showAddFeatModal, setShowAddFeatModal] = useState(false);

    // backup attributes for variant rule
    const [backupSkillAttributes, setBackupSkillAttributes] = useState<{ name: string; attribute: string }[]>([]);
    const [backupToolAttributes, setBackupToolAttributes] = useState<{ name: string; attribute: string }[]>([]);

    if (!character) return <div className="cc-page">Character not found</div>;

    // Computed
    const proficiencyBonus = getProficiencyBonus(character.level);
    const acInfo = getACInfo(character);
    const { meleeAttack, meleeDamage } = getAttackBonuses(character);
    const classDisplay = character.classes?.join(' / ') || 'No class';

    // Race features
    const raceFeatures = RACE_FEATURES[character.race] || [];
    const subraceFeatures = character.subrace ? (SUBRACE_DETAILS[character.subrace]?.features || []) : [];
    const allFeaturesMap = new Map<string, typeof raceFeatures[0]>();
    [...raceFeatures, ...subraceFeatures].forEach(f => {
        if (!allFeaturesMap.has(f.name)) allFeaturesMap.set(f.name, f);
    });
    const allFeatures = Array.from(allFeaturesMap.values());

    // Spell stats
    const preparedCount = character.spells.filter(s => s.prepared).length;
    const knownCount = character.spells.length;
    const racialCount = character.spells.filter(s => s.isRacial).length;

    // Handlers
    const update = (data: Partial<typeof character>) => updateCharacter(character.id, data);

    const handleDelete = () => {
        if (window.confirm(`Delete "${character.name}"? This action cannot be undone.`)) {
            deleteCharacter(character.id);
            navigate('/hub');
        }
    };

    const handleSavingThrowRoll = (attr: string) => {
        const bonus = character.savingThrowProficiencies?.includes(attr)
            ? getModifier(character.abilities[attr.toLowerCase() as keyof typeof character.abilities]) + proficiencyBonus
            : getModifier(character.abilities[attr.toLowerCase() as keyof typeof character.abilities]);
        const roll = Math.floor(Math.random() * 20) + 1;
        setRollResultModal({ name: `${attr} Saving Throw`, modifier: bonus, result: roll });
    };

    const handleSkillRoll = (skill: typeof character.skills[0]) => {
        const attrKey = skill.attribute.toLowerCase() as keyof typeof character.abilities;
        const mod = getModifier(character.abilities[attrKey]);
        const bonus = skill.proficient ? mod + proficiencyBonus : mod;
        const roll = Math.floor(Math.random() * 20) + 1;
        setRollResultModal({ name: skill.name, modifier: bonus, result: roll });
    };

    const handleToolRoll = (tool: typeof character.toolProficiencies[0]) => {
        const attrKey = (tool.attribute || 'DEX').toLowerCase() as keyof typeof character.abilities;
        const mod = getModifier(character.abilities[attrKey]);
        const bonus = tool.proficient ? mod + proficiencyBonus : mod;
        const roll = Math.floor(Math.random() * 20) + 1;
        setRollResultModal({ name: tool.name, modifier: bonus, result: roll });
    };

    const toggleSkillProficient = (index: number) =>
        update({ skills: character.skills.map((s, i) => i === index ? { ...s, proficient: !s.proficient } : s) });

    const toggleToolProficient = (index: number) =>
        update({ toolProficiencies: character.toolProficiencies.map((t, i) => i === index ? { ...t, proficient: !t.proficient } : t) });

    const changeSkillAttribute = (index: number, attr: string) =>
        update({ skills: character.skills.map((s, i) => i === index ? { ...s, attribute: attr } : s) });

    const changeToolAttribute = (index: number, attr: string) =>
        update({ toolProficiencies: character.toolProficiencies.map((t, i) => i === index ? { ...t, attribute: attr } : t) });

    const handleVariantToggle = () => {
        if (!useVariant) {
            setBackupSkillAttributes(character.skills.map(s => ({ name: s.name, attribute: s.attribute })));
            setBackupToolAttributes(character.toolProficiencies.map(t => ({ name: t.name, attribute: t.attribute || 'DEX' })));
        } else {
            const restoredSkills = character.skills.map(s => {
                const b = backupSkillAttributes.find(x => x.name === s.name);
                return b ? { ...s, attribute: b.attribute } : s;
            });
            const restoredTools = character.toolProficiencies.map(t => {
                const b = backupToolAttributes.find(x => x.name === t.name);
                return b ? { ...t, attribute: b.attribute } : t;
            });
            update({ skills: restoredSkills, toolProficiencies: restoredTools });
        }
        setUseVariant(v => !v);
    };

    const toggleSavingThrowProficiency = (attr: string) => {
        if (rollMode) return handleSavingThrowRoll(attr);
        const profs = character.savingThrowProficiencies || [];
        const updated = profs.includes(attr) ? profs.filter(p => p !== attr) : [...profs, attr];
        update({ savingThrowProficiencies: updated });
    };

    const hp = character.hp;
    const maxHp = character.maxHp;
    const tempHp = character.tempHp || 0;
    const hpPercent = (hp / maxHp) * 100;
    const tempPercent = (tempHp / maxHp) * 100;

    return (
        <div className="cc-page">
            <header className="cc-header">
                <button className="cc-back-btn" onClick={() => navigate(-1)} aria-label="Back">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M17.5 10C17.5 10.1658 17.4342 10.3247 17.3169 10.4419C17.1997 10.5592 17.0408 10.625 16.875 10.625H4.6336L9.19219 15.1828C9.25026 15.2409 9.29632 15.3098 9.32775 15.3857C9.35918 15.4616 9.37535 15.5429 9.37535 15.625C9.37535 15.7071 9.35918 15.7884 9.32775 15.8643C9.29632 15.9402 9.25026 16.0091 9.19219 16.0672C9.13412 16.1253 9.06518 16.1713 8.98931 16.2027C8.91344 16.2342 8.83213 16.2503 8.75 16.2503C8.66788 16.2503 8.58656 16.2342 8.51069 16.2027C8.43482 16.1713 8.36588 16.1253 8.30782 16.0672L2.68282 10.4422C2.62471 10.3841 2.57861 10.3152 2.54715 10.2393C2.5157 10.1635 2.49951 10.0821 2.49951 10C2.49951 9.91787 2.5157 9.83654 2.54715 9.76066C2.57861 9.68479 2.62471 9.61586 2.68282 9.55781L8.30782 3.93281C8.42509 3.81554 8.58415 3.74965 8.75 3.74965C8.91586 3.74965 9.07492 3.81554 9.19219 3.93281C9.30947 4.05009 9.37535 4.20915 9.37535 4.375C9.37535 4.54085 9.30947 4.69991 9.19219 4.81719L4.6336 9.375H16.875C17.0408 9.375 17.1997 9.44085 17.3169 9.55806C17.4342 9.67527 17.5 9.83424 17.5 10Z" fill="#9CA3AF" />
                    </svg>
                </button>
                <div className="cc-header-info">
                    <div className="cc-title">Character Sheet</div>
                    <div className="cc-subtitle">{character.name}</div>
                </div>
                <button className="cc-set-current-btn"
                        onClick={() => { setCurrentCharacterId(character.id); navigate('/dashboard'); }}>
                    Set as current
                </button>
                <button className="cc-delete-btn" onClick={handleDelete}>Delete</button>
            </header>

            <div className="cc-content">
                <CharacterInfoSection
                    character={character}
                    classDisplay={classDisplay}
                    proficiencyBonus={proficiencyBonus}
                    acInfo={acInfo}
                />

                {/* HP */}
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
                            <div className="cc-hp-fill" style={{ width: `${hpPercent}%` }} />
                            {tempHp > 0 && <div className="cc-temp-fill" style={{ width: `${tempPercent}%` }} />}
                        </div>
                    </div>
                </div>

                <AbilitiesSection abilities={character.abilities} />

                <AttacksSection
                    features={allFeatures}
                    feats={character.feats}
                    attackBonus={meleeAttack}
                    damageBonus={meleeDamage}
                />

                <SpellcastingSection character={character} />

                <SavingThrowsSection
                    abilities={character.abilities}
                    proficiencies={character.savingThrowProficiencies || []}
                    proficiencyBonus={proficiencyBonus}
                    rollMode={rollMode}
                    onToggleRollMode={() => setRollMode(m => !m)}
                    onClick={toggleSavingThrowProficiency}
                />

                <RaceFeaturesSection features={allFeatures} />

                <PassiveEffectsSection effects={getActivePassiveEffects(character.race, character.subrace)} />

                <FeatsSection
                    feats={character.feats}
                    characterLevel={character.level}
                    onAdd={() => setShowAddFeatModal(true)}
                    onRemove={(id) => window.confirm('Remove this feat?') && removeFeat(character.id, id)}
                />

                {/* Variant toggle */}
                <div className="cc-variant-toggle-container">
                    <label className="cc-variant-toggle">
                        <span className="cc-toggle-label">Use Skills with Different Abilities variant rule?</span>
                        <input type="checkbox" checked={useVariant} onChange={handleVariantToggle} />
                        <span className="cc-toggle-slider" />
                    </label>
                </div>

                <SkillsSection
                    skills={character.skills}
                    abilities={character.abilities}
                    proficiencyBonus={proficiencyBonus}
                    rollMode={rollMode}
                    useVariant={useVariant}
                    onToggle={toggleSkillProficient}
                    onAttributeChange={changeSkillAttribute}
                    onRoll={handleSkillRoll}
                />

                <ToolsSection
                    tools={character.toolProficiencies}
                    abilities={character.abilities}
                    proficiencyBonus={proficiencyBonus}
                    rollMode={rollMode}
                    useVariant={useVariant}
                    onToggle={toggleToolProficient}
                    onAttributeChange={changeToolAttribute}
                    onRoll={handleToolRoll}
                />

                <LanguagesSection languages={character.languages} />
            </div>

            {/* Modals */}
            <Modal isOpen={!!rollResultModal} onClose={() => setRollResultModal(null)}>
                {rollResultModal && (
                    <>
                        <h3 className="cc-roll-modal-title">{rollResultModal.name}</h3>
                        <div className="cc-roll-modal-dice">
                            <DiceRoller sides={20} initialResult={rollResultModal.result} autoRoll displayOnly />
                        </div>
                        <div className="cc-roll-modal-modifier">
                            Modifier: {rollResultModal.modifier >= 0 ? '+' : ''}{rollResultModal.modifier}
                        </div>
                        <div className="cc-roll-modal-total">
                            Total: <strong>{(rollResultModal.result ?? 0) + rollResultModal.modifier}</strong>
                        </div>
                    </>
                )}
            </Modal>

            <HpEditPopup
                isOpen={hpPopupOpen}
                onClose={() => setHpPopupOpen(false)}
                hp={hp}
                maxHp={maxHp}
                tempHp={tempHp}
                onAddHp={(a) => a > 0 && update({ hp: Math.min(hp + a, maxHp) })}
                onSubtractHp={(a) => a > 0 && update({ hp: Math.max(hp - a, 0) })}
                onAddTempHp={(a) => a > 0 && update({ tempHp: tempHp + a })}
                onSubtractTempHp={(a) => a > 0 && update({ tempHp: Math.max(tempHp - a, 0) })}
            />

            <AddFeatModal
                isOpen={showAddFeatModal}
                onClose={() => setShowAddFeatModal(false)}
                onAdd={(feat) => addFeat(character.id, feat)}
                characterLevel={character.level}
                existingLevelFeats={character.feats.filter(f => f.source === 'level')}
            />
        </div>
    );
};

export default CharacterContainer;