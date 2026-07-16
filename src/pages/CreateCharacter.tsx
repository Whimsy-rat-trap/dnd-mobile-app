import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacters } from '../context/CharacterContext';
import { DND_CLASSES } from '../constants/classes';
import { DND_RACES } from '../constants/races';
import { DND_BACKGROUNDS } from '../constants/backgrounds';
import './CreateCharacter.css';

const CreateCharacter: React.FC = () => {
    const navigate = useNavigate();
    const { addCharacter } = useCharacters();
    const today = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        name: '',
        class: DND_CLASSES[0],
        race: DND_RACES[0],
        background: DND_BACKGROUNDS[0],
        level: 1,
        hp: 10,
        maxHp: 10,
        tempHp: 0,
        exp: 0,
        ac: 10,
        speed: 30,
        abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: ['level', 'hp', 'maxHp', 'tempHp', 'exp', 'ac', 'speed'].includes(name)
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
            classes: [formData.class],
            status: 'active' as const,
            created: today,
            lastUsed: today,
            died: undefined,
            archived: undefined,
            diceLogs: {},
            deathSuccesses: 0,
            deathFailures: 0,
            isStable: false,
            skills: [],
            inventory: [],
            spells: [],
            quests: [],
            campaigns: [],
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
                        <select name="class" value={formData.class} onChange={handleChange} required>
                            {DND_CLASSES.map(cls => (
                                <option key={cls} value={cls}>{cls}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Race *</label>
                        <select name="race" value={formData.race} onChange={handleChange} required>
                            {DND_RACES.map(race => (
                                <option key={race} value={race}>{race}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Background *</label>
                        <select name="background" value={formData.background} onChange={handleChange} required>
                            {DND_BACKGROUNDS.map(bg => (
                                <option key={bg} value={bg}>{bg}</option>
                            ))}
                        </select>
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