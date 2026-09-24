import React from 'react';
import './LanguagesSection.css';

interface LanguagesSectionProps {
    languages: string[];
}

const LanguagesSection: React.FC<LanguagesSectionProps> = ({ languages }) => {
    const hasLanguages = languages && languages.length > 0;

    return (
        <div className="cc-section-languages">
            <div className="cc-languages-title">Languages</div>
            {hasLanguages ? (
                <div className="cc-languages-grid">
                    {languages.map((lang, index) => (
                        <span key={`${lang}-${index}`} className="cc-language-tag">
                            {lang}
                        </span>
                    ))}
                </div>
            ) : (
                <div className="cc-languages-empty">No languages</div>
            )}
        </div>
    );
};

export default LanguagesSection;