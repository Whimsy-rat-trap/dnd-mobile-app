import React, { useState } from 'react';
import { Character } from '../../types/Character';
import {
    getKnownManeuvers,
    getKnownManeuversLimit,
    getManeuverSaveDC,
} from '../../utils/maneuvers';
import {
    getClassResourceState,
} from '../../utils/classResources';
import ManageManeuversModal from './ManageManeuversModal';
import UseManeuverModal from './UseManeuverModal';
import './ManeuversSection.css';

interface Props {
    character: Character;
    onSpendSuperiorityDie: () => boolean;
}

const ManeuversSection: React.FC<Props> = ({ character, onSpendSuperiorityDie }) => {
    const [manageOpen, setManageOpen] = useState(false);
    const [usingManeuverId, setUsingManeuverId] = useState<string | null>(null);

    const limit = getKnownManeuversLimit(character);
    if (limit === 0) return null;

    const known = getKnownManeuvers(character);
    const saveDC = getManeuverSaveDC(character);
    const superState = getClassResourceState(character, 'superiority-dice');
    const availableDice = superState?.availableUses ?? 0;
    const dieSize = superState?.dieSize ?? 0;

    return (
        <div className="mns-container">
            <div className="mns-header">
                <div className="mns-title-wrap">
                    <span className="mns-title">Maneuvers</span>
                    <span className="mns-save-dc">Save DC {saveDC}</span>
                </div>
                <button
                    type="button"
                    className="mns-manage-btn"
                    onClick={() => setManageOpen(true)}
                >
                    Manage ({known.length}/{limit})
                </button>
            </div>

            {known.length === 0 ? (
                <div className="mns-empty">
                    No maneuvers known. Click <strong>Manage</strong> to pick some.
                </div>
            ) : (
                <div className="mns-list">
                    {known.map(m => (
                        <div key={m.id} className="mns-maneuver">
                            <div className="mns-maneuver-header">
                                <span className="mns-maneuver-name">{m.name}</span>
                                <span className="mns-maneuver-source">
                                    {m.source === 'TCE' ? 'Tasha\'s' : 'PHB'}
                                </span>
                            </div>
                            <span className="mns-maneuver-desc">{m.description}</span>
                            <button
                                type="button"
                                className="mns-use-btn"
                                disabled={availableDice === 0 || dieSize === 0}
                                onClick={() => setUsingManeuverId(m.id)}
                                title={
                                    availableDice === 0
                                        ? 'No superiority dice left'
                                        : `Spend 1 superiority die (d${dieSize})`
                                }
                            >
                                Use {dieSize > 0 ? `(d${dieSize})` : ''}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <ManageManeuversModal
                isOpen={manageOpen}
                onClose={() => setManageOpen(false)}
                character={character}
            />

            <UseManeuverModal
                isOpen={usingManeuverId !== null}
                onClose={() => setUsingManeuverId(null)}
                character={character}
                maneuverId={usingManeuverId}
                dieSize={dieSize}
                saveDC={saveDC}
                onUse={onSpendSuperiorityDie}
            />
        </div>
    );
};

export default ManeuversSection;