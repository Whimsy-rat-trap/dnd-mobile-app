import { Spell } from '../../types/Character';

// Базовый тип для заклинания без id и prepared (используется в массивах)
export type SpellData = Omit<Spell, 'id' | 'prepared'>;