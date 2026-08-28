import { Spell } from '../types/Character';
import { ALL_SPELLS } from './spells';

// Тип для данных заклинания (без id и служебных полей)
type RacialSpellData = Omit<Spell, 'id' | 'prepared' | 'isCustom' | 'isRacial'>;

// Вспомогательная функция для поиска заклинания по имени в ALL_SPELLS
function getSpellData(name: string): RacialSpellData | undefined {
    const found = ALL_SPELLS.find(s => s.name === name);
    if (!found) return undefined;
    // Преобразуем, убирая лишние поля
    return {
        name: found.name,
        level: found.level,
        school: found.school,
        castingTime: found.castingTime,
        range: found.range,
        components: found.components,
        description: found.description,
        element: (found as any).element, // может быть не во всех
    };
}

// Карта расовых заклинаний
// Ключ – название расы или подрасы (должно точно совпадать с именами в константах)
export const RACIAL_SPELLS: Record<string, RacialSpellData[]> = {
    // Эльфы
    'High Elf': [
        getSpellData('Minor Illusion')!,
    ],
    'Wood Elf': [], // у Wood Elf нет заклинаний (только Mask of the Wild)
    'Dark Elf (Drow)': [
        getSpellData('Dancing Lights')!,
        getSpellData('Faerie Fire')!,
        getSpellData('Darkness')!,
    ],
    // Полуэльфы (Half-Elf) – нет заклинаний
    // Гномы
    'Forest Gnome': [
        getSpellData('Minor Illusion')!,
    ],
    'Rock Gnome': [], // нет заклинаний
    // Тифлинги
    'Tiefling': [
        getSpellData('Thaumaturgy')!,
    ],
    'Asmodeus': [
        getSpellData('Hellish Rebuke')!,
        getSpellData('Darkness')!,
    ],
    'Baalzebul': [
        getSpellData('Ray of Sickness')!,
        getSpellData('Crown of Madness')!,
    ],
    'Dispater': [
        getSpellData('Disguise Self')!,
        getSpellData('Invisibility')!,
    ],
    'Fierna': [
        getSpellData('Charm Person')!,
        getSpellData('Suggestion')!,
    ],
    'Glasya': [
        getSpellData('Disguise Self')!,
        getSpellData('Invisibility')!,
    ],
    'Levistus': [
        getSpellData('Armor of Agathys')!,
        getSpellData('Darkness')!,
    ],
    'Mammon': [
        getSpellData('Tenser\'s Floating Disk')!,
        getSpellData('Arcane Lock')!,
    ],
    'Mephistopheles': [
        getSpellData('Burning Hands')!,
        getSpellData('Flame Blade')!,
    ],
    'Zariel': [
        getSpellData('Searing Smite')!,
        getSpellData('Branding Smite')!,
    ],
    // Аасимар
    'Aasimar': [
        getSpellData('Light')!,
    ],
    // Ааракокра – нет заклинаний
    // Фирболг – есть Firbolg Magic
    'Firbolg': [
        // Detect Magic и Disguise Self – они получают возможность использовать, но не как заклинания? Да, они могут их использовать ограниченно.
        // Мы добавим их как заклинания, но они не должны занимать слоты – они расовые.
        getSpellData('Detect Magic')!,
        getSpellData('Disguise Self')!,
    ],
    // Голиаф – нет
    // Кенку – нет
    // Ящеролюд – нет
    // Табаши – нет
    // Тортл – нет
    // Дварф – нет
    // Драконорождённый – нет (только дыхание)
    // Полуорк – нет
    // Халфлинг – нет
    // Человек – нет
};

// Функция для получения списка расовых заклинаний по расе и подрасе
export function getRacialSpells(race: string, subrace?: string): RacialSpellData[] {
    const spells: RacialSpellData[] = [];
    if (RACIAL_SPELLS[race]) {
        spells.push(...RACIAL_SPELLS[race]);
    }
    if (subrace && RACIAL_SPELLS[subrace]) {
        spells.push(...RACIAL_SPELLS[subrace]);
    }
    return spells;
}