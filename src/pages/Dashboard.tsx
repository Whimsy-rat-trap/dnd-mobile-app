import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCharacters } from '../context/CharacterContext';
import CreateModePopup from '../components/CreateModePopup';
import Modal from '../components/Modal';
import SearchBar from '../components/SearchBar';
import FilterModal, { FilterField } from '../components/FilterModal';
import CharacterSelectCard from '../components/dashboard/CharacterSelectCard';
import CharacterStats from '../components/dashboard/CharacterStats';
import DeathSaves from '../components/dashboard/DeathSaves';
import DiceRollerSection from '../components/dashboard/DiceRollerSection';
import QuickActions from '../components/dashboard/QuickActions';
import { DND_CLASSES } from '../constants/classes';
import { DND_RACES } from '../constants/races';
import { SUBCLASSES } from '../constants/subclasses';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {
        characters,
        currentCharacterId,
        setCurrentCharacterId,
        getCharacter,
        updateCharacter,
        addDiceLog,
    } = useCharacters();

    const character = currentCharacterId ? getCharacter(currentCharacterId) : undefined;

    // Состояния для попапов и ввода
    const [popupType, setPopupType] = useState<'hp' | 'exp' | 'settings' | 'profile' | null>(null);
    const [inputValue, setInputValue] = useState<number>(0);
    const [tempInputValue, setTempInputValue] = useState<number>(0);
    const [expInputValue, setExpInputValue] = useState<number>(0);

    // Состояние для попапа выбора режима создания персонажа
    const [showCreatePopup, setShowCreatePopup] = useState(false);

    // Поиск и фильтры
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filters, setFilters] = useState({
        class: '',
        subclass: '',
        race: '',
        subrace: '',
        level: { min: 1, max: 20 },
        alive: 'all' as 'all' | 'alive' | 'dead',
        createdAfter: '',
        createdBefore: '',
        lastUsedAfter: '',
        lastUsedBefore: '',
        status: 'all' as 'all' | 'active' | 'archived',
    });

    // Dice roller состояния
    const diceTypes = [4, 6, 8, 10, 12, 20];
    const [openSections, setOpenSections] = useState<Record<number, boolean>>({
        4: false,
        6: false,
        8: false,
        10: false,
        12: false,
        20: false,
    });

    // Обработка параметра create (автоматическое открытие модалки)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('create') === 'true') {
            setShowCreatePopup(true);
            navigate('/dashboard', { replace: true });
        }
    }, [location, navigate]);

    // Обработчик выбора режима создания
    const handleCreateModeSelect = (mode: 'creative' | 'rules') => {
        setShowCreatePopup(false);
        navigate(`/characters/new?mode=${mode}`);
    };

    // Обработчик изменения фильтров для FilterModal
    const handleFilterChange = (newFilters: Record<string, any>) => {
        // Если изменился класс – сбрасываем сабкласс
        if (newFilters.class !== filters.class) {
            newFilters.subclass = '';
        }
        setFilters(newFilters as any);
    };

    // Поля для фильтрации персонажей (вычисляются динамически)
    const filterFields: FilterField[] = useMemo(() => {
        // Для поля subclass строим опции в зависимости от выбранного класса
        let subclassOptions: { value: string; label: string }[] = [{ value: '', label: 'All' }];
        if (filters.class && SUBCLASSES[filters.class]) {
            subclassOptions = [
                ...subclassOptions,
                ...SUBCLASSES[filters.class].map(s => ({ value: s, label: s })),
            ];
        }

        return [
            {
                key: 'class',
                label: 'Class',
                type: 'select',
                options: [{ value: '', label: 'All' }, ...DND_CLASSES.map(c => ({ value: c, label: c }))],
            },
            {
                key: 'subclass',
                label: 'Subclass',
                type: 'select',
                options: subclassOptions,
            },
            {
                key: 'race',
                label: 'Race',
                type: 'select',
                options: [{ value: '', label: 'All' }, ...DND_RACES.map(r => ({ value: r, label: r }))],
            },
            {
                key: 'subrace',
                label: 'Subrace',
                type: 'select',
                options: [
                    { value: '', label: 'All' },
                    ...Array.from(new Set(characters.flatMap(c => c.subrace ? [c.subrace] : []))).map(s => ({ value: s, label: s })),
                ],
            },
            { key: 'level', label: 'Level Range', type: 'range', min: 1, max: 20 },
            {
                key: 'alive',
                label: 'Alive',
                type: 'select',
                options: [
                    { value: 'all', label: 'All' },
                    { value: 'alive', label: 'Alive' },
                    { value: 'dead', label: 'Dead' },
                ],
            },
            { key: 'createdAfter', label: 'Created After', type: 'date' },
            { key: 'createdBefore', label: 'Created Before', type: 'date' },
            { key: 'lastUsedAfter', label: 'Last Used After', type: 'date' },
            { key: 'lastUsedBefore', label: 'Last Used Before', type: 'date' },
            {
                key: 'status',
                label: 'Status',
                type: 'select',
                options: [
                    { value: 'all', label: 'All' },
                    { value: 'active', label: 'Active' },
                    { value: 'archived', label: 'Archived' },
                ],
            },
        ];
    }, [filters.class, characters]);

    // Фильтрация персонажей
    const filteredCharacters = characters.filter(char => {
        const matchesSearch = char.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesClass = !filters.class || char.class === filters.class || char.classes.includes(filters.class);
        const matchesSubclass = !filters.subclass || char.subclass === filters.subclass;
        const matchesRace = !filters.race || char.race === filters.race;
        const matchesSubrace = !filters.subrace || char.subrace === filters.subrace;
        const matchesLevel = char.level >= (filters.level?.min || 1) && char.level <= (filters.level?.max || 20);
        const matchesAlive = filters.alive === 'all' || (filters.alive === 'alive' && char.status !== 'dead') || (filters.alive === 'dead' && char.status === 'dead');
        const matchesCreatedAfter = !filters.createdAfter || new Date(char.created) >= new Date(filters.createdAfter);
        const matchesCreatedBefore = !filters.createdBefore || new Date(char.created) <= new Date(filters.createdBefore);
        const matchesLastUsedAfter = !filters.lastUsedAfter || new Date(char.lastUsed) >= new Date(filters.lastUsedAfter);
        const matchesLastUsedBefore = !filters.lastUsedBefore || new Date(char.lastUsed) <= new Date(filters.lastUsedBefore);
        const matchesStatus = filters.status === 'all' || char.status === filters.status;
        return matchesSearch && matchesClass && matchesSubclass && matchesRace && matchesSubrace && matchesLevel && matchesAlive && matchesCreatedAfter && matchesCreatedBefore && matchesLastUsedAfter && matchesLastUsedBefore && matchesStatus;
    });

    // Если персонаж не выбран – показываем экран выбора
    if (!character) {
        return (
            <div className="db-page">
                <div className="db-header">
                    <div className="db-header-top">
                        <span className="db-title">Arcane Realms</span>
                    </div>
                    <div className="db-subtitle">Select a character to begin</div>
                </div>
                <div className="db-dashboard-content">
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search characters..."
                        onFilterClick={() => setShowFilterModal(true)}
                    />
                    <div className="db-character-select-grid">
                        {filteredCharacters.map((char) => {
                            const needsDeathSave = char.hp === 0 && char.status !== 'dead' && !char.isStable;
                            return (
                                <CharacterSelectCard
                                    key={char.id}
                                    character={char}
                                    onClick={() => setCurrentCharacterId(char.id)}
                                    needsDeathSave={needsDeathSave}
                                />
                            );
                        })}
                        {/* Заменяем Link на div с onClick */}
                        <div
                            className="db-character-select-card db-add-card"
                            onClick={() => setShowCreatePopup(true)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="db-add-card-content">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13 14.0002H16V16.0002H13V19.0002H11V16.0002H8V14.0002H11V11.0002H13V14.0002ZM24 6.00024V23.0002H0V4.00024C0 3.20459 0.31607 2.44153 0.87868 1.87892C1.44129 1.31631 2.20435 1.00024 3 1.00024H8.236L12.236 3.00024H21C21.7956 3.00024 22.5587 3.31631 23.1213 3.87892C23.6839 4.44153 24 5.20459 24 6.00024ZM2 4.00024V7.00024H22V6.00024C22 5.73503 21.8946 5.48067 21.7071 5.29314C21.5196 5.1056 21.2652 5.00024 21 5.00024H11.764L7.764 3.00024H3C2.73478 3.00024 2.48043 3.1056 2.29289 3.29314C2.10536 3.48067 2 3.73503 2 4.00024ZM22 21.0002V9.00024H2V21.0002H22Z" fill="#34D399" />
                                </svg>
                                <span className="db-add-card-label">Create New Character</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Модалка фильтрации */}
                <FilterModal
                    isOpen={showFilterModal}
                    onClose={() => setShowFilterModal(false)}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    fields={filterFields}
                    onReset={() =>
                        setFilters({
                            class: '',
                            subclass: '',
                            race: '',
                            subrace: '',
                            level: { min: 1, max: 20 },
                            alive: 'all',
                            createdAfter: '',
                            createdBefore: '',
                            lastUsedAfter: '',
                            lastUsedBefore: '',
                            status: 'all',
                        })
                    }
                    title="Filter Characters"
                />

                {/* Модалка выбора режима создания */}
                {showCreatePopup && (
                    <CreateModePopup
                        onSelect={handleCreateModeSelect}
                        onClose={() => setShowCreatePopup(false)}
                    />
                )}
            </div>
        );
    }

    // Функции для работы с HP и EXP
    const updateChar = (updates: Partial<typeof character>) => {
        updateCharacter(character.id, updates);
    };

    const hp = character.hp;
    const maxHp = character.maxHp;
    const tempHp = character.tempHp || 0;
    const exp = character.exp;
    const level = character.level;

    const getMaxExp = (lvl: number) => lvl * 1000;
    const maxExp = getMaxExp(level);

    const hpPercent = (hp / maxHp) * 100;
    const tempPercent = (tempHp / maxHp) * 100;
    const expPercent = Math.min((exp / maxExp) * 100, 100);
    const overlevelPercent = exp > maxExp ? ((exp - maxExp) / maxExp) * 100 : 0;

    const isZeroHp = hp === 0;

    const levelUpIfNeeded = () => {
        let newExp = exp;
        let newLevel = level;
        let leveledUp = false;
        while (newExp >= getMaxExp(newLevel)) {
            newExp -= getMaxExp(newLevel);
            newLevel += 1;
            leveledUp = true;
        }
        if (leveledUp) {
            updateChar({ exp: newExp, level: newLevel });
        }
    };

    // Сброс death saves при восстановлении HP > 0
    const resetDeathSaves = () => {
        if (character.hp > 0) {
            updateCharacter(character.id, {
                deathSuccesses: 0,
                deathFailures: 0,
                isStable: false,
            });
        }
    };

    const addHp = (amount: number) => {
        if (amount <= 0) return;
        const newHp = Math.min(hp + amount, maxHp);
        updateChar({ hp: newHp });
        if (newHp > 0) resetDeathSaves();
    };

    const subtractHp = (amount: number) => {
        if (amount <= 0) return;
        const newHp = Math.max(hp - amount, 0);
        updateChar({ hp: newHp });
    };

    const addTempHp = (amount: number) => {
        if (amount <= 0) return;
        updateChar({ tempHp: tempHp + amount });
    };

    const subtractTempHp = (amount: number) => {
        if (amount <= 0) return;
        const newTemp = Math.max(tempHp - amount, 0);
        updateChar({ tempHp: newTemp });
    };

    const addExp = (amount: number) => {
        if (amount <= 0) return;
        const newExp = exp + amount;
        updateChar({ exp: newExp });
    };

    const subtractExp = (amount: number) => {
        if (amount <= 0) return;
        const newExp = Math.max(exp - amount, 0);
        updateChar({ exp: newExp });
    };

    // Death Saving Throws
    const rollDeathSave = () => {
        if (character.isStable || character.status === 'dead') return;
        const roll = Math.floor(Math.random() * 20) + 1;
        let newSuccesses: number = character.deathSuccesses || 0;
        let newFailures: number = character.deathFailures || 0;
        let newHp: number = character.hp;
        let newStatus: 'active' | 'dead' | 'archived' = character.status;
        let newIsStable: boolean = character.isStable || false;

        if (roll === 20) {
            newHp = 1;
            newIsStable = true;
            newSuccesses = 0;
            newFailures = 0;
            updateCharacter(character.id, {
                hp: newHp,
                deathSuccesses: newSuccesses,
                deathFailures: newFailures,
                isStable: newIsStable,
                status: 'active',
            });
            addDiceLog(character.id, 20, roll);
            return;
        }

        if (roll === 1) {
            newFailures += 2;
        } else if (roll >= 10) {
            newSuccesses += 1;
        } else {
            newFailures += 1;
        }

        if (newSuccesses >= 3) {
            newIsStable = true;
            newSuccesses = 3;
        }
        if (newFailures >= 3) {
            newStatus = 'dead';
            newFailures = 3;
            updateCharacter(character.id, {
                deathSuccesses: newSuccesses,
                deathFailures: newFailures,
                isStable: newIsStable,
                status: newStatus,
                died: new Date().toISOString().split('T')[0],
            });
            addDiceLog(character.id, 20, roll);
            return;
        }

        updateCharacter(character.id, {
            deathSuccesses: newSuccesses,
            deathFailures: newFailures,
            isStable: newIsStable,
            status: newStatus,
        });
        addDiceLog(character.id, 20, roll);
    };

    // Popups
    const openPopup = (type: 'hp' | 'exp' | 'settings' | 'profile') => setPopupType(type);
    const closePopup = () => {
        if (popupType === 'exp') levelUpIfNeeded();
        setPopupType(null);
    };

    // Dice roller logs
    const logs = character.diceLogs || {};

    const toggleSection = (diceType: number) => {
        setOpenSections(prev => ({ ...prev, [diceType]: !prev[diceType] }));
    };

    const getResultColor = (diceType: number, result: number) => {
        if (diceType === 20) {
            if (result === 1) return '#ef4444';
            if (result === 20) return '#34d399';
        }
        return '#fff';
    };

    // Данные кампаний (заглушка)
    const campaigns = character.campaigns && character.campaigns.length > 0
        ? character.campaigns.map(c => ({
            id: c.id,
            name: c.name,
            status: c.status,
            description: c.description,
        }))
        : [
            { id: '1', name: 'Curse of Strahd', status: 'active', description: 'Ravenloft' },
            { id: '2', name: 'Lost Mine of Phandelver', status: 'active', description: 'Phandalin' },
            { id: '3', name: 'Dragon Heist', status: 'inactive', description: 'Waterdeep' },
            { id: '4', name: 'Tomb of Annihilation', status: 'ended', description: 'Chult' },
        ];

    const switchCharacter = () => {
        setCurrentCharacterId(null);
    };

    // Рендер для выбранного персонажа
    return (
        <div className="db-page">
            {/* Header */}
            <div className="db-header">
                <div className="db-header-top">
                    <span className="db-title">Arcane Realms</span>
                    <div className="db-header-actions">
                        <button className="db-switch-char-btn" onClick={switchCharacter}>
                            Switch
                        </button>
                        <div className="db-header-icon" style={{ cursor: 'pointer' }} onClick={() => openPopup('settings')}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 6.25C9.25833 6.25 8.5333 6.46994 7.91662 6.88199C7.29993 7.29405 6.81929 7.87972 6.53546 8.56494C6.25163 9.25016 6.17737 10.0042 6.32206 10.7316C6.46676 11.459 6.82391 12.1272 7.34835 12.6517C7.8728 13.1761 8.54099 13.5333 9.26842 13.6779C9.99585 13.8226 10.7498 13.7484 11.4351 13.4646C12.1203 13.1807 12.706 12.7001 13.118 12.0834C13.5301 11.4667 13.75 10.7417 13.75 10C13.749 9.00576 13.3536 8.05253 12.6505 7.34949C11.9475 6.64646 10.9942 6.25104 10 6.25ZM10 12.5C9.50555 12.5 9.0222 12.3534 8.61108 12.0787C8.19996 11.804 7.87953 11.4135 7.69031 10.9567C7.50109 10.4999 7.45158 9.99723 7.54804 9.51228C7.64451 9.02732 7.88261 8.58187 8.23224 8.23223C8.58187 7.8826 9.02733 7.6445 9.51228 7.54804C9.99723 7.45157 10.4999 7.50108 10.9567 7.6903C11.4135 7.87952 11.804 8.19995 12.0787 8.61108C12.3534 9.0222 12.5 9.50555 12.5 10C12.5 10.663 12.2366 11.2989 11.7678 11.7678C11.2989 12.2366 10.663 12.5 10 12.5ZM16.875 10.1688C16.8781 10.0563 16.8781 9.94375 16.875 9.83125L18.0406 8.375C18.1017 8.29854 18.1441 8.2088 18.1641 8.11299C18.1842 8.01719 18.1815 7.91801 18.1563 7.82344C17.9652 7.10516 17.6793 6.41551 17.3063 5.77266C17.2574 5.68853 17.1896 5.61697 17.1082 5.56367C17.0268 5.51036 16.9341 5.47679 16.8375 5.46563L14.9844 5.25938C14.9073 5.17813 14.8292 5.1 14.75 5.025L14.5313 3.16719C14.52 3.07048 14.4863 2.97774 14.4329 2.89635C14.3794 2.81497 14.3077 2.7472 14.2234 2.69844C13.5803 2.32605 12.8908 2.0405 12.1727 1.84922C12.078 1.82406 11.9788 1.82149 11.883 1.84171C11.7872 1.86193 11.6975 1.90437 11.6211 1.96563L10.1688 3.125C10.0563 3.125 9.94376 3.125 9.83125 3.125L8.375 1.96172C8.29855 1.9006 8.2088 1.8583 8.113 1.83821C8.01719 1.81813 7.91801 1.82083 7.82344 1.8461C7.10528 2.03752 6.41567 2.32335 5.77266 2.69609C5.68853 2.74494 5.61697 2.81276 5.56367 2.89413C5.51037 2.97551 5.4768 3.06821 5.46563 3.16484L5.25938 5.02109C5.17813 5.0987 5.10001 5.17682 5.02501 5.25547L3.16719 5.46875C3.07048 5.48 2.97774 5.51369 2.89636 5.56713C2.81497 5.62058 2.7472 5.69229 2.69844 5.77656C2.32606 6.41966 2.0405 7.10925 1.84922 7.82735C1.82407 7.92197 1.82149 8.02119 1.84171 8.117C1.86193 8.2128 1.90438 8.30252 1.96563 8.37891L3.12501 9.83125C3.12501 9.94375 3.12501 10.0563 3.12501 10.1688L1.96172 11.625C1.90061 11.7015 1.8583 11.7912 1.83822 11.887C1.81813 11.9828 1.82083 12.082 1.8461 12.1766C2.03718 12.8948 2.32303 13.5845 2.6961 14.2273C2.74495 14.3115 2.81276 14.383 2.89414 14.4363C2.97551 14.4896 3.06821 14.5232 3.16485 14.5344L5.01797 14.7406C5.09558 14.8219 5.1737 14.9 5.25235 14.975L5.46876 16.8328C5.48001 16.9295 5.5137 17.0223 5.56714 17.1036C5.62058 17.185 5.6923 17.2528 5.77657 17.3016C6.41966 17.674 7.10926 17.9595 7.82735 18.1508C7.92198 18.1759 8.02119 18.1785 8.117 18.1583C8.2128 18.1381 8.30252 18.0956 8.37891 18.0344L9.83125 16.875C9.94376 16.8781 10.0563 16.8781 10.1688 16.875L11.625 18.0406C11.7015 18.1017 11.7912 18.1441 11.887 18.1641C11.9828 18.1842 12.082 18.1815 12.1766 18.1562C12.8948 17.9652 13.5845 17.6793 14.2273 17.3063C14.3115 17.2574 14.383 17.1896 14.4363 17.1082C14.4896 17.0268 14.5232 16.9341 14.5344 16.8375L14.7406 14.9844C14.8219 14.9073 14.9 14.8292 14.975 14.75L16.8328 14.5313C16.9295 14.52 17.0223 14.4863 17.1037 14.4329C17.185 14.3794 17.2528 14.3077 17.3016 14.2234C17.674 13.5803 17.9595 12.8908 18.1508 12.1727C18.1759 12.078 18.1785 11.9788 18.1583 11.883C18.1381 11.7872 18.0956 11.6975 18.0344 11.6211L16.875 10.1688ZM15.6172 9.66094C15.6305 9.88679 15.6305 10.1132 15.6172 10.3391C15.6079 10.4937 15.6563 10.6463 15.7531 10.7672L16.8617 12.1523C16.7345 12.5566 16.5716 12.9488 16.375 13.3242L14.6094 13.5242C14.4556 13.5413 14.3137 13.6148 14.2109 13.7305C14.0606 13.8996 13.9004 14.0598 13.7313 14.2102C13.6156 14.3129 13.5421 14.4548 13.525 14.6086L13.3289 16.3727C12.9535 16.5694 12.5613 16.7323 12.157 16.8594L10.7711 15.7508C10.6602 15.6622 10.5224 15.614 10.3805 15.6141H10.343C10.1171 15.6273 9.8907 15.6273 9.66485 15.6141C9.51023 15.6048 9.35766 15.6532 9.23672 15.75L7.84766 16.8594C7.44339 16.7322 7.05122 16.5693 6.67579 16.3727L6.47579 14.6094C6.45872 14.4556 6.38523 14.3136 6.26954 14.2109C6.1004 14.0606 5.94023 13.9004 5.78985 13.7313C5.68714 13.6156 5.54517 13.5421 5.39141 13.525L3.62735 13.3281C3.43062 12.9527 3.26774 12.5606 3.14063 12.1563L4.24922 10.7703C4.34602 10.6494 4.39447 10.4968 4.38516 10.3422C4.37188 10.1163 4.37188 9.88991 4.38516 9.66406C4.39447 9.50944 4.34602 9.35687 4.24922 9.23594L3.14063 7.84766C3.26784 7.44339 3.43072 7.05122 3.62735 6.67578L5.39063 6.47578C5.54439 6.45871 5.68636 6.38523 5.78907 6.26953C5.93945 6.1004 6.09962 5.94023 6.26875 5.78985C6.38491 5.68707 6.4587 5.54478 6.47579 5.39063L6.67188 3.62735C7.04727 3.43062 7.43945 3.26774 7.84376 3.14063L9.22969 4.24922C9.35062 4.34602 9.50319 4.39447 9.65782 4.38516C9.88366 4.37188 10.1101 4.37188 10.3359 4.38516C10.4906 4.39447 10.6431 4.34602 10.7641 4.24922L12.1523 3.14063C12.5566 3.26783 12.9488 3.43071 13.3242 3.62735L13.5242 5.39063C13.5413 5.54439 13.6148 5.68636 13.7305 5.78906C13.8996 5.93945 14.0598 6.09962 14.2102 6.26875C14.3129 6.38444 14.4548 6.45793 14.6086 6.475L16.3727 6.67109C16.5694 7.04649 16.7323 7.43866 16.8594 7.84297L15.7508 9.22891C15.6531 9.35086 15.6046 9.505 15.6148 9.66094H15.6172Z" fill="#34D399" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="db-subtitle">Your adventure awaits, traveler</div>
            </div>

            <div className="db-content-wrapper">
                <CharacterStats
                    character={character}
                    hp={hp}
                    maxHp={maxHp}
                    tempHp={tempHp}
                    hpPercent={hpPercent}
                    tempPercent={tempPercent}
                    exp={exp}
                    maxExp={maxExp}
                    expPercent={expPercent}
                    overlevelPercent={overlevelPercent}
                    isZeroHp={isZeroHp}
                    onHpClick={() => openPopup('hp')}
                    onExpClick={() => openPopup('exp')}
                    onProfileClick={() => openPopup('profile')}
                />

                <DeathSaves
                    character={character}
                    hp={hp}
                    rollDeathSave={rollDeathSave}
                />

                <QuickActions
                    characterId={character.id}
                    spellsCount={character.spells?.length || 0}
                    inventoryCount={character.inventory?.length || 0}
                    questsActive={character.quests?.filter(q => q.status === 'active').length || 0}
                />

                {/* Campaigns */}
                <div className="db-campaigns-container">
                    <div className="db-campaigns-header">
                        <span className="db-campaigns-title">Active campaigns</span>
                        <Link to="/campaigns" className="db-view-all-btn">View all</Link>
                    </div>
                    <div className="db-campaigns-scroll">
                        {campaigns.map(campaign => (
                            <Link
                                key={campaign.id}
                                to="/campaigns"
                                className={`db-campaign-card ${campaign.status !== 'active' ? 'db-inactive' : ''}`}
                                style={{ textDecoration: 'none' }}
                            >
                                <div className="db-campaign-name">{campaign.name}</div>
                                <div className="db-campaign-description">{campaign.description}</div>
                                <div className="db-campaign-status-label">{campaign.status}</div>
                            </Link>
                        ))}
                        <Link to="/campaigns" className="db-campaign-card db-add-campaign" style={{ textDecoration: 'none' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13 14.0002H16V16.0002H13V19.0002H11V16.0002H8V14.0002H11V11.0002H13V14.0002ZM24 6.00024V23.0002H0V4.00024C0 3.20459 0.31607 2.44153 0.87868 1.87892C1.44129 1.31631 2.20435 1.00024 3 1.00024H8.236L12.236 3.00024H21C21.7956 3.00024 22.5587 3.31631 23.1213 3.87892C23.6839 4.44153 24 5.20459 24 6.00024ZM2 4.00024V7.00024H22V6.00024C22 5.73503 21.8946 5.48067 21.7071 5.29314C21.5196 5.1056 21.2652 5.00024 21 5.00024H11.764L7.764 3.00024H3C2.73478 3.00024 2.48043 3.1056 2.29289 3.29314C2.10536 3.48067 2 3.73503 2 4.00024ZM22 21.0002V9.00024H2V21.0002H22Z" fill="#34D399" />
                            </svg>
                        </Link>
                    </div>
                </div>

                <DiceRollerSection
                    diceTypes={diceTypes}
                    logs={logs}
                    openSections={openSections}
                    toggleSection={toggleSection}
                    getResultColor={getResultColor}
                    addDiceLog={addDiceLog}
                    characterId={character.id}
                />
            </div>

            {/* Попапы (HP, EXP, Settings, Profile) */}
            {popupType === 'hp' && (
                <Modal isOpen={true} onClose={closePopup}>
                    <div className="db-popup-body">
                        <h3 className="db-popup-title">Edit HP</h3>
                        <div className="db-popup-stat-block">
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
                        </div>
                        <div className="db-popup-controls">
                            <div className="db-control-group">
                                <label>HP Adjustment</label>
                                <div className="db-input-group">
                                    <input
                                        type="number"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(Number(e.target.value))}
                                        min="0"
                                    />
                                    <button onClick={() => addHp(inputValue)}>Add</button>
                                    <button onClick={() => subtractHp(inputValue)}>Subtract</button>
                                </div>
                            </div>
                            <div className="db-control-group">
                                <label>Temp HP Adjustment</label>
                                <div className="db-input-group">
                                    <input
                                        type="number"
                                        value={tempInputValue}
                                        onChange={(e) => setTempInputValue(Number(e.target.value))}
                                        min="0"
                                    />
                                    <button onClick={() => addTempHp(tempInputValue)}>Add Temp</button>
                                    <button onClick={() => subtractTempHp(tempInputValue)}>Subtract Temp</button>
                                </div>
                            </div>
                        </div>
                        {isZeroHp && (
                            <div className="db-popup-death-warning">
                                {character.isStable ? 'Character is stable. Please get healed.' : 'You need to make a death saving throw'}
                            </div>
                        )}
                    </div>
                </Modal>
            )}

            {popupType === 'exp' && (
                <Modal isOpen={true} onClose={closePopup}>
                    <div className="db-popup-body">
                        <h3 className="db-popup-title">Edit EXP</h3>
                        <div className="db-popup-stat-block">
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
                        <div className="db-popup-controls">
                            <div className="db-control-group">
                                <label>EXP Adjustment</label>
                                <div className="db-input-group">
                                    <input
                                        type="number"
                                        value={expInputValue}
                                        onChange={(e) => setExpInputValue(Number(e.target.value))}
                                        min="0"
                                    />
                                    <button onClick={() => addExp(expInputValue)}>Add</button>
                                    <button onClick={() => subtractExp(expInputValue)}>Subtract</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}

            {popupType === 'settings' && (
                <Modal isOpen={true} onClose={closePopup}>
                    <div className="db-popup-body">
                        <h3 className="db-popup-title">Settings</h3>
                        <p>Empty popup</p>
                    </div>
                </Modal>
            )}

            {popupType === 'profile' && (
                <Modal isOpen={true} onClose={closePopup}>
                    <div className="db-popup-body">
                        <h3 className="db-popup-title">Character Profile</h3>
                        <p>Empty popup</p>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Dashboard;