import React, { useState } from 'react';
import { Character } from '../../types/Character';
import {
    getKnownMetamagic,
    getKnownMetamagicLimit,
    metamagicNeedsSpellLevel,
    getMetamagicSpCost,
} from '../../utils/metamagic';
import { getClassResourceState } from '../../utils/classResources';
import ManageMetamagicModal from './ManageMetamagicModal';
import UseMetamagicModal from './UseMetamagicModal';
import './MetamagicSection.css';

interface Props {
    character: Character;
    onSpendSorceryPoints: (amount: number) => boolean;
}

const MetamagicSection: React.FC<Props> = ({ character, onSpendSorceryPoints }) => {
    const [manageOpen, setManageOpen] = useState(false);
    const [usingMetamagicId, setUsingMetamagicId] = useState<string | null>(null);

    const limit = getKnownMetamagicLimit(character);
    if (limit === 0) return null;

    const known = getKnownMetamagic(character);
    const spState = getClassResourceState(character, 'sorcery-points');
    const spAvailable = spState?.availableUses ?? 0;
    const spMax = spState?.maxUses ?? 0;

    return (
        <div className="mgs-container">
            <div className="mgs-header">
                <div className="mgs-title-wrap">
                    <span className="mgs-title">Metamagic</span>
                    <span className="mgs-sp">
                        {spAvailable} / {spMax} SP
                    </span>
                </div>
                <button
                    type="button"
                    className="mgs-manage-btn"
                    onClick={() => setManageOpen(true)}
                >
                    Manage ({known.length}/{limit})
                </button>
            </div>

            {known.length === 0 ? (
                <div className="mgs-empty">
                    No Metamagic known. Click <strong>Manage</strong> to pick some.
                </div>
            ) : (
                <div className="mgs-list">
                    {known.map(m => {
                        const cost = getMetamagicSpCost(m);
                        const costLabel = metamagicNeedsSpellLevel(m)
                            ? '= spell level SP'
                            : `${cost} SP`;
                        const canAfford = metamagicNeedsSpellLevel(m)
                            ? spAvailable >= 1
                            : spAvailable >= cost;

                        return (
                            <div key={m.id} className="mgs-item">
                                <div className="mgs-item-header">
                                    <span className="mgs-item-name">{m.name}</span>
                                    <span className="mgs-item-cost">{costLabel}</span>
                                </div>
                                <span className="mgs-item-desc">{m.description}</span>
                                <button
                                    type="button"
                                    className="mgs-use-btn"
                                    disabled={!canAfford}
                                    onClick={() => setUsingMetamagicId(m.id)}
                                    title={
                                        !canAfford
                                            ? 'Not enough Sorcery Points'
                                            : `Spend ${costLabel}`
                                    }
                                >
                                    Use
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            <ManageMetamagicModal
                isOpen={manageOpen}
                onClose={() => setManageOpen(false)}
                character={character}
            />

            <UseMetamagicModal
                isOpen={usingMetamagicId !== null}
                onClose={() => setUsingMetamagicId(null)}
                metamagicId={usingMetamagicId}
                onConfirm={(spCost) => onSpendSorceryPoints(spCost)}
            />
        </div>
    );
};

export default MetamagicSection;