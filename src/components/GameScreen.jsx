import { useRef, useEffect, useState } from 'react';
import { getAvailableActions, scenario } from '../game/scenario';
import FacilityMap from './FacilityMap';

function formatTime(ms) {
  const totalSecs = Math.floor(ms / 1000);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

const MOVE_ACTIONS = ['move_control', 'move_server', 'move_corridor', 'move_corridor_from_server'];

export default function GameScreen({ state, onAction, timerStart }) {
  const logEndRef = useRef(null);
  const mapRef = useRef(null);
  const [animatingAction, setAnimatingAction] = useState(null);
  const [isMoving, setIsMoving] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const { actions, locked } = getAvailableActions(state);

  useEffect(() => {
    if (!timerStart?.current) return;
    const id = setInterval(() => {
      setElapsed(Date.now() - timerStart.current);
    }, 1000);
    return () => clearInterval(id);
  }, [timerStart, state.moveCount]);
  const room = scenario.rooms[state.currentRoom];
  const harness = scenario.harnesses[state.currentRoom];

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.log.length]);

  const handleAction = (actionId) => {
    if (isMoving) return;

    if (MOVE_ACTIONS.includes(actionId)) {
      setIsMoving(true);
      setAnimatingAction(actionId);
      mapRef.current?.startMove(actionId, () => {
        onAction(actionId);
        setAnimatingAction(null);
        setIsMoving(false);
      });
    } else {
      setAnimatingAction(actionId);
      setTimeout(() => {
        onAction(actionId);
        setAnimatingAction(null);
      }, 200);
    }
  };

  return (
    <div className="game-screen">
      {/* Status Bar */}
      <div className="status-bar">
        <div className="status-left">
          <span className="status-label">MISSION</span>
          <span className="status-value">RECOVERY PROTOCOL</span>
        </div>
        <div className="status-center">
          <span className="status-label">LOCATION</span>
          <span className="status-value room-name">{room.name}</span>
        </div>
        <div className="status-right">
          <span className="status-label">MOVES</span>
          <span className="status-value move-count">{state.moveCount}</span>
          {timerStart?.current && (
            <>
              <span className="status-label" style={{ marginTop: 4 }}>TIME</span>
              <span className="status-value timer-value">{formatTime(elapsed)}</span>
            </>
          )}
        </div>
      </div>

      {/* Harness + Inventory Bar */}
      <div className="harness-bar">
        <div className="harness-info">
          <span className="harness-label">HARNESS:</span>
          <span className="harness-name" style={{ color: harness.color }}>
            {harness.name}
          </span>
          <span className="harness-tools">
            {harness.tools.map((tool) => (
              <span key={tool} className="harness-tool" style={{ borderColor: harness.color }}>
                {tool}
              </span>
            ))}
          </span>
        </div>
        <div className="inventory-section">
          <span className="inv-label">INV:</span>
          {state.inventory.length === 0 ? (
            <span className="inv-empty">[ empty ]</span>
          ) : (
            state.inventory.map((item) => (
              <span key={item} className="inv-item">
                [{formatItem(item)}]
              </span>
            ))
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="game-main">
        {/* Left: Room View */}
        <div className="room-panel">
          <FacilityMap
            ref={mapRef}
            currentRoom={state.currentRoom}
            flags={state.flags}
          />
          <div className="room-description">
            <p>{room.description}</p>
            {state.flags[`${state.currentRoom}_observed`] && (
              <p className="room-objects">
                Visible: {room.objects.join(' \u2502 ')}
              </p>
            )}
          </div>
          <div className="harness-desc" style={{ borderColor: harness.color }}>
            <span className="harness-desc-icon" style={{ color: harness.color }}>{'\u25C6'}</span>
            {harness.description}
          </div>
        </div>

        {/* Right: Log + Actions */}
        <div className="side-panel">
          <div className="action-log">
            <div className="log-header">ACTION LOG</div>
            <div className="log-entries">
              {state.log.length === 0 && (
                <div className="log-entry log-info">
                  <span className="log-prefix">SYS</span>
                  <span className="log-text">Agent initialized. Awaiting first command...</span>
                </div>
              )}
              {state.log.map((entry, i) => (
                <div key={i} className={`log-entry log-${entry.type}`}>
                  <span className="log-move">#{entry.move}</span>
                  <span className="log-action">{entry.label}</span>
                  <span className="log-text">{entry.text}</span>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>

          <div className="action-panel">
            <div className="action-header">
              AVAILABLE ACTIONS
              <span className="action-header-harness" style={{ color: harness.color }}>
                [{harness.name}]
              </span>
            </div>
            <div className="action-list">
              {actions.map((action) => (
                <button
                  key={action.id}
                  className={`action-btn ${animatingAction === action.id ? 'action-firing' : ''}`}
                  onClick={() => handleAction(action.id)}
                  disabled={isMoving}
                  title={action.description}
                >
                  <span className="action-icon">{action.icon}</span>
                  <span className="action-label">{action.label}</span>
                  <span className="action-cat">{action.category}</span>
                </button>
              ))}
              {locked.map((item, i) => (
                <div key={`locked-${i}`} className="action-btn action-locked" title={item.reason}>
                  <span className="action-icon">XX</span>
                  <span className="action-label">{item.label}</span>
                  <span className="action-locked-reason">{item.reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="scanlines" />
    </div>
  );
}

function formatItem(item) {
  return item.replace(/_/g, ' ').toUpperCase();
}
