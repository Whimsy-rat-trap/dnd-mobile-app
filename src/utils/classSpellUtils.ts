import { Character } from '../types/Character';
import { ALL_SPELLS, SpellData } from '../constants/spells';
import {
    CLASS_SPELL_LISTS,
    ClassSpellListData,
} from '../constants/classSpellLists';
import { SUBCLASS_ALWAYS_PREPARED_SPELLS } from '../constants/subclassSpells';
import { SUBCLASS_EXPANDED_SPELLS } from '../constants/subclassExpandedSpells';
import { MAGICAL_SECRETS_FEATURES } from '../constants/magicalSecrets'

// Ключи и резолвинг класса

export function resolveSpellListKey(
    className: string,
    subclass?: string
): string {
    if (subclass) {
        const composite = `${className}:${subclass}`;
        if (CLASS_SPELL_LISTS[composite]) return composite;
    }
    return className;
}

export function getClassSpellListData(
    className: string,
    subclass?: string
): ClassSpellListData | undefined {
    return CLASS_SPELL_LISTS[resolveSpellListKey(className, subclass)];
}

// Списки заклинаний класса

/**
 * Все заклинания класса из ALL_SPELLS. Если задан `level`, только этого уровня.
 */
export function getSpellsForClass(
    className: string,
    level?: number,
    subclass?: string
): SpellData[] {
    const data = getClassSpellListData(className, subclass);
    if (!data) return [];

    const names =
        level === undefined
            ? Object.values(data.spellsByLevel).flat()
            : data.spellsByLevel[level] || [];

    const byName = new Map(ALL_SPELLS.map(s => [s.name.toLowerCase(), s]));
    return names
        .map(n => byName.get(n.toLowerCase()))
        .filter((s): s is SpellData => !!s);
}

// Always-prepared (Cleric Domains, Paladin Oaths)

export function getSubclassAlwaysPreparedSpells(
    className: string,
    subclass: string | undefined,
    classLevel: number
): SpellData[] {
    if (!subclass) return [];
    const classData = SUBCLASS_ALWAYS_PREPARED_SPELLS[className];
    if (!classData) return [];
    const subclassData = classData[subclass];
    if (!subclassData) return [];

    const byName = new Map(ALL_SPELLS.map(s => [s.name.toLowerCase(), s]));
    const result = new Map<string, SpellData>();

    for (const [lvlStr, names] of Object.entries(subclassData)) {
        const requiredClassLevel = Number(lvlStr);
        if (classLevel < requiredClassLevel) continue;
        for (const name of names) {
            const key = name.toLowerCase();
            if (result.has(key)) continue;
            const spell = byName.get(key);
            if (spell) result.set(key, spell);
        }
    }

    return Array.from(result.values());
}

export function getSubclassAlwaysPreparedSpellsForCharacter(
    character: Character
): SpellData[] {
    const result = new Map<string, SpellData>();
    for (const cl of character.classLevels || []) {
        const spells = getSubclassAlwaysPreparedSpells(
            cl.className,
            cl.subclass,
            cl.level
        );
        for (const spell of spells) {
            const key = spell.name.toLowerCase();
            if (result.has(key)) continue;
            result.set(key, spell);
        }
    }
    return Array.from(result.values());
}

// Expanded (Warlock Patrons, Divine Soul)
// NOT auto-added — только расширяют пул доступного.

/**
 * Возвращает «expanded» заклинания для класса/подкласса на данном уровне класса.
 * Гейт по МАКСИМАЛЬНОМУ УРОВНЮ ЗАКЛИНАНИЙ, который класс может кастовать.
 */
export function getSubclassExpandedSpells(
    className: string,
    subclass: string | undefined,
    classLevel: number
): SpellData[] {
    if (!subclass) return [];
    const classData = SUBCLASS_EXPANDED_SPELLS[className];
    if (!classData) return [];
    const subclassData = classData[subclass];
    if (!subclassData) return [];

    const maxSpellLevel = getMaxSpellLevelForClass(className, classLevel, subclass);
    if (maxSpellLevel === 0) return [];

    const byName = new Map(ALL_SPELLS.map(s => [s.name.toLowerCase(), s]));
    const result = new Map<string, SpellData>();

    // 1. Фиксированные списки (Warlock Patrons)
    if (subclassData.spellsByLevel) {
        for (const [lvlStr, names] of Object.entries(subclassData.spellsByLevel)) {
            const lvl = Number(lvlStr);
            if (lvl > maxSpellLevel) continue;
            for (const name of names) {
                const key = name.toLowerCase();
                if (result.has(key)) continue;
                const spell = byName.get(key);
                if (spell) result.set(key, spell);
            }
        }
    }

    // 2. Пул другого класса (Divine Soul → Cleric)
    if (subclassData.fromClass) {
        const source = CLASS_SPELL_LISTS[subclassData.fromClass];
        if (source) {
            for (const [lvlStr, names] of Object.entries(source.spellsByLevel)) {
                const lvl = Number(lvlStr);
                if (lvl > maxSpellLevel) continue;
                for (const name of names) {
                    const key = name.toLowerCase();
                    if (result.has(key)) continue;
                    const spell = byName.get(key);
                    if (spell) result.set(key, spell);
                }
            }
        }
    }

    return Array.from(result.values());
}

export function getSubclassExpandedSpellsForCharacter(
    character: Character
): SpellData[] {
    const result = new Map<string, SpellData>();
    for (const cl of character.classLevels || []) {
        const spells = getSubclassExpandedSpells(
            cl.className,
            cl.subclass,
            cl.level
        );
        for (const spell of spells) {
            const key = spell.name.toLowerCase();
            if (result.has(key)) continue;
            result.set(key, spell);
        }
    }
    return Array.from(result.values());
}

/**
 * Является ли заклинание «expanded only» для персонажа —
 * то есть доступно ТОЛЬКО через expanded-список подкласса,
 * а не через базовые списки классов.
 *
 * Полезно для UI: помечать такие заклинания тегом «Expanded».
 */
export function isSpellExpandedOnly(
    character: Character,
    spellName: string
): boolean {
    const lower = spellName.toLowerCase();

    // 1. Если в базовом списке хотя бы одного класса — не «expanded only»
    for (const cl of character.classLevels || []) {
        const data = getClassSpellListData(cl.className, cl.subclass);
        if (!data) continue;
        const inBase = Object.values(data.spellsByLevel).some(names =>
            names.some(n => n.toLowerCase() === lower)
        );
        if (inBase) return false;
    }

    // 2. Если есть в expanded хотя бы одного подкласса — true
    for (const cl of character.classLevels || []) {
        const expanded = getSubclassExpandedSpells(
            cl.className,
            cl.subclass,
            cl.level
        );
        if (expanded.some(s => s.name.toLowerCase() === lower)) return true;
    }

    return false;
}

// Прогрессия уровня заклинаний

export function getMaxSpellLevelForClass(
    className: string,
    classLevel: number,
    subclass?: string
): number {
    const data = getClassSpellListData(className, subclass);
    if (!data) return 0;
    if (classLevel < data.startsAtClassLevel) return 0;

    if (className === 'Artificer') {
        if (classLevel >= 17) return 5;
        if (classLevel >= 13) return 4;
        if (classLevel >= 9) return 3;
        if (classLevel >= 5) return 2;
        return 1;
    }
    if (className === 'Paladin' || className === 'Ranger') {
        if (classLevel >= 17) return 5;
        if (classLevel >= 13) return 4;
        if (classLevel >= 9) return 3;
        if (classLevel >= 5) return 2;
        if (classLevel >= 2) return 1;
        return 0;
    }
    if (className === 'Fighter' || className === 'Rogue') {
        if (classLevel >= 19) return 4;
        if (classLevel >= 13) return 3;
        if (classLevel >= 7) return 2;
        if (classLevel >= 3) return 1;
        return 0;
    }
    if (className === 'Warlock') {
        if (classLevel >= 9) return 5;
        if (classLevel >= 7) return 4;
        if (classLevel >= 5) return 3;
        if (classLevel >= 3) return 2;
        return 1;
    }
    if (classLevel >= 17) return 9;
    if (classLevel >= 15) return 8;
    if (classLevel >= 13) return 7;
    if (classLevel >= 11) return 6;
    if (classLevel >= 9) return 5;
    if (classLevel >= 7) return 4;
    if (classLevel >= 5) return 3;
    if (classLevel >= 3) return 2;
    return 1;
}

// Доступные персонажу заклинания

/**
 * Все заклинания, доступные персонажу:
 *   1. Базовые списки классов (по maxSpellLevel).
 *   2. Always-prepared подклассов (Cleric Domains, Paladin Oaths).
 *   3. Expanded подклассов (Warlock Patrons, Divine Soul) — для выбора на level up.
 *
 * Expanded-заклинания возвращаются в этом списке, но НЕ добавляются
 * автоматически в character.spells. Это отличие от always-prepared.
 */
export function getSpellsAvailableToCharacter(
    character: Character,
    options: { respectSpellLevel?: boolean } = {}
): SpellData[] {
    const { respectSpellLevel = true } = options;
    const byName = new Map(ALL_SPELLS.map(s => [s.name.toLowerCase(), s]));
    const result = new Map<string, SpellData>();

    const addSpell = (spell: SpellData) => {
        const key = spell.name.toLowerCase();
        if (result.has(key)) return;
        result.set(key, spell);
    };

    for (const cl of character.classLevels || []) {
        const data = getClassSpellListData(cl.className, cl.subclass);
        if (!data) continue;

        const maxLevel = respectSpellLevel
            ? getMaxSpellLevelForClass(cl.className, cl.level, cl.subclass)
            : 9;

        // 1. Базовый список класса
        for (const [lvlStr, names] of Object.entries(data.spellsByLevel)) {
            const lvl = Number(lvlStr);
            if (lvl > maxLevel) continue;
            for (const name of names) {
                const spell = byName.get(name.toLowerCase());
                if (spell) addSpell(spell);
            }
        }

        // 2. Always-prepared подкласса (Cleric Domains, Paladin Oaths)
        const alwaysPrepared = getSubclassAlwaysPreparedSpells(
            cl.className,
            cl.subclass,
            cl.level
        );
        for (const spell of alwaysPrepared) addSpell(spell);

        // 3. Expanded подкласса (Warlock Patrons, Divine Soul)
        const expanded = getSubclassExpandedSpells(
            cl.className,
            cl.subclass,
            cl.level
        );
        for (const spell of expanded) addSpell(spell);
    }

    return Array.from(result.values());
}

// Обратный индекс: spell name → базовые классы

/**
 * ВАЖНО: учитывает только базовые списки классов, НЕ expanded и НЕ always-prepared.
 */
export function getClassesForSpell(spellName: string): string[] {
    const lower = spellName.toLowerCase();
    const result = new Set<string>();

    for (const [key, data] of Object.entries(CLASS_SPELL_LISTS)) {
        const found = Object.values(data.spellsByLevel).some(names =>
            names.some(n => n.toLowerCase() === lower)
        );
        if (found) {
            const baseClass = key.includes(':') ? key.split(':')[0] : key;
            result.add(baseClass);
        }
    }

    return Array.from(result);
}

// Magical Secrets (Bard: base + College of Lore)
/**
 * Сколько секретов даёт класс/подкласс на данном уровне класса.
 */
export function getMaxMagicalSecrets(
    className: string,
    subclass: string | undefined,
    classLevel: number
): number {
    const features = MAGICAL_SECRETS_FEATURES[className];
    if (!features) return 0;

    return features
        .filter(f =>
            classLevel >= f.level && (!f.subclass || f.subclass === subclass)
        )
        .reduce((sum, f) => sum + f.count, 0);
}

/**
 * Сколько всего слотов секретов у персонажа (сумма по всем классам).
 */
export function getMaxMagicalSecretsForCharacter(character: Character): number {
    let total = 0;
    for (const cl of character.classLevels || []) {
        total += getMaxMagicalSecrets(cl.className, cl.subclass, cl.level);
    }
    return total;
}

/**
 * Сколько заклинаний персонаж уже выбрал как секреты.
 */
export function getUsedMagicalSecretsCount(character: Character): number {
    return character.spells.filter(s => s.isMagicalSecret).length;
}

/**
 * Максимальный уровень заклинаний, который можно взять как секрет.
 * Гейтится классом, который даёт Magical Secrets (а не общим уровнем).
 */
export function getMaxMagicalSecretSpellLevel(character: Character): number {
    let max = 0;
    for (const cl of character.classLevels || []) {
        if (!MAGICAL_SECRETS_FEATURES[cl.className]) continue;
        max = Math.max(
            max,
            getMaxSpellLevelForClass(cl.className, cl.level, cl.subclass)
        );
    }
    return max;
}

/**
 * Может ли персонаж добавить ещё один секрет.
 */
export function canAddMagicalSecret(character: Character): {
    can: boolean;
    reason?: string;
    used: number;
    max: number;
} {
    const max = getMaxMagicalSecretsForCharacter(character);
    const used = getUsedMagicalSecretsCount(character);
    if (max === 0) {
        return { can: false, reason: 'Character has no Magical Secrets feature', used, max };
    }
    if (used >= max) {
        return { can: false, reason: `All ${max} slots used`, used, max };
    }
    return { can: true, used, max };
}

/**
 * Является ли заклинание базовым для персонажа (по любому из его классов).
 * Используется, чтобы исключить «скучные» секреты — брать то, что и так есть,
 * бессмысленно.
 */
function isSpellOnAnyBaseList(character: Character, spellName: string): boolean {
    const lower = spellName.toLowerCase();
    for (const cl of character.classLevels || []) {
        const data = getClassSpellListData(cl.className, cl.subclass);
        if (!data) continue;
        const found = Object.values(data.spellsByLevel).some(names =>
            names.some(n => n.toLowerCase() === lower)
        );
        if (found) return true;
    }
    return false;
}

/**
 * Пул заклинаний, доступных как Magical Secrets:
 *   - любое заклинание из ALL_SPELLS, любой класс;
 *   - level ≤ max castable by the granting class (или cantrip);
 *   - НЕ уже в character.spells;
 *   - НЕ на базовом списке персонажа (эти можно взять и так).
 */
export function getMagicalSecretsCandidates(character: Character): SpellData[] {
    const maxLevel = getMaxMagicalSecretSpellLevel(character);
    if (maxLevel === 0) return [];

    const existing = new Set(
        character.spells.map(s => s.name.toLowerCase())
    );

    return ALL_SPELLS.filter(s => {
        const key = s.name.toLowerCase();
        if (existing.has(key)) return false;
        if (isSpellOnAnyBaseList(character, s.name)) return false;
        if (s.level === 0) return true; // cantrips всегда доступны
        return s.level <= maxLevel;
    });
}