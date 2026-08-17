import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacters } from '../context/CharacterContext';
import { useSpells } from '../context/SpellContext';
import { ALL_SPELLS } from '../constants/spells';
import { CASTING_TIMES, COMPONENT_OPTIONS, RANGES, ELEMENTS } from '../constants/spellOptions';
import SpellCard from '../components/SpellCard';
import SearchBar from '../components/SearchBar';
import FilterModal, { FilterField } from '../components/FilterModal';
import Modal from '../components/Modal';
import { getElementFromSpell, SCHOOLS } from '../utils/spellUtils';
import './SpellsLibrary.css';

const SpellsLibrary: React.FC = () => {
    const navigate = useNavigate();
    const { currentCharacterId, getCharacter, addSpellToCharacter, removeSpellFromCharacter } = useCharacters();
    const { customSpells, addCustomSpell } = useSpells();
    const character = currentCharacterId ? getCharacter(currentCharacterId) : undefined;

    const [searchQuery, setSearchQuery] = useState('');
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filters, setFilters] = useState({
        level: '',
        school: '',
        element: '',
        type: '',
        components: [] as string[],
    });

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newSpell, setNewSpell] = useState({
        name: '',
        level: 0,
        school: SCHOOLS[0] || 'Abjuration',
        castingTime: CASTING_TIMES[0],
        range: RANGES[0],
        components: [] as string[],
        description: '',
        element: ELEMENTS[0],
    });

    // Функции для управления компонентами при создании
    const toggleComponent = (comp: string) => {
        setNewSpell(prev => {
            const current = prev.components;
            if (current.includes(comp)) {
                return { ...prev, components: current.filter(c => c !== comp) };
            } else {
                return { ...prev, components: [...current, comp] };
            }
        });
    };

    const removeComponent = (comp: string) => {
        setNewSpell(prev => ({
            ...prev,
            components: prev.components.filter(c => c !== comp),
        }));
    };

    const handleFilterChange = (newFilters: Record<string, any>) => {
        setFilters(newFilters as any);
    };

    const filterFields: FilterField[] = [
        {
            key: 'level',
            label: 'Level',
            type: 'select',
            options: [
                { value: '', label: 'All' },
                { value: '0', label: 'Cantrip' },
                ...Array.from({ length: 9 }, (_, i) => ({ value: String(i + 1), label: `Level ${i + 1}` })),
            ],
        },
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
            options: [{ value: '', label: 'All' }, ...ELEMENTS.map(e => ({ value: e, label: e }))],
        },
        {
            key: 'type',
            label: 'Type',
            type: 'select',
            options: [
                { value: '', label: 'All' },
                { value: 'standard', label: 'Standard' },
                { value: 'custom', label: 'Custom' },
            ],
        },
        {
            key: 'components',
            label: 'Components',
            type: 'tags',
            options: COMPONENT_OPTIONS.map(c => ({ value: c, label: c })),
        },
    ];

    // Объединяем стандартные и пользовательские заклинания
    const allSpells = [
        ...ALL_SPELLS.map((s, index) => ({ ...s, id: `std-${index}`, isCustom: false, prepared: false })),
        ...customSpells,
    ];

    const filteredSpells = allSpells.filter(spell => {
        const matchesSearch = spell.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            spell.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
            spell.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLevel = !filters.level || spell.level === Number(filters.level);
        const matchesSchool = !filters.school || spell.school === filters.school;
        const matchesElement = !filters.element || (spell.element || getElementFromSpell(spell) || '') === filters.element;
        const matchesType = !filters.type ||
            (filters.type === 'custom' && spell.isCustom) ||
            (filters.type === 'standard' && !spell.isCustom);
        const matchesComponents = filters.components.length === 0 ||
            filters.components.every(comp => spell.components.includes(comp));
        return matchesSearch && matchesLevel && matchesSchool && matchesElement && matchesType && matchesComponents;
    });

    const handleAddSpell = (spellData: any) => {
        if (!character) return;
        const exists = character.spells.some(s => s.name === spellData.name);
        if (exists) return;
        addSpellToCharacter(character.id, {
            ...spellData,
            prepared: false,
            isCustom: spellData.isCustom || false,
            element: spellData.element || undefined,
        });
    };

    const handleRemoveSpell = (spellName: string) => {
        if (!character) return;
        const spell = character.spells.find(s => s.name === spellName);
        if (spell) {
            removeSpellFromCharacter(character.id, spell.id);
        }
    };

    const isSpellInBook = (spellName: string) => {
        if (!character) return false;
        return character.spells.some(s => s.name === spellName);
    };

    const handleBack = () => navigate(-1);

    // Создание заклинания
    const handleCreateSpell = () => {
        if (!newSpell.name.trim()) {
            alert('Please enter a spell name.');
            return;
        }
        const componentsStr = newSpell.components.length > 0 ? newSpell.components.join(', ') : '';

        addCustomSpell({
            name: newSpell.name,
            level: newSpell.level,
            school: newSpell.school,
            castingTime: newSpell.castingTime,
            range: newSpell.range,
            components: componentsStr,
            description: newSpell.description,
            element: newSpell.element === 'None' ? undefined : newSpell.element,
            isCustom: true,
            prepared: false,
        });
        setShowCreateModal(false);
        setNewSpell({
            name: '',
            level: 0,
            school: SCHOOLS[0] || 'Abjuration',
            castingTime: CASTING_TIMES[0],
            range: RANGES[0],
            components: [],
            description: '',
            element: ELEMENTS[0],
        });
    };

    return (
        <div className="page spells-library-page">
            <header className="spell-header">
                <button className="spell-back-btn" onClick={handleBack}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.5 10C17.5 10.1658 17.4342 10.3247 17.3169 10.4419C17.1997 10.5592 17.0408 10.625 16.875 10.625H4.6336L9.19219 15.1828C9.25026 15.2409 9.29632 15.3098 9.32775 15.3857C9.35918 15.4616 9.37535 15.5429 9.37535 15.625C9.37535 15.7071 9.35918 15.7884 9.32775 15.8643C9.29632 15.9402 9.25026 16.0091 9.19219 16.0672C9.13412 16.1253 9.06518 16.1713 8.98931 16.2027C8.91344 16.2342 8.83213 16.2503 8.75 16.2503C8.66788 16.2503 8.58656 16.2342 8.51069 16.2027C8.43482 16.1713 8.36588 16.1253 8.30782 16.0672L2.68282 10.4422C2.62471 10.3841 2.57861 10.3152 2.54715 10.2393C2.5157 10.1635 2.49951 10.0821 2.49951 10C2.49951 9.91787 2.5157 9.83654 2.54715 9.76066C2.57861 9.68479 2.62471 9.61586 2.68282 9.55781L8.30782 3.93281C8.42509 3.81554 8.58415 3.74965 8.75 3.74965C8.91586 3.74965 9.07492 3.81554 9.19219 3.93281C9.30947 4.05009 9.37535 4.20915 9.37535 4.375C9.37535 4.54085 9.30947 4.69991 9.19219 4.81719L4.6336 9.375H16.875C17.0408 9.375 17.1997 9.44085 17.3169 9.55806C17.4342 9.67527 17.5 9.83424 17.5 10Z" fill="#9CA3AF" />
                    </svg>
                </button>
                <div className="spell-header-info">
                    <div className="spell-title">Spells Library</div>
                    <div className="spell-subtitle">
                        {character ? `Adding to ${character.name}` : 'Select a character to add spells'}
                    </div>
                </div>
                <button className="btn-create-spell" onClick={() => setShowCreateModal(true)}>
                    + Create Spell
                </button>
            </header>

            <div className="spells-library-content">
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search spells..."
                    onFilterClick={() => setShowFilterModal(true)}
                />
                <div className="spell-list">
                    {filteredSpells.map((spell) => {
                        const inBook = isSpellInBook(spell.name);
                        return (
                            <SpellCard
                                key={spell.id}
                                spell={spell}
                                showAddButton={!!character && !inBook}
                                onAdd={() => handleAddSpell(spell)}
                                showRemoveButton={!!character && inBook}
                                onRemove={() => handleRemoveSpell(spell.name)}
                            />
                        );
                    })}
                </div>
            </div>

            {showFilterModal && (
                <FilterModal
                    isOpen={showFilterModal}
                    onClose={() => setShowFilterModal(false)}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    fields={filterFields}
                    onReset={() => setFilters({ level: '', school: '', element: '', type: '', components: [] })}
                    title="Filter Spells"
                />
            )}

            <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)}>
                <h3>Create Custom Spell</h3>
                <div className="create-spell-form">
                    <div className="form-group">
                        <label>Spell Name *</label>
                        <input
                            type="text"
                            value={newSpell.name}
                            onChange={(e) => setNewSpell({ ...newSpell, name: e.target.value })}
                            placeholder="Enter spell name"
                        />
                    </div>
                    <div className="form-group">
                        <label>Level</label>
                        <select
                            value={newSpell.level}
                            onChange={(e) => setNewSpell({ ...newSpell, level: Number(e.target.value) })}
                        >
                            {Array.from({ length: 10 }, (_, i) => i).map(lvl => (
                                <option key={lvl} value={lvl}>{lvl === 0 ? 'Cantrip' : `Level ${lvl}`}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>School</label>
                        <select
                            value={newSpell.school}
                            onChange={(e) => setNewSpell({ ...newSpell, school: e.target.value })}
                        >
                            {SCHOOLS.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Casting Time</label>
                        <select
                            value={newSpell.castingTime}
                            onChange={(e) => setNewSpell({ ...newSpell, castingTime: e.target.value })}
                        >
                            {CASTING_TIMES.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Range</label>
                        <select
                            value={newSpell.range}
                            onChange={(e) => setNewSpell({ ...newSpell, range: e.target.value })}
                        >
                            {RANGES.map(r => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Components</label>
                        <div className="component-selector">
                            <div className="component-tags">
                                {newSpell.components.map(comp => (
                                    <span key={comp} className="component-tag">
                                        {comp}
                                        <button
                                            type="button"
                                            className="component-remove"
                                            onClick={() => removeComponent(comp)}
                                        >
                                            ✕
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="component-options">
                                {COMPONENT_OPTIONS.map(comp => (
                                    <button
                                        key={comp}
                                        type="button"
                                        className={`component-option-btn ${newSpell.components.includes(comp) ? 'active' : ''}`}
                                        onClick={() => toggleComponent(comp)}
                                    >
                                        {comp}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Element</label>
                        <select
                            value={newSpell.element}
                            onChange={(e) => setNewSpell({ ...newSpell, element: e.target.value })}
                        >
                            {ELEMENTS.map(el => (
                                <option key={el} value={el}>{el}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={newSpell.description}
                            onChange={(e) => setNewSpell({ ...newSpell, description: e.target.value })}
                            placeholder="Enter spell description"
                            rows={3}
                        />
                    </div>
                </div>
                <div className="modal-actions">
                    <button className="modal-btn cancel" onClick={() => setShowCreateModal(false)}>Cancel</button>
                    <button className="modal-btn apply" onClick={handleCreateSpell}>Create</button>
                </div>
            </Modal>
        </div>
    );
};

export default SpellsLibrary;