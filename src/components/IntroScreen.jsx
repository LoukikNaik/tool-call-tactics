import { useState, useEffect } from 'react';

export default function IntroScreen({ scenario, onStart }) {
  const [showBriefing, setShowBriefing] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setTitleVisible(true), 300);
    setTimeout(() => setShowBriefing(true), 1000);
  }, []);

  useEffect(() => {
    if (!showBriefing) return;
    const text = scenario.briefing;
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 18);
    return () => clearInterval(interval);
  }, [showBriefing, scenario.briefing]);

  const briefingDone = typedText.length >= scenario.briefing.length;

  return (
    <div className="intro-screen">
      <div className="intro-content">
        <div className="intro-top-label">{'< TOOL-CALL TACTICS >'}</div>

        <h1 className={`intro-title ${titleVisible ? 'visible' : ''}`}>
          <span className="title-line">TOOL-CALL</span>
          <span className="title-line accent">TACTICS</span>
        </h1>

        <div className="intro-subtitle">THINK LIKE AN AI AGENT</div>

        <div className="intro-divider">
          {'════════════════════════════════'}
        </div>

        <div className="scenario-card">
          <div className="scenario-header">
            <span className="scenario-label">SCENARIO 01</span>
            <span className="scenario-title">{scenario.title}</span>
          </div>

          <div className="briefing-box">
            <div className="briefing-text">
              {typedText}
              {!briefingDone && <span className="cursor">_</span>}
            </div>
          </div>

          {briefingDone && (
            <div className="intro-stats">
              <span>OPTIMAL: {scenario.optimalMoves} MOVES</span>
              <span>ROOMS: {Object.keys(scenario.rooms).length}</span>
              <span>DIFFICULTY: ██░░░</span>
            </div>
          )}
        </div>

        <button
          className={`start-btn ${briefingDone ? 'visible' : ''}`}
          onClick={onStart}
          disabled={!briefingDone}
        >
          {'[ START MISSION ]'}
        </button>

        <div className="intro-hint">
          Observe before you act. Every move counts.
        </div>
      </div>

      <div className="scanlines" />
    </div>
  );
}
