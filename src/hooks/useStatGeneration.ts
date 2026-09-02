import { useState } from 'react';
import { roll4d6DropLowest, standardArray, getPointBuyCost, POINT_BUY_POINTS } from '../utils/characterCreationUtils';

type Abilities = { str: number; dex: number; con: number; int: number; wis: number; cha: number };

export const useStatGeneration = (initialAbilities: Abilities, onApplyAbilities: (newAbilities: Abilities) => void) => {
    // Point Buy
    const [showPointBuy, setShowPointBuy] = useState(false);
    const [pointBuyValues, setPointBuyValues] = useState<Abilities>({
        str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8
    });

    // Roll Distribution
    const [showRollDistribution, setShowRollDistribution] = useState(false);
    const [rollValues, setRollValues] = useState<number[]>([]);
    const [statAssignments, setStatAssignments] = useState<{ [key: string]: number | null }>({
        str: null, dex: null, con: null, int: null, wis: null, cha: null
    });

    // --- Point Buy logic ---
    const getRemainingPoints = (): number => {
        const totalCost = Object.values(pointBuyValues).reduce((sum, val) => sum + getPointBuyCost(val), 0);
        return POINT_BUY_POINTS - totalCost;
    };

    const canIncrease = (stat: keyof Abilities): boolean => {
        const current = pointBuyValues[stat];
        if (current >= 15) return false;
        const nextCost = getPointBuyCost(current + 1);
        const currentCost = getPointBuyCost(current);
        const diff = nextCost - currentCost;
        return getRemainingPoints() >= diff;
    };

    const canDecrease = (stat: keyof Abilities): boolean => {
        return pointBuyValues[stat] > 8;
    };

    const handlePointBuyChange = (stat: keyof Abilities, delta: number) => {
        if (delta > 0 && !canIncrease(stat)) return;
        if (delta < 0 && !canDecrease(stat)) return;
        const newVal = pointBuyValues[stat] + delta;
        if (newVal < 8 || newVal > 15) return;
        const newCost = getPointBuyCost(newVal);
        const oldCost = getPointBuyCost(pointBuyValues[stat]);
        const diff = newCost - oldCost;
        if (diff > getRemainingPoints()) return;
        setPointBuyValues(prev => ({ ...prev, [stat]: newVal }));
    };

    const applyPointBuy = () => {
        onApplyAbilities(pointBuyValues);
        setShowPointBuy(false);
    };

    const resetPointBuy = () => {
        setPointBuyValues({ str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 });
        setShowPointBuy(true);
    };

    // --- Standard Array ---
    const applyStandardArray = () => {
        onApplyAbilities(standardArray());
    };

    // --- Roll Distribution ---
    const handleRollStats = () => {
        const stats = Array.from({ length: 6 }, () => roll4d6DropLowest());
        setRollValues(stats);
        setStatAssignments({ str: null, dex: null, con: null, int: null, wis: null, cha: null });
        setShowRollDistribution(true);
    };

    const assignRollToStat = (stat: keyof typeof statAssignments, index: number) => {
        const usedIndices = Object.values(statAssignments).filter(v => v !== null) as number[];
        if (usedIndices.includes(index)) {
            for (const key of Object.keys(statAssignments) as (keyof typeof statAssignments)[]) {
                if (statAssignments[key] === index) {
                    setStatAssignments(prev => ({ ...prev, [key]: null }));
                    break;
                }
            }
        }
        setStatAssignments(prev => ({ ...prev, [stat]: index }));
    };

    const unassignRoll = (stat: keyof typeof statAssignments) => {
        setStatAssignments(prev => ({ ...prev, [stat]: null }));
    };

    const applyRollDistribution = () => {
        const allAssigned = Object.values(statAssignments).every(v => v !== null);
        if (!allAssigned) {
            alert('Please assign all rolled values to ability scores.');
            return;
        }
        const newAbilities = { ...initialAbilities };
        for (const [stat, index] of Object.entries(statAssignments)) {
            if (index !== null) {
                newAbilities[stat as keyof Abilities] = rollValues[index];
            }
        }
        onApplyAbilities(newAbilities);
        setShowRollDistribution(false);
    };

    return {
        // Point Buy
        showPointBuy,
        setShowPointBuy,
        pointBuyValues,
        getRemainingPoints,
        canIncrease,
        canDecrease,
        handlePointBuyChange,
        applyPointBuy,
        resetPointBuy,
        // Standard Array
        applyStandardArray,
        // Roll Distribution
        showRollDistribution,
        setShowRollDistribution,
        rollValues,
        statAssignments,
        handleRollStats,
        assignRollToStat,
        unassignRoll,
        applyRollDistribution,
    };
};