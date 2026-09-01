import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacters } from '../context/CharacterContext';
import SpellCard from '../components/SpellCard';
import SearchBar from '../components/SearchBar';
import SkillCheck from '../components/SkillCheck';
import { getSpellSlots, getMaxPrepared } from '../utils/spellcasting';
import FilterModal, { FilterField } from '../components/FilterModal';
import { SCHOOLS, getElementFromSpell } from '../utils/spellUtils';
import { COMPONENT_OPTIONS } from '../constants/spellOptions';
import './SpellbookContainer.css';

type FilterType = 'all' | 'prepared' | 'notPrepared';
type SpellTypeFilter = 'all' | 'standard' | 'custom' | 'racial';
type ConcentrationFilter = 'all' | 'concentration' | 'noConcentration';

const SpellbookContainer: React.FC = () => {
    const navigate = useNavigate();
    const { currentCharacterId, getCharacter, updateSpell, startConcentration, endConcentration } = useCharacters();
    const character = currentCharacterId ? getCharacter(currentCharacterId) : undefined;

    const [activeLevel, setActiveLevel] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<FilterType>('all');
    const [spellTypeFilter, setSpellTypeFilter] = useState<SpellTypeFilter>('all');
    const [concentrationFilter, setConcentrationFilter] = useState<ConcentrationFilter>('all');
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [schoolFilter, setSchoolFilter] = useState('');
    const [elementFilter, setElementFilter] = useState('');
    const [componentsFilter, setComponentsFilter] = useState<string[]>([]);

    // Состояние для предупреждения о превышении количества подготовленных
    const [isPreparedWarning, setIsPreparedWarning] = useState(false);
    let warningTimeout: NodeJS.Timeout | null = null;

    if (!character) {
        return (
            <div className="sb-page">
                <div className="sb-empty-state">
                    <p>No character selected. Please go to Dashboard and select a character.</p>
                    <button className="sb-btn-primary" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
                </div>
            </div>
        );
    }

    // Получение заклинаний по уровню
    const getSpellsByLevel = (level: number) => {
        return character.spells.filter(spell => spell.level === level);
    };

    // Применение фильтрации по статусу подготовки
    const applyFilter = (spells: typeof character.spells) => {
        if (filterType === 'all') return spells;
        if (filterType === 'prepared') return spells.filter(s => s.prepared);
        if (filterType === 'notPrepared') return spells.filter(s => !s.prepared);
        return spells;
    };

    // Поиск и расширенные фильтры (школа, элемент, тип, компоненты)
    const applySearchAndFilters = (spells: typeof character.spells) => {
        let result = spells;
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(s =>
                s.name.toLowerCase().includes(query) ||
                s.school.toLowerCase().includes(query) ||
                s.description.toLowerCase().includes(query)
            );
        }
        if (schoolFilter) {
            result = result.filter(s => s.school === schoolFilter);
        }
        if (elementFilter) {
            result = result.filter(s => (s.element || getElementFromSpell(s) || '') === elementFilter);
        }
        if (componentsFilter.length > 0) {
            result = result.filter(s => componentsFilter.every(comp => s.components.includes(comp)));
        }
        if (spellTypeFilter !== 'all') {
            if (spellTypeFilter === 'standard') {
                result = result.filter(s => !s.isCustom && !s.isRacial);
            } else if (spellTypeFilter === 'custom') {
                result = result.filter(s => s.isCustom);
            } else if (spellTypeFilter === 'racial') {
                result = result.filter(s => s.isRacial);
            }
        }
        // Фильтр по концентрации
        if (concentrationFilter !== 'all') {
            if (concentrationFilter === 'concentration') {
                result = result.filter(s => s.requiresConcentration === true);
            } else if (concentrationFilter === 'noConcentration') {
                result = result.filter(s => !s.requiresConcentration);
            }
        }
        return result;
    };

    const currentSpells = applySearchAndFilters(applyFilter(getSpellsByLevel(activeLevel)));

    // Формирование заголовка вкладки
    const getTabLabel = (level: number) => {
        if (level === 0) return 'Cantrips';
        return `Level ${level}`;
    };

    // Подсчёт количества заклинаний для каждого уровня (для отображения в скобках)
    const getLevelCount = (level: number) => {
        return character.spells.filter(s => s.level === level).length;
    };

    const togglePrepared = (spellId: string) => {
        const spell = character.spells.find(s => s.id === spellId);
        if (!spell) return;
        if (spell.isRacial) return;
        if (!spell.prepared) {
            const maxPrepared = getMaxPrepared(character);
            const nonRacialPrepared = character.spells.filter(s => !s.isRacial && s.prepared).length;
            if (nonRacialPrepared >= maxPrepared) {
                // Визуальное предупреждение
                if (warningTimeout) clearTimeout(warningTimeout);
                setIsPreparedWarning(true);
                warningTimeout = setTimeout(() => setIsPreparedWarning(false), 2000);
                return;
            }
        }

        updateSpell(character.id, spellId, { prepared: !spell.prepared });
    };

    const handleToggleConcentration = (spellId: string) => {
        const spell = character.spells.find(s => s.id === spellId);
        if (!spell || !spell.requiresConcentration) return;

        // Если это заклинание уже активное – завершаем концентрацию
        if (character.activeConcentrationSpellId === spellId) {
            endConcentration(character.id);
            return;
        }

        // Если активно другое заклинание – спрашиваем
        if (character.activeConcentrationSpellId) {
            if (!window.confirm('You are already concentrating on another spell. End it and concentrate on this one?')) {
                return;
            }
            endConcentration(character.id);
        }
        startConcentration(character.id, spellId);
    };

    const handleBack = () => navigate(-1);
    const handleAddFromLibrary = () => navigate('/spells');

    // Статистика
    const spellSlotsArray = getSpellSlots(character);
    const totalSlots = spellSlotsArray.reduce((a: number, b: number) => a + b, 0);
    const maxPrepared = getMaxPrepared(character);
    const preparedCount = character.spells.filter(s => s.prepared).length;
    const knownCount = character.spells.length;
    const racialCount = character.spells.filter(s => s.isRacial).length;

    // Активная концентрация
    const activeSpell = character.activeConcentrationSpellId
        ? character.spells.find(s => s.id === character.activeConcentrationSpellId)
        : null;

    // Фильтры для модалки (без поля концентрации)
    const filterFields: FilterField[] = [
        {
            key: 'school',
            label: 'School',
            type: 'select',
            options: [{ value: '', label: 'All' }, ...SCHOOLS.map(s => ({ value: s, label: s }))],
        },
        {
            key: 'element',
            label: 'Element',
            type: 'select',
            options: [
                { value: '', label: 'All' },
                ...['fire', 'cold', 'lightning', 'acid', 'poison', 'force', 'necrotic', 'radiant', 'psychic', 'healing'].map(e => ({ value: e, label: e.charAt(0).toUpperCase() + e.slice(1) })),
            ],
        },
        {
            key: 'components',
            label: 'Components',
            type: 'tags',
            options: COMPONENT_OPTIONS.map(c => ({ value: c, label: c })),
        },
    ];

    const handleFilterChange = (newFilters: Record<string, any>) => {
        setSchoolFilter(newFilters.school || '');
        setElementFilter(newFilters.element || '');
        setComponentsFilter(newFilters.components || []);
    };

    return (
        <div className="sb-page">
            <header className="sb-header">
                <button className="sb-back-btn" onClick={handleBack} aria-label="Go back">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.5 10C17.5 10.1658 17.4342 10.3247 17.3169 10.4419C17.1997 10.5592 17.0408 10.625 16.875 10.625H4.6336L9.19219 15.1828C9.25026 15.2409 9.29632 15.3098 9.32775 15.3857C9.35918 15.4616 9.37535 15.5429 9.37535 15.625C9.37535 15.7071 9.35918 15.7884 9.32775 15.8643C9.29632 15.9402 9.25026 16.0091 9.19219 16.0672C9.13412 16.1253 9.06518 16.1713 8.98931 16.2027C8.91344 16.2342 8.83213 16.2503 8.75 16.2503C8.66788 16.2503 8.58656 16.2342 8.51069 16.2027C8.43482 16.1713 8.36588 16.1253 8.30782 16.0672L2.68282 10.4422C2.62471 10.3841 2.57861 10.3152 2.54715 10.2393C2.5157 10.1635 2.49951 10.0821 2.49951 10C2.49951 9.91787 2.5157 9.83654 2.54715 9.76066C2.57861 9.68479 2.62471 9.61586 2.68282 9.55781L8.30782 3.93281C8.42509 3.81554 8.58415 3.74965 8.75 3.74965C8.91586 3.74965 9.07492 3.81554 9.19219 3.93281C9.30947 4.05009 9.37535 4.20915 9.37535 4.375C9.37535 4.54085 9.30947 4.69991 9.19219 4.81719L4.6336 9.375H16.875C17.0408 9.375 17.1997 9.44085 17.3169 9.55806C17.4342 9.67527 17.5 9.83424 17.5 10Z" fill="#9CA3AF" />
                    </svg>
                </button>
                <div className="sb-header-info">
                    <div className="sb-title">Spellbook</div>
                    <div className="sb-subtitle">{character.name}</div>
                </div>
                <button className="sb-btn-add-library" onClick={handleAddFromLibrary}>
                    + Library
                </button>
            </header>

            <div className="sb-stats">
                <div className="sb-stat-item">
                    <span className="sb-stat-label">Spell Slots</span>
                    <span className="sb-stat-value">{totalSlots}</span>
                </div>
                <div className={`sb-stat-item ${isPreparedWarning ? 'sb-warning' : ''}`}>
                    <span className="sb-stat-label">Prepared</span>
                    <span className="sb-stat-value">{preparedCount} / {maxPrepared}</span>
                </div>
                <div className="sb-stat-item">
                    <span className="sb-stat-label">Racial</span>
                    <span className="sb-stat-value">{racialCount}</span>
                </div>
                <div className="sb-stat-item">
                    <span className="sb-stat-label">Known</span>
                    <span className="sb-stat-value">{knownCount}</span>
                </div>
            </div>

            {/* Выпадающий список для выбора уровня */}
            <div className="sb-level-selector">
                <label htmlFor="level-select">Spell level:</label>
                <select
                    id="level-select"
                    value={activeLevel}
                    onChange={(e) => setActiveLevel(Number(e.target.value))}
                >
                    {Array.from({ length: 10 }, (_, i) => i).map(level => (
                        <option key={level} value={level}>
                            {level === 0 ? 'Cantrips' : `Level ${level}`} ({getLevelCount(level)})
                        </option>
                    ))}
                </select>
            </div>

            <div className="sb-content">
                <div className="sb-controls">
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search spells..."
                        onFilterClick={() => setShowFilterModal(true)}
                    />
                    <div className="sb-filter-buttons">
                        <button
                            className={`sb-filter-btn ${filterType === 'all' ? 'sb-active' : ''}`}
                            onClick={() => setFilterType('all')}
                        >
                            All
                        </button>
                        <button
                            className={`sb-filter-btn ${filterType === 'prepared' ? 'sb-active' : ''}`}
                            onClick={() => setFilterType('prepared')}
                        >
                            Prepared
                        </button>
                        <button
                            className={`sb-filter-btn ${filterType === 'notPrepared' ? 'sb-active' : ''}`}
                            onClick={() => setFilterType('notPrepared')}
                        >
                            Not Prepared
                        </button>
                    </div>
                    <div className="sb-filter-buttons sb-type-filters">
                        <button
                            className={`sb-filter-btn ${spellTypeFilter === 'all' ? 'sb-active' : ''}`}
                            onClick={() => setSpellTypeFilter('all')}
                        >
                            All Types
                        </button>
                        <button
                            className={`sb-filter-btn ${spellTypeFilter === 'standard' ? 'sb-active' : ''}`}
                            onClick={() => setSpellTypeFilter('standard')}
                        >
                            Standard
                        </button>
                        <button
                            className={`sb-filter-btn ${spellTypeFilter === 'custom' ? 'sb-active' : ''}`}
                            onClick={() => setSpellTypeFilter('custom')}
                        >
                            Custom
                        </button>
                        <button
                            className={`sb-filter-btn ${spellTypeFilter === 'racial' ? 'sb-active' : ''}`}
                            onClick={() => setSpellTypeFilter('racial')}
                        >
                            Racial
                        </button>
                    </div>
                    {/* Новый ряд фильтров по концентрации */}
                    <div className="sb-filter-buttons sb-concentration-filters">
                        <button
                            className={`sb-filter-btn ${concentrationFilter === 'all' ? 'sb-active' : ''}`}
                            onClick={() => setConcentrationFilter('all')}
                        >
                            All
                        </button>
                        <button
                            className={`sb-filter-btn ${concentrationFilter === 'concentration' ? 'sb-active' : ''}`}
                            onClick={() => setConcentrationFilter('concentration')}
                        >
                            Concentration
                        </button>
                        <button
                            className={`sb-filter-btn ${concentrationFilter === 'noConcentration' ? 'sb-active' : ''}`}
                            onClick={() => setConcentrationFilter('noConcentration')}
                        >
                            No Concentration
                        </button>
                    </div>
                </div>
                <div className="sb-list-title">
                    {getTabLabel(activeLevel)} ({currentSpells.length})
                </div>
                {currentSpells.length === 0 ? (
                    <div className="sb-empty-message">
                        <p>No spells match your filters.</p>
                        <button className="sb-btn-add-library" onClick={handleAddFromLibrary}>
                            Add from Library
                        </button>
                    </div>
                ) : (
                    <div className="sb-cards">
                        {currentSpells.map((spell) => (
                            <SpellCard
                                key={spell.id}
                                spell={spell}
                                isPrepared={spell.prepared}
                                onTogglePrepared={() => togglePrepared(spell.id)}
                                renderPreparedToggle={({ prepared, onToggle }) => (
                                    <SkillCheck proficient={prepared} onToggle={onToggle} />
                                )}
                                isCustom={spell.isCustom || false}
                                disableToggle={spell.isRacial || false}
                                requiresConcentration={spell.requiresConcentration || false}
                                isConcentrating={character.activeConcentrationSpellId === spell.id}
                                onToggleConcentration={() => handleToggleConcentration(spell.id)}
                                showConcentrationControl={!!spell.requiresConcentration}
                            />
                        ))}
                    </div>
                )}
            </div>

            {showFilterModal && (
                <FilterModal
                    isOpen={showFilterModal}
                    onClose={() => setShowFilterModal(false)}
                    filters={{ school: schoolFilter, element: elementFilter, components: componentsFilter }}
                    onFilterChange={handleFilterChange}
                    fields={filterFields}
                    onReset={() => {
                        setSchoolFilter('');
                        setElementFilter('');
                        setComponentsFilter([]);
                    }}
                    title="Filter Spells"
                />
            )}
        </div>
    );
};

export default SpellbookContainer;