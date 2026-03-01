export default function GameCharacter({ x, y, direction = 'down', isWalking = false, color = '#00ff88' }) {
  const charClass = `game-character ${isWalking ? 'char-walking' : 'char-idle'} char-${direction}`;

  return (
    <div
      className={charClass}
      style={{
        left: x - 12,
        top: y - 14,
        '--char-color': color,
      }}
    >
      <div className="char-shadow" />
      <div className="char-glow" />
      <div className="char-body" />
    </div>
  );
}
