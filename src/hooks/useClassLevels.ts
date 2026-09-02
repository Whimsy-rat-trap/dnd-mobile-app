import { useState, useEffect } from 'react';
import { DND_CLASSES } from '../constants/classes';

export const useClassLevels = (initialClass: string, initialLevel: number) => {
    const [classLevels, setClassLevels] = useState<{ className: string; level: number }[]>([
        { className: initialClass, level: initialLevel }
    ]);

    const addExtraClass = () => {
        setClassLevels([...classLevels, { className: DND_CLASSES[0], level: 1 }]);
    };

    const removeExtraClass = (index: number) => {
        if (index === 0) return;
        setClassLevels(classLevels.filter((_, i) => i !== index));
    };

    const updateExtraClass = (index: number, field: 'className' | 'level', value: string | number) => {
        const newList = [...classLevels];
        if (field === 'className') {
            newList[index].className = value as string;
        } else {
            newList[index].level = Math.max(1, Math.min(20, Number(value)));
        }
        setClassLevels(newList);
    };

    const totalLevel = classLevels.reduce((sum, cl) => sum + cl.level, 0);

    // Синхронизация с внешними изменениями
    const syncMainClass = (className: string) => {
        setClassLevels(prev => {
            const newList = [...prev];
            if (newList.length > 0) newList[0].className = className;
            else newList.push({ className, level: 1 });
            return newList;
        });
    };

    const syncMainLevel = (level: number) => {
        setClassLevels(prev => {
            const newList = [...prev];
            if (newList.length > 0) newList[0].level = level;
            else newList.push({ className: DND_CLASSES[0], level });
            return newList;
        });
    };

    return {
        classLevels,
        setClassLevels,
        addExtraClass,
        removeExtraClass,
        updateExtraClass,
        totalLevel,
        syncMainClass,
        syncMainLevel,
    };
};