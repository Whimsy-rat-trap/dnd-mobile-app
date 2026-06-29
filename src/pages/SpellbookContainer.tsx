import React, { useState } from 'react';
import './SpellbookContainer.css';

type TabKey = 'cantrips' | 'level1' | 'level2' | 'level3';

interface Spell {
    id: string;
    name: string;
    level: number;
    school: string;
}

const SpellbookContainer: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabKey>('cantrips');

    const handleBack = () => {
        console.log('Back button clicked');
    };

    const tabs: { id: TabKey; label: string }[] = [
        { id: 'cantrips', label: 'Cantrips' },
        { id: 'level1', label: 'Level 1' },
        { id: 'level2', label: 'Level 2' },
        { id: 'level3', label: 'Level 3' },
    ];

    const spellsData: Record<TabKey, Spell[]> = {
        cantrips: [
            { id: '1', name: 'Acid Splash', level: 0, school: 'Conjuration' },
            { id: '2', name: 'Blade Ward', level: 0, school: 'Abjuration' },
            { id: '3', name: 'Dancing Lights', level: 0, school: 'Evocation' },
            { id: '4', name: 'Fire Bolt', level: 0, school: 'Evocation' },
        ],
        level1: [
            { id: '5', name: 'Chromatic Orb', level: 1, school: 'Evocation' },
            { id: '6', name: 'Magic Missile', level: 1, school: 'Evocation' },
            { id: '7', name: 'Shield', level: 1, school: 'Abjuration' },
        ],
        level2: [
            { id: '8', name: 'Invisibility', level: 2, school: 'Illusion' },
            { id: '9', name: 'Misty Step', level: 2, school: 'Conjuration' },
            { id: '10', name: 'Scorching Ray', level: 2, school: 'Evocation' },
        ],
        level3: [
            { id: '11', name: 'Counterspell', level: 3, school: 'Abjuration' },
            { id: '12', name: 'Fireball', level: 3, school: 'Evocation' },
            { id: '13', name: 'Haste', level: 3, school: 'Transmutation' },
        ],
    };

    const currentSpells = spellsData[activeTab];
    const title = `${activeTab === 'cantrips' ? 'Cantrips' : `Level ${activeTab.replace('level', '')}`} (${currentSpells.length})`;

    return (
        <div className="spellbook-page">
            {/* Spell Header */}
            <header className="spell-header spell-section">
                <button className="spell-back-btn" onClick={handleBack} aria-label="Go back">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.5 10C17.5 10.1658 17.4342 10.3247 17.3169 10.4419C17.1997 10.5592 17.0408 10.625 16.875 10.625H4.6336L9.19219 15.1828C9.25026 15.2409 9.29632 15.3098 9.32775 15.3857C9.35918 15.4616 9.37535 15.5429 9.37535 15.625C9.37535 15.7071 9.35918 15.7884 9.32775 15.8643C9.29632 15.9402 9.25026 16.0091 9.19219 16.0672C9.13412 16.1253 9.06518 16.1713 8.98931 16.2027C8.91344 16.2342 8.83213 16.2503 8.75 16.2503C8.66788 16.2503 8.58656 16.2342 8.51069 16.2027C8.43482 16.1713 8.36588 16.1253 8.30782 16.0672L2.68282 10.4422C2.62471 10.3841 2.57861 10.3152 2.54715 10.2393C2.5157 10.1635 2.49951 10.0821 2.49951 10C2.49951 9.91787 2.5157 9.83654 2.54715 9.76066C2.57861 9.68479 2.62471 9.61586 2.68282 9.55781L8.30782 3.93281C8.42509 3.81554 8.58415 3.74965 8.75 3.74965C8.91586 3.74965 9.07492 3.81554 9.19219 3.93281C9.30947 4.05009 9.37535 4.20915 9.37535 4.375C9.37535 4.54085 9.30947 4.69991 9.19219 4.81719L4.6336 9.375H16.875C17.0408 9.375 17.1997 9.44085 17.3169 9.55806C17.4342 9.67527 17.5 9.83424 17.5 10Z" fill="#9CA3AF" />
                    </svg>
                </button>
                <div className="spell-header-info">
                    <div className="spell-title">Spellbook</div>
                    <div className="spell-subtitle">Arcane Arsenal</div>
                </div>
            </header>

            {/* Spell Stats */}
            <div className="spell-stats spell-section">
                <div className="stat-item">
                    <div className="stat-label">Spell Slots</div>
                    <div className="stat-value">8 / 12</div>
                </div>
                <div className="stat-item">
                    <div className="stat-label">Prepared</div>
                    <div className="stat-value">12</div>
                </div>
                <div className="stat-item">
                    <div className="stat-label">Known</div>
                    <div className="stat-value">18</div>
                </div>
            </div>

            {/* Spell Tabs */}
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

            {/* Spell Content */}
            <div className="spell-content spell-section">
                <div className="spell-list-title">{title}</div>
                <div className="spell-cards">
                    {currentSpells.map((spell) => (
                        <div key={spell.id} className="spell-card">
                            {/* Header */}
                            <div className="spell-card-header">
                                <div className="spell-card-left">
                                    <div className="spell-card-icon">
                                        {/* Здесь будет иконка */}
                                    </div>
                                    <div className="spell-card-info">
                                        <div className="spell-card-name">{spell.name}</div>
                                        <div className="spell-card-school">{spell.school}</div>
                                    </div>
                                </div>
                                <div className="spell-card-prepared">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14.5306 5.03063L6.5306 13.0306C6.46092 13.1005 6.37813 13.156 6.28696 13.1939C6.1958 13.2317 6.09806 13.2512 5.99935 13.2512C5.90064 13.2512 5.8029 13.2317 5.71173 13.1939C5.62057 13.156 5.53778 13.1005 5.4681 13.0306L1.9681 9.53063C1.89833 9.46087 1.84299 9.37804 1.80524 9.28689C1.76748 9.19574 1.74805 9.09804 1.74805 8.99938C1.74805 8.90072 1.76748 8.80302 1.80524 8.71187C1.84299 8.62072 1.89833 8.53789 1.9681 8.46813C2.03786 8.39837 2.12069 8.34302 2.21184 8.30527C2.30299 8.26751 2.40069 8.24808 2.49935 8.24808C2.59801 8.24808 2.69571 8.26751 2.78686 8.30527C2.87801 8.34302 2.96083 8.39837 3.0306 8.46813L5.99997 11.4375L13.4693 3.96938C13.6102 3.82848 13.8013 3.74933 14.0006 3.74933C14.1999 3.74933 14.391 3.82848 14.5318 3.96938C14.6727 4.11028 14.7519 4.30137 14.7519 4.50063C14.7519 4.69989 14.6727 4.89098 14.5318 5.03188L14.5306 5.03063Z" fill="white" />
                                    </svg>
                                </div>
                            </div>
                            {/* Details */}
                            <div className="spell-card-details">
                                <div className="spell-card-row">

                                </div>
                                <div className="spell-card-description">

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SpellbookContainer;