import { Spell } from '../types/Character';
import { ALL_SPELLS } from '../constants/spells';

export const getElementFromSpell = (spell: Spell | { name: string }): string | undefined => {
    const name = spell.name.toLowerCase();
    if (name.includes('fire') || name.includes('flame') || name.includes('burn') || name.includes('burning')) return 'fire';
    if (name.includes('cold') || name.includes('frost') || name.includes('ice') || name.includes('freeze')) return 'cold';
    if (name.includes('lightning') || name.includes('shock') || name.includes('thunder') || name.includes('storm')) return 'lightning';
    if (name.includes('acid')) return 'acid';
    if (name.includes('poison') || name.includes('venom')) return 'poison';
    if (name.includes('force') || name.includes('magic missile')) return 'force';
    if (name.includes('necrotic') || name.includes('chill touch') || name.includes('death') || name.includes('inflict')) return 'necrotic';
    if (name.includes('radiant') || name.includes('light') || name.includes('holy') || name.includes('guiding bolt')) return 'radiant';
    if (name.includes('psychic')) return 'psychic';
    if (name.includes('healing') || name.includes('cure') || name.includes('restore')) return 'healing';
    return undefined;
};

export const SCHOOLS = Array.from(new Set(ALL_SPELLS.map(s => s.school)));
export const ELEMENTS = ['fire', 'cold', 'lightning', 'acid', 'poison', 'force', 'necrotic', 'radiant', 'psychic', 'healing'];