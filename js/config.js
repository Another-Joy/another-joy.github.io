// ── Main tag categories ───────────────────────────────────────────────────────
// Controls grouping order in the builder sidebar and center list.
// Must match tag strings used in regiment JSON files.
export const MAIN_TAGS = ['Infantry', 'Vehicle', 'Fortification', 'Support'];

// ── Army Size Limits ──────────────────────────────────────────────────────────
// Costs are split into Man Power (MP) and Materials (Mats) — each has its own
// independent limits. Edit these arrays to set your game's size categories.
export const MP_LIMITS = [
  { label: 'Skirmish',     points: 10  },
  { label: 'Battle',       points: 25  },
  { label: 'Grand Battle', points: 50  },
  { label: 'Epic',         points: 100 },
];

export const MATS_LIMITS = [
  { label: 'Skirmish',     points: 500  },
  { label: 'Battle',       points: 1000 },
  { label: 'Grand Battle', points: 2000 },
  { label: 'Epic',         points: 4000 },
];

// ── Keyword descriptions ──────────────────────────────────────────────────────
// Keys must exactly match keyword strings used in regiment JSON weapon arrays.
// These descriptions are shown below a unit's profile in the detail panel.
export const KEYWORDS = {
  'Reach':       'This weapon can attack targets one additional hex away.',
  'Piercing':    'Reduces the target\'s effective Armor by one step when resolving Penetration.',
  'Volley':      'Can be used even if this unit moved during the current activation.',
  'Blast':       'On a hit, all units within 1 hex of the target are also hit.',
  'Suppressing': 'On a successful hit, the target loses 1 Control until end of round.',
  'Reliable':    'This weapon never generates a Jam result.',
  'Indirect':    'Can target units not in line of sight, with no range penalty.',
  'Fortify':     'When fired from inside a Fortification, doubles the weapon\'s base damage.',
};
