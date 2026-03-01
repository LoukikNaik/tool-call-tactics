import { useState, useEffect } from 'react';
import { calculateScore, scenario } from '../game/scenario';

function formatTime(ms) {
  const totalSecs = Math.floor(ms / 1000);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

export default function VictoryScreen({ state, onRestart, elapsedTime }) {
  const [showStats, setShowStats] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const score = calculateScore(state.moveCount, scenario.optimalMoves);

  useEffect(() => {
    setTimeout(() => setShowStats(true), 800);
    setTimeout(() => setShowLog(true), 1600);
  }, []);

  const gradeColors = {
    S: '#ffd700',
    A: '#00ff88',
    B: '#00ccff',
    C: '#ffaa00',
    D: '#ff4444',
  };

  return (
    <div className="victory-screen">
      <div className="victory-content">
        <div className="victory-flash">MISSION COMPLETE</div>

        <div className="victory-divider">
          {'\u2550'.repeat(32)}
        </div>

        {showStats && (
          <div className="victory-stats">
            <div className="stat-row">
              <span className="stat-label">GRADE</span>
              <span
                className="stat-grade"
                style={{ color: gradeColors[score.grade] }}
              >
                {score.grade}
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-label">RANK</span>
              <span className="stat-value">{score.title}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">MOVES TAKEN</span>
              <span className="stat-value">{score.moveCount}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">OPTIMAL</span>
              <span className="stat-value">{score.optimal}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">EFFICIENCY</span>
              <span className="stat-value">{score.efficiency}%</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">TIME</span>
              <span className="stat-value">{formatTime(elapsedTime)}</span>
            </div>

            <div className="efficiency-bar">
              <div className="efficiency-label">
                {'['}
                <span
                  className="efficiency-fill"
                  style={{ color: gradeColors[score.grade] }}
                >
                  {'\u2588'.repeat(Math.round(score.efficiency / 5))}
                </span>
                <span className="efficiency-empty">
                  {'\u2591'.repeat(20 - Math.round(score.efficiency / 5))}
                </span>
                {']'}
              </div>
            </div>
          </div>
        )}

        {showLog && (
          <div className="victory-log">
            <div className="vlog-header">ACTION REPLAY</div>
            <div className="vlog-entries">
              {state.log.map((entry, i) => (
                <div key={i} className="vlog-entry">
                  <span className="vlog-num">#{entry.move}</span>
                  <span className="vlog-action">{entry.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {showLog && (
          <button className="restart-btn" onClick={onRestart}>
            {'[ PLAY AGAIN ]'}
          </button>
        )}
      </div>

      <div className="scanlines" />
    </div>
  );
}
