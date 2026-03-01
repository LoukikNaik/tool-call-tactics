// The Recovery Protocol - Demo Scenario
// Demonstrates agentic harnesses: each room restricts which tool categories are available

export const scenario = {
  id: 'recovery_protocol',
  title: 'THE RECOVERY PROTOCOL',
  briefing: `PRIORITY ALERT — SECURITY LOCKDOWN DETECTED

A routine security sweep triggered an automated lockdown, sealing the backup encryption key inside Server Room B.

As an AI maintenance agent, your mission is to navigate the facility, gather intel, locate access tools, and retrieve the key.

Each area runs a different TOOL HARNESS — a set of constraints that determines which actions you can perform. Choose your moves wisely.

Think before you act. Observe before you move. Every action counts.`,
  optimalMoves: 13,

  // Harness definitions — each room constrains available tool categories
  harnesses: {
    corridor: {
      name: 'FIELD-OPS',
      tools: ['OBSERVE', 'EXAMINE', 'USE', 'NAVIGATE'],
      color: '#00ff88',
      description: 'Standard field operations. Full interaction with physical objects.',
    },
    control_room: {
      name: 'DIAGNOSTICS',
      tools: ['OBSERVE', 'SEARCH', 'ACCESS', 'NAVIGATE'],
      color: '#00ccff',
      description: 'Diagnostic mode. Can search containers and access digital systems.',
    },
    server_room: {
      name: 'EXTRACTION',
      tools: ['OBSERVE', 'INSPECT', 'EXTRACT', 'NAVIGATE'],
      color: '#ffaa00',
      description: 'Secure extraction mode. Can inspect hardware and extract assets.',
    },
  },

  rooms: {
    corridor: {
      name: 'CORRIDOR',
      description: 'A dimly lit corridor with flickering overhead lights. Cables run along the ceiling.',
      objects: ['Notice Board', 'Utility Cabinet', 'Control Room Door', 'Server Room Door'],
    },
    control_room: {
      name: 'CONTROL ROOM',
      description: 'A small room humming with monitoring equipment. Screens cast a blue glow across the walls.',
      objects: ['Security Terminal', 'Desk with Drawer'],
    },
    server_room: {
      name: 'SERVER ROOM',
      description: 'Rows of humming server racks fill the cold room. Status LEDs blink in rhythmic patterns.',
      objects: ['Rack #1', 'Rack #2', 'Rack #3', 'Rack #4'],
    },
  },

  initialState: {
    currentRoom: 'corridor',
    inventory: [],
    flags: {},
    moveCount: 0,
    log: [],
    completed: false,
  },
};

// Room ASCII art based on state
export function getRoomArt(room, flags) {
  if (room === 'corridor') {
    const cab = flags.cabinet_unlocked ? 'OPEN' : 'LOCK';
    const srv = flags.server_door_unlocked ? '    ' : ' \u{1F512} ';
    return [
      '\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557',
      '\u2551       C O R R I D O R        \u2551',
      '\u2551  \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510    \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510  \u2551',
      '\u2551  \u2502 NOTICE \u2502    \u2502 UTILITY  \u2502  \u2551',
      '\u2551  \u2502 BOARD  \u2502    \u2502 CABINET  \u2502  \u2551',
      `\u2551  \u2502 \u2592\u2592\u2592\u2592\u2592\u2592 \u2502    \u2502  [${cab}]  \u2502  \u2551`,
      '\u2551  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518    \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518  \u2551',
      '\u2551                              \u2551',
      '\u2551  \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510    \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510  \u2551',
      '\u2551  \u2502  CTRL  \u2502    \u2502   SRVR   \u2502  \u2551',
      `\u2551  \u2502  ROOM  \u2502    \u2502   ROOM${srv}\u2502  \u2551`,
      '\u2551  \u2514\u2500\u2500\u2500\u2568\u2500\u2500\u2500\u2500\u2518    \u2514\u2500\u2500\u2500\u2500\u2568\u2500\u2500\u2500\u2500\u2500\u2518  \u2551',
      '\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D',
    ];
  }
  if (room === 'control_room') {
    const desk = flags.desk_searched ? '(empty)' : '       ';
    return [
      '\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557',
      '\u2551   C O N T R O L   R O O M    \u2551',
      '\u2551                              \u2551',
      '\u2551  \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510  \u250C\u2500\u2500\u2500\u2500\u2500\u2510  \u2551',
      '\u2551  \u2502 \u2591 TERMINAL \u2591 \u2502  \u2502DESK \u2502  \u2551',
      '\u2551  \u2502 \u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591 \u2502  \u2502 \u250C\u2500\u2510 \u2502  \u2551',
      `\u2551  \u2502 > _          \u2502  \u2502 ${desk}\u2502  \u2551`,
      '\u2551  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518  \u2514\u2500\u2500\u2500\u2500\u2500\u2518  \u2551',
      '\u2551                              \u2551',
      '\u2551       \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510          \u2551',
      '\u2551       \u2502 CORRIDOR \u2502          \u2551',
      '\u2551       \u2514\u2500\u2500\u2500\u2500\u2568\u2500\u2500\u2500\u2500\u2500\u2518          \u2551',
      '\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D',
    ];
  }
  if (room === 'server_room') {
    return [
      '\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557',
      '\u2551    S E R V E R   R O O M     \u2551',
      '\u2551                              \u2551',
      '\u2551  \u250C\u2500\u2500\u2510  \u250C\u2500\u2500\u2510  \u250C\u2500\u2500\u2510  \u250C\u2500\u2500\u2510    \u2551',
      '\u2551  \u250201\u2502  \u250202\u2502  \u250203\u2502  \u250204\u2502    \u2551',
      '\u2551  \u2502\u2593\u2593\u2502  \u2502\u2593\u2593\u2502  \u2502\u2593\u2593\u2502  \u2502\u2593\u2593\u2502    \u2551',
      '\u2551  \u2502\u2593\u2593\u2502  \u2502\u2593\u2593\u2502  \u2502\u2593\u2593\u2502  \u2502\u2593\u2593\u2502    \u2551',
      '\u2551  \u2502\u2593\u2593\u2502  \u2502\u2593\u2593\u2502  \u2502\u2593\u2593\u2502  \u2502\u2593\u2593\u2502    \u2551',
      '\u2551  \u2514\u2500\u2500\u2518  \u2514\u2500\u2500\u2518  \u2514\u2500\u2500\u2518  \u2514\u2500\u2500\u2518    \u2551',
      '\u2551                              \u2551',
      '\u2551       \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510          \u2551',
      '\u2551       \u2502 CORRIDOR \u2502          \u2551',
      '\u2551       \u2514\u2500\u2500\u2500\u2500\u2568\u2500\u2500\u2500\u2500\u2500\u2518          \u2551',
      '\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D',
    ];
  }
  return [];
}

// Get available actions based on current game state and room harness
export function getAvailableActions(state) {
  const { currentRoom, inventory, flags } = state;
  const harness = scenario.harnesses[currentRoom];
  const actions = [];
  const locked = []; // Actions blocked by harness

  // OBSERVE — available in all harnesses if room not yet observed
  if (!flags[`${currentRoom}_observed`]) {
    actions.push({
      id: 'observe',
      label: 'OBSERVE',
      icon: '>>',
      description: 'Scan the environment',
      category: 'OBSERVE',
    });
    return { actions, locked };
  }

  // === CORRIDOR (FIELD-OPS harness) ===
  if (currentRoom === 'corridor') {
    if (!flags.notice_board_read) {
      actions.push({
        id: 'read_notice',
        label: 'EXAMINE NOTICE BOARD',
        icon: '?>',
        description: 'Check posted information',
        category: 'EXAMINE',
      });
    }

    if (!flags.cabinet_unlocked) {
      if (inventory.includes('cabinet_key')) {
        actions.push({
          id: 'unlock_cabinet',
          label: 'USE KEY ON CABINET',
          icon: '[]',
          description: 'Unlock the utility cabinet',
          category: 'USE',
        });
      } else if (!flags.cabinet_examined) {
        actions.push({
          id: 'examine_cabinet',
          label: 'EXAMINE CABINET',
          icon: '?>',
          description: 'Inspect the utility cabinet',
          category: 'EXAMINE',
        });
      }
    }

    if (flags.cabinet_unlocked && !inventory.includes('keycard')) {
      actions.push({
        id: 'take_keycard',
        label: 'USE: TAKE KEYCARD',
        icon: '++',
        description: 'Pick up the access keycard',
        category: 'USE',
      });
    }

    if (!flags.server_door_unlocked && inventory.includes('keycard')) {
      actions.push({
        id: 'use_keycard',
        label: 'USE KEYCARD ON DOOR',
        icon: '[]',
        description: 'Swipe keycard at server room',
        category: 'USE',
      });
    }

    if (!flags.server_door_unlocked && !inventory.includes('keycard')) {
      actions.push({
        id: 'try_server_door',
        label: 'EXAMINE SERVER DOOR',
        icon: '!!',
        description: 'Check the server room entrance',
        category: 'EXAMINE',
      });
    }

    // Harness-locked actions: can't ACCESS or SEARCH here
    if (!flags.terminal_read) {
      locked.push({
        label: 'ACCESS TERMINAL',
        category: 'ACCESS',
        reason: 'ACCESS tools require DIAGNOSTICS harness (Control Room)',
      });
    }

    actions.push({
      id: 'move_control',
      label: 'GO TO CONTROL ROOM',
      icon: '->',
      description: 'Enter the control room',
      category: 'NAVIGATE',
    });

    if (flags.server_door_unlocked) {
      actions.push({
        id: 'move_server',
        label: 'GO TO SERVER ROOM',
        icon: '->',
        description: 'Enter the server room',
        category: 'NAVIGATE',
      });
    }
  }

  // === CONTROL ROOM (DIAGNOSTICS harness) ===
  if (currentRoom === 'control_room') {
    if (!flags.terminal_read) {
      actions.push({
        id: 'read_terminal',
        label: 'ACCESS TERMINAL',
        icon: '?>',
        description: 'Query the security terminal',
        category: 'ACCESS',
      });
    }

    if (!flags.desk_searched) {
      actions.push({
        id: 'search_desk',
        label: 'SEARCH DESK',
        icon: '?>',
        description: 'Search the desk drawer',
        category: 'SEARCH',
      });
    }

    if (flags.desk_searched && !inventory.includes('cabinet_key')) {
      actions.push({
        id: 'take_key',
        label: 'SEARCH: TAKE KEY',
        icon: '++',
        description: 'Pick up the brass key',
        category: 'SEARCH',
      });
    }

    // Harness-locked: can't USE items here
    if (inventory.includes('cabinet_key') && !flags.cabinet_unlocked) {
      locked.push({
        label: 'USE KEY ON CABINET',
        category: 'USE',
        reason: 'USE tools require FIELD-OPS harness (Corridor)',
      });
    }

    actions.push({
      id: 'move_corridor',
      label: 'GO TO CORRIDOR',
      icon: '->',
      description: 'Return to the corridor',
      category: 'NAVIGATE',
    });
  }

  // === SERVER ROOM (EXTRACTION harness) ===
  if (currentRoom === 'server_room') {
    if (!flags.rack3_checked) {
      actions.push({
        id: 'check_rack3',
        label: 'INSPECT RACK #3',
        icon: '?>',
        description: 'Inspect the partially open rack',
        category: 'INSPECT',
      });
    }

    if (flags.rack3_checked && !state.completed) {
      actions.push({
        id: 'take_backup_key',
        label: 'EXTRACT BACKUP KEY',
        icon: '**',
        description: 'Extract the encryption key',
        category: 'EXTRACT',
      });
    }

    // Harness-locked: can't EXAMINE or USE here
    locked.push({
      label: 'EXAMINE OBJECTS',
      category: 'EXAMINE',
      reason: 'EXAMINE tools require FIELD-OPS harness (Corridor)',
    });

    actions.push({
      id: 'move_corridor_from_server',
      label: 'GO TO CORRIDOR',
      icon: '->',
      description: 'Return to the corridor',
      category: 'NAVIGATE',
    });
  }

  return { actions, locked };
}

// Execute an action and return new state + feedback
export function executeAction(state, actionId) {
  const newState = {
    ...state,
    flags: { ...state.flags },
    inventory: [...state.inventory],
    log: [...state.log],
    moveCount: state.moveCount + 1,
  };

  let feedback = { text: '', type: 'info' };

  switch (actionId) {
    case 'observe':
      newState.flags[`${state.currentRoom}_observed`] = true;
      if (state.currentRoom === 'corridor') {
        feedback = {
          text: 'Scanning corridor... Notice board on the left wall. Locked utility cabinet on the right. Two doors ahead: Control Room (open) and Server Room (sealed).',
          type: 'info',
        };
      } else if (state.currentRoom === 'control_room') {
        feedback = {
          text: 'Scanning control room... Security terminal active on the main console. Wooden desk with a closed drawer in the corner. Single exit back to corridor.',
          type: 'info',
        };
      } else if (state.currentRoom === 'server_room') {
        feedback = {
          text: 'Scanning server room... Four server racks in a row. Rack #3 has an access panel slightly ajar. Temperature: 18\u00B0C. Exit leads back to corridor.',
          type: 'info',
        };
      }
      break;

    case 'read_notice':
      newState.flags.notice_board_read = true;
      feedback = {
        text: 'FACILITY NOTICE: "Server Room access requires Level-2 keycard. Keycards stored in utility cabinet. Cabinet key kept in Control Room desk. \u2014Maintenance Dept."',
        type: 'success',
      };
      break;

    case 'examine_cabinet':
      newState.flags.cabinet_examined = true;
      feedback = {
        text: 'A sturdy metal utility cabinet. The door is secured with a small brass lock. You need a key to open it.',
        type: 'warning',
      };
      break;

    case 'unlock_cabinet':
      newState.flags.cabinet_unlocked = true;
      newState.inventory = newState.inventory.filter(i => i !== 'cabinet_key');
      feedback = {
        text: 'The brass key fits. Click. The cabinet swings open, revealing a Level-2 access keycard inside.',
        type: 'success',
      };
      break;

    case 'take_keycard':
      newState.inventory.push('keycard');
      feedback = {
        text: 'Acquired: Level-2 Access Keycard. The server room door scanner should accept this.',
        type: 'success',
      };
      break;

    case 'use_keycard':
      newState.flags.server_door_unlocked = true;
      newState.inventory = newState.inventory.filter(i => i !== 'keycard');
      feedback = {
        text: 'BEEP. Green light. "ACCESS GRANTED \u2014 Server Room B unlocked." The heavy door slides open.',
        type: 'success',
      };
      break;

    case 'try_server_door':
      feedback = {
        text: 'The door is sealed. A keycard scanner blinks red: "LEVEL-2 ACCESS REQUIRED." You need a keycard.',
        type: 'warning',
      };
      break;

    case 'move_control':
      newState.currentRoom = 'control_room';
      feedback = { text: 'Moving to Control Room... Harness switching to DIAGNOSTICS.', type: 'move' };
      break;

    case 'move_server':
      newState.currentRoom = 'server_room';
      feedback = { text: 'Moving to Server Room... Harness switching to EXTRACTION.', type: 'move' };
      break;

    case 'read_terminal':
      newState.flags.terminal_read = true;
      feedback = {
        text: 'SECURITY LOG: "14:32 \u2014 Lockdown initiated. All keycards returned to corridor utility cabinet. Cabinet secured with brass key, stored in Control Room desk drawer."',
        type: 'success',
      };
      break;

    case 'search_desk':
      newState.flags.desk_searched = true;
      feedback = {
        text: 'You search the desk drawer. Inside: a small brass key labeled "UTIL-CAB" and some paperwork.',
        type: 'success',
      };
      break;

    case 'take_key':
      newState.inventory.push('cabinet_key');
      feedback = {
        text: 'Acquired: Brass Key (UTIL-CAB). This should open the utility cabinet in the corridor.',
        type: 'success',
      };
      break;

    case 'move_corridor':
    case 'move_corridor_from_server':
      newState.currentRoom = 'corridor';
      feedback = { text: 'Moving to Corridor... Harness switching to FIELD-OPS.', type: 'move' };
      break;

    case 'check_rack3':
      newState.flags.rack3_checked = true;
      feedback = {
        text: 'Rack #3 access panel is ajar. Inside, behind a tangle of cables, you spot a secure USB drive labeled "BACKUP-KEY-ALPHA."',
        type: 'success',
      };
      break;

    case 'take_backup_key':
      newState.inventory.push('backup_key');
      newState.completed = true;
      feedback = {
        text: 'MISSION COMPLETE. Backup encryption key retrieved. System access can now be restored.',
        type: 'victory',
      };
      break;

    default:
      feedback = { text: 'Unknown action. System error.', type: 'error' };
      break;
  }

  newState.log.push({
    move: newState.moveCount,
    action: actionId,
    label: getActionLabel(actionId),
    room: newState.currentRoom,
    ...feedback,
  });

  return { state: newState, feedback };
}

function getActionLabel(actionId) {
  const labels = {
    observe: 'OBSERVE',
    read_notice: 'EXAMINE NOTICE BOARD',
    examine_cabinet: 'EXAMINE CABINET',
    unlock_cabinet: 'USE KEY ON CABINET',
    take_keycard: 'TAKE KEYCARD',
    use_keycard: 'USE KEYCARD ON DOOR',
    try_server_door: 'EXAMINE SERVER DOOR',
    move_control: 'GO TO CONTROL ROOM',
    move_server: 'GO TO SERVER ROOM',
    read_terminal: 'ACCESS TERMINAL',
    search_desk: 'SEARCH DESK',
    take_key: 'TAKE CABINET KEY',
    move_corridor: 'GO TO CORRIDOR',
    move_corridor_from_server: 'GO TO CORRIDOR',
    check_rack3: 'INSPECT RACK #3',
    take_backup_key: 'EXTRACT BACKUP KEY',
  };
  return labels[actionId] || actionId;
}

export function calculateScore(moveCount, optimal) {
  const efficiency = Math.max(0, Math.round((optimal / moveCount) * 100));
  let grade, title;

  if (moveCount <= optimal) {
    grade = 'S';
    title = 'PERFECT AGENT';
  } else if (moveCount <= optimal + 2) {
    grade = 'A';
    title = 'SENIOR AGENT';
  } else if (moveCount <= optimal + 4) {
    grade = 'B';
    title = 'FIELD AGENT';
  } else if (moveCount <= optimal + 7) {
    grade = 'C';
    title = 'JUNIOR AGENT';
  } else {
    grade = 'D';
    title = 'TRAINEE';
  }

  return { efficiency, grade, title, moveCount, optimal };
}
