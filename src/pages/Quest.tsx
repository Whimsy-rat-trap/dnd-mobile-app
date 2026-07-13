import React from 'react';
import { useCharacters } from '../context/CharacterContext';
import './Quest.css';

const Quest: React.FC = () => {
    const { currentCharacterId, getCharacter } = useCharacters();
    const character = currentCharacterId ? getCharacter(currentCharacterId) : undefined;

    if (!character) return <div>No character selected</div>;

    return (
        <div className="page quest-page">
            <h2>Quests for {character.name}</h2>
            {character.quests.map(quest => (
                <div key={quest.id} className="quest-item">
                    <h3>{quest.name}</h3>
                    <p>{quest.description}</p>
                    <span>Status: {quest.status}</span>
                </div>
            ))}
        </div>
    );
};

export default Quest;