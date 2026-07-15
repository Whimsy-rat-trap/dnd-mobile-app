import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacters } from '../context/CharacterContext';
import './CreateCharacter.css';

const CreateCharacter: React.FC = () => {
    const navigate = useNavigate();
    const { addCharacter } = useCharacters();

    const defaultSkills = [
        { name: 'Acrobatics', attribute: 'DEX', proficient: false },
        { name: 'Animal Handling', attribute: 'WIS', proficient: false },
        { name: 'Arcana', attribute: 'INT', proficient: false },
        { name: 'Athletics', attribute: 'STR', proficient: false },
        { name: 'Deception', attribute: 'CHA', proficient: false },
        { name: 'History', attribute: 'INT', proficient: false },
        { name: 'Insight', attribute: 'WIS', proficient: false },
        { name: 'Intimidation', attribute: 'CHA', proficient: false },
        { name: 'Investigation', attribute: 'INT', proficient: false },
        { name: 'Medicine', attribute: 'WIS', proficient: false },
        { name: 'Nature', attribute: 'INT', proficient: false },
        { name: 'Perception', attribute: 'WIS', proficient: false },
        { name: 'Performance', attribute: 'CHA', proficient: false },
        { name: 'Persuasion', attribute: 'CHA', proficient: false },
        { name: 'Religion', attribute: 'INT', proficient: false },
        { name: 'Sleight of Hand', attribute: 'DEX', proficient: false },
        { name: 'Stealth', attribute: 'DEX', proficient: false },
        { name: 'Survival', attribute: 'WIS', proficient: false },
    ];

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const [formData, setFormData] = useState({
        name: '',
        class: '',
        race: '',
        background: '',
        level: 1,
        hp: 10,
        maxHp: 10,
        tempHp: 0,
        exp: 0,
        ac: 10,
        speed: 30,
        abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
        skills: defaultSkills,
        inventory: [],
        spells: [],
        quests: [],
        campaigns: [],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'level' || name === 'hp' || name === 'maxHp' || name === 'tempHp' || name === 'exp' || name === 'ac' || name === 'speed'
                ? Number(value)
                : value,
        }));
    };

    const handleAbilityChange = (ability: keyof typeof formData.abilities, value: number) => {
        setFormData(prev => ({
            ...prev,
            abilities: { ...prev.abilities, [ability]: value },
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newCharacter = {
            ...formData,
            status: 'active' as const,
            created: today,
            lastUsed: today,
            died: undefined,
            archived: undefined,
            diceLogs: {},
            deathSuccesses: 0,
            deathFailures: 0,
            isStable: false,
        };
        addCharacter(newCharacter);
        navigate('/hub');
    };

    return (
        <div className="page create-character-page">
            <div className="create-character-header">
                <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
                <h1>Create Character</h1>
            </div>

            <form onSubmit={handleSubmit} className="create-character-form">
                <div className="form-group">
                    <label>Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Class *</label>
                        <input type="text" name="class" value={formData.class} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Race *</label>
                        <input type="text" name="race" value={formData.race} onChange={handleChange} required />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Background</label>
                        <input type="text" name="background" value={formData.background} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Level *</label>
                        <input type="number" name="level" value={formData.level} onChange={handleChange} min="1" required />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>HP *</label>
                        <input type="number" name="hp" value={formData.hp} onChange={handleChange} min="0" required />
                    </div>
                    <div className="form-group">
                        <label>Max HP *</label>
                        <input type="number" name="maxHp" value={formData.maxHp} onChange={handleChange} min="0" required />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>AC</label>
                        <input type="number" name="ac" value={formData.ac} onChange={handleChange} min="0" />
                    </div>
                    <div className="form-group">
                        <label>Speed (ft)</label>
                        <input type="number" name="speed" value={formData.speed} onChange={handleChange} min="0" />
                    </div>
                </div>

                <div className="form-group">
                    <label>Ability Scores</label>
                    <div className="ability-grid">
                        {Object.entries(formData.abilities).map(([key, value]) => (
                            <div key={key} className="ability-input">
                                <label>{key.toUpperCase()}</label>
                                <input
                                    type="number"
                                    value={value}
                                    onChange={(e) =>
                                        handleAbilityChange(key as keyof typeof formData.abilities, Number(e.target.value))
                                    }
                                    min="1"
                                    max="30"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit" className="submit-btn">Create Character</button>
            </form>
        </div>
    );
};

export default CreateCharacter;