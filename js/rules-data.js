// ─────────────────────────────────────────────────────────────────────────────
// LEAD LEDGER — EXTENDED RULES
// ─────────────────────────────────────────────────────────────────────────────
//
// HOW TO EDIT:
//   Each entry in the RULES array is one of four types:
//
//   { type: 'section',    id: '1',      title: 'Section Title' }
//     → Major heading.  id is a single digit (1–9).
//
//   { type: 'subsection', id: '100',    title: 'Subsection Title' }
//     → Sub-heading.    id is a 3-digit number (e.g. 100, 101, 212).
//
//   { type: 'rule',       id: '100.1',  text: 'Rule text.' }
//     → Individual rule. id is subsection.number (e.g. 100.1, 212.5).
//
//   { type: 'subrule',    id: '100.1a', text: 'Subrule text.' }
//     → Paragraph (alinea) under a rule. id adds a letter (100.1a, 100.1b…).
//
// TIPS:
//   • Keep entries in numeric/alphabetic order — the page renders them as-is.
//   • Use plain text; HTML is NOT supported in text/title fields.
//   • Add JS line-comments (//) freely for your own notes.
//   • To add a new section, copy an existing section block and change the ids.
//
// ─────────────────────────────────────────────────────────────────────────────
export const RULES = [

  // ══════════════════════════════════════════════════════════════════════════
  // 1. GAME CONCEPTS
  // ══════════════════════════════════════════════════════════════════════════
  { type: 'section', id: '1', title: 'Game Concepts' },

    // 100. General
    { type: 'subsection', id: '100', title: 'General' },
    { type: 'rule', id: '100.1', text: 'These Extended Rules provide the official guidelines for playing Lead Ledger and apply to all game scenarios unless otherwise specified.' },
    { type: 'subrule', id: '100.1a', text: 'The Extended Rules are the primary reference for resolving any ambiguities or conflicts in the game. Any other official materials are a simplified version and should be considered secondary.' },
    { type: 'rule', id: '100.2', text: 'To play Lead Ledger, each player must construct an Army List following the guidelines outlined in section 2 of the Extended Rules.' },
    { type: 'rule', id: '100.3', text: 'Each player needs several six and twelve-sided dice (d6 and d12) to resolve various game effects.' },
    { type: 'rule', id: '100.4', text: 'Some game objects may require additional markers and tokens to track their status or effects.' },

    // 101. The Golden Rule
    { type: 'subsection', id: '101', title: 'The Golden Rules' },
    { type: 'rule', id: '101.1', text: 'Whenever a rule, effect or ability text contradicts these Extended Rules, the rule, effect or ability text takes precedence.' },
    { type: 'rule', id: '101.2', text: 'If an effect allows or directs something to happen, and another states it can\'t happen, the \"can\'t\" effect takes precedence.' },
    { type: 'rule', id: '101.3', text: 'If two effects contradict each other simultaneously, the newer effect takes precedence.' },
    { type: 'rule', id: '101.4', text: 'If an effect requires multiple players to make a choice, the Active player chooses first, followed by the other players in turn order.' },

    // 102. Players
    { type: 'subsection', id: '102', title: 'Players' },
    { type: 'rule', id: '102.1', text: 'A player is an individual participating in the game and commanding an Army.' },
    { type: 'rule', id: '102.1a', text: 'If multiple people are teaming up to control a single Army (for example, to teach a new player), they collectively act as one player.' },
    { type: 'rule', id: '102.2', text: 'The active player is the one currently taking their turn. All others are non-active players.' },
    { type: 'rule', id: '102.2a', text: 'At some points, there may be no player taking their turn. In that case, the active player is considered to be the last player who took a turn.' },
    { type: 'rule', id: '102.3', text: 'In a two-player or free-for-all game, a player\'s opponents are all other players in the game.' },
    { type: 'rule', id: '102.4', text: 'In a team game, a player\'s teammates are the other players on their team, and their opponents are all players not on their team.' },

    // 103. Starting the Game
    // TODO FROM HERE
    
  // ══════════════════════════════════════════════════════════════════════════
  // 2. ARMIES AND LISTS
  // ══════════════════════════════════════════════════════════════════════════
  { type: 'section', id: '2', title: 'Armies and Lists' },

    // 200. Army Construction
    { type: 'subsection', id: '200', title: 'Army Construction' },
    { type: 'rule', id: '200.1', text: 'Before the game, each player constructs an Army List that respects the limits of the chosen Game Size.' },
    { type: 'rule', id: '200.2', text: 'An Army List must include one or more Regiments selected from the available roster.' },
    { type: 'rule', id: '200.3', text: 'Each unit in the Army List belongs to exactly one Regiment and must be available within that Regiment.' },
    { type: 'subrule', id: '200.3a', text: 'A unit cannot appear more than once in the same Army List unless its entry explicitly states otherwise.' },
    { type: 'rule', id: '200.4', text: 'The total MP (Man Power) cost of all units cannot exceed the MP limit of the chosen Game Size. The same restriction applies to Mats (Materials) independently.' },
    { type: 'rule', id: '200.5', text: 'Both MP and Mats limits must be respected simultaneously. An Army List that is within the MP limit but exceeds the Mats limit is invalid, and vice versa.' },

    // 201. Game Sizes
    { type: 'subsection', id: '201', title: 'Game Sizes' },
    { type: 'rule', id: '201.1', text: 'The four standard Game Sizes are: Skirmish, Engagement, Conquest, and Dominion.' },
    { type: 'rule', id: '201.2', text: 'Skirmish: 150 MP / 300 Mats.' },
    { type: 'rule', id: '201.3', text: 'Engagement: 225 MP / 450 Mats.' },
    { type: 'rule', id: '201.4', text: 'Conquest: 300 MP / 600 Mats.' },
    { type: 'rule', id: '201.5', text: 'Dominion: 450 MP / 900 Mats.' },

    // 202. Regiments
    { type: 'subsection', id: '202', title: 'Regiments' },
    { type: 'rule', id: '202.1', text: 'A Regiment is a named faction that provides a roster of units, a Regiment Rule, a Scheme, and optional Commands.' },
    { type: 'rule', id: '202.2', text: 'A player may include any number of Regiments in their Army List, subject to the unit availability rules in section 200.' },
    { type: 'rule', id: '202.3', text: 'Each Regiment\'s Rule and Scheme are always active for the owning player, regardless of how many units from that Regiment are in the Army List.' },

  // ══════════════════════════════════════════════════════════════════════════
  // 3. UNITS
  // ══════════════════════════════════════════════════════════════════════════
  { type: 'section', id: '3', title: 'Units' },

    // 300. Unit Basics
    { type: 'subsection', id: '300', title: 'Unit Basics' },
    { type: 'rule', id: '300.1', text: 'A Unit is the fundamental piece of an Army. Each unit has statistics, a type, tags, weapons, and abilities.' },
    { type: 'rule', id: '300.2', text: 'The four Unit Types are: Infantry, Vehicle, Fortification, and Support.' },
    { type: 'subrule', id: '300.2a', text: 'Infantry units are foot soldiers and light crews. They are the most common unit type.' },
    { type: 'subrule', id: '300.2b', text: 'Vehicle units are mechanized platforms. They typically have higher HP and heavier weapons at the cost of lower agility.' },
    { type: 'subrule', id: '300.2c', text: 'Fortification units are stationary defensive structures. They cannot be given Move Orders.' },
    { type: 'subrule', id: '300.2d', text: 'Support units provide passive bonuses or ongoing field effects. They do not take standard Attack or Move actions.' },
    { type: 'rule', id: '300.3', text: 'A unit on the battlefield is controlled by the player who included it in their Army List.' },

    // 301. Unit Statistics — MACH
    { type: 'subsection', id: '301', title: 'Unit Statistics — MACH' },
    { type: 'rule', id: '301.1', text: 'Each unit\'s core statistics are represented by the MACH acronym: Move (M), Attack (A), Counter (C), and HP.' },
    { type: 'rule', id: '301.2', text: 'Move (M): the maximum number of tiles the unit may traverse when it is given a Move Order.' },
    { type: 'rule', id: '301.3', text: 'Attack (A): the number of dice rolled when the unit performs an Attack Action.' },
    { type: 'rule', id: '301.4', text: 'Counter (C): the number of dice rolled when the unit performs a Counter-Attack.' },
    { type: 'rule', id: '301.5', text: 'HP: the unit\'s Health Points. When this total reaches 0, the unit is immediately removed from the battlefield.' },
    { type: 'rule', id: '301.6', text: 'Fortification units do not have Move or Counter statistics. Support units have no statistics.' },

    // 302. Tags
    { type: 'subsection', id: '302', title: 'Tags' },
    { type: 'rule', id: '302.1', text: 'Tags are keywords that modify how a unit behaves in the game. A unit may have any number of tags.' },
    { type: 'rule', id: '302.2', text: 'Assault: This unit may perform both a Move and an Attack in the same Activation.' },
    { type: 'rule', id: '302.3', text: 'Brittle: This unit takes double damage from weapons carried by Vehicle units.' },
    { type: 'rule', id: '302.4', text: 'Transport N: This unit can carry up to N Infantry units. Embarked units cannot act until they disembark.' },
    { type: 'rule', id: '302.5', text: 'Loading N: After using this unit\'s designated ability, it cannot use that ability again for N Cycles.' },
    { type: 'subrule', id: '302.5a', text: 'A numeric suffix indicates the number of Cycles required. "Loading 2" means the ability cannot be used for 2 full Cycles after use.' },
    { type: 'rule', id: '302.6', text: 'Autonomous: This unit is a constructed or automated unit, not a living soldier. It is immune to morale effects.' },

    // 303. Weapons
    { type: 'subsection', id: '303', title: 'Weapons' },
    { type: 'rule', id: '303.1', text: 'Each unit may have one or more Weapons defined in its entry. A weapon has a Name, Range, Damage (DMG), and Armour Penetration (AP).' },
    { type: 'rule', id: '303.2', text: 'Range: the maximum number of tiles between the attacking unit and its target, measured in a straight line.' },
    { type: 'rule', id: '303.3', text: 'DMG: the amount of HP removed from the target for each successful hit.' },
    { type: 'rule', id: '303.4', text: 'AP: reduces the target\'s effective defence when resolving the attack.' },

  // ══════════════════════════════════════════════════════════════════════════
  // 4. GAME STRUCTURE
  // ══════════════════════════════════════════════════════════════════════════
  { type: 'section', id: '4', title: 'Game Structure' },

    // 400. Cycles
    { type: 'subsection', id: '400', title: 'Cycles' },
    { type: 'rule', id: '400.1', text: 'A game of Lead Ledger is divided into a series of Cycles. The total number of Cycles is determined by the Game Size.' },
    { type: 'rule', id: '400.2', text: 'Each Cycle consists of alternating Activations between both players, beginning with the player who currently holds Priority.' },
    { type: 'rule', id: '400.3', text: 'A Cycle ends when all units on both sides have been Activated, or when both players consecutively pass their Activation.' },
    { type: 'rule', id: '400.4', text: 'At the end of each Cycle, Victory Points are scored, Loading counters are decremented, and Priority passes to the other player.' },

    // 401. Activations
    { type: 'subsection', id: '401', title: 'Activations' },
    { type: 'rule', id: '401.1', text: 'On your Activation, you must Order one of your eligible units. Each unit may only be Ordered once per Cycle.' },
    { type: 'rule', id: '401.2', text: 'A unit that has been Ordered is considered Activated for that Cycle and cannot be Ordered again until the next Cycle.' },
    { type: 'rule', id: '401.3', text: 'If a player has no eligible units to Order, they must pass their Activation. Play then passes to the opponent.' },
    { type: 'subrule', id: '401.3a', text: 'Passing does not prevent a player from Ordering units in subsequent Activations within the same Cycle if eligible units become available.' },

    // 402. Orders
    { type: 'subsection', id: '402', title: 'Orders' },
    { type: 'rule', id: '402.1', text: 'When you Order a unit, you choose one of the following standard Orders to give it: Move, Attack, or Ability.' },
    { type: 'rule', id: '402.2', text: 'Move Order: the unit may move up to its Move (M) stat in tiles.' },
    { type: 'rule', id: '402.3', text: 'Attack Order: the unit performs an Attack Action against a valid target within weapon range.' },
    { type: 'rule', id: '402.4', text: 'Ability Order: the unit uses one of its listed abilities, following that ability\'s specific instructions.' },

  // ══════════════════════════════════════════════════════════════════════════
  // 5. COMBAT
  // ══════════════════════════════════════════════════════════════════════════
  { type: 'section', id: '5', title: 'Combat' },

    // 500. Attacking
    { type: 'subsection', id: '500', title: 'Attacking' },
    { type: 'rule', id: '500.1', text: 'To perform an Attack, the attacking unit must have a valid target within the range of one of its weapons.' },
    { type: 'rule', id: '500.2', text: 'The attacker rolls a number of dice equal to its Attack (A) statistic.' },
    { type: 'rule', id: '500.3', text: 'Each die that meets or exceeds the target number counts as a hit. The target number is determined by the scenario rules.' },
    { type: 'rule', id: '500.4', text: 'For each hit, the target loses HP equal to the weapon\'s DMG value, reduced by the target\'s defence minus the weapon\'s AP.' },

    // 501. Counter-Attacks
    { type: 'subsection', id: '501', title: 'Counter-Attacks' },
    { type: 'rule', id: '501.1', text: 'After an Attack is resolved, the defending unit may perform a Counter-Attack against the attacker if it is within range of one of the defender\'s weapons.' },
    { type: 'rule', id: '501.2', text: 'A Counter-Attack uses the Counter (C) statistic instead of Attack (A).' },
    { type: 'rule', id: '501.3', text: 'Fortification and Support units cannot perform Counter-Attacks.' },

  // ══════════════════════════════════════════════════════════════════════════
  // 6. COMMANDS AND ABILITIES
  // ══════════════════════════════════════════════════════════════════════════
  { type: 'section', id: '6', title: 'Commands and Abilities' },

    // 600. Command Points
    { type: 'subsection', id: '600', title: 'Command Points' },
    { type: 'rule', id: '600.1', text: 'Command Points (CP) are a resource players spend to use Commands.' },
    { type: 'rule', id: '600.2', text: 'Each player begins the game with a number of CP determined by the Game Size. CP may also be gained through Schemes and certain abilities.' },
    { type: 'rule', id: '600.3', text: 'CP are not carried over between games.' },

    // 601. Commands
    { type: 'subsection', id: '601', title: 'Commands' },
    { type: 'rule', id: '601.1', text: 'Commands are special actions a player may take by spending CP. Commands come from two sources: Base Commands available to all players, and Regiment Commands specific to Regiments in the player\'s Army List.' },
    { type: 'rule', id: '601.2', text: 'Commands may be used at the timing stated on the Command, not outside of it.' },
    { type: 'rule', id: '601.3', text: 'Each Command lists its CP cost, timing, valid targets, and effect.' },

    // 602. Schemes
    { type: 'subsection', id: '602', title: 'Schemes' },
    { type: 'rule', id: '602.1', text: 'Each Regiment provides one Scheme: a conditional bonus that activates when its requirements are met.' },
    { type: 'rule', id: '602.2', text: 'A Scheme\'s timing entry states when it is evaluated. Some Schemes trigger at the end of a Cycle; others trigger immediately when their condition is met.' },
    { type: 'rule', id: '602.3', text: 'A player may only benefit from each Scheme once per Cycle unless the Scheme explicitly states otherwise.' },

];
