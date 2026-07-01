import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CharacterContainer.css';

const CharacterContainer: React.FC = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    const handleSettings = () => {
        console.log('Settings clicked');
    };

    const abilitiesData = [
        { name: 'STR', score: 10, modifier: '+0' },
        { name: 'CON', score: 13, modifier: '+1' },
        { name: 'WIS', score: 15, modifier: '+2' },
        { name: 'DEX', score: 14, modifier: '+2' },
        { name: 'INT', score: 18, modifier: '+4' },
        { name: 'CHA', score: 12, modifier: '+1' },
    ];

    const skillsData = [
        { name: 'Acrobatics', attribute: 'DEX', bonus: '+5' },
        { name: 'Animal Handling', attribute: 'WIS', bonus: '+2' },
        { name: 'Arcana', attribute: 'INT', bonus: '+8' },
        { name: 'Athletics', attribute: 'STR', bonus: '+0' },
        { name: 'Deception', attribute: 'CHA', bonus: '+1' },
        { name: 'History', attribute: 'INT', bonus: '+8' },
        { name: 'Insight', attribute: 'WIS', bonus: '+2' },
        { name: 'Intimidation', attribute: 'CHA', bonus: '+1' },
        { name: 'Investigation', attribute: 'INT', bonus: '+8' },
        { name: 'Medicine', attribute: 'WIS', bonus: '+2' },
        { name: 'Nature', attribute: 'INT', bonus: '+4' },
        { name: 'Perception', attribute: 'WIS', bonus: '+6' },
        { name: 'Performance', attribute: 'CHA', bonus: '+1' },
        { name: 'Persuasion', attribute: 'CHA', bonus: '+5' },
        { name: 'Religion', attribute: 'INT', bonus: '+4' },
        { name: 'Sleight of Hand', attribute: 'DEX', bonus: '+2' },
        { name: 'Stealth', attribute: 'DEX', bonus: '+2' },
        { name: 'Survival', attribute: 'WIS', bonus: '+2' },
    ];

    // Состояние для галочек (все отмечены по умолчанию)
    const [checkedSkills, setCheckedSkills] = useState<boolean[]>(
        skillsData.map(() => true)
    );

    const toggleSkillCheck = (index: number) => {
        setCheckedSkills((prev) => {
            const newState = [...prev];
            newState[index] = !newState[index];
            return newState;
        });
    };

    return (
        <div className="character-page">
            <header className="character-header-charactercontainer">
                <div className="character-back-btn" onClick={handleBack}>
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M17.5 10C17.5 10.1658 17.4342 10.3247 17.3169 10.4419C17.1997 10.5592 17.0408 10.625 16.875 10.625H4.6336L9.19219 15.1828C9.25026 15.2409 9.29632 15.3098 9.32775 15.3857C9.35918 15.4616 9.37535 15.5429 9.37535 15.625C9.37535 15.7071 9.35918 15.7884 9.32775 15.8643C9.29632 15.9402 9.25026 16.0091 9.19219 16.0672C9.13412 16.1253 9.06518 16.1713 8.98931 16.2027C8.91344 16.2342 8.83213 16.2503 8.75 16.2503C8.66788 16.2503 8.58656 16.2342 8.51069 16.2027C8.43482 16.1713 8.36588 16.1253 8.30782 16.0672L2.68282 10.4422C2.62471 10.3841 2.57861 10.3152 2.54715 10.2393C2.5157 10.1635 2.49951 10.0821 2.49951 10C2.49951 9.91787 2.5157 9.83654 2.54715 9.76066C2.57861 9.68479 2.62471 9.61586 2.68282 9.55781L8.30782 3.93281C8.42509 3.81554 8.58415 3.74965 8.75 3.74965C8.91586 3.74965 9.07492 3.81554 9.19219 3.93281C9.30947 4.05009 9.37535 4.20915 9.37535 4.375C9.37535 4.54085 9.30947 4.69991 9.19219 4.81719L4.6336 9.375H16.875C17.0408 9.375 17.1997 9.44085 17.3169 9.55806C17.4342 9.67527 17.5 9.83424 17.5 10Z"
                              fill="#9CA3AF"
                        />
                    </svg>
                </div>
                <div className="character-header-info">
                    <div className="character-title">Character Sheet</div>
                    <div className="character-subtitle">Aelar Dawn</div>
                </div>
                <div className="character-settings-btn" onClick={handleSettings}>
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M10 6.25C9.25833 6.25 8.5333 6.46994 7.91662 6.88199C7.29993 7.29405 6.81929 7.87972 6.53546 8.56494C6.25163 9.25016 6.17737 10.0042 6.32206 10.7316C6.46676 11.459 6.82391 12.1272 7.34835 12.6517C7.8728 13.1761 8.54099 13.5333 9.26842 13.6779C9.99585 13.8226 10.7498 13.7484 11.4351 13.4646C12.1203 13.1807 12.706 12.7001 13.118 12.0834C13.5301 11.4667 13.75 10.7417 13.75 10C13.749 9.00576 13.3536 8.05253 12.6505 7.34949C11.9475 6.64646 10.9942 6.25104 10 6.25ZM10 12.5C9.50555 12.5 9.0222 12.3534 8.61108 12.0787C8.19996 11.804 7.87953 11.4135 7.69031 10.9567C7.50109 10.4999 7.45158 9.99723 7.54804 9.51228C7.64451 9.02732 7.88261 8.58187 8.23224 8.23223C8.58187 7.8826 9.02733 7.6445 9.51228 7.54804C9.99723 7.45157 10.4999 7.50108 10.9567 7.6903C11.4135 7.87952 11.804 8.19995 12.0787 8.61108C12.3534 9.0222 12.5 9.50555 12.5 10C12.5 10.663 12.2366 11.2989 11.7678 11.7678C11.2989 12.2366 10.663 12.5 10 12.5ZM16.875 10.1688C16.8781 10.0563 16.8781 9.94375 16.875 9.83125L18.0406 8.375C18.1017 8.29854 18.1441 8.2088 18.1641 8.11299C18.1842 8.01719 18.1815 7.91801 18.1563 7.82344C17.9652 7.10516 17.6793 6.41551 17.3063 5.77266C17.2574 5.68853 17.1896 5.61697 17.1082 5.56367C17.0268 5.51036 16.9341 5.47679 16.8375 5.46563L14.9844 5.25938C14.9073 5.17813 14.8292 5.1 14.75 5.025L14.5313 3.16719C14.52 3.07048 14.4863 2.97774 14.4329 2.89635C14.3794 2.81497 14.3077 2.7472 14.2234 2.69844C13.5803 2.32605 12.8908 2.0405 12.1727 1.84922C12.078 1.82406 11.9788 1.82149 11.883 1.84171C11.7872 1.86193 11.6975 1.90437 11.6211 1.96563L10.1688 3.125C10.0563 3.125 9.94376 3.125 9.83125 3.125L8.375 1.96172C8.29855 1.9006 8.2088 1.8583 8.113 1.83821C8.01719 1.81813 7.91801 1.82083 7.82344 1.8461C7.10528 2.03752 6.41567 2.32335 5.77266 2.69609C5.68853 2.74494 5.61697 2.81276 5.56367 2.89413C5.51037 2.97551 5.4768 3.06821 5.46563 3.16484L5.25938 5.02109C5.17813 5.0987 5.10001 5.17682 5.02501 5.25547L3.16719 5.46875C3.07048 5.48 2.97774 5.51369 2.89636 5.56713C2.81497 5.62058 2.7472 5.69229 2.69844 5.77656C2.32606 6.41966 2.0405 7.10925 1.84922 7.82735C1.82407 7.92197 1.82149 8.02119 1.84171 8.117C1.86193 8.2128 1.90438 8.30252 1.96563 8.37891L3.12501 9.83125C3.12501 9.94375 3.12501 10.0563 3.12501 10.1688L1.96172 11.625C1.90061 11.7015 1.8583 11.7912 1.83822 11.887C1.81813 11.9828 1.82083 12.082 1.8461 12.1766C2.03718 12.8948 2.32303 13.5845 2.6961 14.2273C2.74495 14.3115 2.81276 14.383 2.89414 14.4363C2.97551 14.4896 3.06821 14.5232 3.16485 14.5344L5.01797 14.7406C5.09558 14.8219 5.1737 14.9 5.25235 14.975L5.46876 16.8328C5.48001 16.9295 5.5137 17.0223 5.56714 17.1036C5.62058 17.185 5.6923 17.2528 5.77657 17.3016C6.41966 17.674 7.10926 17.9595 7.82735 18.1508C7.92198 18.1759 8.02119 18.1785 8.117 18.1583C8.2128 18.1381 8.30252 18.0956 8.37891 18.0344L9.83125 16.875C9.94376 16.8781 10.0563 16.8781 10.1688 16.875L11.625 18.0406C11.7015 18.1017 11.7912 18.1441 11.887 18.1641C11.9828 18.1842 12.082 18.1815 12.1766 18.1562C12.8948 17.9652 13.5845 17.6793 14.2273 17.3063C14.3115 17.2574 14.383 17.1896 14.4363 17.1082C14.4896 17.0268 14.5232 16.9341 14.5344 16.8375L14.7406 14.9844C14.8219 14.9073 14.9 14.8292 14.975 14.75L16.8328 14.5313C16.9295 14.52 17.0223 14.4863 17.1037 14.4329C17.185 14.3794 17.2528 14.3077 17.3016 14.2234C17.674 13.5803 17.9595 12.8908 18.1508 12.1727C18.1759 12.078 18.1785 11.9788 18.1583 11.883C18.1381 11.7872 18.0956 11.6975 18.0344 11.6211L16.875 10.1688ZM15.6172 9.66094C15.6305 9.88679 15.6305 10.1132 15.6172 10.3391C15.6079 10.4937 15.6563 10.6463 15.7531 10.7672L16.8617 12.1523C16.7345 12.5566 16.5716 12.9488 16.375 13.3242L14.6094 13.5242C14.4556 13.5413 14.3137 13.6148 14.2109 13.7305C14.0606 13.8996 13.9004 14.0598 13.7313 14.2102C13.6156 14.3129 13.5421 14.4548 13.525 14.6086L13.3289 16.3727C12.9535 16.5694 12.5613 16.7323 12.157 16.8594L10.7711 15.7508C10.6602 15.6622 10.5224 15.614 10.3805 15.6141H10.343C10.1171 15.6273 9.8907 15.6273 9.66485 15.6141C9.51023 15.6048 9.35766 15.6532 9.23672 15.75L7.84766 16.8594C7.44339 16.7322 7.05122 16.5693 6.67579 16.3727L6.47579 14.6094C6.45872 14.4556 6.38523 14.3136 6.26954 14.2109C6.1004 14.0606 5.94023 13.9004 5.78985 13.7313C5.68714 13.6156 5.54517 13.5421 5.39141 13.525L3.62735 13.3281C3.43062 12.9527 3.26774 12.5606 3.14063 12.1563L4.24922 10.7703C4.34602 10.6494 4.39447 10.4968 4.38516 10.3422C4.37188 10.1163 4.37188 9.88991 4.38516 9.66406C4.39447 9.50944 4.34602 9.35687 4.24922 9.23594L3.14063 7.84766C3.26784 7.44339 3.43072 7.05122 3.62735 6.67578L5.39063 6.47578C5.54439 6.45871 5.68636 6.38523 5.78907 6.26953C5.93945 6.1004 6.09962 5.94023 6.26875 5.78985C6.38491 5.68707 6.4587 5.54478 6.47579 5.39063L6.67188 3.62735C7.04727 3.43062 7.43945 3.26774 7.84376 3.14063L9.22969 4.24922C9.35062 4.34602 9.50319 4.39447 9.65782 4.38516C9.88366 4.37188 10.1101 4.37188 10.3359 4.38516C10.4906 4.39447 10.6431 4.34602 10.7641 4.24922L12.1523 3.14063C12.5566 3.26783 12.9488 3.43071 13.3242 3.62735L13.5242 5.39063C13.5413 5.54439 13.6148 5.68636 13.7305 5.78906C13.8996 5.93945 14.0598 6.09962 14.2102 6.26875C14.3129 6.38444 14.4548 6.45793 14.6086 6.475L16.3727 6.67109C16.5694 7.04649 16.7323 7.43866 16.8594 7.84297L15.7508 9.22891C15.6531 9.35086 15.6046 9.505 15.6148 9.66094H15.6172Z"
                              fill="#34D399"
                        />
                    </svg>
                </div>
            </header>

            <div className="character-content">
                <div className="section-info">
                    <div className="info-title">Characters Details</div>

                    {/* Первый ряд */}
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">Level</span>
                            <span className="info-value">7</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Class</span>
                            <span className="info-value">Wizard</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Race</span>
                            <span className="info-value">Elf</span>
                        </div>
                    </div>

                    {/* Второй ряд */}
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">Background</span>
                            <span className="info-value">Sage</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">AC</span>
                            <span className="info-value">14</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Speed</span>
                            <span className="info-value">30 ft</span>
                        </div>
                    </div>
                </div>

                <div className="section-hp">
                    <div className="hp-title">Hit Points</div>

                    <div className="hp-display">
                        <span className="hp-current">45</span>
                        <span className="hp-separator">/</span>
                        <span className="hp-max">60</span>
                    </div>

                    <div className="hp-controls">
                        <button className="hp-button">Take Damage</button>
                        <button className="hp-button">Heal</button>
                    </div>
                </div>

                <div className="section-abilities">
                    <div className="abilities-title">Abilities</div>
                    <div className="abilities-grid">
                        {abilitiesData.map((ability) => (
                            <div className="ability-card" key={ability.name}>
                                <span className="ability-name">{ability.name}</span>
                                <span className="ability-score">{ability.score}</span>
                                <span className="ability-modifier">{ability.modifier}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="section-skills">
                    <div className="skills-title">Skills & Proficiencies</div>
                    <div className="skills-grid">
                        {skillsData.map((skill, index) => (
                            <div className="skill-card" key={skill.name}>
                                <div className="skill-left">
                                    <div
                                        className="skill-check"
                                        onClick={() => toggleSkillCheck(index)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {checkedSkills[index] ? (
                                            <svg
                                                width="14"
                                                height="14"
                                                viewBox="0 0 14 14"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M12.7143 4.40178L5.7143 11.4018C5.65334 11.463 5.58089 11.5115 5.50112 11.5446C5.42135 11.5777 5.33583 11.5948 5.24946 11.5948C5.16309 11.5948 5.07757 11.5777 4.9978 11.5446C4.91803 11.5115 4.84558 11.463 4.78462 11.4018L1.72212 8.33928C1.66107 8.27823 1.61265 8.20576 1.57961 8.12601C1.54658 8.04625 1.52957 7.96076 1.52957 7.87443C1.52957 7.78811 1.54658 7.70262 1.57961 7.62286C1.61265 7.5431 1.66107 7.47063 1.72212 7.40959C1.78316 7.34855 1.85563 7.30012 1.93539 7.26709C2.01515 7.23405 2.10063 7.21705 2.18696 7.21705C2.27329 7.21705 2.35877 7.23405 2.43853 7.26709C2.51829 7.30012 2.59076 7.34855 2.6518 7.40959L5.25001 10.0078L11.7857 3.47318C11.909 3.3499 12.0762 3.28064 12.2506 3.28064C12.4249 3.28064 12.5921 3.3499 12.7154 3.47318C12.8387 3.59647 12.9079 3.76368 12.9079 3.93803C12.9079 4.11238 12.8387 4.27959 12.7154 4.40287L12.7143 4.40178Z"
                                                    fill="white"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                width="14"
                                                height="14"
                                                viewBox="0 0 14 14"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <rect x="0.5" y="0.5" width="13" height="13" stroke="white" strokeOpacity="0.5" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="skill-name">{skill.name} ({skill.attribute})</span>
                                </div>
                                <span className="skill-bonus">{skill.bonus}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CharacterContainer;