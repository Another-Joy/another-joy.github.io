// ── Main tag categories ───────────────────────────────────────────────────────
// Controls grouping order in the builder sidebar and center list.
// Must match tag strings used in regiment JSON files.
export const MAIN_TAGS = ['Infantry', 'Vehicle', 'Fortification', 'Support'];

// ── Army Size Limits ──────────────────────────────────────────────────────────
// Each size defines both the MP (Man Power) and Mats (Materials) limits.
export const GAME_SIZES = [
  { label: 'Skirmish',    mp: 150, mats: 300 },
  { label: 'Engagement',  mp: 225, mats: 450 },
  { label: 'Conquest',    mp: 300, mats: 600 },
  { label: 'Dominion',    mp: 450, mats: 900 },
];

// ── Keyword descriptions ──────────────────────────────────────────────────────
// Keys must exactly match keyword strings used in regiment JSON weapon arrays.
// These descriptions are shown below a unit's profile in the detail panel.
export const KEYWORDS = {
  'Assault':       'When you Advance a unit with an Assault weapon, you may then Minor it to shoot, and only Weapons with Assault can shoot.',
  'Linked':    'Reduces the target\'s effective Armor by one step when resolving Penetration.',
  'Blast':      'Blast Weapons target tiles, and deal damage to every unit within that tile.',
  'Frontal':       'On a hit, all units within 1 hex of the target are also hit.',
  'Lateral': 'On a successful hit, the target loses 1 Control until end of round.',
  'Rear':    'This weapon never generates a Jam result.',
  'Precision':    'Precision Weapons can target units within Fortifications and ignore Evasion rolls.',
  'Long':     'Long Weapons have higher Range than normal (+2, included in the weapon profile).',
  'Short':     'Short Weapons have lower Range than normal (-1, included in the weapon profile).',
  'Burst X':     'When fired from inside a Fortification, doubles the weapon\'s base damage.',
  'Point Blank':     'When fired from inside a Fortification, doubles the weapon\'s base damage.',
  'Indirect Fire':     'Indirect Fire Weapons do not need LoS to shoot at targets.',
  'HE':     'When fired from inside a Fortification, doubles the weapon\'s base damage.',
  'Loading':     'Loading Weapons have a Charge characteristic (X), and consume 1 Charge each time they shoot.\nAt the beginning of each cycle, restore all Loading Weapons\' Charge to full.',
};

// ── Tag descriptions ──────────────────────────────────────────────────────────
// Tags that have rule descriptions shown in the detail panel alongside keywords.
// Only tags listed here will appear in the glossary section.
export const TAG_DESCRIPTIONS = {
  'Infantry':     'Infantry units move on foot and can enter most terrain. They benefit from Cover when inside Fortifications.',
  'Vehicle':      'Vehicle units ignore rough terrain movement penalties but cannot enter Fortifications.',
  'Fortification':'Fortification units are immobile structures. Friendly Infantry units may occupy them to gain Cover and use their weapons.',
  'Support':      'Support units provide passive effects to nearby allies and cannot be the primary target of enemy actions.',
};
