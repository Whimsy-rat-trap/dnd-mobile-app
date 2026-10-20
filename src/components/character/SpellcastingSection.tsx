import React from 'react';
import { Link } from 'react-router-dom';
import { Character } from '../../types/Character';
import {
    getSpellSlots,
    getMaxPrepared,
    isSpellcastingClass,
} from '../../utils/spellcasting';
import {
    getSpellSaveDC,
    getSpellAttackBonus,
} from '../../utils/spellUtils';
import {
    getMaxMagicalSecretsForCharacter,
    getUsedMagicalSecretsCount,
} from '../../utils/classSpellUtils';
import './SpellcastingSection.css';

interface SpellcastingSectionProps {
    character: Character;
}

const SpellcastingSection: React.FC<SpellcastingSectionProps> = ({ character }) => {
    const isCaster = isSpellcastingClass(character);
    const hasSpells = character.spells.length > 0;

    if (!isCaster && !hasSpells) return null;

    const spellSlots = getSpellSlots(character);
    const totalSlots = spellSlots.reduce((a, b) => a + b, 0);
    const maxPrepared = getMaxPrepared(character);
    const preparedCount = character.spells.filter(
        s => s.prepared && !s.isRacial && !s.isAlwaysPrepared
    ).length;
    const knownCount = character.spells.length;
    const racialCount = character.spells.filter(s => s.isRacial).length;

    const showPrepared = isCaster && maxPrepared > 0;

    // Save DC / Attack — считаем по основному классу-кастеру
    const spellSaveDC = isCaster ? getSpellSaveDC(character) : null;
    const spellAttackBonus = isCaster ? getSpellAttackBonus(character) : null;

    const magicalSecretsMax = getMaxMagicalSecretsForCharacter(character);
    const magicalSecretsUsed = getUsedMagicalSecretsCount(character);

    return (
        <div className="cc-section-spellcasting">
            <div className="cc-spellcasting-header">
                <span className="cc-spellcasting-title">Spellcasting</span>
                <Link to="/spellbook" className="cc-view-full-spellbook">
                    View Full Spellbook
                </Link>
            </div>

            {/* Save DC / Attack — главные боевые числа */}
            {isCaster && (
                <div className="cc-spell-stats cc-spell-stats-primary">
                    <div className="cc-stat-item cc-stat-dc">
                        <span className="cc-stat-label">Save DC</span>
                        <span className="cc-stat-value cc-stat-value-dc">{spellSaveDC}</span>
                    </div>
                    <div className="cc-stat-item cc-stat-atk">
                        <span className="cc-stat-label">Attack</span>
                        <span className="cc-stat-value cc-stat-value-atk">
                            {spellAttackBonus !== null && spellAttackBonus >= 0 ? '+' : ''}
                            {spellAttackBonus}
                        </span>
                    </div>
                    <div className="cc-stat-item">
                        <span className="cc-stat-label">Slots</span>
                        <span className="cc-stat-value">{totalSlots}</span>
                    </div>
                </div>
            )}

            {/* Счётчики */}
            <div className="cc-spell-stats">
                {showPrepared && (
                    <div className="cc-stat-item">
                        <span className="cc-stat-label">Prepared</span>
                        <span className="cc-stat-value">
                            {preparedCount} / {maxPrepared}
                        </span>
                    </div>
                )}

                {magicalSecretsMax > 0 && (
                    <div className="cc-stat-item">
                        <span className="cc-stat-label">Magical Secrets</span>
                        <span className="cc-stat-value cc-stat-value-secrets">
                            {magicalSecretsUsed} / {magicalSecretsMax}
                        </span>
                    </div>
                )}

                {racialCount > 0 && (
                    <div className="cc-stat-item">
                        <span className="cc-stat-label">Racial</span>
                        <span className="cc-stat-value">{racialCount}</span>
                    </div>
                )}

                <div className="cc-stat-item">
                    <span className="cc-stat-label">Known</span>
                    <span className="cc-stat-value">{knownCount}</span>
                </div>
            </div>
        </div>
    );
};

export default SpellcastingSection;