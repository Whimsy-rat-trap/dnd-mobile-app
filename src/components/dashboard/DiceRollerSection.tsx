import React from 'react';
import DiceRoller from '../DiceRoller';

interface DiceRollerSectionProps {
    diceTypes: number[];
    logs: Record<number, { result: number; timestamp: number }[]>;
    openSections: Record<number, boolean>;
    toggleSection: (diceType: number) => void;
    getResultColor: (diceType: number, result: number) => string;
    addDiceLog: (characterId: string, sides: number, result: number) => void;
    characterId: string;
}

const DiceRollerSection: React.FC<DiceRollerSectionProps> = ({
                                                                 diceTypes,
                                                                 logs,
                                                                 openSections,
                                                                 toggleSection,
                                                                 getResultColor,
                                                                 addDiceLog,
                                                                 characterId,
                                                             }) => {
    return (
        <div className="db-dice-roller">
            <div className="db-dice-title">Dice Roller</div>
            <div className="db-dice-grid">
                {diceTypes.map((sides, index) => (
                    <DiceRoller
                        key={sides}
                        sides={sides}
                        onRoll={(result) => addDiceLog(characterId, sides, result)}
                    />
                ))}
            </div>

            <div className="db-dice-logs-section">
                {diceTypes.some(type => (logs[type] || []).length > 0) && (
                    <>
                        <div className="db-dice-logs-header">
                            <span className="db-dice-logs-title">Dice Roller Logs</span>
                        </div>
                        {diceTypes.map(sides => (
                            (logs[sides] || []).length > 0 && (
                                <div key={sides} className="db-dice-log-group">
                                    <div
                                        className="db-dice-log-group-header"
                                        onClick={() => toggleSection(sides)}
                                    >
                                        <span className="db-dice-log-type">D{sides}</span>
                                        <svg
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`db-chevron-icon ${openSections[sides] ? 'db-open' : ''}`}
                                        >
                                            <g clipPath="url(#clip0_403_3483)">
                                                <path
                                                    d="M22.586 5.92896L12.707 15.808C12.5169 15.9904 12.2636 16.0923 12 16.0923C11.7365 16.0923 11.4832 15.9904 11.293 15.808L1.42004 5.93396L0.00604248 7.34796L9.87904 17.222C10.4509 17.767 11.2106 18.071 12.0005 18.071C12.7905 18.071 13.5502 17.767 14.122 17.222L24 7.34296L22.586 5.92896Z"
                                                    fill="#374957"
                                                />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_403_3483">
                                                    <rect width="24" height="24" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </div>
                                    {openSections[sides] && (
                                        <div className="db-dice-logs-body">
                                            {logs[sides].map((log, idx) => (
                                                <div key={idx} className="db-log-entry">
                                                    <span className="db-log-dice">D{sides}</span>
                                                    <span className="db-log-result" style={{ color: getResultColor(sides, log.result) }}>
                                                        {log.result}
                                                    </span>
                                                    <span className="db-log-time">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

export default DiceRollerSection;