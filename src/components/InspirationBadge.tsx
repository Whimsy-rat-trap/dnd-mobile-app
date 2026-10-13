import React from 'react';
import './InspirationBadge.css';

interface InspirationBadgeProps {
    hasInspiration: boolean;
    onGrant: () => void;
    onSpend: () => void;
    size?: 'sm' | 'md';
    disabled?: boolean;
}

const InspirationBadge: React.FC<InspirationBadgeProps> = ({
                                                               hasInspiration,
                                                               onGrant,
                                                               onSpend,
                                                               size = 'md',
                                                               disabled = false,
                                                           }) => {
    const handleClick = () => {
        if (disabled) return;
        if (hasInspiration) onSpend();
        else onGrant();
    };

    return (
        <button
            type="button"
            className={`insp-badge insp-${size} ${hasInspiration ? 'insp-active' : 'insp-empty'}`}
            onClick={handleClick}
            disabled={disabled}
            title={
                hasInspiration
                    ? 'Inspiration available — click to spend'
                    : 'No inspiration — click to grant'
            }
            aria-label={hasInspiration ? 'Spend inspiration' : 'Grant inspiration'}
        >
            <svg width={size === 'sm' ? 16 : 20} height={size === 'sm' ? 16 : 20} viewBox="0 0 24 24">
                <path
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    fill={hasInspiration ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                />
            </svg>
        </button>
    );
};

export default InspirationBadge;