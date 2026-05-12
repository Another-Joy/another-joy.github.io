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

    // 103. Army Sizes
    { type: 'subsection', id: '103', title: 'Army Sizes' },
    { type: 'rule', id: '103.1', text: 'The Army Size determines the cost limits for Contracting and Deployment, the number of Cycles, and the map size' },
    { type: 'subrule', id: '103.1a', text: 'Contracting limits refer to the total MP and Mats cost of all Assets included in the Army List. Deployment limits refer to the total MP and Mats cost of all Assets deployed on the battlefield and in reserves at the start of the game.' },
    { type: 'rule', id: '103.2', text: 'A game cannot be played between armies of different sizes.' },
    { type: 'rule', id: '103.3', text: 'The four standard Game Sizes are: Skirmish, Engagement, Conquest, and Dominion.' },
    { type: 'rule', id: '103.3a', text: 'Skirmish:  Contracting: 150 MP / 300 Mats. Deployment: 100 MP / 200 Mats. 6 Cycles. 13 tiles.' },
    { type: 'rule', id: '103.3b', text: 'Engagement:  Contracting: 225 MP / 450 Mats. Deployment: 150 MP / 300 Mats. 10 Cycles. 13 tiles.' },
    { type: 'rule', id: '103.3c', text: 'Conquest:  Contracting: 300 MP / 600 Mats. Deployment: 200 MP / 400 Mats. 15 Cycles. 15 tiles.' },
    { type: 'rule', id: '103.3d', text: 'Dominion:  Contracting: 450 MP / 900 Mats. Deployment: 300 MP / 600 Mats. 22 Cycles. 17 tiles.' },

    // 104. Starting the Game
    { type: 'subsection', id: '104', title: 'Starting the Game' },
    { type: 'rule', id: '104.1', text: 'At the start of the game, players must first present their Army Lists to each other, as well as any other relevant information related to their Army.' },
    { type: 'rule', id: '104.2', text: 'After both players have presented their Army Lists, they determine which one of them will choose who takes the first turn. Any mutually agreeable method may be used for this.' },
    { type: 'subrule', id: '104.2a', text: 'Examples include, but are not limited to: coin flip, dice roll, rock-paper-scissors, or any other random method.' },
    { type: 'subrule', id: '104.2b', text: 'In a two player game, the starting player takes the odd turns, and the other player takes the even turns.' },
    { type: 'rule', id: '104.3', text: 'After the first player is determined, 5 missions are drawn from the mission deck. Players take turns banning missions until only one mission remains, which becomes the mission for the game.' },
    { type: 'subrule', id: '104.3a', text: 'The number of missions drawn may vary based on the game\'s context, such as the number of players, if it\'s a competitive or casual game, or other factors.' },
    { type: 'rule', id: '104.4', text: 'Each player chooses a Scheme from their available options as public information, starting from the starting player.' },
    { type: 'rule', id: '104.5', text: 'Setup the map according to the mission requirements, such as Objective locations and terrain features.' },
    { type: 'rule', id: '104.6', text: 'Each player starts deploying their Assets in turn order, beginning with the starting player.' },
    { type: 'subrule', id: '104.6a', text: 'The total deployed costs of a player\'s deployed Assets can never exceed the Deployment Limit.' },
    { type: 'subrule', id: '104.6b', text: 'Each player may only deploy one Asset at a time.' },
    { type: 'subrule', id: '104.6c', text: 'Players can deploy Assets on their map edge or on a tile adjacent to one of their Assets.'},
    { type: 'subrule', id: '104.6d', text: 'Players may stop deploying at any time. If a player stops deploying, their turn is skipped for the rest of the deployment phase.' },
    { type: 'subrule', id: '104.6e', text: 'If all players stop deploying, the deployment phase ends.' },
    { type: 'rule', id: '104.7', text: 'After deployment, players may place Assets into Reserves, following turn order.'},
    { type: 'subrule', id: '104.7a', text: 'Assets in Reserves are not placed on the battlefield, but instead are set aside.' },
    { type: 'subrule', id: '104.7b', text: 'The total deployed costs of a player\'s deployed Assets and Assets in Reserves can never exceed the Deployment Limit.' },
    { type: 'subrule', id: '104.7c', text: 'The Reserves Phase functions the same as the Deployment Phase, with players skipping their turn when they are finished.' },
    { type: 'rule', id: '104.8', text: 'Any Assets that are not Deployed or in Reserves at the end of the Reserves Phase are considered Out of Battle, are not available for the game and cannot be used in any way.' },
    { type: 'rule', id: '104.9', text: 'After Assets are placed Out of Battle, players may take any actions that can be taken before the battle, following turn order.' },
    { type: 'rule', id: '104.10', text: 'The battle begins with the beginning of the first cycle' },


    // 105. Ending the Game
    { type: 'subsection', id: '105', title: 'Ending the Game' },
    { type: 'rule', id: '105.1', text: 'The game ends immediately when any player wins, or when the total number of cycles is reached.' },
    { type: 'rule', id: '105.2', text: 'A player still in the game wins if that player\'s opponents have all left or lost the game.' },
    { type: 'rule', id: '105.3', text: 'If all of a player\'s Assets are removed from the battlefield, that player immediately loses the game.' },
    { type: 'rule', id: '105.4', text: 'At the end of the game, the player with the highest Victory Points (VP) total is the winner. If there is a tie in VP totals, the game ends in a draw.' },


    // 106. Orders
    { type: 'subsection', id: '106', title: 'Orders' },
    { type: 'rule', id: '106.1', text: 'Orders are used by players to pay the various costs associated with actions, commands and abilities.' },
    { type: 'rule', id: '106.2', text: 'The two types of Orders: Primary Orders and Secondary Orders.' },
    { type: 'rule', id: '106.3', text: 'At the beginning of each turn, the active player receives 1 Primary Order and 1 Secondary Order.' },
    { type: 'subrule', id: '106.3a', text: 'Orders are lost at the end of the turn if they are not used.' },
    { type: 'subrule', id: '106.3b', text: 'Some abilities may allow a player to gain, store or convert Orders.' },
    { type: 'rule', id: '106.4', text: 'Orders generated from non-standard sources can have restrictions on how they can be used.' },

    // 107. Assets
    { type: 'subsection', id: '107', title: 'Assets' },
    { type: 'rule', id: '107.1', text: 'Assets are the primary pieces on the battlefield that players control and use to achieve their objectives.' },
    { type: 'rule', id: '107.2', text: 'Each Asset has a set of statistics, tags, weapons and abilities that define its capabilities and interactions in the game.' },
    { type: 'rule', id: '107.3', text: 'Assets can be given Orders to perform actions such as moving, attacking or using abilities.' },

    // 108. Markers
    { type: 'subsection', id: '108', title: 'Markers' },
    { type: 'rule', id: '108.1', text: 'Markers are used to track various game states, effects and conditions on the battlefield.' },
    { type: 'rule', id: '108.2', text: 'Many Markers are not physical objects and exist only as game state indicators.' },
    { type: 'rule', id: '108.3', text: 'Some Markers can be placed on the battlefield to indicate the presence of an effect or condition in a specific location.' },
    { type: 'rule', id: '108.4', text: 'Each marker has an associated ability or effect that it represents, and that connection must be clearly defined and visible to all players at all times.' },

    // 109. Checks and Rolls
    { type: 'subsection', id: '109', title: 'Checks and Rolls' },
    { type: 'rule', id: '109.1', text: 'Checks are always an integer value and a + or - symbol used to indicate objective.Example: 4+ means rolling 4 or more, 7- means rolling 7 or less.' },
    { type: 'subrule', id: '109.1a', text: 'The + symbol indicates a roll equal to or greater than the number, while the - symbol indicates a roll equal to or less than the number.' },
    { type: 'subrule', id: '109.1b', text: '\"Rolling Up\" refers to rolling a number equal to or greater than the target number, while \"Rolling Down\" refers to rolling a number equal to or less than the target number.' },
    { type: 'rule', id: '109.2', text: 'Unless stated otherwise, all checks use a standard twelve-sided dice (d12).' },
    { type: 'rule', id: '109.3', text: 'A check can be rerolled only once, and only if an ability or effect specifically allows it.' },
    { type: 'subrule', id: '109.3a', text: 'If a check is rerolled, the second result is final, even if it is worse than the first result.' },
    { type: 'subrule', id: '109.3b', text: 'If multiple effects allow a check to be rerolled, Only one can be used and must be chosen before rerolling.' },
    { type: 'subrule', id: '109.3c', text: 'If a check is rerolled due to an effect that triggers on a specific result (e.g. \"Reroll 1s\"), the reroll can only be triggered by the specified result.' },
    { type: 'subrule', id: '109.3d', text: 'If a check involves multiple dice, all dice must be rerolled.' },
    { type: 'rule', id: '109.4', text: 'Multiple checks can be performed simultaneously if these checks are independent and equal in requiments an effects, but each check is resolved independently.' },
    { type: 'rule', id: '109.5', text: 'If a check requires multiple dice, success is determined by the sum of the values rolled.' },


    // 110. Timing and Priority
    { type: 'subsection', id: '110', title: 'Timing and Priority' },
    { type: 'rule', id: '110.1', text: 'Any action, command or effect that is played when another is already on the stack is said to be "in response to" and will resolve first' },
    { type: 'rule', id: '110.2', text: 'Unless an action or ability instructs a player to act, the player that can act is determined by a system of priority. The player with priority can choose to act (by using actions or abilities) or pass.' },
    { type: 'subrule', id: '110.2a', text: 'Priority only allows a player to act. The action or ability must still be of legal timing.' },
    { type: 'rule', id: '110.3', text: 'Which player has priority is determined by the following rules:' },
    { type: 'subrule', id: '110.3a', text: 'The active player receives priority at the beginning of each phase, after any turn-based actions have been resolved and abilities that trigger at the start of the phase have been put on the stack.' },
    { type: 'subrule', id: '110.3b', text: 'The active player receives priority after an action or ability resolves.' },
    { type: 'subrule', id: '110.3c', text: 'A player with priority receives it again when they make an action or activate an ability.' },
    { type: 'subrule', id: '110.3d', text: 'If a player with priority passes, the next player in turn order gains priority.' },
    { type: 'rule', id: '110.4', text: 'If all players pass in succession (that is, if all players pass without acting in between passing), the action or ability on top of the stack resolves. If the stack is empty, the phase ends.' },
    { type: 'rule', id: '110.5', text: 'Whenever a player would get priority, the game first performs all applicable state-based actions as a single event, then repeats this process until no state-based actions are performed. Then any triggered abilities are put on the stack. These steps repeat until no state-based actions are performed and no triggered abilities are put on the stack. Only then does the player receive priority.' },

    
  // ══════════════════════════════════════════════════════════════════════════
  // 2. ARMIES AND LISTS
  // ══════════════════════════════════════════════════════════════════════════
  { type: 'section', id: '2', title: 'Armies and Lists' },

    // 200. Army Construction
    { type: 'subsection', id: '200', title: 'Army Construction' },
    { type: 'rule', id: '200.1', text: 'An Army List is a public collection of Assets, Regiments, and other relevant information that defines the composition of a player\'s forces for a game.' },
    { type: 'subrule', id: '200.1a', text: 'A List must be public at all times during the game, with no attempts to conceal or misrepresent its contents.' },
    { type: 'rule', id: '200.2', text: 'A List must have a designated Game Size.' },
    { type: 'rule', id: '200.2a', text: 'The total MP (Man Power) cost of all Assets cannot exceed the MP limit of the chosen Game Size. The same restriction applies to Mats (Materials) independently.' },
    { type: 'rule', id: '200.2b', text: 'Both MP and Mats limits must be respected simultaneously. An Army List that is within the MP limit but exceeds the Mats limit is invalid, and vice versa.' },
    { type: 'rule', id: '200.3', text: 'An Army List must include one to three Regiments selected from the available roster.' },
    { type: 'rule', id: '200.4', text: 'Each Asset in the Army List must belong to a Regiment selected in the Army List.' },
    { type: 'subrule', id: '200.4a', text: 'A Asset cannot appear more than three times in the same Army List unless its entry explicitly states otherwise.' },
    { type: 'rule', id: '200.5', text: 'In addition to Assets, an Army List includes the relevant Regiment Rules, Schemes, Commands and Created Assets' },

    // 201. Regiments
    { type: 'subsection', id: '201', title: 'Regiments' },
    { type: 'rule', id: '201.1', text: 'A Regiment is a named faction that provides a roster of Assets, a Regiment Rule, a Scheme, and Commands.' },
    { type: 'subrule', id: '201.1a', text: 'Some Regiments also provide information about related Created Assets. These Assets cannot be included as standard Assets in the Army List.' },
    { type: 'rule', id: '201.2', text: 'In order for a Regiment Rule to be active during a battle, at least one Asset from that Regiment must be deployed or in reserves.' },
    { type: 'subrule', id: '201.2a', text: 'This restriction applies player by player, meaning each player must have at least one Asset from their Army List from the Regiment deployed or in reserves for the Regiment Rule to be active.' },
    { type: 'rule', id: '201.3', text: 'Only one Scheme may be active for each player, selected at the beginning of the battle (see section 104).' },

  // ══════════════════════════════════════════════════════════════════════════
  // 3. ASSETS
  // ══════════════════════════════════════════════════════════════════════════
  { type: 'section', id: '3', title: 'Assets' },

    // 300. Asset Basics
    { type: 'subsection', id: '300', title: 'Asset Basics' },
    { type: 'rule', id: '300.1', text: 'An Asset is the fundamental piece of an Army. Each Asset has a dedicated datasheet which provides all it\'s necessary information .' },
    { type: 'rule', id: '300.2', text: 'The four Asset Types are: Units, Fortifications, and Supports.' },
    { type: 'rule', id: '300.3', text: 'Units are soldiers, vehicles, or other mobile forces that can take all Actions.' },
    { type: 'subrule', id: '300.3a', text: 'Units have statistics (MACH) and tags, and may have weapons and abilities.' },
    { type: 'rule', id: '300.4', text: 'Fortification Assets are stationary defensive structures. They cannot move.' },
    { type: 'subrule', id: '300.4a', text: 'Fortifications have Health (H), and may have weapons and abilities.' },
    { type: 'rule', id: '300.5', text: 'Support Assets provide abilities to their attached Asset. They are not deployed on the battlefield and do not take standard Actions.' },
    { type: 'subrule', id: '300.5a', text: 'Support Assets are attached to a single Unit or Fortification Asset when that Asset is deployed.' },
    { type: 'subrule', id: '300.5b', text: 'Support Assets may have restrictions on which Assets they can be attached to. If at any time these restrictions are not met, the Support Asset is destroyed as a state-based action.' },
    { type: 'subrule', id: '300.5c', text: 'In a Support\'s abilities, the term \"Attached Asset\" refers to the Asset it is attached to. Note that \"Asset\" may be replaced with the more specific type of Asset it can attach to.' },
    { type: 'rule', id: '300.6', text: 'When deployed, an Asset is controlled by the player who included it in their Army List.' },
    { type: 'subrule', id: '300.6a', text: 'Assets can have their control transferred under certain conditions. If this happens, that Asset now counts as being on the new controller\'s side for all purposes.' },


    // 301. Asset Statistics — MACH
    { type: 'subsection', id: '301', title: 'Asset Statistics — MACH' },
    { type: 'rule', id: '301.1', text: 'Each Asset\'s core statistics are represented by the MACH acronym: Movement (M), Attack (A), Control (C), and Health (H).' },
    { type: 'rule', id: '301.2', text: 'Movement (M): affects Advance and Relocate Actions, and measures the Asset\'s mobility.' },
    { type: 'rule', id: '301.3', text: 'Armor (A): the armor size of the Asset. Affects shooting and the space it takes on a tile.' },
    { type: 'rule', id: '301.4', text: 'Control (C): affects Conquer and Occupy Actions, and measures the Asset\'s ability to influence Objectives.' },
    { type: 'rule', id: '301.5', text: 'Health (H): the Asset\'s Health Points. When this total reaches 0, the Asset is immediately removed from the battlefield.' },
    { type: 'rule', id: '301.6', text: 'Fortification Assets do not have Movement, Armor or Control statistics. Support Assets have no statistics.' },


    //302. Health
    { type: 'subsection', id: '302', title: 'Health' },
    { type: 'rule', id: '302.1', text: 'An Asset\'s Health must be publicly visible at all times.' },
    { type: 'rule', id: '302.2', text: 'When an Asset takes damage, its Health is reduced by the amount of damage taken.' },
    { type: 'rule', id: '302.3', text: 'If an Asset\'s Health is reduced to 0 or below, it is considered "Destroyed" and is immediately removed from the battlefield.' },
    { type: 'subrule', id: '302.3a', text: 'This is a state-based action and cannot be responded to. Any ability that triggers from an Asset being destroyed is still put on the stack.' },
    { type: 'rule', id: '302.4', text: 'Some abilities or effects may cause an Asset to be removed from the battlefield without being destroyed. In this case, the Asset is not considered destroyed and any abilities that trigger from destruction do not trigger.' },

    // 303. Fortification Assets
    { type: 'subsection', id: '303', title: 'Fortification Assets' },
    { type: 'rule', id: '303.1', text: 'Fortification Assets are stationary structures. They cannot move or perform Control-based actions.' },
    { type: 'rule', id: '303.2', text: 'Fortification Assets have Health (H) as their only statistic.' },
    { type: 'rule', id: '303.3', text: 'Deployed Fortification Assets occupy one slot on their tile per 2 Health they have. Removing Health frees up space on the tile similar to Map Fortifications.' },

    // 304. Tags
    { type: 'subsection', id: '304', title: 'Tags' },
    { type: 'rule', id: '304.1', text: 'Assets have Tags to indicate identity and special abilities.' },
    { type: 'rule', id: '304.2', text: 'Type Tags identify the primary category of an Asset, such as Infantry, Vehicle, Fortification or Support.' },
    { type: 'rule', id: '304.3', text: 'Regiment Tags indicate the specific regiment or unit an Asset belongs to. A Regiment may have more than one Tag to symbolize different affiliations or roles.' },
    { type: 'rule', id: '304.4', text: 'Subtype Tags provide additional classification within a Type, such as APC or Light Tank.' },
    { type: 'rule', id: '304.5', text: 'Keyword Tags provide special abilities or characteristics that modify how an Asset behaves in the game.' },




    // 305. Weapons
    { type: 'subsection', id: '305', title: 'Weapons' },
    { type: 'rule', id: '305.1', text: 'Each Asset may have one or more Weapons defined in its datasheet. A Weapon has a Name, Range, Penetration values against each Armor Size, and Keywords.' },
    { type: 'rule', id: '305.2', text: 'A Weapon\'s Name encodes its caliber and ammo type (e.g. "105mm Attack HEAT"). If no ammo type is stated in the name, the ammo type defaults to Standard (ST).' },
    { type: 'subrule', id: '305.2a', text: 'Valid ammo types are: ST (Standard), AC (Auto Cannon), HESH (High Explosive Squash Head), HEAT (High Explosive Anti-Tank), T-HEAT (Tandem HEAT), APFSDS (Armour-Piercing Fin-Stabilised Discarding-Sabot), HER (High-Explosive Round), and ATGM (Anti-Tank Guided Missile).' },
    { type: 'rule', id: '305.3', text: 'Range (R): the maximum number of tiles between the shooting Asset and its target. Measured along the most direct path available.' },
    { type: 'rule', id: '305.4', text: 'Penetration: each Weapon lists a Penetration Check Objective for each Armor Size — Unarmored (N), Light (L), Medium (M), Heavy (H), and Fortification (F). The value is a Check Objective (e.g. 7+ or 4-).' },
    { type: 'subrule', id: '305.4a', text: 'A value of "NA" means the weapon cannot target that Armor Size at all.' },
    { type: 'rule', id: '305.5', text: 'Weapon Keywords modify how a Weapon and it\'s shots behave.' },
    { type: 'rule', id: '305.6', text: 'Each Weapon on a unit may only be used once per turn, regardless of how many shots it fires.' },

  // ══════════════════════════════════════════════════════════════════════════
  // 4. THE BATTLEFIELD
  // ══════════════════════════════════════════════════════════════════════════
  { type: 'section', id: '4', title: 'The Battlefield' },

    // 400. The Map
    { type: 'subsection', id: '400', title: 'The Map' },
    { type: 'rule', id: '400.1', text: 'A game of Lead Ledger is played on a hexagonal map. The map\'s size is determined by the Army Size chosen for the game (see rule 103.3).' },
    { type: 'rule', id: '400.2', text: 'Each player has a designated map edge. Assets are deployed from and may retreat toward this edge.' },
    { type: 'rule', id: '400.3', text: 'The map is divided into Tiles. Each Tile is a hexagonal area that units can occupy and through which movement and range are measured.' },

    // 401. Tiles and Slots
    { type: 'subsection', id: '401', title: 'Tiles and Slots' },
    { type: 'rule', id: '401.1', text: 'A Tile is the fundamental unit of space on the battlefield and the measurement unit for all ranges in the game.' },
    { type: 'rule', id: '401.2', text: 'Each Tile is subdivided into six triangular Slots. Assets occupy one or more Slots within a Tile, with Unit size determined by their Armor Size and Fortification size determined by their Health.' },
    { type: 'subrule', id: '401.2a', text: 'Unarmored (N) units occupy 1 Slot. Light (L) Units occupy 1 Slot. Medium (M) Units occupy 2 Slots. Heavy (H) Units occupy 3 Slots.' },
    { type: 'subrule', id: '401.2b', text: 'Fortifications occupy 1 slot per 3 Health points.' },
    { type: 'rule', id: '401.3', text: 'Tiles with at least one enemy Asset on them are Enemy Tiles.' },
    { type: 'rule', id: '401.4', text: 'Two Assets cannot share the same Slot.' },

    // 402. Arcs
    { type: 'subsection', id: '402', title: 'Arcs' },
    { type: 'rule', id: '402.1', text: 'From any Tile, there are six Arcs. Each Arc spans 60° and is defined by one of the six adjacent Tiles.' },
    { type: 'rule', id: '402.2', text: 'A Tile is considered within an Arc if it is at least partially within that 60° span. A Tile can therefore belong to more than one Arc simultaneously.' },

    // 403. Fortifications
    { type: 'subsection', id: '403', title: 'Fortifications' },
    { type: 'rule', id: '403.1', text: 'A Tile may contain a Fortification. Fortifications are represented by a variable number of Fortification Slots.' },
    { type: 'rule', id: '403.2', text: 'Each Fortification has a Health value, tracked with pips. Pips can be depleted by shots from units.' },
    { type: 'subrule', id: '403.2a', text: 'When a Fortification takes damage, remove the corresponding number of Health pips from its Slots, prioritizing the already damaged Slots, then the outermost Slots.' },
    { type: 'rule', id: '403.3', text: 'Pips have a color that represents which player controls that portion of the Fortification. Neutral pips have no color.' },
    { type: 'subrule', id: '403.3a', text: 'Fortifications can be owned by a player, Objectives, or be simple map elements.' },
    { type: 'rule', id: '403.4', text: 'Some Fortifications are Objective Fortifications. Objective Fortifications contribute to Scoring at the end of each Cycle (see rule 502.1).' },
    { type: 'rule', id: '403.5', text: 'All Fortifications block Line of Sight.' },

    // 404. Distances and Visibility
    { type: 'subsection', id: '404', title: 'Distances and Visibility' },
    { type: 'rule', id: '404.1', text: 'Distances are measured in Tiles using the most direct path possible. The origin Tile counts as distance 0; the first adjacent Tile is distance 1, and so on.' },
    { type: 'rule', id: '404.2', text: 'Unit A is visible to Unit B if an uninterrupted straight line can be drawn between the center of A\'s main Slot (the centermost triangle) and any part of B\'s model.' },~
    { type: 'rule', id: '404.3', text: 'If a tile (or objects on a tile) blocks Line of Sight, that tile is still visible, but tiles beyond are not.' },
    { type: 'rule', id: '404.4', text: 'Enemy units block Line of Sight. Allied units do not block Line of Sight.' },
    { type: 'rule', id: '404.5', text: 'Fortifications block Line of Sight, except as noted in rule 405.5.' },

    // 405. Objectives
    { type: 'subsection', id: '405', title: 'Objectives' },
    { type: 'rule', id: '405.1', text: 'Map Fortifications are structures placed on the battlefield by missions. They differ from Fortification Assets (see rule 303) and Created Fortifications (see rule 202).' },
    { type: 'rule', id: '405.2', text: 'Each Map Fortification occupies at least one Tile. Within the Fortification Tiles, some Slots are occupied by Health pips. The color of these pips indicates which player controls the Fortification.' },
    { type: 'rule', id: '405.3', text: 'A Fortification\'s Health physically occupies Slots on its Tile. Each Slot holds at most 3 Health pips. As Health is removed, occupied Slots are freed, allowing larger units to enter.' },
    { type: 'rule', id: '405.4', text: 'When a Map Fortification takes damage, do not roll for Penetration. Instead, remove that amount of Health pips directly.' },
    { type: 'subrule', id: '405.4a', text: 'Pips are removed one at a time, starting from the most common color. In case of a tie, remove by priority: Neutral > Enemy > Ally.' },
    { type: 'subrule', id: '405.4b', text: 'Enemy units inside the Fortification suffer a number of 10+ Wounds equal to the damage dealt.' },
    { type: 'rule', id: '405.5', text: 'Units inside a Map Fortification are visible to units outside, but the Fortification itself blocks Line of Sight for units outside.' },
    { type: 'rule', id: '405.6', text: 'A unit inside a Map Fortification can only be targeted by shots at Range 0, but it may shoot any unit outside the Fortification at any range.' },
    { type: 'rule', id: '405.7', text: 'When a unit enters a Map Fortification, its movement ends immediately, regardless of how many Movement Sub-Actions remain.' },
    { type: 'rule', id: '405.8', text: 'Health Checks: when a Fortification has less Health than the combined Health of all units inside, each unit inside may shoot another unit inside, resolving from the unit with the least Health first. This continues until either no enemy units remain inside, or the combined Health of units inside no longer exceeds the Fortification\'s Health.' },
    { type: 'subrule', id: '405.8a', text: 'In the event of a tie in Health for shot priority, the unit controlled by the player who last damaged the Fortification fires first.' },

  // ══════════════════════════════════════════════════════════════════════════
  // 5. TURN STRUCTURE
  // ══════════════════════════════════════════════════════════════════════════
  { type: 'section', id: '5', title: 'Turn Structure' },

    // 500. Turns and Phases
    { type: 'subsection', id: '500', title: 'Turns and Phases' },
    { type: 'rule', id: '500.1', text: 'The Battle Phase is made up of Turns. Each Turn belongs to one player, who is the Active Player for that Turn.' },
    { type: 'subrule', id: '500.1a', text: 'One player takes the odd-numbered Turns; the other takes the even-numbered Turns.' },
    { type: 'rule', id: '500.2', text: 'Each Turn consists of four sequential Phases: the Beginning Phase, the Primary Phase, the Secondary Phase, and the Ending Phase.' },
    { type: 'subrule', id: '500.2a', text: 'The Beginning Phase handles any "at the start of your turn" triggered abilities and effects.' },
    { type: 'subrule', id: '500.2b', text: 'The Primary Phase is when the Active Player may make any Primary Actions.' },
    { type: 'subrule', id: '500.2c', text: 'The Secondary Phase is when the Active Player may make any Secondary Actions.' },
    { type: 'subrule', id: '500.2d', text: 'The Ending Phase handles any "at the end of your turn" triggered abilities and effects. Unused Orders are lost.' },
    { type: 'rule', id: '500.3', text: 'At the beginning of each Turn, the Active Player receives 1 Primary Order and 1 Secondary Order.' },

    // 501. Cycles
    { type: 'subsection', id: '501', title: 'Cycles' },
    { type: 'rule', id: '501.1', text: 'Turns are grouped into Cycles. Each Cycle consists of 10 Turns: 5 per player, alternating.' },
    { type: 'rule', id: '501.2', text: 'Each Cycle consists of: Beginning of Cycle, Turns, Scoring, End of Cycle.' },
    { type: 'subrule', id: '501.2a', text: 'Any "at the beginning of each Cycle" effects trigger at the Beginning of Cycle step, before any Turns take place.' },
    { type: 'subrule', id: '501.2b', text: 'Any "at the end of each Cycle" effects trigger at the End of Cycle step, after Scoring.' },
    { type: 'rule', id: '501.3', text: 'The total number of Cycles in a game is determined by the Army Size (see rule 103.3).' },

    // 502. Scoring
    { type: 'subsection', id: '502', title: 'Scoring' },
    { type: 'rule', id: '502.1', text: 'At the end of each Cycle, each player tallies the number of pips of their color in Objective Buildings and adds that total to their score on the Scoreboard.' },
    { type: 'rule', id: '502.2', text: 'Additional Victory Points may be awarded by the active Mission, Schemes, or special abilities at the times specified by those effects.' },
    { type: 'rule', id: '502.3', text: 'At the end of the game, the player with the highest score wins. In the event of a tie, the game is a draw.' },
    { type: 'rule', id: '502.4', text: 'Win by Annihilation: if all of a player\'s Assets are removed from the battlefield or not deployed, that player immediately loses the game, regardless of score.' },

    // 503. Command Points
    { type: 'subsection', id: '503', title: 'Command Points' },
    { type: 'rule', id: '503.1', text: 'Command Points (CP) are a resource players spend to use Commands (see section 900).' },
    { type: 'rule', id: '503.2', text: 'At the beginning of each Cycle, each player receives 1 CP.' },
    { type: 'rule', id: '503.3', text: 'Each player can store a maximum of 5 CP at any time. CP received beyond 5 are lost.' },

  // ══════════════════════════════════════════════════════════════════════════
  // 6. ACTIONS AND ORDERS
  // ══════════════════════════════════════════════════════════════════════════
  { type: 'section', id: '6', title: 'Actions and Orders' },

    // 600. General
    { type: 'subsection', id: '600', title: 'General' },
    { type: 'rule', id: '600.1', text: 'Actions are the primary way players interact with the battlefield. Actions are performed during the Action Phase of a Turn, in their respective subphases (Primary or Secondary).' },
    { type: 'rule', id: '600.2', text: 'Actions are paid for with Orders. A Primary Order pays for a Primary Action; a Secondary Order pays for a Secondary Action.' },
    { type: 'subrule', id: '600.2a', text: 'If an ability is made "as an Action", it follows the same rules as Actions for timing and resolution.' },
    { type: 'rule', id: '600.3', text: 'Actions are placed on the Stack and can only be activated when the Stack is empty (i.e. no other actions or abilities are waiting to resolve).' },

    // 601. Primary Orders
    { type: 'subsection', id: '601', title: 'Primary Orders' },
    { type: 'rule', id: '601.1', text: 'A Primary Order is spent to perform one of the following Primary Actions during the Primary Phase.' },
    { type: 'rule', id: '601.2', text: 'Advance: Move a unit up to its Movement (M) stat.' },
    { type: 'rule', id: '601.3', text: 'Embark: Move a unit into an adjacent Transport, performing up to 1 Movement Sub-Action to reach it.' },
    { type: 'rule', id: '601.4', text: 'Disembark: Move a unit out of a Transport it is riding, performing up to 1 Movement Sub-Action after exiting.' },
    { type: 'rule', id: '601.5', text: 'Salvo: Shoot with up to all of a unit\'s Weapons, each at a valid target.' },
    { type: 'rule', id: '601.6', text: 'Conquer: Capture a Building by turning its pips to your color. When turning Neutral pips this way, turn twice as many pips.' },
    { type: 'rule', id: '601.7', text: 'Overwatch: Choose one of the unit\'s Weapons and one Arc the unit can shoot into. The unit enters a Focus state. While in Focus, whenever an enemy enters, moves within, or exits this unit\'s weapon range within the chosen Arc, the unit may immediately shoot that enemy with the chosen Weapon.' },
    { type: 'subrule', id: '601.7a', text: 'Overwatch shots interrupt the triggering movement and resolve before it continues.' },
    { type: 'subrule', id: '601.7b', text: 'Focus is a unit Status Effect.' },

    // 602. Secondary Orders
    { type: 'subsection', id: '602', title: 'Secondary Orders' },
    { type: 'rule', id: '602.1', text: 'A Secondary Order is spent to perform one of the following Secondary Actions during the Secondary Phase.' },
    { type: 'rule', id: '602.2', text: 'Relocate: Move a unit 1 . Cannot be used by units with Movement (M) of 1 or less, or by units that have already moved this Turn.' },
    { type: 'rule', id: '602.3', text: 'Consolidate: Choose an allied unit. Move up to 2 units into that allied unit\'s Tile. Those moving units may only perform 1 Movement Sub-Action each.' },
    { type: 'rule', id: '602.4', text: 'Occupy: Capture a Building by turning its pips to your color. Cannot be used by a unit that has already used a Capture action (Conquer or Occupy) this Turn.' },
    { type: 'rule', id: '602.5', text: 'Fire: Shoot a single Weapon at a valid target. This shot\'s Penetration Check Objective is capped at 9+ when Rolling Up and 4- when Rolling Down. Cannot be used by a unit that has already shot or moved this Turn.' },

  // ══════════════════════════════════════════════════════════════════════════
  // 7. MOVEMENT
  // ══════════════════════════════════════════════════════════════════════════
  { type: 'section', id: '7', title: 'Movement' },

    // 700. General
    { type: 'subsection', id: '700', title: 'General' },
    { type: 'rule', id: '700.1', text: 'Moving a unit is done by performing a number of Movement Sub-Actions (MSAs) as specified by the Action or ability causing the movement.' },
    { type: 'rule', id: '700.2', text: 'An MSA is legal only if it observes all applicable restrictions and, at the end of its resolution, the unit does not overlap any other unit.' },
    { type: 'rule', id: '700.3', text: 'A unit cannot move if all destinations available to it would result in an illegal overlap. If it has no legal MSA available, it simply does not move.' },

    // 701. Freedom of Movement
    { type: 'subsection', id: '701', title: 'Freedom of Movement' },
    { type: 'rule', id: '701.1', text: 'Freedom of Movement (FM) is a movement type. For each MSA, the unit moves from its current Slot to any other Slot in its current Tile or any directly adjacent Tile.' },
    { type: 'rule', id: '701.2', text: 'There are no additional directional restrictions on FM movement.' },

    // 702. Directional Movement
    { type: 'subsection', id: '702', title: 'Directional Movement' },
    { type: 'rule', id: '702.1', text: 'Directional Movement (DM) is a movement type. For each MSA, the unit performs a combination of a Forward and a Turn, in any order. Either component may be skipped, allowing a unit to perform only a Forward or only a Turn.' },
    { type: 'rule', id: '702.2', text: 'Forward: the unit moves from its current Tile to the Tile directly in front of it, occupying the corresponding Slots. If the unit has more than one forward-facing direction, it may choose either.' },
    { type: 'rule', id: '702.3', text: 'Turn: the unit rotates one Slot-position clockwise or counter-clockwise within its current Tile.' },
    { type: 'rule', id: '702.4', text: 'Heavy Vehicle restriction: when moving a Heavy Vehicle, a Forward cannot be performed after a Turn within the same MSA. A Heavy Vehicle may still perform a Forward before a Turn in the same MSA.' },

    // 703. Movement by Unit Type
    { type: 'subsection', id: '703', title: 'Movement by Unit Type' },
    { type: 'rule', id: '703.1', text: 'Infantry units use Freedom of Movement with no additional restrictions.' },
    { type: 'rule', id: '703.2', text: 'Vehicle units use Directional Movement, with the Heavy Vehicle restriction (see rule 702.4) applying to Heavy Vehicles.' },
    { type: 'rule', id: '703.3', text: 'Fortifications cannot move.' },
    { type: 'rule', id: '703.4', text: 'Supports are not deployed on the battlefield and do not move.' },

    // 704. Transports
    { type: 'subsection', id: '704', title: 'Transports' },
    { type: 'rule', id: '704.1', text: 'Transports are special units with the Transport keyword that can carry one Infantry unit inside them.' },
    { type: 'rule', id: '704.2', text: 'Infantry can enter a Transport using the Embark Primary Action and exit using the Disembark Primary Action.' },
    { type: 'rule', id: '704.3', text: 'While an Infantry unit is inside a Transport, it cannot be targeted by any shots, including shots with the Blast keyword.' },
    { type: 'rule', id: '704.4', text: 'When a Transport takes damage, each Infantry unit inside it suffers a 10+ Wound.' },
    { type: 'rule', id: '704.5', text: 'Infantry inside a Transport cannot perform any actions until they Disembark.' },

  // ══════════════════════════════════════════════════════════════════════════
  // 8. SHOOTING AND DAMAGE
  // ══════════════════════════════════════════════════════════════════════════
  { type: 'section', id: '8', title: 'Shooting and Damage' },

    // 800. Damage Types
    { type: 'subsection', id: '800', title: 'Damage Types' },
    { type: 'rule', id: '800.1', text: 'There are four types of damage in Lead Ledger: Shots, Precise Shots, Wounds, and Mortal Wounds.' },
    { type: 'rule', id: '800.2', text: 'Shot: fired by most weapons. Shots can miss and must penetrate armor to deal damage. A Shot uses a Penetration Check, not a Damage Check.' },
    { type: 'rule', id: '800.3', text: 'Precise Shot: made by weapons with the Precision keyword. Precise Shots always hit, with no Evasion Check being made. They still require a Penetration Check.' },
    { type: 'rule', id: '800.4', text: 'Wound: usually caused by abilities. Wounds use a variable Damage Check as described in the ability text. Wounds can be evaded. Written as "N± Wounds", where N± is the Check Objective.' },
    { type: 'rule', id: '800.5', text: 'Mortal Wound: certain abilities deal Mortal Wounds. These cannot be evaded; no Evasion Check is made. Written as "N± Mortal Wounds", where N± is the Check Objective.' },

    // 801. Reading Shots
    { type: 'subsection', id: '801', title: 'Reading Shots' },
    { type: 'rule', id: '801.1', text: 'Weapon Penetration: every weapon lists a Penetration Check Objective for each Armor Size. This value is the target a player must meet or beat when resolving a Penetration Check.' },
    { type: 'rule', id: '801.2', text: 'Armor Size: the armor size of the target — Unarmored (N), Light (L), Medium (M), or Heavy (H). This determines which Penetration value is used from the weapon\'s statline.' },
    { type: 'rule', id: '801.3', text: 'Ammo Type: determined by the weapon\'s name (e.g. "HEAT", "APFSDS"). If unlisted, the ammo type is ST by default. The ammo type determines how Extra Armor interacts with the shot.' },
    { type: 'rule', id: '801.4', text: 'Extra Armor: some units have Extra Armor characteristics that modify the Penetration Check. The modifier depends on both the ammo type and the extra armor type, as listed on the Extra Armors Table.' },
    { type: 'subrule', id: '801.4a', text: 'Extra Armor modifiers that are marked to be ignored when Rolling Down are not applied if the Penetration Check is a Rolling Down check (using a - symbol).' },
    { type: 'rule', id: '801.5', text: 'AP (Armour Penetration) Modifiers: bonuses or penalties applied to the Penetration Check roll. AP modifiers may be applied to a single shot, all shots from a specific weapon, or all shots made by a unit, as stated by the source.' },
    { type: 'rule', id: '801.6', text: 'Weapon Penetration interacts with Armor Size to set the base Check Objective. Ammo Type interacts with Extra Armor to apply additional AP modifiers on top.' },

    // 802. Resolving Damage
    { type: 'subsection', id: '802', title: 'Resolving Damage' },
    { type: 'rule', id: '802.1', text: 'Resolve all damage using the following steps, in order.' },
    { type: 'rule', id: '802.2', text: 'Step 1 — Targeting (Shots only): choose an enemy unit within the weapon\'s Range and within Line of Sight. That unit becomes the Target.' },
    { type: 'rule', id: '802.3', text: 'Step 2 — Evasion: if applicable, the Target makes an Evasion Check. The Check Objective is the target unit\'s Dodge value minus the attacking unit\'s Accuracy value, rolling down. On a success, the damage misses and resolution ends. On a failure, the damage proceeds.' },
    { type: 'subrule', id: '802.3a', text: 'Precise Shots skip the Evasion step entirely.' },
    { type: 'subrule', id: '802.3b', text: 'Mortal Wounds skip the Evasion step entirely.' },
    { type: 'rule', id: '802.4', text: 'Step 3 — Check: make the appropriate check.' },
    { type: 'subrule', id: '802.4a', text: 'For a Shot or Precise Shot: make a Penetration Check. The Check Objective is given by the weapon\'s Penetration value against the target\'s Armor Size, adding all applicable AP modifiers. On a failure, the shot does not penetrate and deals no damage.' },
    { type: 'subrule', id: '802.4b', text: 'For a Wound or Mortal Wound: make a Damage Check with the Objective stated in the ability description. On a failure, the Wound deals no damage.' },
    { type: 'rule', id: '802.5', text: 'Step 4 — Health: if the damage passes all checks, the Target loses 1 Health.' },

    // 803. Extra Armors Table
    { type: 'subsection', id: '803', title: 'Extra Armors Table' },
    { type: 'rule', id: '803.1', text: 'The Extra Armors Table defines how each Extra Armor type modifies the AP of a shot, based on the ammo type used. Modifiers that show "ignore if rolling down" are not applied when the Penetration Check is a rolling-down check.' },
    { type: 'rule', id: '803.2', text: 'Sloped: -2 AP against ST and AC. No effect against HESH, HEAT, T-HEAT, APFSDS, or ATGM. -2 AP against HER. Ignore if rolling down.' },
    { type: 'rule', id: '803.3', text: 'Composite: -2 AP against ST. -4 AP against AC. -2 AP against HESH, HEAT, T-HEAT, and APFSDS. -4 AP against HER. No effect against ATGM. Ignore if rolling down.' },
    { type: 'rule', id: '803.4', text: 'ERA (Explosive Reactive Armor): -4 AP against ST, AC, HESH, HEAT, and APFSDS. No effect against T-HEAT. -8 AP against HER. -2 AP against ATGM. ERA has only 2 uses per battle; after both uses are spent, it provides no further modifier. Ignore if rolling down.' },
    { type: 'rule', id: '803.5', text: 'NERA (Non-Explosive Reactive Armor): No effect against ST, AC, or ATGM. -2 AP against HESH, HEAT, T-HEAT, and APFSDS. -4 AP against HER. Ignore if rolling down.' },
    { type: 'rule', id: '803.6', text: 'Spaced: -2 AP against ST, AC, HEAT, and T-HEAT. No effect against HESH, APFSDS, or ATGM. -2 AP against HER. Ignore if rolling down.' },
    { type: 'rule', id: '803.7', text: 'Slat: No effect against ST, AC, APFSDS, or ATGM. -2 AP against HESH, HEAT, and HER (the HEAT and HER values use the half-circle modifier). -4 AP against HER. Ignore if rolling down.' },
    { type: 'rule', id: '803.8', text: 'APS (Active Protection System): Grants a 2/4 Dodge bonus (2 against half-circle entries, 4 against full-circle entries). APS is NOT ignored when rolling down, unlike other Extra Armor types.' },

  // ══════════════════════════════════════════════════════════════════════════
  // 9. COMMANDS, ABILITIES, AND EFFECTS
  // ══════════════════════════════════════════════════════════════════════════
  { type: 'section', id: '9', title: 'Commands, Abilities, and Effects' },

    // 900. Commands
    { type: 'subsection', id: '900', title: 'Commands' },
    { type: 'rule', id: '900.1', text: 'Commands are special actions players may take by spending Command Points (CP). They are not tied to a specific unit and do not require an Order.' },
    { type: 'rule', id: '900.2', text: 'Commands come from two sources: Generic Commands, which are available to all players, and Regiment Commands, which are provided by specific Regiments and are only available if at least one unit from that Regiment is deployed or in Reserves.' },
    { type: 'rule', id: '900.3', text: 'A Command may only be used at the timing stated in its entry.' },
    { type: 'rule', id: '900.4', text: 'Each Command lists: Cost (in CP), When (the timing it can be used), Targets (what it affects), and Effects (what it does).' },

    // 901. Generic Commands
    { type: 'subsection', id: '901', title: 'Generic Commands' },
    { type: 'rule', id: '901.1', text: 'Generic Commands are available to all players regardless of regiment composition.' },
    { type: 'rule', id: '901.2', text: 'Runover — Cost: 1 CP. When: after an allied Medium or Heavy Vehicle has used Advance. Targets: that allied Vehicle and enemy Infantry units on the same Tile. Effect: each targeted enemy unit suffers a number of 10+ Wounds equal to the Vehicle\'s Health. This total increases by 2 if the Vehicle is Heavy, and decreases by 2 for each Armor Size the enemy has above Unarmored. This Command cannot deal more than 4 damage total.' },
    { type: 'rule', id: '901.3', text: 'Sabotage — Cost: 1 CP + 1 Minor Action. When: as a Minor Action. Targets: an allied Infantry unit and an enemy Vehicle unit on the same Tile as that Infantry. Effect: the enemy Vehicle suffers a number of 9+ Mortal Wounds equal to the allied Infantry\'s Health. This Command always deals at least 1 damage.' },
    { type: 'rule', id: '901.4', text: 'Emergency Reload — Cost: 1 CP. When: any time on your Turn. Targets: an allied unit that has at least one Loading Weapon. Effect: immediately restore all Ammo to all Loading Weapons on that unit.' },
    { type: 'rule', id: '901.5', text: 'Commander\'s Luck — Cost: 1 CP. When: after you make a Penetration Check, Damage Check, or Evasion Check for an allied unit. Targets: that allied unit. Effect: re-roll that check.' },
    { type: 'rule', id: '901.6', text: 'Prepared Shot — Cost: 1 CP. When: at the end of your Turn. Targets: an allied unit. Effect: that unit cannot move on its next Turn. In exchange, all of that unit\'s Weapons gain the Precision keyword for your next Turn.' },

    // 902. Schemes
    { type: 'subsection', id: '902', title: 'Schemes' },
    { type: 'rule', id: '902.1', text: 'Each Regiment provides one Scheme. A player must choose which Scheme to use at the start of the game (see rule 104.4) and cannot change it during play.' },
    { type: 'rule', id: '902.2', text: 'A Scheme is a conditional bonus that activates when its stated requirements are met, at the timing stated in its entry.' },
    { type: 'rule', id: '902.3', text: 'Every Scheme has a number of cycles to activate, called its Period. A Scheme activates at the end of its Period, then resets its timer.' },

    // 903. Abilities
    { type: 'subsection', id: '903', title: 'Abilities' },
    { type: 'rule', id: '903.1', text: 'Abilities are special rules associated with individual Assets, Regiment Rules, or other game objects. They are described in that object\'s entry.' },
    { type: 'rule', id: '903.2', text: 'Abilities are categorized by their activation type: Passive (always active), Triggered (activate automatically when their condition is met), and Activated (require the controller to spend an Order or another cost to use).' },
    { type: 'rule', id: '903.3', text: 'Passive abilities are always in effect and do not need to be activated. They cannot be responded to.' },
    { type: 'rule', id: '903.4', text: 'Triggered abilities are placed on the Stack when their trigger condition is met.' },
    { type: 'rule', id: '903.5', text: 'Activated abilities must be explicitly used by their controller at a legal time and by paying any stated cost.' },
    { type: 'subrule', id: '903.5a', text: 'An activated ability that is used "as an Action" has the inherent cost of that type of Action and the timing associated with that Action.' },

    // 904. Replacement Effects
    { type: 'subsection', id: '904', title: 'Replacement Effects' },
    { type: 'rule', id: '904.1', text: 'Some effects or abilities replace certain events entirely. These are typically indicated by the word "instead" or "skip".' },
    { type: 'rule', id: '904.2', text: 'When an event is replaced, the original event does not happen. Any ability or trigger that would normally activate from that event also does not activate.' },
    { type: 'rule', id: '904.3', text: 'If an event is skipped, it is treated as if nothing happened in its place.' },
    { type: 'rule', id: '904.4', text: 'A replacement effect cannot apply to itself. A replacement effect also cannot be triggered by another replacement effect that it originally caused.' },

];
