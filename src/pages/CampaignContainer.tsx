import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCampaigns } from '../context/CampaignContext';
import { useCharacters } from '../context/CharacterContext';
import SearchBar from '../components/SearchBar';
import FilterModal, { FilterField } from '../components/FilterModal';
import CampaignCard from '../components/CampaignCard';
import CampaignFormModal from '../components/CampaignFormModal';
import {
    CampaignFilters,
    DEFAULT_CAMPAIGN_FILTERS,
    cycleStatus,
    filterCampaigns,
} from '../utils/campaignUtils';
import { Campaign } from '../types/Character';
import './CampaignContainer.css';

const CampaignContainer: React.FC = () => {
    const navigate = useNavigate();
    const routerLocation = useLocation();
    const {
        campaigns,
        addCampaign,
        updateCampaign,
        deleteCampaign,
        getCampaign,
    } = useCampaigns();
    const { characters, currentCharacterId } = useCharacters();

    // Определяем режим: все кампании или кампании персонажа
    const params = new URLSearchParams(routerLocation.search);
    const characterIdFilter = params.get('characterId');

    const filterCharacter = useMemo(
        () => (characterIdFilter ? characters.find(c => c.id === characterIdFilter) : null),
        [characters, characterIdFilter]
    );

    const isCharacterMode = characterIdFilter !== null;
    const characterNotFound = isCharacterMode && !filterCharacter;

    const [searchQuery, setSearchQuery] = useState('');
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filters, setFilters] = useState<CampaignFilters>(DEFAULT_CAMPAIGN_FILTERS);

    // Управление модалкой формы
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

    // Обработка ?create=true — открываем модалку, сохраняя characterId если он был
    useEffect(() => {
        const urlParams = new URLSearchParams(routerLocation.search);
        if (urlParams.get('create') === 'true') {
            setEditingCampaign(null);
            setShowFormModal(true);

            // Собираем URL без ?create, но с ?characterId (если есть)
            const newParams = new URLSearchParams();
            if (characterIdFilter) newParams.set('characterId', characterIdFilter);
            const qs = newParams.toString();
            navigate(qs ? `/campaigns?${qs}` : '/campaigns', { replace: true });
        }
    }, [routerLocation, navigate, characterIdFilter]);

    const handleBack = () => navigate(-1);

    // Список кампаний, доступных для отображения
    const baseCampaigns = useMemo(() => {
        if (characterIdFilter) {
            return campaigns.filter(c => (c.characterIds || []).includes(characterIdFilter));
        }
        return campaigns;
    }, [campaigns, characterIdFilter]);

    // Применяем поиск и фильтры
    const filteredCampaigns = useMemo(
        () => filterCampaigns(baseCampaigns, searchQuery, filters),
        [baseCampaigns, searchQuery, filters]
    );

    // Обработчики
    const handleToggleStatus = (id: string) => {
        const camp = getCampaign(id);
        if (!camp) return;
        updateCampaign(id, { status: cycleStatus(camp.status) });
    };

    const handleEdit = (id: string) => {
        const camp = getCampaign(id);
        if (!camp) return;
        setEditingCampaign(camp);
        setShowFormModal(true);
    };

    const handleDelete = (id: string) => {
        deleteCampaign(id);
    };

    const handleCreateNew = () => {
        setEditingCampaign(null);
        setShowFormModal(true);
    };

    const handleFormSubmit = (data: Omit<Campaign, 'id'>) => {
        if (editingCampaign) {
            // Редактирование: сохраняем существующие characterIds
            updateCampaign(editingCampaign.id, {
                ...data,
                characterIds: editingCampaign.characterIds || [],
            });
        } else {
            // Создание: characterIds уже переданы из модалки
            // (либо [lockedCharacterId], либо [dropdown selection], либо [])
            addCampaign(data);
        }
        setEditingCampaign(null);
    };

    const handleFilterChange = (newFilters: Record<string, any>) => {
        setFilters(newFilters as CampaignFilters);
    };

    // Поля фильтра
    const filterFields: FilterField[] = [
        { key: 'dm', label: 'DM', type: 'text', placeholder: 'Enter DM name...' },
        { key: 'players', label: 'Players', type: 'range', min: 0, max: 20 },
        { key: 'sessions', label: 'Sessions', type: 'range', min: 0, max: 100 },
        { key: 'lastPlayedAfter', label: 'Last Played After', type: 'date' },
        { key: 'lastPlayedBefore', label: 'Last Played Before', type: 'date' },
        {
            key: 'status',
            label: 'Status',
            type: 'select',
            options: [
                { value: '', label: 'All' },
                { value: 'active', label: 'Active' },
                { value: 'paused', label: 'Paused' },
                { value: 'ended', label: 'Ended' },
            ],
        },
    ];

    // Селектор персонажа для модалки создания
    // Показываем только если НЕ в режиме персонажа
    const availableCharacters = isCharacterMode
        ? undefined
        : characters.map(c => ({ id: c.id, name: c.name }));

    const lockedCharacterId = characterIdFilter ?? undefined;

    // Заголовки
    const welcomeText = isCharacterMode
        ? (filterCharacter ? `Campaigns for` : 'Campaigns for')
        : 'Welcome back, Adventurer!';

    const title = isCharacterMode
        ? (filterCharacter ? filterCharacter.name : 'Unknown character')
        : 'Your Campaigns';

    // Если в URL указан несуществующий персонаж
    if (characterNotFound) {
        return (
            <div className="cg-page">
                <header className="cg-header">
                    <div className="cg-header-top">
                        <button className="cg-back-btn" onClick={handleBack} aria-label="Go back">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.5 10C17.5 10.1658 17.4342 10.3247 17.3169 10.4419C17.1997 10.5592 17.0408 10.625 16.875 10.625H4.6336L9.19219 15.1828C9.25026 15.2409 9.29632 15.3098 9.32775 15.3857C9.35918 15.4616 9.37535 15.5429 9.37535 15.625C9.37535 15.7071 9.35918 15.7884 9.32775 15.8643C9.29632 15.9402 9.25026 16.0091 9.19219 16.0672C9.13412 16.1253 9.06518 16.1713 8.98931 16.2027C8.91344 16.2342 8.83213 16.2503 8.75 16.2503C8.66788 16.2503 8.58656 16.2342 8.51069 16.2027C8.43482 16.1713 8.36588 16.1253 8.30782 16.0672L2.68282 10.4422C2.62471 10.3841 2.57861 10.3152 2.54715 10.2393C2.5157 10.1635 2.49951 10.0821 2.49951 10C2.49951 9.91787 2.5157 9.83654 2.54715 9.76066C2.57861 9.68479 2.62471 9.61586 2.68282 9.55781L8.30782 3.93281C8.42509 3.81554 8.58415 3.74965 8.75 3.74965C8.91586 3.74965 9.07492 3.81554 9.19219 3.93281C9.30947 4.05009 9.37535 4.20915 9.37535 4.375C9.37535 4.54085 9.30947 4.69991 9.19219 4.81719L4.6336 9.375H16.875C17.0408 9.375 17.1997 9.44085 17.3169 9.55806C17.4342 9.67527 17.5 9.83424 17.5 10Z" fill="#9CA3AF" />
                            </svg>
                        </button>
                        <div className="cg-header-left">
                            <span className="cg-welcome-text">Character not found</span>
                            <h1 className="cg-title">Campaigns</h1>
                        </div>
                    </div>
                </header>
                <div className="cg-content">
                    <div className="cg-empty-state">
                        <p>This character doesn't exist or has been deleted.</p>
                        <button className="cg-create-button" onClick={() => navigate('/campaigns')}>
                            View all campaigns
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cg-page">
            <header className="cg-header">
                <div className="cg-header-top">
                    <button className="cg-back-btn" onClick={handleBack} aria-label="Go back">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.5 10C17.5 10.1658 17.4342 10.3247 17.3169 10.4419C17.1997 10.5592 17.0408 10.625 16.875 10.625H4.6336L9.19219 15.1828C9.25026 15.2409 9.29632 15.3098 9.32775 15.3857C9.35918 15.4616 9.37535 15.5429 9.37535 15.625C9.37535 15.7071 9.35918 15.7884 9.32775 15.8643C9.29632 15.9402 9.25026 16.0091 9.19219 16.0672C9.13412 16.1253 9.06518 16.1713 8.98931 16.2027C8.91344 16.2342 8.83213 16.2503 8.75 16.2503C8.66788 16.2503 8.58656 16.2342 8.51069 16.2027C8.43482 16.1713 8.36588 16.1253 8.30782 16.0672L2.68282 10.4422C2.62471 10.3841 2.57861 10.3152 2.54715 10.2393C2.5157 10.1635 2.49951 10.0821 2.49951 10C2.49951 9.91787 2.5157 9.83654 2.54715 9.76066C2.57861 9.68479 2.62471 9.61586 2.68282 9.55781L8.30782 3.93281C8.42509 3.81554 8.58415 3.74965 8.75 3.74965C8.91586 3.74965 9.07492 3.81554 9.19219 3.93281C9.30947 4.05009 9.37535 4.20915 9.37535 4.375C9.37535 4.54085 9.30947 4.69991 9.19219 4.81719L4.6336 9.375H16.875C17.0408 9.375 17.1997 9.44085 17.3169 9.55806C17.4342 9.67527 17.5 9.83424 17.5 10Z" fill="#9CA3AF" />
                        </svg>
                    </button>
                    <div className="cg-header-left">
                        <span className="cg-welcome-text">{welcomeText}</span>
                        <h1 className="cg-title">{title}</h1>
                    </div>
                    <div className="cg-profile-icon">
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.8125 13.125C18.8125 14.0768 18.5303 15.0073 18.0015 15.7987C17.4726 16.5901 16.721 17.2069 15.8417 17.5712C14.9623 17.9354 13.9947 18.0307 13.0611 17.845C12.1276 17.6593 11.2701 17.201 10.5971 16.528C9.92401 15.8549 9.46567 14.9974 9.27998 14.0639C9.09429 13.1303 9.18959 12.1627 9.55383 11.2833C9.91808 10.404 10.5349 9.65236 11.3263 9.12355C12.1177 8.59475 13.0482 8.3125 14 8.3125C15.2759 8.31395 16.4992 8.82144 17.4014 9.72365C18.3036 10.6259 18.8111 11.8491 18.8125 13.125ZM25.375 14C25.375 16.2498 24.7079 18.449 23.458 20.3196C22.2081 22.1902 20.4315 23.6482 18.353 24.5091C16.2745 25.3701 13.9874 25.5953 11.7809 25.1564C9.57432 24.7175 7.54749 23.6342 5.95667 22.0433C4.36584 20.4525 3.28248 18.4257 2.84357 16.2192C2.40467 14.0126 2.62993 11.7255 3.49088 9.64698C4.35182 7.56847 5.80978 5.79193 7.68039 4.54203C9.551 3.29213 11.7502 2.625 14 2.625C17.0159 2.62818 19.9073 3.82764 22.0398 5.96018C24.1724 8.09271 25.3718 10.9841 25.375 14Z" fill="white" />
                        </svg>
                    </div>
                </div>
                <div className="cg-controls">
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search campaigns..."
                        onFilterClick={() => setShowFilterModal(true)}
                    />
                </div>
            </header>

            <div className="cg-content">
                {/* Create Campaign Card */}
                <div className="cg-create-card">
                    <div className="cg-create-icon" onClick={handleCreateNew} style={{ cursor: 'pointer' }}>
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M28.5 16C28.5 16.3978 28.342 16.7794 28.0607 17.0607C27.7794 17.342 27.3978 17.5 27 17.5H17.5V27C17.5 27.3978 17.342 27.7794 17.0607 28.0607C16.7794 28.342 16.3978 28.5 16 28.5C15.6022 28.5 15.2206 28.342 14.9393 28.0607C14.658 27.7794 14.5 27.3978 14.5 27V17.5H5C4.60218 17.5 4.22064 17.342 3.93934 17.0607C3.65804 16.7794 3.5 16.3978 3.5 16C3.5 15.6022 3.65804 15.2206 3.93934 14.9393C4.22064 14.658 4.60218 14.5 5 14.5H14.5V5C14.5 4.60218 14.658 4.22064 14.9393 3.93934C15.2206 3.65804 15.6022 3.5 16 3.5C16.3978 3.5 16.7794 3.65804 17.0607 3.93934C17.342 4.22064 17.5 4.60218 17.5 5V14.5H27C27.3978 14.5 27.7794 14.658 28.0607 14.9393C28.342 15.2206 28.5 15.6022 28.5 16Z" fill="white" />
                        </svg>
                    </div>
                    <h2 className="cg-create-title">Start New Campaign</h2>
                    <p className="cg-create-subtitle">Create a new adventure and invite your party</p>
                    <button className="cg-create-button" onClick={handleCreateNew}>
                        Create campaign
                    </button>
                </div>

                <section className="cg-section">
                    <div className="cg-section-header">
                        <h2 className="cg-section-title">
                            {filters.status === 'active' ? 'Active Campaigns' :
                                filters.status === 'paused' ? 'Paused Campaigns' :
                                    filters.status === 'ended' ? 'Ended Campaigns' :
                                        isCharacterMode ? `${filterCharacter?.name}'s Campaigns` :
                                            'All Campaigns'}
                            <span className="cg-campaign-count"> ({filteredCampaigns.length})</span>
                        </h2>
                    </div>

                    <div className="cg-cards-list">
                        {filteredCampaigns.length === 0 ? (
                            <div className="cg-empty-state">
                                {isCharacterMode
                                    ? `${filterCharacter?.name} is not in any campaigns yet.`
                                    : campaigns.length === 0
                                        ? 'No campaigns yet. Create your first adventure!'
                                        : 'No campaigns match your filters.'}
                            </div>
                        ) : (
                            filteredCampaigns.map(campaign => (
                                <CampaignCard
                                    key={campaign.id}
                                    campaign={campaign}
                                    onToggleStatus={handleToggleStatus}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))
                        )}
                    </div>
                </section>
            </div>

            {/* Модальное окно создания / редактирования */}
            <CampaignFormModal
                isOpen={showFormModal}
                onClose={() => {
                    setShowFormModal(false);
                    setEditingCampaign(null);
                }}
                onSubmit={handleFormSubmit}
                initialData={editingCampaign}
                availableCharacters={availableCharacters}
                lockedCharacterId={lockedCharacterId}
            />

            {/* Модальное окно фильтров */}
            {showFilterModal && (
                <FilterModal
                    isOpen={showFilterModal}
                    onClose={() => setShowFilterModal(false)}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    fields={filterFields}
                    onReset={() => setFilters(DEFAULT_CAMPAIGN_FILTERS)}
                    title="Filter Campaigns"
                />
            )}
        </div>
    );
};

export default CampaignContainer;