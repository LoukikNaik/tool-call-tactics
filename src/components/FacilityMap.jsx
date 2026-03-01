import { forwardRef, useImperativeHandle, useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { scenario } from '../game/scenario';
import { CELL, MAP_W, MAP_H, REST_POSITIONS, MOVE_PATHS, interpolatePath, getDirection } from '../game/movement';
import GameCharacter from './GameCharacter';
import MapObject from './MapObject';

// Object placements
const OBJECTS = [
  { type: 'terminal', row: 2, col: 2, label: 'TRM',  room: 'control_room', w: 3, h: 2 },
  { type: 'desk',     row: 5, col: 2, label: 'DESK', room: 'control_room', w: 3, h: 2 },
  { type: 'notice',   row: 2, col: 9, label: 'NOTE', room: 'corridor',     w: 3, h: 2 },
  { type: 'cabinet',  row: 5, col: 9, label: 'CAB',  room: 'corridor',     w: 3, h: 2 },
  { type: 'rack',     row: 2, col: 19, label: '#1',  room: 'server_room',  w: 2, h: 2 },
  { type: 'rack',     row: 2, col: 22, label: '#2',  room: 'server_room',  w: 2, h: 2 },
  { type: 'rack3',    row: 5, col: 19, label: '#3',  room: 'server_room',  w: 2, h: 2 },
  { type: 'rack',     row: 5, col: 22, label: '#4',  room: 'server_room',  w: 2, h: 2 },
];

// Room floor bounds (interior)
const ROOM_FLOORS = {
  control_room: { x: 1 * CELL, y: 1 * CELL, w: 6 * CELL, h: 7 * CELL },
  corridor:     { x: 8 * CELL, y: 1 * CELL, w: 9 * CELL, h: 7 * CELL },
  server_room:  { x: 18 * CELL, y: 1 * CELL, w: 8 * CELL, h: 7 * CELL },
};

// Wall segments
const WALLS = [
  { x: 0, y: 0, w: 27 * CELL, h: CELL, type: 'outer' },
  { x: 0, y: 8 * CELL, w: 27 * CELL, h: CELL, type: 'outer' },
  { x: 0, y: CELL, w: CELL, h: 7 * CELL, type: 'outer' },
  { x: 26 * CELL, y: CELL, w: CELL, h: 7 * CELL, type: 'outer' },
  { x: 7 * CELL, y: CELL, w: CELL, h: 3 * CELL, type: 'internal' },
  { x: 7 * CELL, y: 5 * CELL, w: CELL, h: 3 * CELL, type: 'internal' },
  { x: 17 * CELL, y: CELL, w: CELL, h: 3 * CELL, type: 'internal' },
  { x: 17 * CELL, y: 5 * CELL, w: CELL, h: 3 * CELL, type: 'internal' },
];

// Door positions
const DOORS = [
  { x: 7 * CELL, y: 4 * CELL, w: CELL, h: CELL, alwaysOpen: true, lockFlag: null },
  { x: 17 * CELL, y: 4 * CELL, w: CELL, h: CELL, alwaysOpen: false, lockFlag: 'server_door_unlocked' },
];

// Room labels
const ROOM_LABELS = [
  { text: 'CTRL ROOM', room: 'control_room', x: 1 * CELL, w: 6 * CELL },
  { text: 'CORRIDOR',  room: 'corridor',     x: 8 * CELL, w: 9 * CELL },
  { text: 'SERVER RM', room: 'server_room',  x: 18 * CELL, w: 8 * CELL },
];

function useCharacterMovement(currentRoom) {
  const [charPos, setCharPos] = useState(() => REST_POSITIONS[currentRoom]);
  const [isWalking, setIsWalking] = useState(false);
  const [direction, setDirection] = useState('down');
  const animRef = useRef(null);
  const onCompleteRef = useRef(null);

  useEffect(() => {
    if (!isWalking) {
      setCharPos(REST_POSITIONS[currentRoom]);
    }
  }, [currentRoom, isWalking]);

  const startMove = useCallback((actionId, onComplete) => {
    const path = MOVE_PATHS[actionId];
    if (!path) {
      onComplete?.();
      return;
    }

    onCompleteRef.current = onComplete;
    setIsWalking(true);
    setCharPos(path[0]);

    const startTime = performance.now();
    let lastPos = path[0];

    function animate(now) {
      const elapsed = now - startTime;
      const { x, y, done } = interpolatePath(path, elapsed);

      const dx = x - lastPos.x;
      const dy = y - lastPos.y;
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        setDirection(getDirection(dx, dy));
      }
      lastPos = { x, y };

      setCharPos({ x, y });

      if (done) {
        setIsWalking(false);
        setDirection('down');
        onCompleteRef.current?.();
        onCompleteRef.current = null;
        return;
      }

      animRef.current = requestAnimationFrame(animate);
    }

    animRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return { charPos, isWalking, direction, startMove };
}

const FacilityMap = forwardRef(function FacilityMap({ currentRoom, flags }, ref) {
  const harness = scenario.harnesses[currentRoom];
  const { charPos, isWalking, direction, startMove } = useCharacterMovement(currentRoom);

  useImperativeHandle(ref, () => ({
    startMove(actionId, onComplete) {
      startMove(actionId, onComplete);
    },
  }), [startMove]);

  const objectStates = useMemo(() => {
    return OBJECTS.map(obj => {
      let state = 'default';
      if (obj.type === 'terminal' && flags.terminal_read) state = 'used';
      if (obj.type === 'desk' && flags.desk_searched) state = 'used';
      if (obj.type === 'notice' && flags.notice_board_read) state = 'used';
      if (obj.type === 'cabinet') {
        if (flags.cabinet_unlocked) state = 'open';
        else if (flags.cabinet_examined) state = 'examined';
      }
      if (obj.type === 'rack3' && flags.rack3_checked) state = 'used';
      return { ...obj, state, active: obj.room === currentRoom };
    });
  }, [currentRoom, flags]);

  return (
    <div className="facility-map-wrapper">
      <div className="map-labels" style={{ width: MAP_W }}>
        {ROOM_LABELS.map((label) => {
          const isActive = label.room === currentRoom;
          const hColor = scenario.harnesses[label.room].color;
          return (
            <div
              key={label.text}
              className={`map-room-label ${isActive ? 'label-active' : ''}`}
              style={{
                left: label.x,
                width: label.w,
                color: isActive ? hColor : undefined,
              }}
            >
              {label.text}
            </div>
          );
        })}
      </div>

      <div className="facility-map" style={{ width: MAP_W, height: MAP_H }}>
        {Object.entries(ROOM_FLOORS).map(([roomId, bounds]) => {
          const isActive = roomId === currentRoom;
          return (
            <div
              key={roomId}
              className={`room-floor ${isActive ? 'room-floor-active' : 'room-floor-dimmed'}`}
              style={{
                left: bounds.x,
                top: bounds.y,
                width: bounds.w,
                height: bounds.h,
              }}
            />
          );
        })}

        {WALLS.map((wall, i) => (
          <div
            key={`wall-${i}`}
            className={`map-wall ${wall.type === 'internal' ? 'map-wall-internal' : ''}`}
            style={{
              left: wall.x,
              top: wall.y,
              width: wall.w,
              height: wall.h,
            }}
          />
        ))}

        {DOORS.map((door, i) => {
          const isLocked = !door.alwaysOpen && !flags[door.lockFlag];
          return (
            <div
              key={`door-${i}`}
              className={`map-door ${isLocked ? 'map-door-locked' : 'map-door-open'}`}
              style={{
                left: door.x,
                top: door.y,
                width: door.w,
                height: door.h,
              }}
            >
              {isLocked && <span className="door-lock-icon">{'\u2715'}</span>}
            </div>
          );
        })}

        {objectStates.map((obj, i) => (
          <MapObject
            key={`obj-${i}`}
            type={obj.type}
            x={obj.col * CELL}
            y={obj.row * CELL}
            w={obj.w * CELL}
            h={obj.h * CELL}
            label={obj.label}
            state={obj.state}
            active={obj.active}
          />
        ))}

        <GameCharacter
          x={charPos.x}
          y={charPos.y}
          direction={direction}
          isWalking={isWalking}
          color={harness.color}
        />
      </div>

      <div className="map-legend">
        <span className="legend-item"><span className="legend-swatch legend-sw-player" /> YOU</span>
        <span className="legend-item"><span className="legend-swatch legend-sw-object" /> OBJECT</span>
        <span className="legend-item"><span className="legend-swatch legend-sw-door" /> DOOR</span>
        <span className="legend-item"><span className="legend-swatch legend-sw-locked" /> LOCKED</span>
      </div>
    </div>
  );
});

export default FacilityMap;
