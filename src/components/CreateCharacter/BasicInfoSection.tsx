import React from 'react';

interface BasicInfoSectionProps {
    // Имя
    name: string;
    onNameChange: (value: string) => void;

    // Класс
    characterClass: string;
    onClassChange: (value: string) => void;
    classOptions: string[];

    // Подкласс
    subclass: string;
    onSubclassChange: (value: string) => void;
    subclassOptions: string[];

    // Раса
    race: string;
    onRaceChange: (value: string) => void;
    raceOptions: string[];

    // Подраса
    subrace: string;
    onSubraceChange: (value: string) => void;
    subraceOptions: string[];
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
                                                               name,
                                                               onNameChange,
                                                               characterClass,
                                                               onClassChange,
                                                               classOptions,
                                                               subclass,
                                                               onSubclassChange,
                                                               subclassOptions,
                                                               race,
                                                               onRaceChange,
                                                               raceOptions,
                                                               subrace,
                                                               onSubraceChange,
                                                               subraceOptions,
                                                           }) => {
    return (
        <>
            {/* Имя */}
            <div className="cr-form-group">
                <label>Name *</label>
                <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                    required
                />
            </div>

            {/* Класс и Раса */}
            <div className="cr-form-row">
                <div className="cr-form-group">
                    <label>Class *</label>
                    <select
                        name="class"
                        value={characterClass}
                        onChange={(e) => onClassChange(e.target.value)}
                        required
                    >
                        {classOptions.map(cls => (
                            <option key={cls} value={cls}>{cls}</option>
                        ))}
                    </select>
                </div>
                <div className="cr-form-group">
                    <label>Race *</label>
                    <select
                        name="race"
                        value={race}
                        onChange={(e) => onRaceChange(e.target.value)}
                        required
                    >
                        {raceOptions.map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Subclass (если есть) */}
            {subclassOptions && subclassOptions.length > 0 && (
                <div className="cr-form-group">
                    <label>Subclass</label>
                    <select
                        value={subclass}
                        onChange={(e) => onSubclassChange(e.target.value)}
                    >
                        <option value="">Select subclass</option>
                        {subclassOptions.map(sub => (
                            <option key={sub} value={sub}>{sub}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Subrace (если есть) */}
            {subraceOptions && subraceOptions.length > 0 && (
                <div className="cr-form-group">
                    <label>Subrace</label>
                    <select
                        value={subrace}
                        onChange={(e) => onSubraceChange(e.target.value)}
                    >
                        <option value="">Select subrace</option>
                        {subraceOptions.map(sub => (
                            <option key={sub} value={sub}>{sub}</option>
                        ))}
                    </select>
                </div>
            )}
        </>
    );
};

export default BasicInfoSection;