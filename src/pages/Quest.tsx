import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacters } from '../context/CharacterContext';
import Modal from '../components/Modal';
import SearchBar from '../components/SearchBar';
import FilterModal, { FilterField } from '../components/FilterModal';
import './Quest.css';

type StatusFilter = 'all' | 'active' | 'completed' | 'failed';

const Quest: React.FC = () => {
    const navigate = useNavigate();
    const { currentCharacterId, getCharacter, addQuestToCharacter, removeQuestFromCharacter, updateQuest } = useCharacters();
    const character = currentCharacterId ? getCharacter(currentCharacterId) : undefined;

    // Состояния
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newQuestName, setNewQuestName] = useState('');
    const [newQuestDescription, setNewQuestDescription] = useState('');
    const [newQuestStatus, setNewQuestStatus] = useState<'active' | 'completed' | 'failed'>('active');

    if (!character) {
        return (
            <div className="quest-page">
                <div className="quest-empty-state">
                    <p>No character selected. Please go to Dashboard and select one.</p>
                    <button className="quest-btn-primary" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
                </div>
            </div>
        );
    }

    const handleBack = () => navigate(-1);

    // Фильтрация квестов
    const filteredQuests = character.quests.filter(quest => {
        const matchesSearch = quest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            quest.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || quest.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Добавление квеста
    const handleAddQuest = () => {
        if (!newQuestName.trim()) {
            alert('Please enter a quest name.');
            return;
        }
        addQuestToCharacter(character.id, {
            name: newQuestName.trim(),
            description: newQuestDescription.trim(),
            status: newQuestStatus,
        });
        setNewQuestName('');
        setNewQuestDescription('');
        setNewQuestStatus('active');
        setShowAddModal(false);
    };

    // Изменение статуса
    const handleStatusChange = (questId: string, newStatus: 'active' | 'completed' | 'failed') => {
        updateQuest(character.id, questId, { status: newStatus });
    };

    // Удаление квеста
    const handleDelete = (questId: string, questName: string) => {
        if (window.confirm(`Delete quest "${questName}"?`)) {
            removeQuestFromCharacter(character.id, questId);
        }
    };

    // Поля для модалки фильтрации (статус – уже есть быстрые кнопки, но можно добавить расширенные фильтры)
    const filterFields: FilterField[] = [
        {
            key: 'status',
            label: 'Status',
            type: 'select',
            options: [
                { value: '', label: 'All' },
                { value: 'active', label: 'Active' },
                { value: 'completed', label: 'Completed' },
                { value: 'failed', label: 'Failed' },
            ],
        },
    ];

    const handleFilterChange = (newFilters: Record<string, any>) => {
        if (newFilters.status) {
            setStatusFilter(newFilters.status as StatusFilter);
        } else {
            setStatusFilter('all');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return '#34d399';
            case 'completed': return '#60a5fa';
            case 'failed': return '#ef4444';
            default: return '#9ca3af';
        }
    };

    return (
        <div className="quest-page">
            {/* Header */}
            <header className="quest-header">
                <button className="quest-back-btn" onClick={handleBack}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.5 10C17.5 10.1658 17.4342 10.3247 17.3169 10.4419C17.1997 10.5592 17.0408 10.625 16.875 10.625H4.6336L9.19219 15.1828C9.25026 15.2409 9.29632 15.3098 9.32775 15.3857C9.35918 15.4616 9.37535 15.5429 9.37535 15.625C9.37535 15.7071 9.35918 15.7884 9.32775 15.8643C9.29632 15.9402 9.25026 16.0091 9.19219 16.0672C9.13412 16.1253 9.06518 16.1713 8.98931 16.2027C8.91344 16.2342 8.83213 16.2503 8.75 16.2503C8.66788 16.2503 8.58656 16.2342 8.51069 16.2027C8.43482 16.1713 8.36588 16.1253 8.30782 16.0672L2.68282 10.4422C2.62471 10.3841 2.57861 10.3152 2.54715 10.2393C2.5157 10.1635 2.49951 10.0821 2.49951 10C2.49951 9.91787 2.5157 9.83654 2.54715 9.76066C2.57861 9.68479 2.62471 9.61586 2.68282 9.55781L8.30782 3.93281C8.42509 3.81554 8.58415 3.74965 8.75 3.74965C8.91586 3.74965 9.07492 3.81554 9.19219 3.93281C9.30947 4.05009 9.37535 4.20915 9.37535 4.375C9.37535 4.54085 9.30947 4.69991 9.19219 4.81719L4.6336 9.375H16.875C17.0408 9.375 17.1997 9.44085 17.3169 9.55806C17.4342 9.67527 17.5 9.83424 17.5 10Z" fill="#9CA3AF" />
                    </svg>
                </button>
                <div className="quest-header-info">
                    <div className="quest-title">Quests</div>
                    <div className="quest-subtitle">{character.name}</div>
                </div>
                <button className="quest-btn-add" onClick={() => setShowAddModal(true)}>
                    + Add Quest
                </button>
            </header>

            {/* Контент */}
            <div className="quest-content">
                <div className="quest-controls">
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search quests..."
                        onFilterClick={() => setShowFilterModal(true)}
                    />
                    <div className="quest-filter-buttons">
                        <button
                            className={`quest-filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
                            onClick={() => setStatusFilter('all')}
                        >
                            All
                        </button>
                        <button
                            className={`quest-filter-btn ${statusFilter === 'active' ? 'active' : ''}`}
                            onClick={() => setStatusFilter('active')}
                        >
                            Active
                        </button>
                        <button
                            className={`quest-filter-btn ${statusFilter === 'completed' ? 'active' : ''}`}
                            onClick={() => setStatusFilter('completed')}
                        >
                            Completed
                        </button>
                        <button
                            className={`quest-filter-btn ${statusFilter === 'failed' ? 'active' : ''}`}
                            onClick={() => setStatusFilter('failed')}
                        >
                            Failed
                        </button>
                    </div>
                </div>

                <div className="quest-list">
                    {filteredQuests.length === 0 ? (
                        <div className="quest-empty">No quests match your filters.</div>
                    ) : (
                        filteredQuests.map(quest => (
                            <div key={quest.id} className="quest-item">
                                <div className="quest-item-header">
                                    <span className="quest-item-name">{quest.name}</span>
                                    <span className="quest-item-status" style={{ color: getStatusColor(quest.status) }}>
                                        {quest.status}
                                    </span>
                                </div>
                                <div className="quest-item-description">{quest.description}</div>
                                <div className="quest-item-actions">
                                    <select
                                        value={quest.status}
                                        onChange={(e) => handleStatusChange(quest.id, e.target.value as any)}
                                        className="quest-status-select"
                                        style={{ borderColor: getStatusColor(quest.status) }}
                                    >
                                        <option value="active">Active</option>
                                        <option value="completed">Completed</option>
                                        <option value="failed">Failed</option>
                                    </select>
                                    <button
                                        className="quest-delete-btn"
                                        onClick={() => handleDelete(quest.id, quest.name)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Модалка фильтрации (расширенная) */}
            {showFilterModal && (
                <FilterModal
                    isOpen={showFilterModal}
                    onClose={() => setShowFilterModal(false)}
                    filters={{ status: statusFilter === 'all' ? '' : statusFilter }}
                    onFilterChange={handleFilterChange}
                    fields={filterFields}
                    onReset={() => setStatusFilter('all')}
                    title="Filter Quests"
                />
            )}

            {/* Модалка добавления квеста */}
            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
                <h3>Add New Quest</h3>
                <div className="quest-add-form">
                    <div className="quest-form-group">
                        <label>Quest Name *</label>
                        <input
                            type="text"
                            value={newQuestName}
                            onChange={(e) => setNewQuestName(e.target.value)}
                            placeholder="e.g., Defeat the Dragon"
                        />
                    </div>
                    <div className="quest-form-group">
                        <label>Description</label>
                        <textarea
                            value={newQuestDescription}
                            onChange={(e) => setNewQuestDescription(e.target.value)}
                            placeholder="Describe the quest..."
                            rows={3}
                        />
                    </div>
                    <div className="quest-form-group">
                        <label>Status</label>
                        <select
                            value={newQuestStatus}
                            onChange={(e) => setNewQuestStatus(e.target.value as any)}
                        >
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>
                </div>
                <div className="quest-modal-actions">
                    <button className="quest-modal-btn cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                    <button className="quest-modal-btn apply" onClick={handleAddQuest}>Add</button>
                </div>
            </Modal>
        </div>
    );
};

export default Quest;