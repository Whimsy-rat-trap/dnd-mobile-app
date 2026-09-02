import React from 'react';
import { DND_CLASSES } from '../../constants/classes';

interface ClassLevelsSectionProps {
    classLevels: { className: string; level: number }[];
    onAddExtraClass: () => void;
    onRemoveExtraClass: (index: number) => void;
    onUpdateExtraClass: (index: number, field: 'className' | 'level', value: string | number) => void;
    totalLevel: number;
}

const ClassLevelsSection: React.FC<ClassLevelsSectionProps> = ({
                                                                   classLevels,
                                                                   onAddExtraClass,
                                                                   onRemoveExtraClass,
                                                                   onUpdateExtraClass,
                                                                   totalLevel,
                                                               }) => {
    return (
        <div className="cr-multiclass-section">
            <label>Class Levels</label>
            {classLevels.map((cl, index) => (
                <div key={index} className="cr-multiclass-row">
                    <select
                        value={cl.className}
                        onChange={(e) => onUpdateExtraClass(index, 'className', e.target.value)}
                        disabled={index === 0}
                    >
                        {DND_CLASSES.map(cls => (
                            <option key={cls} value={cls}>{cls}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        min="1"
                        max="20"
                        value={cl.level}
                        onChange={(e) => onUpdateExtraClass(index, 'level', Number(e.target.value))}
                    />
                    {index > 0 && (
                        <button type="button" className="cr-remove-class-btn" onClick={() => onRemoveExtraClass(index)}>
                            ✕
                        </button>
                    )}
                </div>
            ))}
            <button type="button" className="cr-add-class-btn" onClick={onAddExtraClass}>
                + Add Class
            </button>
            <div className="cr-total-level-display">Total Level: {totalLevel}</div>
        </div>
    );
};

export default ClassLevelsSection;