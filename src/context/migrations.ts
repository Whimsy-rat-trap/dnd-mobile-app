import { Character } from '../types/Character';
import { CURRENT_SCHEMA_VERSION } from '../constants/schema';
import { DEFAULT_SKILLS } from '../constants/skills';
import { ALL_ITEMS } from '../constants/items';
import { normalizeCurrency } from '../utils/currencyUtils';

type AnyCharacter = Partial<Character> & Record<string, any>;

// Registry — каждая версия добавляет одну функцию migrate_vN_to_vN1

const MIGRATIONS: Record<number, (c: AnyCharacter) => AnyCharacter> = {
    1: migrate_v0_to_v1,
    2: migrate_v1_to_v2,
};

/**
 * Прогоняет «сырой» объект персонажа через все применимые миграции
 * и возвращает актуальный Character.
 *
 * Если у объекта нет `schemaVersion` — считается, что он версии 0
 * (самая ранняя, «до схемы»).
 */
export function migrate(raw: AnyCharacter): Character {
    let current: AnyCharacter = { ...raw };
    const fromVersion = typeof current.schemaVersion === 'number' ? current.schemaVersion : 0;

    for (let v = fromVersion + 1; v <= CURRENT_SCHEMA_VERSION; v++) {
        const step = MIGRATIONS[v];
        if (!step) continue;
        current = step(current);
        current.schemaVersion = v;
    }

    // Гарантируем, что schemaVersion в итоге установлен
    current.schemaVersion = CURRENT_SCHEMA_VERSION;

    return current as Character;
}

// v0 → v1 — вся историческая логика, которая раньше жила inline в провайдере

function migrate_v0_to_v1(c: AnyCharacter): AnyCharacter {
    const updated: AnyCharacter = { ...c };

    // classes / classLevels
    if (typeof updated.class === 'string' && !updated.classes) {
        updated.classes = [updated.class];
    } else if (!updated.classes) {
        updated.classes = [updated.class || 'Fighter'];
    }
    if (!updated.class) {
        updated.class = updated.classes[0] || 'Fighter';
    }

    let resolvedClassLevels: any[];

    if (!updated.classLevels || updated.classLevels.length === 0) {
        if (updated.classes && updated.level) {
            const level = updated.level ?? 1;
            resolvedClassLevels = updated.classes.map((cls: string) => ({
                className: cls,
                level,
            }));
        } else if (updated.class) {
            resolvedClassLevels = [
                {
                    className: updated.class,
                    level: updated.level || 1,
                    subclass: '',
                },
            ];
        } else {
            resolvedClassLevels = [{ className: 'Fighter', level: 1, subclass: '' }];
        }
    } else {
        resolvedClassLevels = [...updated.classLevels];
    }

    updated.classLevels = resolvedClassLevels;

    if (resolvedClassLevels.length > 0) {
        updated.level = resolvedClassLevels.reduce((sum: number, cl: any) => sum + cl.level, 0);
    }

    // subclass → classLevels[0].subclass
    if (Array.isArray(updated.classLevels) && updated.classLevels.length > 0) {
        updated.classLevels = updated.classLevels.map((cl: any, idx: number) => {
            if (idx === 0 && !cl.subclass && updated.subclass) {
                return { ...cl, subclass: updated.subclass };
            }
            return cl;
        });
    }
    if (updated.classLevels?.[0]?.subclass) {
        updated.subclass = updated.classLevels[0].subclass;
    }

    // skills / logs
    if (!updated.skills || updated.skills.length === 0) {
        updated.skills = DEFAULT_SKILLS.map((s) => ({ ...s }));
    }
    if (!updated.diceLogs) updated.diceLogs = {};

    // death saves
    if (updated.deathSuccesses === undefined) updated.deathSuccesses = 0;
    if (updated.deathFailures === undefined) updated.deathFailures = 0;
    if (updated.isStable === undefined) updated.isStable = false;

    // tool proficiencies
    const rawTools = updated.toolProficiencies as any[] | undefined;

    if (Array.isArray(rawTools) && rawTools.length > 0) {
        if (typeof rawTools[0] === 'string') {
            updated.toolProficiencies = rawTools.map((name: string) => ({
                name,
                attribute: 'DEX',
                proficient: true,
            }));
        } else if (typeof rawTools[0] === 'object') {
            updated.toolProficiencies = rawTools.map((tool: any) => ({
                ...tool,
                attribute: tool.attribute || 'DEX',
            }));
        } else {
            updated.toolProficiencies = [];
        }
    } else {
        updated.toolProficiencies = updated.toolProficiencies || [];
    }

    // misc defaults
    if (!updated.languages) updated.languages = [];
    if (!updated.size) updated.size = 'Medium';
    if (!updated.creatureType) updated.creatureType = 'Humanoid';
    if (!updated.subrace) updated.subrace = '';
    if (!updated.savingThrowProficiencies) updated.savingThrowProficiencies = [];
    if (updated.activeConcentrationSpellId === undefined) {
        updated.activeConcentrationSpellId = null;
    }
    if (!updated.feats) updated.feats = [];
    if (updated.inspiration === undefined) updated.inspiration = false;

    // currency
    if (!updated.currency) {
        updated.currency = { gp: 0, sp: 0, cp: 0 };
    } else {
        updated.currency = normalizeCurrency(updated.currency);
    }

    // spell slots
    if (!Array.isArray(updated.usedSpellSlots) || updated.usedSpellSlots.length !== 9) {
        updated.usedSpellSlots = Array(9).fill(0);
    }
    if (typeof updated.usedPactSlots !== 'number') {
        updated.usedPactSlots = 0;
    }

    // hit dice
    if (!updated.hitDiceUsed || typeof updated.hitDiceUsed !== 'object') {
        updated.hitDiceUsed = {};
    }

    // class resources
    if (!updated.classResourcesUsed || typeof updated.classResourcesUsed !== 'object') {
        updated.classResourcesUsed = {};
    }
    // legacy bardicInspirationUsed / kiUsed → classResourcesUsed
    const legacyBardic = updated.bardicInspirationUsed;
    const legacyKi = updated.kiUsed;
    if (
        typeof legacyBardic === 'number' &&
        legacyBardic > 0 &&
        !updated.classResourcesUsed['bardic-inspiration']
    ) {
        updated.classResourcesUsed['bardic-inspiration'] = legacyBardic;
    }
    if (typeof legacyKi === 'number' && legacyKi > 0 && !updated.classResourcesUsed['ki']) {
        updated.classResourcesUsed['ki'] = legacyKi;
    }
    delete updated.bardicInspirationUsed;
    delete updated.kiUsed;

    if (!Array.isArray(updated.knownManeuvers)) updated.knownManeuvers = [];
    if (!Array.isArray(updated.knownMetamagic)) updated.knownMetamagic = [];
    if (!Array.isArray(updated.knownInvocations)) updated.knownInvocations = [];
    if (!Array.isArray(updated.partialRecoveryUsed)) {
        updated.partialRecoveryUsed = [];
    }

    // leveling
    if (updated.levelingMode === undefined) updated.levelingMode = 'xp';
    if (typeof updated.allowFeatInsteadOfASI !== 'boolean') {
        updated.allowFeatInsteadOfASI = false;
    }
    if (!Array.isArray(updated.hpRolls)) updated.hpRolls = [];
    if (!Array.isArray(updated.abilityScoreImprovements)) {
        updated.abilityScoreImprovements = [];
    }

    // inventory (ids + обогащение из библиотеки)
    if (Array.isArray(updated.inventory)) {
        updated.inventory = updated.inventory.map((item: any) => {
            const withId = {
                ...item,
                id: item.id || `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            };
            const libraryItem = ALL_ITEMS.find((li: any) => li.name === item.name);
            if (!libraryItem) return withId;
            return {
                ...withId,
                damageDice: withId.damageDice ?? libraryItem.damageDice,
                damageType: withId.damageType ?? libraryItem.damageType,
                healingDice: withId.healingDice ?? libraryItem.healingDice,
                uses: withId.uses ?? libraryItem.uses,
                baseAC: withId.baseAC ?? libraryItem.baseAC,
                acBonus: withId.acBonus ?? libraryItem.acBonus,
                dexModifierAllowed: withId.dexModifierAllowed ?? libraryItem.dexModifierAllowed,
                maxDexBonus: withId.maxDexBonus ?? libraryItem.maxDexBonus,
                strengthRequirement: withId.strengthRequirement ?? libraryItem.strengthRequirement,
                stealthDisadvantage: withId.stealthDisadvantage ?? libraryItem.stealthDisadvantage,
            };
        });
    } else {
        updated.inventory = [];
    }

    return updated;
}

// v1 → v2 — add conditions and exhaustion
function migrate_v1_to_v2(c: AnyCharacter): AnyCharacter {
    return {
        ...c,
        conditions: Array.isArray(c.conditions) ? c.conditions : [],
        exhaustionLevel: typeof c.exhaustionLevel === 'number' ? c.exhaustionLevel : 0,
    };
}
