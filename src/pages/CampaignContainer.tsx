import React from 'react';
import { useCharacters } from '../context/CharacterContext';
import './CampaignContainer.css';

const CampaignContainer: React.FC = () => {
    const { currentCharacterId, getCharacter } = useCharacters();
    const character = currentCharacterId ? getCharacter(currentCharacterId) : undefined;

    if (!character) return <div>No character selected</div>;

    return (
        <div className="campaign-page">
            <h2>Campaigns for {character.name}</h2>
            {character.campaigns.map(campaign => (
                <div key={campaign.id} className="campaign-card">
                    <h3>{campaign.name}</h3>
                    <p>{campaign.description}</p>
                    <span>Status: {campaign.status}</span>
                </div>
            ))}
        </div>
    );
};

export default CampaignContainer;