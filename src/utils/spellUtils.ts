import { ALL_SPELLS } from '../constants/spells';

export const getElementFromSpell = (spell: { name: string }): string | undefined => {
    const name = spell.name.toLowerCase();
    if (name.includes('fire') || name.includes('flame') || name.includes('burn')) return 'fire';
    if (name.includes('cold') || name.includes('frost') || name.includes('ice')) return 'cold';
    if (name.includes('lightning') || name.includes('shock') || name.includes('thunder')) return 'lightning';
    if (name.includes('acid')) return 'acid';
    if (name.includes('poison')) return 'poison';
    if (name.includes('force')) return 'force';
    if (name.includes('necrotic') || name.includes('chill touch') || name.includes('death')) return 'necrotic';
    if (name.includes('radiant') || name.includes('light') || name.includes('holy')) return 'radiant';
    if (name.includes('psychic')) return 'psychic';
    if (name.includes('healing') || name.includes('cure')) return 'healing';
    return undefined;
};

export const SCHOOLS: string[] = Array.from(new Set(ALL_SPELLS.map(s => s.school)));
export const ELEMENTS: string[] = ['fire', 'cold', 'lightning', 'acid', 'poison', 'force', 'necrotic', 'radiant', 'psychic', 'healing'];