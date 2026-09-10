import { Character } from '../types/Character';

export function recalculateAC(character: Character): number {
    const equippedArmor = character.inventory.find(item => item.type === 'armor' && item.equipped);
    const equippedShield = character.inventory.find(item => item.type === 'shield' && item.equipped);

    // Все предметы, дающие бонус к AC (кольца, плащи и т.д.)
    const acBonusItems = character.inventory.filter(item =>
        item.equipped && item.acBonus && item.type !== 'armor' && item.type !== 'shield'
    );

    const dexMod = Math.floor((character.abilities.dex - 10) / 2);
    let ac = 10 + dexMod; // базовый AC без брони

    // Применяем броню
    if (equippedArmor) {
        ac = equippedArmor.baseAC ?? 10;
        if (equippedArmor.dexModifierAllowed) {
            const maxDex = equippedArmor.maxDexBonus ?? Infinity;
            ac += Math.min(dexMod, maxDex);
        }
    }

    // Применяем щит
    if (equippedShield) {
        ac += equippedShield.acBonus ?? 2;
    }

    // Применяем бонусы от магических предметов
    for (const item of acBonusItems) {
        ac += item.acBonus ?? 0;
    }

    return ac;
}