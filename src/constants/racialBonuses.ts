type RacialBonus = {
    fixed?: Record<string, number>; // фиксированные бонусы: { str: 2, dex: 1 }
    choose?: {                      // выбираемые бонусы
        count: number;              // количество бонусов
        options: string[];          // доступные атрибуты
        bonus: number;              // величина бонуса (обычно 1 или 2)
    };
};

export const RACIAL_BONUSES: Record<string, RacialBonus> = {
    Dragonborn: { fixed: { str: 2, cha: 1 } },
    Dwarf: { fixed: { con: 2, wis: 1 } },
    Elf: { fixed: { dex: 2, int: 1 } },
    Gnome: { fixed: { int: 2, dex: 1 } },
    Half_Elf: { choose: { count: 2, options: ['str','dex','con','int','wis','cha'], bonus: 1 } },
    Half_Orc: { fixed: { str: 2, con: 1 } },
    Halfling: { fixed: { dex: 2, cha: 1 } },
    Human: { choose: { count: 2, options: ['str','dex','con','int','wis','cha'], bonus: 1 } },
    Tiefling: { fixed: { cha: 2, int: 1 } },
    Aarakocra: { fixed: { dex: 2, wis: 1 } },
    Aasimar: { fixed: { cha: 2, wis: 1 } },
    Firbolg: { fixed: { wis: 2, str: 1 } },
    Goliath: { fixed: { str: 2, con: 1 } },
    Kenku: { fixed: { dex: 2, wis: 1 } },
    Lizardfolk: { fixed: { con: 2, wis: 1 } },
    Tabaxi: { fixed: { dex: 2, cha: 1 } },
    Tortle: { fixed: { str: 2, wis: 1 } },
};