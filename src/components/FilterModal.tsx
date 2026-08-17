import React from 'react';
import Modal from './Modal';
import './FilterModal.css';

export interface FilterField {
    key: string;
    label: string;
    type: 'text' | 'select' | 'number' | 'range' | 'date' | 'boolean' | 'tags';
    options?: { value: string; label: string }[];
    min?: number;
    max?: number;
    placeholder?: string;
}

export interface FilterValues {
    [key: string]: any;
}

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    filters: FilterValues;
    onFilterChange: (newFilters: FilterValues) => void;
    fields: FilterField[];
    onReset?: () => void;
    title?: string;
}

const FilterModal: React.FC<FilterModalProps> = ({
                                                     isOpen,
                                                     onClose,
                                                     filters,
                                                     onFilterChange,
                                                     fields,
                                                     onReset,
                                                     title = 'Filter',
                                                 }) => {
    const handleChange = (key: string, value: any) => {
        onFilterChange({ ...filters, [key]: value });
    };

    const toggleTag = (key: string, tag: string) => {
        const current = filters[key] || [];
        const newValue = current.includes(tag)
            ? current.filter((t: string) => t !== tag)
            : [...current, tag];
        handleChange(key, newValue);
    };

    const removeTag = (key: string, tag: string) => {
        const current = filters[key] || [];
        handleChange(key, current.filter((t: string) => t !== tag));
    };

    const handleReset = () => {
        if (onReset) {
            onReset();
        } else {
            const resetValues: FilterValues = {};
            fields.forEach(field => {
                if (field.type === 'range') {
                    resetValues[field.key] = { min: field.min || 0, max: field.max || 100 };
                } else if (field.type === 'boolean') {
                    resetValues[field.key] = false;
                } else if (field.type === 'select') {
                    resetValues[field.key] = '';
                } else if (field.type === 'tags') {
                    resetValues[field.key] = [];
                } else {
                    resetValues[field.key] = '';
                }
            });
            onFilterChange(resetValues);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h3>{title}</h3>
            {fields.map(field => (
                <div key={field.key} className="filter-group">
                    <label>{field.label}</label>
                    {field.type === 'select' && (
                        <select
                            value={filters[field.key] || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                        >
                            {field.options?.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    )}
                    {field.type === 'text' && (
                        <input
                            type="text"
                            value={filters[field.key] || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            placeholder={field.placeholder || ''}
                        />
                    )}
                    {field.type === 'number' && (
                        <input
                            type="number"
                            value={filters[field.key] || ''}
                            onChange={(e) => handleChange(field.key, Number(e.target.value))}
                            min={field.min}
                            max={field.max}
                        />
                    )}
                    {field.type === 'range' && (
                        <div className="range-inputs">
                            <input
                                type="number"
                                value={filters[field.key]?.min ?? field.min ?? 0}
                                onChange={(e) => handleChange(field.key, { ...filters[field.key], min: Number(e.target.value) })}
                            />
                            <span>to</span>
                            <input
                                type="number"
                                value={filters[field.key]?.max ?? field.max ?? 100}
                                onChange={(e) => handleChange(field.key, { ...filters[field.key], max: Number(e.target.value) })}
                            />
                        </div>
                    )}
                    {field.type === 'date' && (
                        <input
                            type="date"
                            value={filters[field.key] || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                        />
                    )}
                    {field.type === 'boolean' && (
                        <label className="boolean-filter">
                            <input
                                type="checkbox"
                                checked={filters[field.key] || false}
                                onChange={(e) => handleChange(field.key, e.target.checked)}
                            />
                            {field.label}
                        </label>
                    )}
                    {field.type === 'tags' && (
                        <div className="filter-tags">
                            <div className="filter-tags-list">
                                {(filters[field.key] || []).map((tag: string) => (
                                    <span key={tag} className="filter-tag">
                                        {tag}
                                        <button
                                            type="button"
                                            className="filter-tag-remove"
                                            onClick={() => removeTag(field.key, tag)}
                                        >
                                            ✕
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="filter-tags-options">
                                {field.options?.map(opt => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        className={`filter-tag-btn ${(filters[field.key] || []).includes(opt.value) ? 'active' : ''}`}
                                        onClick={() => toggleTag(field.key, opt.value)}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ))}
            <div className="modal-actions">
                <button className="modal-btn cancel" onClick={handleReset}>Reset</button>
                <button className="modal-btn apply" onClick={onClose}>Apply</button>
            </div>
        </Modal>
    );
};

export default FilterModal;