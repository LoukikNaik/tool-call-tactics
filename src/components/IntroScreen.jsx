import { useState, useEffect, useRef } from 'react';

export default function IntroScreen({ scenario, onStart }) {
  const [showBriefing, setShowBriefing] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [titleVisible, setTitleVisible] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const t1 = setTimeout(() => setTitleVisible(true), 300);
    const t2 = setTimeout(() => setShowBriefing(true), 1000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (!showBriefing || skipped) return;
    const text = scenario.briefing;
    let i = 0;
    intervalRef.current = setInterval(() => {
      setTypedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(intervalRef.current);
    }, 18);
    return () => clearInterval(intervalRef.current);
  }, [showBriefing, skipped, scenario.briefing]);

  const briefingDone = typedText.length >= scenario.briefing.length;

  const handleSkip = () => {
    if (!briefingDone) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setSkipped(true);
      setShowBriefing(true);
      setTitleVisible(true);
      setTypedText(scenario.briefing);
    }
  };

  return (
    <div className="intro-screen" onClick={handleSkip}>
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
