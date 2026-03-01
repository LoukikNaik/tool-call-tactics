// Coordinate system & movement paths for the 2D game view

export const CELL = 24;
export const MAP_W = 27 * CELL; // 648px
export const MAP_H = 9 * CELL;  // 216px

// Convert grid coordinates to pixel position (top-left corner of cell)
export function gridToPixel(col, row) {
  return { x: col * CELL, y: row * CELL };
}

// Convert grid coordinates to center of cell
export function gridToCenter(col, row) {
  return { x: col * CELL + CELL / 2, y: row * CELL + CELL / 2 };
}

// Rest positions (character center) for each room
export const REST_POSITIONS = {
  corridor: gridToCenter(13, 4),
  control_room: gridToCenter(4, 4),
  server_room: gridToCenter(21, 4),
};

// Multi-waypoint paths for movement actions
export const MOVE_PATHS = {
  move_control: [
    gridToCenter(13, 4), // corridor center
    gridToCenter(8, 4),  // approach door
    gridToCenter(7, 4),  // at door
    gridToCenter(4, 4),  // control room center
  ],
  move_server: [
    gridToCenter(13, 4), // corridor center
    gridToCenter(16, 4), // approach door
    gridToCenter(17, 4), // at door
    gridToCenter(21, 4), // server room center
  ],
  move_corridor: [
    gridToCenter(4, 4),  // control room center
    gridToCenter(6, 4),  // approach door
    gridToCenter(7, 4),  // at door
    gridToCenter(13, 4), // corridor center
  ],
  move_corridor_from_server: [
    gridToCenter(21, 4), // server room center
    gridToCenter(18, 4), // approach door
    gridToCenter(17, 4), // at door
    gridToCenter(13, 4), // corridor center
  ],
};

export const SEGMENT_DURATION = 300; // ms per waypoint segment

// Easing function
function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// Interpolate position along a multi-waypoint path
// elapsed: total ms since animation start
// Returns { x, y, done }
export function interpolatePath(path, elapsed) {
  const totalSegments = path.length - 1;
  const totalDuration = totalSegments * SEGMENT_DURATION;

  if (elapsed >= totalDuration) {
    const last = path[path.length - 1];
    return { x: last.x, y: last.y, done: true };
  }

  const segmentIndex = Math.min(
    Math.floor(elapsed / SEGMENT_DURATION),
    totalSegments - 1
  );
  const segmentElapsed = elapsed - segmentIndex * SEGMENT_DURATION;
  const t = easeInOutQuad(Math.min(segmentElapsed / SEGMENT_DURATION, 1));

  const from = path[segmentIndex];
  const to = path[segmentIndex + 1];

  return {
    x: from.x + (to.x - from.x) * t,
    y: from.y + (to.y - from.y) * t,
    done: false,
  };
}

// Determine character facing direction from movement vector
export function getDirection(dx, dy) {
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? 'right' : 'left';
  }
  if (dy !== 0) {
    return dy > 0 ? 'down' : 'up';
  }
  return 'down';
}
