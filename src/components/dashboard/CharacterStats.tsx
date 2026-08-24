import React from 'react';
import { Character } from '../../types/Character';
import { getProficiencyBonus } from '../../utils/proficiency';

interface CharacterStatsProps {
    character: Character;
    hp: number;
    maxHp: number;
    tempHp: number;
    hpPercent: number;
    tempPercent: number;
    exp: number;
    maxExp: number;
    expPercent: number;
    overlevelPercent: number;
    isZeroHp: boolean;
    onHpClick: () => void;
    onExpClick: () => void;
    onProfileClick: () => void;
}

const CharacterStats: React.FC<CharacterStatsProps> = ({
                                                           character,
                                                           hp,
                                                           maxHp,
                                                           tempHp,
                                                           hpPercent,
                                                           tempPercent,
                                                           exp,
                                                           maxExp,
                                                           expPercent,
                                                           overlevelPercent,
                                                           isZeroHp,
                                                           onHpClick,
                                                           onExpClick,
                                                           onProfileClick,
                                                       }) => {
    const level = character.level;
    const proficiencyBonus = getProficiencyBonus(level);

    return (
        <div className="db-character-card">
            <div className="db-character-header">
                <div className="db-avatar" style={{ cursor: 'pointer' }} onClick={onProfileClick}>
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24.1875 16.875C24.1875 18.0988 23.8246 19.2951 23.1447 20.3126C22.4648 21.3301 21.4985 22.1232 20.3679 22.5915C19.2372 23.0598 17.9931 23.1824 16.7929 22.9436C15.5926 22.7049 14.4901 22.1156 13.6248 21.2502C12.7594 20.3849 12.1701 19.2824 11.9314 18.0821C11.6926 16.8819 11.8152 15.6378 12.2835 14.5071C12.7518 13.3765 13.5449 12.4102 14.5624 11.7303C15.5799 11.0504 16.7762 10.6875 18 10.6875C19.6405 10.6894 21.2132 11.3419 22.3732 12.5018C23.5331 13.6618 24.1856 15.2345 24.1875 16.875ZM32.625 18C32.625 20.8926 31.7673 23.7201 30.1602 26.1252C28.5532 28.5303 26.2691 30.4048 23.5967 31.5117C20.9244 32.6187 17.9838 32.9083 15.1468 32.344C12.3098 31.7797 9.70391 30.3868 7.65856 28.3414C5.61322 26.2961 4.22032 23.6902 3.65601 20.8532C3.09171 18.0162 3.38133 15.0756 4.48826 12.4033C5.59519 9.73089 7.46972 7.44677 9.87478 5.83976C12.2799 4.23274 15.1074 3.375 18 3.375C21.8775 3.37909 25.5951 4.92125 28.3369 7.66309C31.0787 10.4049 32.6209 14.1225 32.625 18ZM30.375 18C30.3732 16.3343 30.0355 14.6862 29.3821 13.154C28.7287 11.6219 27.773 10.2372 26.5722 9.08288C25.3714 7.92854 23.9502 7.02823 22.3934 6.43579C20.8367 5.84334 19.1765 5.57093 17.512 5.63484C10.8886 5.89078 5.60672 11.4075 5.625 18.0352C5.63135 21.0523 6.74412 23.9623 8.7525 26.2139C9.57041 25.0276 10.6094 24.0101 11.8125 23.2172C11.9151 23.1494 12.037 23.1172 12.1597 23.1253C12.2824 23.1334 12.399 23.1815 12.4917 23.2622C14.0206 24.5846 15.9744 25.3123 17.9958 25.3123C20.0172 25.3123 21.971 24.5846 23.4998 23.2622C23.5926 23.1815 23.7092 23.1334 23.8319 23.1253C23.9545 23.1172 24.0765 23.1494 24.1791 23.2172C25.3837 24.0097 26.4241 25.0272 27.2433 26.2139C29.2616 23.9541 30.3765 21.0299 30.375 18Z" fill="white" />
                    </svg>
                </div>
                <div className="db-character-info">
                    <div className="db-character-name">{character.name}</div>
                    <div className="db-character-class">{character.classes?.join(' / ') || 'Unknown'}</div>
                    <div className="db-character-level">
                        Level {level} <span className="db-level-separator">•</span> {character.background || 'No Background'}
                    </div>
                </div>
                <div className="db-levelup-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_403_3729)">
                            <path d="M22.5861 18.1479L12.7071 8.26894C12.517 8.08645 12.2636 7.98455 12.0001 7.98455C11.7365 7.98455 11.4832 8.08645 11.2931 8.26894L1.4201 18.1419L0.00610352 16.7279L9.8791 6.85494C10.4507 6.30947 11.2105 6.00513 12.0006 6.00513C12.7907 6.00513 13.5505 6.30947 14.1221 6.85494L24.0001 16.7339L22.5861 18.1479Z" fill="#374957" />
                        </g>
                        <defs>
                            <clipPath id="clip0_403_3729">
                                <rect width="24" height="24" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                </div>
            </div>

            <div className="db-stats-row">
                <div className="db-stat-block db-clickable db-stat-hp" onClick={onHpClick}>
                    <span className="db-stat-label">HP</span>
                    <div className="db-stat-progress">
                        <div className="db-progress-track">
                            <div className="db-hp-fill" style={{ width: `${hpPercent}%` }}></div>
                            {tempHp > 0 && (
                                <div className="db-temp-fill" style={{ width: `${tempPercent}%` }}></div>
                            )}
                        </div>
                    </div>
                    <span className="db-stat-value db-stat-value-hp">
                        {hp} / {maxHp}
                        {tempHp > 0 && <span className="db-temp-hp-value"> +{tempHp} temp</span>}
                    </span>
                    {isZeroHp && (
                        <div className="db-death-warning">
                            {character.isStable ? 'Character is stable. Please get healed.' : 'You need to make a death saving throw'}
                        </div>
                    )}
                </div>
                <div className="db-stat-block db-clickable db-stat-exp" onClick={onExpClick}>
                    <span className="db-stat-label">EXP</span>
                    <div className="db-stat-progress">
                        <div className="db-progress-track">
                            <div className="db-exp-fill" style={{ width: `${expPercent}%` }}></div>
                            {overlevelPercent > 0 && (
                                <div className="db-overlevel-fill" style={{ width: `${overlevelPercent}%` }}></div>
                            )}
                        </div>
                    </div>
                    <span className="db-stat-value db-stat-value-exp">
                        {exp.toLocaleString()} / {maxExp.toLocaleString()}
                        {exp > maxExp && <span className="db-overlevel-exp-value"> +{Math.floor(exp - maxExp)} over</span>}
                    </span>
                </div>
            </div>

            <div className="db-character-level" style={{ marginTop: '8px' }}>
                Proficiency +{proficiencyBonus}
            </div>
        </div>
    );
};

export default CharacterStats;