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
  'Linked':    'Linked Weapons can only shoot at targets in the same tile or adjacent tiles to the target of other Linked Weapons.\nResolve Linked Weapons in any order.\n- The first Linked weapon has no restriction.\n- Each following Linked weapon\'s target must be within 1 range of all previous targets of Linked Weapons.',
  'Blast':      'Blast Weapons target tiles, and deal damage to every unit within that tile.',
  'Frontal':       'Frontal Weapons can only target enemies/tiles in the unit\'s front arc.',
  'Lateral': '',
  'Rear':    '',
  'Precision':    'Precision Weapons can target units within Fortifications and ignore Evasion rolls.',
  'Long':     'Long Weapons have higher Range than normal (+2, included in the weapon profile).',
  'Short':     'Short Weapons have lower Range than normal (-1, included in the weapon profile).',
  'Burst X':     'Burst Weapons make an additional shot at the same target if it is within X range.',
  'Point Blank X':     '',
  'Indirect Fire':     'Indirect Fire Weapons do not need LoS to shoot at targets.',
  'HE':     'HE Weapons have worse penetration and more Fortification damage than normal (-2 and +1 respectively, included in the weapon profile)',
  'Loading':     'Loading Weapons have a Charge characteristic (X), and consume 1 Charge each time they shoot.\nAt the beginning of each cycle, restore all Loading Weapons\' Charge to full.',
};

// ── Tag descriptions ──────────────────────────────────────────────────────────
// Tags that have rule descriptions shown in the detail panel alongside keywords.
// Only tags listed here will appear in the glossary section.
export const TAG_DESCRIPTIONS = {
  'Brittle': '+2AP to all shots that target this unit.',
  'Sturdy': '-2AP to all shots that target this unit. Cannot push a roll result under 4.',
  'Transport': 'Units that can carry other units. Carried units do not contribute to MP or cost, and are not affected by damage until the transport is destroyed.',
  'Slopped Armor': '-4AP to AC; -2AP to ST and HERs targetting this unit. Ignore when rolling down.',
  'Composite Armor': '-4AP to AC and HERs; -2AP to ST, HESH, HEAT, Tandem, and APFSDSs targetting this unit. Ignore when rolling down.',
  'ERA Armor': '-8AP to HER; -4AP to ST, AC, HESH, HEAT, APFSDS and ATGMs targetting this unit. Two charges per battle, used automatically.Ignore modifier when rolling down (still consumes a charge).',
  'NERA Armor': '-4AP to HER; -2AP to HESH, HEAT and Tandem targetting this unit. Ignore when rolling down.',
  'Spaced Armor': '-2AP to ST, AC, HEAT, Tandem and HERs targetting this unit. Ignore when rolling down.',
  'Slat Armor': '-4AP to HER; -2AP to HESH and HEAT targetting this unit. Ignore when rolling down.',
  'APS Protection': '+4 dodge against HEAT, HER and ATGM; +2 dodge against HESH and Tandem.',
  'Large': 'Large units are 1 size bigger than normal.',
  'Small': 'Small units are 1 size smaller than normal.',

};
