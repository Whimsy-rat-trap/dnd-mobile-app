import React from 'react';
import { Link } from 'react-router-dom';
import './Hub.css';

const Hub: React.FC = () => {
    // Моковые данные персонажей
    const characters = [
        { id: 1, name: 'Aelar Dawn', class: 'Wizard', level: 7 },
        { id: 2, name: 'Thorin Oakenshield', class: 'Fighter', level: 5 },
        { id: 3, name: 'Luna Silvermoon', class: 'Cleric', level: 6 },
    ];

    // Моковые данные кампаний
    const campaigns = [
        { id: 1, name: 'Curse of Strahd', status: 'active', description: 'Ravenloft' },
        { id: 2, name: 'Lost Mine of Phandelver', status: 'active', description: 'Phandalin' },
        { id: 3, name: 'Dragon Heist', status: 'inactive', description: 'Waterdeep' },
    ];

    return (
        <div className="page hub-page">
            <div className="hub-header">
                <div className="header-top">
                    <span className="header-title">Hub</span>
                </div>
                <div className="header-subtitle">Select a character or explore campaigns</div>
            </div>

            <div className="hub-content">
                {/* Секция персонажей */}
                <div className="hub-section">
                    <div className="section-header">
                        <span className="section-title">Your Characters</span>
                        <Link to="/characters" className="view-all-link">View all</Link>
                    </div>
                    <div className="character-grid">
                        {characters.map((char) => (
                            <Link
                                to={`/character/${char.id}`}
                                key={char.id}
                                className="character-card-link"
                                style={{ textDecoration: 'none' }}
                            >
                                <div className="character-card-hub">
                                    <div className="character-card-header">
                                        <div className="avatar-small">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="white"/>
                                            </svg>
                                        </div>
                                        <div className="character-info-hub">
                                            <div className="character-name-hub">{char.name}</div>
                                            <div className="character-class-hub">{char.class} • Level {char.level}</div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Секция кампаний */}
                <div className="hub-section">
                    <div className="section-header">
                        <span className="section-title">Campaigns</span>
                        <Link to="/campaigns" className="view-all-link">View all</Link>
                    </div>
                    <div className="campaigns-grid">
                        {campaigns.map((camp) => (
                            <Link
                                to={`/campaign/${camp.id}`}
                                key={camp.id}
                                className="campaign-card-link"
                                style={{ textDecoration: 'none' }}
                            >
                                <div className={`campaign-card-hub ${camp.status !== 'active' ? 'inactive' : ''}`}>
                                    <div className="campaign-name-hub">{camp.name}</div>
                                    <div className="campaign-description-hub">{camp.description}</div>
                                    <div className="campaign-status-hub">{camp.status}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hub;