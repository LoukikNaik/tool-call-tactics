import { useState, useCallback, useRef } from 'react';
import IntroScreen from './components/IntroScreen';
import GameScreen from './components/GameScreen';
import VictoryScreen from './components/VictoryScreen';
import { scenario, executeAction } from './game/scenario';

export default function App() {
  const [phase, setPhase] = useState('intro');
  const [gameState, setGameState] = useState(scenario.initialState);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerStart = useRef(null);

  const handleStart = useCallback(() => {
    setGameState({ ...scenario.initialState, log: [], inventory: [] });
    timerStart.current = null;
    setElapsedTime(0);
    setPhase('playing');
  }, []);

  const handleAction = useCallback((actionId) => {
    if (!timerStart.current) {
      timerStart.current = Date.now();
    }

    setGameState((prev) => {
      const { state: newState } = executeAction(prev, actionId);
      if (newState.completed) {
        setElapsedTime(Date.now() - timerStart.current);
        setTimeout(() => setPhase('victory'), 1200);
      }
      return newState;
    });
  }, []);

  const handleRestart = useCallback(() => {
    setGameState({ ...scenario.initialState, log: [], inventory: [] });
    timerStart.current = null;
    setElapsedTime(0);
    setPhase('intro');
  }, []);

  return (
    <div className="app">
      <div className="crt-container">
        {phase === 'intro' && (
          <IntroScreen scenario={scenario} onStart={handleStart} />
        )}
        {phase === 'playing' && (
          <GameScreen state={gameState} onAction={handleAction} timerStart={timerStart} />
        )}
        {phase === 'victory' && (
          <VictoryScreen state={gameState} onRestart={handleRestart} elapsedTime={elapsedTime} />
        )}
      </div>
    </div>
  );
}
