import React from 'react';
import { DND_BACKGROUNDS } from '../../constants/backgrounds';

interface BackgroundSectionProps {
    background: string;
    onBackgroundChange: (value: string) => void;
    size: string;
    onSizeChange: (value: string) => void;
    sizeOptions?: string[];
}

const BackgroundSection: React.FC<BackgroundSectionProps> = ({
                                                                 background,
                                                                 onBackgroundChange,
                                                                 size,
                                                                 onSizeChange,
                                                                 sizeOptions,
                                                             }) => {
    return (
        <>
            <div className="cr-form-row">
                <div className="cr-form-group">
                    <label>Background *</label>
                    <select
                        name="background"
                        value={background}
                        onChange={(e) => onBackgroundChange(e.target.value)}
                        required
                    >
                        {DND_BACKGROUNDS.map(bg => (
                            <option key={bg.name} value={bg.name}>{bg.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Размер (если выбор) */}
            {sizeOptions && sizeOptions.length > 0 && (
                <div className="cr-form-group">
                    <label>Size</label>
                    <select
                        value={size}
                        onChange={(e) => onSizeChange(e.target.value)}
                    >
                        {sizeOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>
            )}
        </>
    );
};

export default BackgroundSection;