import React from 'react';
import { Campaign } from '../types/Character';
import { formatLastPlayed, getStatusLabel } from '../utils/campaignUtils';

interface CampaignCardProps {
    campaign: Campaign;
    onToggleStatus: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({
                                                       campaign,
                                                       onToggleStatus,
                                                       onEdit,
                                                       onDelete,
                                                   }) => {
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm(`Delete campaign "${campaign.name}"? This action cannot be undone.`)) {
            onDelete(campaign.id);
        }
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(campaign.id);
    };

    return (
        <div className={`cg-card ${campaign.status === 'ended' ? 'cg-card-ended' : ''}`}>
            <div className="cg-card-header">
                <div className="cg-card-thumbnail" />
                <div className="cg-card-info">
                    <div className="cg-card-name">{campaign.name}</div>
                    <div className="cg-card-dm">
                        DM: {campaign.dm || 'Dungeon Master'}
                    </div>
                    {campaign.description && (
                        <div className="cg-card-description">
                            {campaign.description.length > 60
                                ? campaign.description.slice(0, 60) + '...'
                                : campaign.description}
                        </div>
                    )}
                    <div className="cg-card-stats">
                        <div className="cg-stats-group">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.41211 8.63624C6.99847 8.24587 7.44364 7.67717 7.68179 7.01424C7.91994 6.3513 7.93842 5.62932 7.73451 4.95506C7.5306 4.2808 7.11511 3.69007 6.5495 3.27021C5.98388 2.85035 5.29816 2.62366 4.59375 2.62366C3.88933 2.62366 3.20361 2.85035 2.638 3.27021C2.07238 3.69007 1.6569 4.2808 1.45298 4.95506C1.24907 5.62932 1.26756 6.3513 1.50571 7.01424C1.74386 7.67717 2.18903 8.24587 2.77539 8.63624C1.71472 9.02716 0.808883 9.75057 0.193044 10.6985C0.160677 10.7466 0.138195 10.8007 0.126905 10.8575C0.115615 10.9144 0.115741 10.973 0.127277 11.0298C0.138813 11.0866 0.161528 11.1406 0.194101 11.1885C0.226675 11.2365 0.268458 11.2775 0.317021 11.3092C0.365585 11.3408 0.41996 11.3626 0.476985 11.373C0.534011 11.3835 0.592551 11.3825 0.649201 11.3702C0.705851 11.3578 0.759481 11.3344 0.806975 11.3011C0.854469 11.2679 0.894879 11.2255 0.925856 11.1765C1.3231 10.5655 1.86668 10.0634 2.50722 9.71587C3.14776 9.36831 3.86498 9.18626 4.59375 9.18626C5.32251 9.18626 6.03973 9.36831 6.68027 9.71587C7.32082 10.0634 7.86439 10.5655 8.26164 11.1765C8.32581 11.2718 8.42493 11.3381 8.53758 11.361C8.65023 11.3839 8.76735 11.3615 8.86363 11.2987C8.95991 11.2359 9.02761 11.1377 9.05209 11.0254C9.07657 10.9131 9.05586 10.7957 8.99445 10.6985C8.37861 9.75057 7.47277 9.02716 6.41211 8.63624Z" fill="#9CA3AF" />
                            </svg>
                            <span className="cg-stats-text">{campaign.players ?? 0} players</span>
                        </div>
                        <div className="cg-stats-group">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.375 1.75H10.0625V1.3125C10.0625 1.19647 10.0164 1.08519 9.93436 1.00314C9.85231 0.921094 9.74103 0.875 9.625 0.875C9.50897 0.875 9.39769 0.921094 9.31564 1.00314C9.23359 1.08519 9.1875 1.19647 9.1875 1.3125V1.75H4.8125V1.3125C4.8125 1.19647 4.76641 1.08519 4.68436 1.00314C4.60231 0.921094 4.49103 0.875 4.375 0.875C4.25897 0.875 4.14769 0.921094 4.06564 1.00314C3.98359 1.08519 3.9375 1.19647 3.9375 1.3125V1.75H2.625C2.39294 1.75 2.17038 1.84219 2.00628 2.00628C1.84219 2.17038 1.75 2.39294 1.75 2.625V11.375C1.75 11.6071 1.84219 11.8296 2.00628 11.9937C2.17038 12.1578 2.39294 12.25 2.625 12.25H11.375C11.6071 12.25 11.8296 12.1578 11.9937 11.9937C12.1578 11.8296 12.25 11.6071 12.25 11.375V2.625C12.25 2.39294 12.1578 2.17038 11.9937 2.00628C11.8296 1.84219 11.6071 1.75 11.375 1.75Z" fill="#9CA3AF" />
                            </svg>
                            <span className="cg-stats-text">{campaign.sessions ?? 0} sessions</span>
                        </div>
                    </div>
                </div>
                <div className="cg-card-actions">
                    <button
                        className="cg-card-action-btn"
                        onClick={handleEdit}
                        title="Edit campaign"
                    >
                        ✎
                    </button>
                    <button
                        className="cg-card-action-btn cg-card-action-delete"
                        onClick={handleDelete}
                        title="Delete campaign"
                    >
                        ✕
                    </button>
                </div>
            </div>

            <div className="cg-card-footer">
                <span className="cg-card-date">{formatLastPlayed(campaign.lastPlayed)}</span>
                <div
                    className={`cg-card-status ${campaign.status}`}
                    onClick={() => onToggleStatus(campaign.id)}
                    style={{ cursor: 'pointer' }}
                    title="Click to change status"
                >
                    {getStatusLabel(campaign.status)}
                </div>
            </div>
        </div>
    );
};

export default CampaignCard;