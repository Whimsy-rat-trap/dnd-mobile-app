import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacters } from '../context/CharacterContext';
import SpellCard from '../components/SpellCard';
import SearchBar from '../components/SearchBar';
import './SpellbookContainer.css';

type TabKey = 'cantrips' | 'level1' | 'level2' | 'level3';

const SpellbookContainer: React.FC = () => {
    const navigate = useNavigate();
    const { currentCharacterId, getCharacter, updateSpell } = useCharacters();
    const character = currentCharacterId ? getCharacter(currentCharacterId) : undefined;

    const [activeTab, setActiveTab] = useState<TabKey>('cantrips');
    const [searchQuery, setSearchQuery] = useState('');

    const tabs: { id: TabKey; label: string }[] = [
        { id: 'cantrips', label: 'Cantrips' },
        { id: 'level1', label: 'Level 1' },
        { id: 'level2', label: 'Level 2' },
        { id: 'level3', label: 'Level 3' },
    ];

    if (!character) {
        return (
            <div className="spellbook-page">
                <div className="spellbook-empty">
                    <p>No character selected. Please go to Dashboard and select a character.</p>
                    <button className="btn-primary" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
                </div>
            </div>
        );
    }

    const getSpellsByLevel = (level: number) => {
        return character.spells.filter(spell => spell.level === level);
    };

    const cantrips = getSpellsByLevel(0);
    const level1 = getSpellsByLevel(1);
    const level2 = getSpellsByLevel(2);
    const level3 = getSpellsByLevel(3);

    const spellsData: Record<TabKey, typeof character.spells> = {
        cantrips,
        level1,
        level2,
        level3,
    };

    const currentSpells = spellsData[activeTab].filter(spell =>
        spell.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spell.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spell.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const title = `${activeTab === 'cantrips' ? 'Cantrips' : `Level ${activeTab.replace('level', '')}`} (${currentSpells.length})`;

    const togglePrepared = (spellId: string) => {
        const spell = character.spells.find(s => s.id === spellId);
        if (spell) {
            updateSpell(character.id, spellId, { prepared: !spell.prepared });
        }
    };

    const handleBack = () => navigate(-1);
    const handleAddFromLibrary = () => navigate('/spells');

    return (
        <div className="spellbook-page">
            <header className="spell-header spell-section">
                <button className="spell-back-btn" onClick={handleBack} aria-label="Go back">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.5 10C17.5 10.1658 17.4342 10.3247 17.3169 10.4419C17.1997 10.5592 17.0408 10.625 16.875 10.625H4.6336L9.19219 15.1828C9.25026 15.2409 9.29632 15.3098 9.32775 15.3857C9.35918 15.4616 9.37535 15.5429 9.37535 15.625C9.37535 15.7071 9.35918 15.7884 9.32775 15.8643C9.29632 15.9402 9.25026 16.0091 9.19219 16.0672C9.13412 16.1253 9.06518 16.1713 8.98931 16.2027C8.91344 16.2342 8.83213 16.2503 8.75 16.2503C8.66788 16.2503 8.58656 16.2342 8.51069 16.2027C8.43482 16.1713 8.36588 16.1253 8.30782 16.0672L2.68282 10.4422C2.62471 10.3841 2.57861 10.3152 2.54715 10.2393C2.5157 10.1635 2.49951 10.0821 2.49951 10C2.49951 9.91787 2.5157 9.83654 2.54715 9.76066C2.57861 9.68479 2.62471 9.61586 2.68282 9.55781L8.30782 3.93281C8.42509 3.81554 8.58415 3.74965 8.75 3.74965C8.91586 3.74965 9.07492 3.81554 9.19219 3.93281C9.30947 4.05009 9.37535 4.20915 9.37535 4.375C9.37535 4.54085 9.30947 4.69991 9.19219 4.81719L4.6336 9.375H16.875C17.0408 9.375 17.1997 9.44085 17.3169 9.55806C17.4342 9.67527 17.5 9.83424 17.5 10Z" fill="#9CA3AF" />
                    </svg>
                </button>
                <div className="spell-header-info">
                    <div className="spell-title">Spellbook</div>
                    <div className="spell-subtitle">{character.name}</div>
                </div>
                <button className="btn-add-library" onClick={handleAddFromLibrary}>
                    + Library
                </button>
            </header>

            <div className="spell-stats spell-section">
                <div className="stat-item">
                    <div className="stat-label">Spell Slots</div>
                    <div className="stat-value">8 / 12</div>
                </div>
                <div className="stat-item">
                    <div className="stat-label">Prepared</div>
                    <div className="stat-value">{character.spells.filter(s => s.prepared).length}</div>
                </div>
                <div className="stat-item">
                    <div className="stat-label">Known</div>
                    <div className="stat-value">{character.spells.length}</div>
                </div>
            </div>

            <div className="spell-tabs spell-section">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="spell-content spell-section">
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search spells..."
                />
                <div className="spell-list-title">{title}</div>
                {currentSpells.length === 0 ? (
                    <div className="spell-empty-message">
                        <p>No spells in this level.</p>
                        <button className="btn-add-library" onClick={handleAddFromLibrary}>
                            Add from Library
                        </button>
                    </div>
                ) : (
                    <div className="spell-cards">
                        {currentSpells.map((spell) => (
                            <SpellCard
                                key={spell.id}
                                spell={spell}
                                showPreparedToggle
                                onTogglePrepared={() => togglePrepared(spell.id)}
                                isPrepared={spell.prepared}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SpellbookContainer;