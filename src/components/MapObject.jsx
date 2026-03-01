export default function MapObject({ type, x, y, w, h, label, state = 'default', active = false }) {
  const className = `game-obj game-obj-${type} game-obj-state-${state} ${active ? 'game-obj-active' : 'game-obj-inactive'}`;

  return (
    <div className={className} style={{ left: x, top: y, width: w, height: h }}>
      {renderObject(type, state, label)}
    </div>
  );
}

function renderObject(type, state, label) {
  switch (type) {
    case 'terminal':
      return (
        <>
          <div className="obj-monitor">
            <div className="obj-monitor-bezel">
              <div className="obj-screen">
                <div className="obj-screen-content" />
                <div className="obj-scanline" />
              </div>
            </div>
            <div className="obj-monitor-chin" />
          </div>
          <div className="obj-monitor-neck" />
          <div className="obj-monitor-foot" />
          <span className="game-obj-label">{label}</span>
        </>
      );
    case 'desk':
      return (
        <>
          <div className="obj-desk-surface">
            <div className="obj-desk-item-1" />
            <div className="obj-desk-item-2" />
          </div>
          <div className="obj-desk-front">
            <div className="obj-desk-drawer">
              <div className="obj-desk-handle" />
            </div>
          </div>
          <div className="obj-desk-leg-l" />
          <div className="obj-desk-leg-r" />
          <span className="game-obj-label">{label}</span>
        </>
      );
    case 'notice':
      return (
        <>
          <div className="obj-board-frame">
            <div className="obj-board-cork">
              <div className="obj-note obj-note-1">
                <div className="obj-note-line" />
                <div className="obj-note-line" />
                <div className="obj-note-line short" />
              </div>
              <div className="obj-note obj-note-2">
                <div className="obj-note-line" />
                <div className="obj-note-line short" />
              </div>
              <div className="obj-pin obj-pin-1" />
              <div className="obj-pin obj-pin-2" />
              <div className="obj-pin obj-pin-3" />
            </div>
          </div>
          <span className="game-obj-label">{label}</span>
        </>
      );
    case 'cabinet':
      return (
        <>
          <div className="obj-cab-body">
            <div className="obj-cab-door obj-cab-door-l">
              <div className={`obj-cab-led ${state === 'open' ? 'led-on' : 'led-off'}`} />
            </div>
            <div className="obj-cab-seam" />
            <div className="obj-cab-door obj-cab-door-r">
              <div className="obj-cab-handle" />
            </div>
            <div className="obj-cab-vent" />
          </div>
          <span className="game-obj-label">{label}</span>
        </>
      );
    case 'rack':
      return (
        <>
          <div className="obj-rack-chassis">
            <div className="obj-rack-top-rail" />
            <div className="obj-rack-bays">
              {[0, 1, 2, 3].map(row => (
                <div key={row} className="obj-rack-bay">
                  <div className="obj-rack-led-strip">
                    {[0, 1, 2].map(col => (
                      <div key={col} className="obj-rack-led" style={{ animationDelay: `${(row * 3 + col) * 0.2}s` }} />
                    ))}
                  </div>
                  <div className="obj-rack-bay-line" />
                </div>
              ))}
            </div>
            <div className="obj-rack-vent-grille" />
          </div>
          <span className="game-obj-label">{label}</span>
        </>
      );
    case 'rack3':
      return (
        <>
          <div className="obj-rack-chassis obj-rack3-chassis">
            <div className="obj-rack-top-rail obj-rack3-rail" />
            <div className="obj-rack-bays">
              {[0, 1, 2, 3].map(row => (
                <div key={row} className="obj-rack-bay">
                  <div className="obj-rack-led-strip">
                    {[0, 1, 2].map(col => (
                      <div key={col} className="obj-rack3-led" style={{ animationDelay: `${(row * 3 + col) * 0.25}s` }} />
                    ))}
                  </div>
                  <div className="obj-rack-bay-line" />
                </div>
              ))}
            </div>
            <div className="obj-rack-vent-grille" />
            <div className="obj-rack3-ajar" />
          </div>
          <span className="game-obj-label">{label}</span>
        </>
      );
    default:
      return <span className="game-obj-label">{label}</span>;
  }
}
