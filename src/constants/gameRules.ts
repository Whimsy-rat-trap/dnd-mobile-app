// Centralised D&D 5e numeric constants.
// Import from here instead of hard-coding 9, 20, 6, 3, etc.

/** Maximum character level supported by D&D 5e (PHB p.15). */
export const MAX_CHARACTER_LEVEL = 20;

/** Maximum spell slot level (PHB p.201). Slots 1..9. */
export const MAX_SPELL_LEVEL = 9;

/** Number of spell slot levels tracked on a character sheet. */
export const SPELL_SLOT_LEVELS_COUNT = MAX_SPELL_LEVEL;

/** Maximum exhaustion level (PHB p.291 — level 6 is lethal). */
export const MAX_EXHAUSTION_LEVEL = 6;

/** Maximum number of magic items a character can be attuned to at once (PHB p.138). */
export const MAX_ATTUNEMENT_SLOTS = 3;

/** Time window (ms) during which a deleted character can be restored via undo. */
export const UNDO_TIMEOUT_MS = 6000;

/** Minimum ability score. */
export const MIN_ABILITY_SCORE = 1;

/** Maximum ability score cap (PHB p.13, p.173). */
export const MAX_ABILITY_SCORE = 20;
