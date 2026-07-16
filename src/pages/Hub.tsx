import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCharacters } from '../context/CharacterContext';
import CreateModePopup from '../components/CreateModePopup';
import './Hub.css';

const Hub: React.FC = () => {
    const navigate = useNavigate();
    const { characters } = useCharacters();

    const [isCharactersOpen, setIsCharactersOpen] = useState(true);
    const [isCampaignsOpen, setIsCampaignsOpen] = useState(true);
    const [isItemsOpen, setIsItemsOpen] = useState(true);
    const [isSpellsOpen, setIsSpellsOpen] = useState(true);
    const [showCreatePopup, setShowCreatePopup] = useState(false);

    // Локальные данные (заглушки) для кампаний, предметов и заклинаний
    const campaigns = [
        { id: 1, name: 'Curse of Strahd', status: 'active', description: 'Ravenloft', playedWith: ['Alice', 'Bob', 'Charlie'], lastPlayed: '2026-07-01' },
        { id: 2, name: 'Lost Mine of Phandelver', status: 'active', description: 'Phandalin', playedWith: ['Dave', 'Eve'], lastPlayed: '2026-06-28' },
        { id: 3, name: 'Dragon Heist', status: 'inactive', description: 'Waterdeep', playedWith: ['Frank', 'Grace'], archivedDate: '2026-05-15' },
    ];

    const items = [
        { id: 1, name: 'Potion of Healing', description: 'Restores 2d4+2 hit points.', charges: { current: 1, max: 1 }, diceRoll: '2d4+2', healing: true },
        { id: 2, name: 'Greater Potion of Healing', description: 'Restores 4d4+4 hit points.', charges: { current: 1, max: 1 }, diceRoll: '4d4+4', healing: true },
        { id: 3, name: 'Antidote', description: 'Cures poison and disease.', charges: { current: 1, max: 1 }, diceRoll: null, healing: false },
        { id: 4, name: 'Potion of Invisibility', description: 'Become invisible for 1 hour.', charges: { current: 1, max: 1 }, diceRoll: null, healing: false },
        { id: 5, name: 'Scroll of Protection', description: 'Creates a protective barrier.', charges: { current: 1, max: 1 }, diceRoll: null, healing: false },
    ];

    const spells = [
        { id: 1, name: 'Fireball', level: 3, school: 'Evocation', description: 'A bright streak flashes from your pointing finger...', element: 'fire', diceRoll: '8d6' },
        { id: 2, name: 'Magic Missile', level: 1, school: 'Evocation', description: 'You create three glowing darts...', element: 'force', diceRoll: '1d4+1 per dart' },
        { id: 3, name: 'Cure Wounds', level: 1, school: 'Evocation', description: 'A creature you touch regains...', element: 'healing', diceRoll: '1d8+mod' },
        { id: 4, name: 'Shield', level: 1, school: 'Abjuration', description: 'An invisible barrier...', element: 'force', diceRoll: null },
        { id: 5, name: 'Chill Touch', level: 0, school: 'Necromancy', description: 'You create a ghostly, skeletal hand...', element: 'necrotic', diceRoll: '1d8' },
        { id: 6, name: 'Acid Splash', level: 0, school: 'Conjuration', description: 'You hurl a bubble of acid...', element: 'acid', diceRoll: '1d6' },
        { id: 7, name: 'Poison Spray', level: 0, school: 'Conjuration', description: 'You project a puff of noxious gas...', element: 'poison', diceRoll: '1d12' },
    ];

    const elementColors: Record<string, string> = {
        fire: '#ef4444',
        force: '#a855f7',
        necrotic: '#8b5cf6',
        acid: '#22c55e',
        cold: '#38bdf8',
        lightning: '#fbbf24',
        thunder: '#a855f7',
        psychic: '#f472b6',
        radiant: '#fcd34d',
        poison: '#84cc16',
        healing: '#22c55e',
    };

    const toggleCharacters = () => setIsCharactersOpen(!isCharactersOpen);
    const toggleCampaigns = () => setIsCampaignsOpen(!isCampaignsOpen);
    const toggleItems = () => setIsItemsOpen(!isItemsOpen);
    const toggleSpells = () => setIsSpellsOpen(!isSpellsOpen);

    const renderChevron = (isOpen: boolean) => (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`chevron-icon ${isOpen ? 'open' : ''}`}
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

    const truncateDescription = (text: string, maxLength: number = 70) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    };

    const renderAddCharacterCard = () => (
        <div
            className="character-card-hub add-card"
            onClick={() => setShowCreatePopup(true)}
            style={{ cursor: 'pointer' }}
        >
            <div className="add-card-content">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_403_3304)">
                        <path d="M9 11.9999C10.1867 11.9999 11.3467 11.648 12.3334 10.9888C13.3201 10.3295 14.0892 9.3924 14.5433 8.29604C14.9974 7.19969 15.1162 5.99329 14.8847 4.8294C14.6532 3.66551 14.0818 2.59642 13.2426 1.7573C12.4035 0.918186 11.3344 0.346741 10.1705 0.11523C9.00666 -0.116281 7.80026 0.00253868 6.7039 0.456664C5.60754 0.91079 4.67047 1.67983 4.01118 2.66652C3.35189 3.65321 3 4.81325 3 5.99994C3.00159 7.59075 3.63424 9.11595 4.75911 10.2408C5.88399 11.3657 7.40919 11.9984 9 11.9999ZM9 1.99994C9.79113 1.99994 10.5645 2.23454 11.2223 2.67406C11.8801 3.11359 12.3928 3.7383 12.6955 4.46921C12.9983 5.20011 13.0775 6.00438 12.9231 6.7803C12.7688 7.55623 12.3878 8.26896 11.8284 8.82837C11.269 9.38778 10.5563 9.76874 9.78036 9.92308C9.00444 10.0774 8.20017 9.99821 7.46927 9.69546C6.73836 9.39271 6.11365 8.88002 5.67412 8.22222C5.2346 7.56443 5 6.79107 5 5.99994C5 4.93908 5.42143 3.92166 6.17157 3.17151C6.92172 2.42137 7.93913 1.99994 9 1.99994Z" fill="#34D399" />
                        <path d="M20.9999 9.99938V6.99939H18.9999V9.99938H15.9999V11.9994H18.9999V14.9994H20.9999V11.9994H23.9999V9.99938H20.9999Z" fill="#34D399" />
                        <path d="M13.043 14.0006H4.957C3.64281 14.0022 2.3829 14.525 1.45363 15.4542C0.524352 16.3835 0.00158783 17.6434 0 18.9576L0 24.0006H2V18.9576C2.00079 18.1736 2.31259 17.4219 2.86696 16.8676C3.42134 16.3132 4.173 16.0014 4.957 16.0006H13.043C13.827 16.0014 14.5787 16.3132 15.133 16.8676C15.6874 17.4219 15.9992 18.1736 16 18.9576V24.0006H18V18.9576C17.9984 17.6434 17.4756 16.3835 16.5464 15.4542C15.6171 14.525 14.3572 14.0022 13.043 14.0006Z" fill="#34D399" />
                    </g>
                    <defs>
                        <clipPath id="clip0_403_3304">
                            <rect width="24" height="24" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
                <span className="add-card-label">Add new Character</span>
            </div>
        </div>
    );

    const renderAddCampaignCard = () => (
        <div
            className="campaign-card-hub add-card"
            onClick={() => navigate('/campaigns')}
            style={{ cursor: 'pointer' }}
        >
            <div className="add-card-content">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 14.0002H16V16.0002H13V19.0002H11V16.0002H8V14.0002H11V11.0002H13V14.0002ZM24 6.00024V23.0002H0V4.00024C0 3.20459 0.31607 2.44153 0.87868 1.87892C1.44129 1.31631 2.20435 1.00024 3 1.00024H8.236L12.236 3.00024H21C21.7956 3.00024 22.5587 3.31631 23.1213 3.87892C23.6839 4.44153 24 5.20459 24 6.00024ZM2 4.00024V7.00024H22V6.00024C22 5.73503 21.8946 5.48067 21.7071 5.29314C21.5196 5.1056 21.2652 5.00024 21 5.00024H11.764L7.764 3.00024H3C2.73478 3.00024 2.48043 3.1056 2.29289 3.29314C2.10536 3.48067 2 3.73503 2 4.00024ZM22 21.0002V9.00024H2V21.0002H22Z" fill="#34D399" />
                </svg>
                <span className="add-card-label">Add new Campaign</span>
            </div>
        </div>
    );

    const renderAddItemCard = () => (
        <div
            className="item-card-hub add-card"
            onClick={() => navigate('/items')}
            style={{ cursor: 'pointer' }}
        >
            <div className="add-card-content">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_403_3361)">
                        <path d="M18 6C18 4.4087 17.3679 2.88258 16.2426 1.75736C15.1174 0.632141 13.5913 0 12 0C10.4087 0 8.88258 0.632141 7.75736 1.75736C6.63214 2.88258 6 4.4087 6 6H0V21C0 21.7956 0.31607 22.5587 0.87868 23.1213C1.44129 23.6839 2.20435 24 3 24H14V22H3C2.73478 22 2.48043 21.8946 2.29289 21.7071C2.10536 21.5196 2 21.2652 2 21V8H6V10H8V8H16V10H18V8H22V14H24V6H18ZM8 6C8 4.93913 8.42143 3.92172 9.17157 3.17157C9.92172 2.42143 10.9391 2 12 2C13.0609 2 14.0783 2.42143 14.8284 3.17157C15.5786 3.92172 16 4.93913 16 6H8Z" fill="#34D399" />
                        <path d="M21.0003 15.9994H19.0003V18.9994H16.0003V20.9994H19.0003V23.9994H21.0003V20.9994H24.0003V18.9994H21.0003V15.9994Z" fill="#34D399" />
                    </g>
                    <defs>
                        <clipPath id="clip0_403_3361">
                            <rect width="24" height="24" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
                <span className="add-card-label">Add new Item</span>
            </div>
        </div>
    );

    const renderAddSpellCard = () => (
        <div
            className="spell-card-hub add-card"
            onClick={() => navigate('/spells')}
            style={{ cursor: 'pointer' }}
        >
            <div className="add-card-content">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.9 56C15.6062 56 17.8 53.8062 17.8 51.1C17.8 48.3938 15.6062 46.2 12.9 46.2C10.1938 46.2 8 48.3938 8 51.1C8 53.8062 10.1938 56 12.9 56Z" stroke="#34D399" strokeWidth="3"/>
                    <path d="M51.1 17.8C53.8062 17.8 56 15.6062 56 12.9C56 10.1938 53.8062 8 51.1 8C48.3938 8 46.2 10.1938 46.2 12.9C46.2 15.6062 48.3938 17.8 51.1 17.8Z" stroke="#34D399" strokeWidth="3"/>
                    <path d="M18.76 41C16.6336 37.9209 15.6536 34.1939 15.9906 30.4671C16.3275 26.7403 17.96 23.2495 20.6042 20.6017C23.2484 17.9539 26.737 16.3167 30.4634 15.9748C34.1897 15.6328 37.918 16.6077 41 18.73" stroke="#34D399" strokeWidth="3"/>
                    <path d="M45.05 22.74C47.2241 25.7952 48.2561 29.517 47.9657 33.2556C47.6754 36.9942 46.0811 40.512 43.4613 43.1949C40.8415 45.8778 37.3626 47.5553 33.632 47.9346C29.9014 48.3139 26.1561 47.3708 23.05 45.27" stroke="#34D399" strokeWidth="3"/>
                </svg>
                <span className="add-card-label">Add new Spell</span>
            </div>
        </div>
    );

    const getCharacterDateLabel = (status: string | undefined, date: string | undefined) => {
        if (!status) return '';
        switch (status) {
            case 'active': return `Last used: ${date || 'N/A'}`;
            case 'dead': return `Died: ${date || 'N/A'}`;
            case 'archived': return `Archived: ${date || 'N/A'}`;
            default: return '';
        }
    };

    const getCampaignPlayers = (players: string[]) => {
        const text = `Played with: ${players.join(', ')}`;
        if (text.length <= 35) return text;
        return text.slice(0, 32) + '...';
    };

    const getCampaignDateLabel = (status: string, lastPlayed?: string, archivedDate?: string) => {
        if (status === 'active' && lastPlayed) return `Last played: ${lastPlayed}`;
        if (status === 'inactive' && archivedDate) return `Archived: ${archivedDate}`;
        return '';
    };

    const renderDeathSaves = (character: any) => {
        const successes = character.deathSuccesses || 0;
        const failures = character.deathFailures || 0;
        return (
            <div className="death-saves-indicator">
                <span className="death-saves-label">Death Saves</span>
                <div className="death-saves-dots">
                    {[0, 1, 2].map(i => (
                        <span key={`s-${i}`} className={`dot ${i < successes ? 'success' : 'empty'}`} />
                    ))}
                    <span className="separator">/</span>
                    {[0, 1, 2].map(i => (
                        <span key={`f-${i}`} className={`dot ${i < failures ? 'failure' : 'empty'}`} />
                    ))}
                </div>
            </div>
        );
    };

    const handleCreateModeSelect = (mode: 'creative' | 'rules') => {
        setShowCreatePopup(false);
        navigate(`/characters/new?mode=${mode}`);
    };

    return (
        <div className="page hub-page">
            <div className="hub-header">
                <div className="hub-header-content">
                    <div className="header-left">
                        <span className="header-title-hub">Hub</span>
                        <div className="hub-header-subtitle">Select a character or explore campaigns</div>
                    </div>
                    <div className="header-icon" onClick={() => {}} style={{ cursor: 'pointer' }}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 6.25C9.25833 6.25 8.5333 6.46994 7.91662 6.88199C7.29993 7.29405 6.81929 7.87972 6.53546 8.56494C6.25163 9.25016 6.17737 10.0042 6.32206 10.7316C6.46676 11.459 6.82391 12.1272 7.34835 12.6517C7.8728 13.1761 8.54099 13.5333 9.26842 13.6779C9.99585 13.8226 10.7498 13.7484 11.4351 13.4646C12.1203 13.1807 12.706 12.7001 13.118 12.0834C13.5301 11.4667 13.75 10.7417 13.75 10C13.749 9.00576 13.3536 8.05253 12.6505 7.34949C11.9475 6.64646 10.9942 6.25104 10 6.25ZM10 12.5C9.50555 12.5 9.0222 12.3534 8.61108 12.0787C8.19996 11.804 7.87953 11.4135 7.69031 10.9567C7.50109 10.4999 7.45158 9.99723 7.54804 9.51228C7.64451 9.02732 7.88261 8.58187 8.23224 8.23223C8.58187 7.8826 9.02733 7.6445 9.51228 7.54804C9.99723 7.45157 10.4999 7.50108 10.9567 7.6903C11.4135 7.87952 11.804 8.19995 12.0787 8.61108C12.3534 9.0222 12.5 9.50555 12.5 10C12.5 10.663 12.2366 11.2989 11.7678 11.7678C11.2989 12.2366 10.663 12.5 10 12.5ZM16.875 10.1688C16.8781 10.0563 16.8781 9.94375 16.875 9.83125L18.0406 8.375C18.1017 8.29854 18.1441 8.2088 18.1641 8.11299C18.1842 8.01719 18.1815 7.91801 18.1563 7.82344C17.9652 7.10516 17.6793 6.41551 17.3063 5.77266C17.2574 5.68853 17.1896 5.61697 17.1082 5.56367C17.0268 5.51036 16.9341 5.47679 16.8375 5.46563L14.9844 5.25938C14.9073 5.17813 14.8292 5.1 14.75 5.025L14.5313 3.16719C14.52 3.07048 14.4863 2.97774 14.4329 2.89635C14.3794 2.81497 14.3077 2.7472 14.2234 2.69844C13.5803 2.32605 12.8908 2.0405 12.1727 1.84922C12.078 1.82406 11.9788 1.82149 11.883 1.84171C11.7872 1.86193 11.6975 1.90437 11.6211 1.96563L10.1688 3.125C10.0563 3.125 9.94376 3.125 9.83125 3.125L8.375 1.96172C8.29855 1.9006 8.2088 1.8583 8.113 1.83821C8.01719 1.81813 7.91801 1.82083 7.82344 1.8461C7.10528 2.03752 6.41567 2.32335 5.77266 2.69609C5.68853 2.74494 5.61697 2.81276 5.56367 2.89413C5.51037 2.97551 5.4768 3.06821 5.46563 3.16484L5.25938 5.02109C5.17813 5.0987 5.10001 5.17682 5.02501 5.25547L3.16719 5.46875C3.07048 5.48 2.97774 5.51369 2.89636 5.56713C2.81497 5.62058 2.7472 5.69229 2.69844 5.77656C2.32606 6.41966 2.0405 7.10925 1.84922 7.82735C1.82407 7.92197 1.82149 8.02119 1.84171 8.117C1.86193 8.2128 1.90438 8.30252 1.96563 8.37891L3.12501 9.83125C3.12501 9.94375 3.12501 10.0563 3.12501 10.1688L1.96172 11.625C1.90061 11.7015 1.8583 11.7912 1.83822 11.887C1.81813 11.9828 1.82083 12.082 1.8461 12.1766C2.03718 12.8948 2.32303 13.5845 2.6961 14.2273C2.74495 14.3115 2.81276 14.383 2.89414 14.4363C2.97551 14.4896 3.06821 14.5232 3.16485 14.5344L5.01797 14.7406C5.09558 14.8219 5.1737 14.9 5.25235 14.975L5.46876 16.8328C5.48001 16.9295 5.5137 17.0223 5.56714 17.1036C5.62058 17.185 5.6923 17.2528 5.77657 17.3016C6.41966 17.674 7.10926 17.9595 7.82735 18.1508C7.92198 18.1759 8.02119 18.1785 8.117 18.1583C8.2128 18.1381 8.30252 18.0956 8.37891 18.0344L9.83125 16.875C9.94376 16.8781 10.0563 16.8781 10.1688 16.875L11.625 18.0406C11.7015 18.1017 11.7912 18.1441 11.887 18.1641C11.9828 18.1842 12.082 18.1815 12.1766 18.1562C12.8948 17.9652 13.5845 17.6793 14.2273 17.3063C14.3115 17.2574 14.383 17.1896 14.4363 17.1082C14.4896 17.0268 14.5232 16.9341 14.5344 16.8375L14.7406 14.9844C14.8219 14.9073 14.9 14.8292 14.975 14.75L16.8328 14.5313C16.9295 14.52 17.0223 14.4863 17.1037 14.4329C17.185 14.3794 17.2528 14.3077 17.3016 14.2234C17.674 13.5803 17.9595 12.8908 18.1508 12.1727C18.1759 12.078 18.1785 11.9788 18.1583 11.883C18.1381 11.7872 18.0956 11.6975 18.0344 11.6211L16.875 10.1688ZM15.6172 9.66094C15.6305 9.88679 15.6305 10.1132 15.6172 10.3391C15.6079 10.4937 15.6563 10.6463 15.7531 10.7672L16.8617 12.1523C16.7345 12.5566 16.5716 12.9488 16.375 13.3242L14.6094 13.5242C14.4556 13.5413 14.3137 13.6148 14.2109 13.7305C14.0606 13.8996 13.9004 14.0598 13.7313 14.2102C13.6156 14.3129 13.5421 14.4548 13.525 14.6086L13.3289 16.3727C12.9535 16.5694 12.5613 16.7323 12.157 16.8594L10.7711 15.7508C10.6602 15.6622 10.5224 15.614 10.3805 15.6141H10.343C10.1171 15.6273 9.8907 15.6273 9.66485 15.6141C9.51023 15.6048 9.35766 15.6532 9.23672 15.75L7.84766 16.8594C7.44339 16.7322 7.05122 16.5693 6.67579 16.3727L6.47579 14.6094C6.45872 14.4556 6.38523 14.3136 6.26954 14.2109C6.1004 14.0606 5.94023 13.9004 5.78985 13.7313C5.68714 13.6156 5.54517 13.5421 5.39141 13.525L3.62735 13.3281C3.43062 12.9527 3.26774 12.5606 3.14063 12.1563L4.24922 10.7703C4.34602 10.6494 4.39447 10.4968 4.38516 10.3422C4.37188 10.1163 4.37188 9.88991 4.38516 9.66406C4.39447 9.50944 4.34602 9.35687 4.24922 9.23594L3.14063 7.84766C3.26784 7.44339 3.43072 7.05122 3.62735 6.67578L5.39063 6.47578C5.54439 6.45871 5.68636 6.38523 5.78907 6.26953C5.93945 6.1004 6.09962 5.94023 6.26875 5.78985C6.38491 5.68707 6.4587 5.54478 6.47579 5.39063L6.67188 3.62735C7.04727 3.43062 7.43945 3.26774 7.84376 3.14063L9.22969 4.24922C9.35062 4.34602 9.50319 4.39447 9.65782 4.38516C9.88366 4.37188 10.1101 4.37188 10.3359 4.38516C10.4906 4.39447 10.6431 4.34602 10.7641 4.24922L12.1523 3.14063C12.5566 3.26783 12.9488 3.43071 13.3242 3.62735L13.5242 5.39063C13.5413 5.54439 13.6148 5.68636 13.7305 5.78906C13.8996 5.93945 14.0598 6.09962 14.2102 6.26875C14.3129 6.38444 14.4548 6.45793 14.6086 6.475L16.3727 6.67109C16.5694 7.04649 16.7323 7.43866 16.8594 7.84297L15.7508 9.22891C15.6531 9.35086 15.6046 9.505 15.6148 9.66094H15.6172Z" fill="#34D399"/>
                        </svg>
                    </div>
                </div>
            </div>

            <div className="hub-content">
                {/* Секция персонажей */}
                <div className="hub-section">
                    <div className="section-header" onClick={toggleCharacters} style={{ cursor: 'pointer' }}>
                        <span className="section-title">Your Characters</span>
                        <div className="section-header-right">
                            <Link to="/characters" className="view-all-link" onClick={(e) => e.stopPropagation()}>View all</Link>
                            {renderChevron(isCharactersOpen)}
                        </div>
                    </div>
                    {isCharactersOpen && (
                        <div className="character-grid">
                            {characters.map((char) => {
                                const needsDeathSave = char.hp === 0 && char.status !== 'dead' && !char.isStable;
                                return (
                                    <Link to={`/characters/${char.id}`} key={char.id} className="character-card-link" style={{ textDecoration: 'none' }}>
                                        <div className={`character-card-hub ${char.status !== 'active' ? 'inactive' : ''} ${needsDeathSave ? 'needs-death-save' : ''}`}>
                                            <div className="character-info-only">
                                                <div className="character-name-hub">{char.name}</div>
                                                <div className="character-class-hub">{char.classes.join(' / ')} • Level {char.level}</div>
                                                <div className="character-created-hub">Created: {char.created || 'N/A'}</div>
                                                <div className="character-date-hub">{getCharacterDateLabel(char.status, char.lastUsed || char.died || char.archived)}</div>
                                                {needsDeathSave && renderDeathSaves(char)}
                                            </div>
                                            <div className={`character-status-hub ${char.status || 'active'}`}>
                                                {char.status === 'active' ? 'Active' : char.status === 'dead' ? 'Deceased' : 'Archived'}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                            {renderAddCharacterCard()}
                        </div>
                    )}
                </div>

                {/* Секция кампаний */}
                <div className="hub-section">
                    <div className="section-header" onClick={toggleCampaigns} style={{ cursor: 'pointer' }}>
                        <span className="section-title">Campaigns</span>
                        <div className="section-header-right">
                            <Link to="/campaigns" className="view-all-link" onClick={(e) => e.stopPropagation()}>View all</Link>
                            {renderChevron(isCampaignsOpen)}
                        </div>
                    </div>
                    {isCampaignsOpen && (
                        <div className="campaigns-grid">
                            {campaigns.map((camp) => (
                                <Link to={`/campaign/${camp.id}`} key={camp.id} className="campaign-card-link" style={{ textDecoration: 'none' }}>
                                    <div className={`campaign-card-hub ${camp.status !== 'active' ? 'inactive' : ''}`}>
                                        <div className="campaign-info-only">
                                            <div className="campaign-name-hub">{camp.name}</div>
                                            <div className="campaign-description-hub">{camp.description}</div>
                                            <div className="campaign-players-hub">{getCampaignPlayers(camp.playedWith)}</div>
                                            <div className="campaign-date-hub">
                                                {getCampaignDateLabel(camp.status, camp.lastPlayed, camp.archivedDate)}
                                            </div>
                                        </div>
                                        <div className="campaign-status-hub">{camp.status}</div>
                                    </div>
                                </Link>
                            ))}
                            {renderAddCampaignCard()}
                        </div>
                    )}
                </div>

                {/* Секция предметов */}
                <div className="hub-section">
                    <div className="section-header" onClick={toggleItems} style={{ cursor: 'pointer' }}>
                        <span className="section-title">Items</span>
                        <div className="section-header-right">
                            <Link to="/items" className="view-all-link" onClick={(e) => e.stopPropagation()}>View all</Link>
                            {renderChevron(isItemsOpen)}
                        </div>
                    </div>
                    {isItemsOpen && (
                        <div className="items-grid">
                            {items.map((item) => (
                                <Link to={`/item/${item.id}`} key={item.id} className="item-card-link" style={{ textDecoration: 'none' }}>
                                    <div className="item-card-hub">
                                        <div className="item-info-only">
                                            <div className="item-name-hub">{item.name}</div>
                                            <div className="item-description-hub">{truncateDescription(item.description)}</div>
                                            <div className="item-details-hub">
                                                {item.healing && (
                                                    <span className="item-tag-healing">Healing</span>
                                                )}
                                                {item.charges && (
                                                    <span className="item-charges">Uses: {item.charges.current}/{item.charges.max}</span>
                                                )}
                                                {item.diceRoll && (
                                                    <span className="item-dice" style={{ color: item.healing ? elementColors.healing : undefined }}>
                                                        {item.diceRoll}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            {renderAddItemCard()}
                        </div>
                    )}
                </div>

                {/* Секция заклинаний */}
                <div className="hub-section">
                    <div className="section-header" onClick={toggleSpells} style={{ cursor: 'pointer' }}>
                        <span className="section-title">Spells</span>
                        <div className="section-header-right">
                            <Link to="/spells" className="view-all-link" onClick={(e) => e.stopPropagation()}>View all</Link>
                            {renderChevron(isSpellsOpen)}
                        </div>
                    </div>
                    {isSpellsOpen && (
                        <div className="spells-grid">
                            {spells.map((spell) => (
                                <Link to={`/spell/${spell.id}`} key={spell.id} className="spell-card-link" style={{ textDecoration: 'none' }}>
                                    <div className="spell-card-hub">
                                        <div className="spell-info-only">
                                            <div className="spell-name-hub">{spell.name}</div>
                                            <div className="spell-description-hub">{truncateDescription(spell.description)}</div>
                                            <div className="spell-details-hub">
                                                <span className="spell-level">
                                                    {spell.level === 0 ? 'Cantrip' : `Lv.${spell.level}`}
                                                </span>
                                                <span className="spell-school">{spell.school}</span>
                                                {spell.element && (
                                                    <span className="spell-element" style={{ color: elementColors[spell.element] || '#6b7280' }}>
                                                        {spell.element}
                                                    </span>
                                                )}
                                                {spell.diceRoll && spell.element && elementColors[spell.element] && (
                                                    <span className="spell-dice" style={{ color: elementColors[spell.element] }}>
                                                        {spell.diceRoll}
                                                    </span>
                                                )}
                                                {spell.diceRoll && !spell.element && (
                                                    <span className="spell-dice">{spell.diceRoll}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            {renderAddSpellCard()}
                        </div>
                    )}
                </div>
            </div>

            {showCreatePopup && (
                <CreateModePopup
                    onSelect={handleCreateModeSelect}
                    onClose={() => setShowCreatePopup(false)}
                />
            )}
        </div>
    );
};

export default Hub;