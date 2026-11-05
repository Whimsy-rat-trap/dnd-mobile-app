# Arcane Realms

> A mobile-first D&D 5e character manager. All game mechanics, spellcasting, class resources, and leveling are handled client-side with no backend — persistence is `localStorage`, and all rules are derived from character data in pure TypeScript functions.

![React](https://img.shields.io/badge/React-19.2-61dafb?logo=react&logoColor=white&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9-3178c6?logo=typescript&logoColor=white&style=flat-square)
![CRA](https://img.shields.io/badge/CRA-5.0.1-09d3ac?style=flat-square)
![Schema](https://img.shields.io/badge/schema-v1-34d399?style=flat-square)
![Node](https://img.shields.io/badge/node-%E2%89%A520-339933?logo=node.js&logoColor=white&style=flat-square)
![License](https://img.shields.io/badge/license-personal--project-lightgrey?style=flat-square)

---

## Table of contents

- [Tech stack](#tech-stack)
- [Requirements](#requirements)
- [Quick start](#quick-start)
- [Architecture](#architecture)
- [Data model](#data-model)
- [Core systems](#core-systems)
    - [Character lifecycle](#character-lifecycle)
    - [Multiclass](#multiclass)
    - [Spellcasting](#spellcasting)
    - [Class resources](#class-resources)
    - [Maneuvers (Battle Master)](#maneuvers-battle-master)
    - [Metamagic (Sorcerer)](#metamagic-sorcerer)
    - [Partial recovery](#partial-recovery)
    - [Magical Secrets (Bard)](#magical-secrets-bard)
    - [Pact of the Tome / Book of Ancient Secrets (Warlock)](#pact-of-the-tome--book-of-ancient-secrets-warlock)
    - [Subclass spells](#subclass-spells)
    - [Leveling](#leveling)
    - [Rests](#rests)
    - [Inspiration](#inspiration)
    - [Migrations](#migrations)
- [Utilities reference](#utilities-reference)
- [Storage](#storage)
- [Development](#development)
- [Style guide](#style-guide)

---

## Tech stack

| Layer | Technology | Version |
|-------|------------|---------|
| UI | **React** | 19.2.7 |
| Language | **TypeScript** | 4.9.5 |
| Routing | **react-router-dom** | 7.18.0 |
| Build tool | **Create React App** (`react-scripts`) | 5.0.1 |
| Persistence | `localStorage` | — |
| Styling | Plain **CSS** (CSS variables, no preprocessor) | — |
| Testing | **React Testing Library** + **Jest** | via CRA |
| Web vitals | **web-vitals** | 2.1.4 |

`tsconfig.json` highlights:

```jsonc
{
  "target": "es2020",
  "lib": ["dom", "dom.iterable", "esnext"],
  "strict": true,
  "jsx": "react-jsx",
  "module": "esnext",
  "moduleResolution": "node"
}
```

- **No backend, no auth** — everything lives in `localStorage`.
- **No path aliases** — imports are relative (`../utils/...`).
- **No state-management library** — `CharacterContext` is the single source of truth.

---

## Requirements

- **Node.js ≥ 20** (required by `react-router-dom` 7.18)
- **npm** (bundled with Node)
- A modern browser (Chrome / Firefox / Safari / Edge)

---

## Quick start

```bash
npm install
npm start        # dev server → http://localhost:3000
npm run build    # production build → ./build
npm test         # run tests in watch mode
```

No environment variables are required.

---

## Architecture

```
src/
├── components/
│   ├── character/        # Character sheet sections (Skills, SavingThrows, ClassResources…)
│   ├── dashboard/        # Dashboard widgets (CharacterStats, DiceRollerSection…)
│   ├── CreateCharacter/  # Character creation form sections
│   ├── AttackRoller.tsx
│   ├── CastSpellModal.tsx
│   ├── DiceRoller.tsx
│   ├── InspirationBadge.tsx
│   ├── LevelUpModal.tsx
│   ├── Modal.tsx
│   ├── SpellCard.tsx
│   ├── ShortRestModal.tsx
│   └── LongRestModal.tsx
├── constants/            # Static rules data (tables, spell lists, class features)
├── context/              # CharacterProvider, CampaignProvider, SpellProvider
│   ├── CharacterContext.tsx
│   └── migrations.ts
├── hooks/                # Reusable hooks (useStatGeneration, …)
├── pages/                # Route-level screens
├── types/                # Character.ts (the main data model)
├── utils/                # Pure helper functions (per domain)
├── App.tsx
├── index.tsx
└── index.css             # CSS variables + global reset
```

> **Design principle:** every game rule is a **pure function** — no class instances, no mutable singletons, no Redux. State is centralized in `CharacterContext`.

---

## Data model

Everything revolves around `Character` (`src/types/Character.ts`).

### `Character`

```ts
interface Character {
    id: string;
    schemaVersion: number;      // for migrations

    name: string;
    class: string;              // deprecated — use classLevels
    classes: string[];          // deprecated — use classLevels
    subclass?: string;          // deprecated — use classLevels[0].subclass
    classLevels: ClassLevel[];
    level: number;              // total level, cached from classLevels

    race: string;
    subrace?: string;
    background: string;

    hp: number;
    maxHp: number;
    tempHp: number;
    ac?: number;
    speed?: number;
    exp: number;
    levelingMode?: 'xp' | 'milestone';
    allowFeatInsteadOfASI?: boolean;

    abilities: {
        str: number; dex: number; con: number;
        int: number; wis: number; cha: number;
    };
    skills: { name: string; attribute: string; proficient: boolean }[];
    savingThrowProficiencies: string[];
    toolProficiencies: { name: string; attribute: string; proficient: boolean }[];
    languages: string[];
    size: string;
    creatureType: string;

    inventory: InventoryItem[];
    spells: Spell[];
    feats: Feat[];
    quests: Quest[];
    currency: { gp: number; sp: number; cp: number };

    // Combat state
    status: 'active' | 'dead' | 'archived';
    deathSuccesses: number;
    deathFailures: number;
    isStable: boolean;
    activeConcentrationSpellId?: string | null;
    inspiration?: boolean;

    // Spell slots
    usedSpellSlots?: number[];   // length 9, index 0 = level 1
    usedPactSlots?: number;

    // Hit dice
    hitDiceUsed?: Record<number, number>; // { 6: 1, 10: 2 }

    // Class resources (Rage, Ki, Sorcery Points, Bardic Inspiration…)
    classResourcesUsed?: Record<string, number>;
    partialRecoveryUsed?: string[];

    // Known options
    knownManeuvers?: string[];         // Battle Master
    knownMetamagic?: string[];         // Sorcerer
    knownInvocations?: string[];       // Warlock
    pactBoon?: 'chain' | 'blade' | 'tome';

    // Level-up history
    hpRolls?: Array<{
        classLevel: number; className: string;
        method: 'roll' | 'average'; roll?: number;
        conMod: number; gained: number;
    }>;
    abilityScoreImprovements?: Array<{
        classLevel: number; className: string;
        type: 'asi' | 'feat'; bonuses?: any;
        featId?: string; featName?: string;
    }>;

    diceLogs: Record<number, { result: number; timestamp: number }[]>;
}
```

### `ClassLevel`

```ts
interface ClassLevel {
    className: string;
    level: number;
    subclass?: string;
}
```

### Spell flags

All optional booleans on `Spell`:

| Flag | Source |
|------|--------|
| `isRacial` | from race |
| `isAlwaysPrepared` | Cleric domain / Paladin oath (auto-added, not counted toward limit) |
| `isMagicalSecret` | Bard Magical Secrets |
| `isPactOfTome` | Warlock Pact of the Tome cantrips |
| `isBookOfAncientSecrets` | Warlock Book of Ancient Secrets rituals |
| `isCustom` | user-created |
| `isRitual` | has ritual tag |

---

## Core systems

### Character lifecycle

1. **Create** → `CreateCharacter` page → `buildCharacter` → `addCharacter`
2. **Select** → Dashboard → `setCurrentCharacterId` → stored globally
3. **Play** → Dashboard (quick info) + CharacterContainer (full sheet)
4. **Level up** → `LevelUpModal` → `applyLevelUp`
5. **Delete** → `deleteCharacter` (confirm required)

`CharacterContext` is the single source of truth:

```ts
const { getCharacter, updateCharacter, addCharacter, deleteCharacter } = useCharacters();
```

All mutations go through `updateCharacter(id, partial)`, which:

- normalizes currency
- syncs subclass to `classLevels[0].subclass`
- re-adds natural weapons / racial spells / feats on race/class change
- recalculates AC on inventory/ability change
- re-syncs subclass always-prepared spells on `classLevels` change

### Multiclass

Every class lives in `classLevels[]`. All rules use **class level per class**, not total:

- **Spell slots** — summed across full/half/third casters per PHB
- **Pact Magic** — separate pool
- **Class resources** (Rage, Ki…) — by class level of that class
- **ASI** — by class level of that class
- **Subclass choice** — by class level of that class

> ⚠️ `character.level` is a **cached sum** of `classLevels[].level`. Never write to it directly — always update `classLevels` and let the provider recalculate.

### Spellcasting

**Slot system** (`utils/spellcasting.ts`):

- `getNonPactSpellSlots(char)` — regular slots by caster level
- `getPactMagicInfo(char)` — `{ slotLevel, total, used, available }` for Warlock
- `getUsedSpellSlots(char)` — 9-element array

**Save DC / Attack** (`utils/spellUtils.ts`):

- `getSpellSaveDC(char)` = `8 + prof + abilityMod`
- `getSpellAttackBonus(char)` = `prof + abilityMod`
- `getSpellDamageBonus(char)` = `abilityMod`

> Ability is derived from `spell.classes` matching a class the character has, falling back to the first caster class. **EK/AT use INT.**

**Spell learning** (`utils/spellLearning.ts`):

- Known casters (Bard, Sorcerer, Warlock, Ranger) learn **N new spells per level-up**, tracked via `SPELLS_KNOWN_BY_CLASS` and `CANTRIPS_KNOWN_BY_CLASS`.
- `getSpellCandidates(char, className, maxLevel, onlyCantrips)` — picks from `CLASS_SPELL_LISTS[className]` filtered by existing book.

**Preparation** (`utils/spellPreparation.ts`):

- Triggered **after long rest** for prepared casters (Wizard, Cleric, Druid, Paladin, Artificer).
- `getPreparableSpellsData(char)` — separates `alwaysPrepared` (locked) from preparable (level 1+), enforces `maxPrepared` limit.

**Swap on long rest** (`utils/spellSwap.ts`):

- Known casters can swap 1 spell with another of **equal or lower level** (house rule — officially it's on level-up).
- `getForgettableSpells(char)` / `getLearnableSpellsForSwap(char, maxLevel)`.

**Class spell lists** (`constants/classSpellLists.ts`):

- Single source of truth for what each class can learn.
- Supports composite keys: `'Fighter:Eldritch Knight'`, `'Rogue:Arcane Trickster'`.
- `getSpellsAvailableToCharacter(char)` unions across all classes and respects `getMaxSpellLevelForClass(className, classLevel)`.

### Class resources

`constants/classResources.ts` defines every resource declaratively:

```ts
{
    id: 'rage',
    className: 'Barbarian',
    minClassLevel: 1,
    recharge: 'long',
    maxUses: { type: 'table', table: [{ minLevel: 1, uses: 2 }, { minLevel: 3, uses: 3 }, ...] },
    color: '#ef4444',
}
```

Supported `maxUses` forms: `fixed`, `level`, `table`, `ability`.

**Currently registered resources:**

| Resource | Class | Min level | Recharge | Notes |
|----------|-------|-----------|----------|-------|
| Rage | Barbarian | 1 | long | 2 → 6 by level (table) |
| Bardic Inspiration | Bard | 1 | short from L5 | d6 → d12 by level; uses = max(1, CHA mod) |
| Channel Divinity | Cleric | 2 | short | 1 → 3 by level |
| Wild Shape | Druid | 2 | short | 2 → 3 by level |
| Action Surge | Fighter | 2 | short | 1 → 2 at L17 |
| Superiority Dice | Fighter (Battle Master) | 3 | short | d8 → d12; 4 → 6 by level |
| Ki Points | Monk | 2 | short | = Monk level |
| Channel Divinity | Paladin | 3 | short | fixed 1 |
| Sorcery Points | Sorcerer | 2 | long | = Sorcerer level |

> `subclass` field gates resources that only certain subclasses get.

**Interaction:**

```ts
const { spendClassResource, restoreClassResource } = useCharacters();
spendClassResource(characterId, 'rage');       // returns true if succeeded
spendClassResource(characterId, 'ki', 3);      // spend multiple at once
```

`shortRest` / `longRest` auto-reset appropriate resources based on `recharge`.

### Maneuvers (Battle Master)

`constants/maneuvers.ts` — **18 maneuvers** (16 PHB + 7 TCE).

- `getKnownManeuversLimit(char)` — 3 → 5 → 7 → 9 by Fighter level (Battle Master only).
- `getManeuverSaveDC(char)` = `8 + prof + max(STR, DEX) mod`.
- `ManeuversSection` lists known maneuvers with "Use" button that spends 1 superiority die.
- `AttackRoller` shows the maneuver picker when `character` prop is provided. **Precision Attack works on miss**; on-hit maneuvers only after hit.

**State:** `character.knownManeuvers: string[]`.

### Metamagic (Sorcerer)

`constants/metamagic.ts` — **10 options** (Careful, Distant, Empowered, Extended, Heightened, Quickened, Seeking, Subtle, Transmuted, Twinned).

- `getKnownMetamagicLimit(char)` — 2 → 4 → 6 by Sorcerer level.
- **Cost:** fixed (1–3 SP) or spell-level-based (Twinned).
- `MetamagicSection` lists known options with "Use" button that spends SP via `spendClassResource(charId, 'sorcery-points', cost)`.
- For spell-level cost, `UseMetamagicModal` asks for spell level (0 = cantrip = 1 SP).

**State:** `character.knownMetamagic: string[]`.

### Partial recovery

`constants/partialRecovery.ts` — features that restore part of resources.

**Manual** (user-triggered, once per cooldown):

- `arcane-recovery` — Wizard 2, budget = `ceil(wizardLevel / 2)` spell levels
- `natural-recovery` — Druid 2 (Circle of the Land), same formula

**Automatic** (fires on rest, no UI):

- `sorcerous-restoration` — Sorcerer 20, +4 SP on short rest

`PartialRecoverySection` renders manual features with "Use" button. `applyPartialRecoveryFeature(charId, featureId, payload)` handles both types.

**Cooldown tracking:** `character.partialRecoveryUsed: string[]` (cleared on long rest).

### Magical Secrets (Bard)

`constants/magicalSecrets.ts`:

```ts
Bard: [
    { level: 10, count: 2 },          // base
    { level: 14, count: 2 },
    { level: 18, count: 2 },
    { subclass: 'Lore', level: 6, count: 2 },  // College of Lore
]
```

- `getMaxMagicalSecretsForCharacter(char)` — sums matching features.
- `getMagicalSecretsCandidates(char)` — any spell from `ALL_SPELLS` not on any of the character's base class lists, not already in book.
- `SpellsLibrary` shows a **Magical Secrets** tab when available; adding a spell there tags it with `isMagicalSecret: true`.
- If a magical secret becomes always-prepared later (e.g. Cleric domain), the flag is **auto-cleared** so the slot frees up.

### Pact of the Tome / Book of Ancient Secrets (Warlock)

`constants/eldritchInvocations.ts`:

```ts
{
    id: 'book-of-ancient-secrets',
    requiresPact: 'tome',
    minWarlockLevel: 3,
}
```

**Pact of the Tome (Warlock 3+):**

- 3 cantrips from any class.
- `SpellsLibrary` tab "Tome Cantrips"; adds with `isPactOfTome: true`.
- **State:** `character.pactBoon = 'tome'`.

**Book of Ancient Secrets** (invocation, requires tome):

- Rituals up to `ceil(warlockLevel / 2)` spell level.
- Starts with **2 free**, more can be inscribed (no hard limit — DM discretion).
- `constants/ritualSpells.ts` has a `Set` of ritual spell names as fallback when `Spell.isRitual` isn't set on the spell data.
- **State:** `character.knownInvocations` contains `'book-of-ancient-secrets'`.

### Subclass spells

Two parallel systems.

**Always-prepared** (`constants/subclassSpells.ts`):

- Cleric domains (all 9), Paladin oaths (all 6).
- Structure: `[className][subclassName][classLevel] = ['Spell', ...]`
- **Auto-added** to `character.spells` when class level reaches threshold.
- Tagged `isAlwaysPrepared: true`, `source: 'subclass'`.
- **Re-synced** on every `updateCharacter({ classLevels })` — old subclass spells removed, new ones added, existing matching spells promoted to always-prepared.
- Not counted in `maxPrepared`.

**Expanded** (`constants/subclassExpandedSpells.ts`):

- Warlock patrons (5), Sorcerer Divine Soul.
- **Does not auto-add** to `character.spells`.
- Only widens what `getSpellsAvailableToCharacter` returns, so player can manually pick them in `SpellsLibrary`.
- Divine Soul uses `fromClass: 'Cleric'` to pull the entire Cleric list.

### Leveling

`constants/leveling.ts`:

- `XP_TABLE` / `XP_TO_NEXT` — standard 5e thresholds.
- `ASI_LEVELS_BY_CLASS` — per class (Fighter/Rogue get extras).
- `SUBCLASS_LEVEL_BY_CLASS` — when subclass must be chosen.
- `MAX_LEVEL = 20`.

`utils/leveling.ts`:

- `getXpToNextLevel(level)` — returns `Infinity` at 20.
- `canLevelUpNow(char)` — respects `levelingMode` (milestone always `false` here).
- `computeLevelUpPreview(char, classIndex, subclass?)` — simulates level up on a clone and diffs: HP, proficiency, spell slots, pact slots, max prepared, spell save DC, spell attack, class resources, spell learning, ASI, subclass.

**`LevelUpModal` steps:**

1. Pick class (if multiclass).
2. Choose subclass if required and not yet chosen.
3. HP: **roll or average** (average = `floor(hitDie / 2) + 1 + CON`).
4. ASI if at ASI level: `+2` / `+1+1` **OR** Feat (only if `allowFeatInsteadOfASI`).
5. Learn new spells/cantrips if known caster.
6. **Live preview** of what will change before confirming.
7. `applyLevelUp(charId, payload)` mutates the character.

**XP modes:**

- `levelingMode: 'xp'` — level up button lights up when `exp >= xpToNext`.
- `levelingMode: 'milestone'` — button always active (DM decides).

> `levelUpIfNeeded` was **removed** — level up is only user-triggered via `db-levelup-icon` in `CharacterStats`.

### Rests

**Short rest** (`ShortRestModal` → `shortRest(charId)`):

- Spend hit dice via `HitDiceTracker` (roll + CON per die).
- Resets pact slots.
- Resets class resources with `recharge: 'short'`.
- Triggers `AUTO_REST_RECOVERY` features (Sorcerous Restoration).
- Clears partial recovery cooldowns where `cooldown === 'short'`.

**Long rest** (`LongRestModal` → `longRest(charId)`):

- Restores HP to max, temp HP → 0.
- All spell slots reset.
- Half of hit dice restored (`restoreHitDiceOnLongRest`).
- Death saves reset.
- All class resources reset.
- `partialRecoveryUsed` cleared.
- Fires `onComplete` callback → `PrepareSpellsModal` → `SwapSpellModal` (sequence for casters).

### Inspiration

Single boolean flag `character.inspiration`.

- `InspirationBadge` (in header) — click to **grant if empty**, **spend if filled**.
- `AttackRoller` and `DiceRoller` show **"Reroll with Inspiration"** when `character.inspiration === true`.
- `grantInspiration` / `spendInspiration` in context.

### Migrations

Character data has a `schemaVersion: number`.

`constants/schema.ts`:

```ts
export const CURRENT_SCHEMA_VERSION = 1;
```

`context/migrations.ts`:

```ts
migrate(raw) → Character
```

Runs every registered `migrate_vN_to_vN1` in order from stored version to current.

Currently: `migrate_v0_to_v1` covers all pre-schema migrations (classLevels, skills, tool proficiencies, spell slots, hit dice, class resources, leveling, inventory IDs, etc.).

**When adding a new field:**

1. Bump `CURRENT_SCHEMA_VERSION`.
2. Add `migrate_vN_to_vN1` in `migrations.ts`.
3. Register in `MIGRATIONS` object.
4. `addCharacter` sets `schemaVersion: CURRENT_SCHEMA_VERSION` explicitly.

---

## Utilities reference

| File | Purpose |
|------|---------|
| `utils/characterUtils.ts` | `getModifier`, `getACInfo`, `getSkillBonus`, `getAttackBonuses`, `getProficiencyBonus` (re-export) |
| `utils/proficiency.ts` | `getProficiencyBonus(level)` — single source |
| `utils/spellcasting.ts` | Slots, pact magic, max prepared |
| `utils/spellUtils.ts` | Save DC, attack, damage, ability resolution, element detection |
| `utils/classSpellUtils.ts` | Per-class spell access, subclass spells, expanded spells |
| `utils/spellLearning.ts` | Known-caster spell learning candidates |
| `utils/spellPreparation.ts` | Long-rest prepared-caster flow |
| `utils/spellSwap.ts` | Known-caster spell swap |
| `utils/classResources.ts` | Generic class resource resolution |
| `utils/maneuvers.ts` | Battle Master limits and save DC |
| `utils/metamagic.ts` | Metamagic costs and limits |
| `utils/partialRecovery.ts` | Arcane/Natural Recovery |
| `utils/leveling.ts` | XP, ASI, HP, subclass, preview, payload |
| `utils/hitDice.ts` | Hit die pools, roll, long-rest restore |
| `utils/format.ts` | `ordinal(n)` — "1st", "2nd", "3rd", … |
| `utils/currencyUtils.ts` | Currency normalization |
| `utils/characterIO.ts` *(planned)* | Export/import character JSON |

---

## Storage

- **Key:** `dnd_characters` in `localStorage`
- **Shape:** `Character[]` (array)
- **Auto-saved** on every `characters` change in `CharacterContext`
- **Loaded once on mount**, each entry through `migrate()`

**Clear all data:**

```js
localStorage.removeItem('dnd_characters');
```

---

## Development

### npm scripts

| Script | What it does |
|--------|--------------|
| `npm start` | Start the CRA dev server at `http://localhost:3000` |
| `npm run build` | Production build to `./build` |
| `npm test` | Run Jest tests in watch mode (CRA + RTL) |
| `npm run eject` | ⚠️ Ejects CRA config (one-way, do not use unless necessary) |

### Adding a new class resource

1. Add entry to `CLASS_RESOURCES` in `constants/classResources.ts`.
2. **Done.** UI and rests pick it up automatically via `getAvailableClassResources`.

### Adding a new spell to the library

1. Edit `constants/spells/levelN.ts` (or `cantrips.ts`).
2. If it belongs to a class, also add its name to `CLASS_SPELL_LISTS[className]` in `constants/classSpellLists.ts`.
3. If it's a ritual, add to `RITUAL_SPELL_NAMES` in `constants/ritualSpells.ts` (or set `isRitual: true` on the spell itself).

### Adding a new ASI-granting class

If a homebrew class has ASI at non-standard levels, add to `ASI_LEVELS_BY_CLASS` in `constants/leveling.ts`.

### Debugging migrations

DevTools → Application → Local Storage → `dnd_characters`.

Every character should have `schemaVersion: CURRENT_SCHEMA_VERSION`.

If a character is **stuck at an old version** after reload, check that:

- `MIGRATIONS` in `migrations.ts` has an entry for every version step.
- No migration throws (errors are caught in the load `try/catch`, character is dropped).

---

## Style guide

- Comments in code may be **Russian or English** — no rule
- `interface` for prop types and data shapes, `type` for unions
- **Pure functions** in `utils/`, **side effects only** in `context/` or `components/`
- **No `any` in new code** — use `unknown` + type guards if needed
- `React.memo` for list items that render frequently (`SpellCard`, `SkillCheck`)
- Imports are **relative** (no path aliases configured)

---

*Schema v1 · Personal project · Last updated: 2026*