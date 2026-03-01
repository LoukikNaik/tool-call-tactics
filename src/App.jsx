import { useState, useCallback } from 'react';
import IntroScreen from './components/IntroScreen';
import GameScreen from './components/GameScreen';
import VictoryScreen from './components/VictoryScreen';
import { scenario, executeAction } from './game/scenario';

export default function App() {
  const [phase, setPhase] = useState('intro');
  const [gameState, setGameState] = useState(scenario.initialState);

  const handleStart = useCallback(() => {
    setGameState({ ...scenario.initialState, log: [], inventory: [] });
    setPhase('playing');
  }, []);

  const handleAction = useCallback((actionId) => {
    setGameState((prev) => {
      const { state: newState } = executeAction(prev, actionId);
      if (newState.completed) {
        setTimeout(() => setPhase('victory'), 1200);
      }
      return newState;
    });
  }, []);

  const handleRestart = useCallback(() => {
    setGameState({ ...scenario.initialState, log: [], inventory: [] });
    setPhase('intro');
  }, []);

  return (
    <div className="app">
      <div className="crt-container">
        {phase === 'intro' && (
          <IntroScreen scenario={scenario} onStart={handleStart} />
        )}
        {phase === 'playing' && (
          <GameScreen state={gameState} onAction={handleAction} />
        )}
        {phase === 'victory' && (
          <VictoryScreen state={gameState} onRestart={handleRestart} />
        )}
      </div>
    </div>
  );
}
