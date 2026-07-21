import { DND_RACES } from './races';

export type SizeOption = 'Small' | 'Medium' | 'Large';

export interface RaceDetail {
    creatureType: string;
    size: SizeOption | { options: SizeOption[]; default?: SizeOption };
}

export const RACE_DETAILS: Record<string, RaceDetail> = {
    Dragonborn: { creatureType: 'Humanoid', size: 'Medium' },
    Dwarf: { creatureType: 'Humanoid', size: 'Medium' },
    Elf: { creatureType: 'Humanoid', size: 'Medium' },
    Gnome: { creatureType: 'Humanoid', size: 'Small' },
    'Half-Elf': { creatureType: 'Humanoid', size: 'Medium' },
    'Half-Orc': { creatureType: 'Humanoid', size: 'Medium' },
    Halfling: { creatureType: 'Humanoid', size: 'Small' },
    Human: { creatureType: 'Humanoid', size: 'Medium' },
    Tiefling: { creatureType: 'Humanoid', size: 'Medium' },
    Aarakocra: { creatureType: 'Humanoid', size: 'Medium' },
    Aasimar: { creatureType: 'Humanoid', size: 'Medium' },
    Firbolg: { creatureType: 'Humanoid', size: 'Medium' },
    Goliath: { creatureType: 'Humanoid', size: 'Medium' },
    Kenku: { creatureType: 'Humanoid', size: 'Medium' },
    Lizardfolk: { creatureType: 'Humanoid', size: 'Medium' },
    Tabaxi: { creatureType: 'Humanoid', size: 'Medium' },
    Tortle: { creatureType: 'Humanoid', size: 'Medium' },
};