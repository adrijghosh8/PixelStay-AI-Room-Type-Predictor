import '../styles/locationScanner.css';

// NYC's rough bounding box, used only to place a dot inside the scanner —
// this is a visual aid, not a real map, and never feeds into the prediction.
const BOUNDS = {
  latMin: 40.49,
  latMax: 40.92,
  lngMin: -74.26,
  lngMax: -73.68,
};

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

export default function LocationScanner({ latitude, longitude }) {
  const lat = Number(latitude);
  const lng = Number(longitude);
  const hasFix = latitude !== '' && longitude !== '' && !Number.isNaN(lat) && !Number.isNaN(lng);

  let dotX = 50;
  let dotY = 50;
  if (hasFix) {
    const xRatio = (lng - BOUNDS.lngMin) / (BOUNDS.lngMax - BOUNDS.lngMin);
    const yRatio = (lat - BOUNDS.latMin) / (BOUNDS.latMax - BOUNDS.latMin);
    dotX = clamp(xRatio * 100, 4, 96);
    dotY = clamp((1 - yRatio) * 100, 4, 96);
  }

  return (
    <div className="scanner pixel-border">
      <div className="scanner__header">Location Scanner</div>
      <div className={`scanner__grid ${hasFix ? 'scanner__grid--active' : ''}`}>
        <div className="scanner__crosshair" style={{ left: `${dotX}%`, top: `${dotY}%` }}>
          <span className="scanner__ping" />
          <span className="scanner__dot" />
        </div>
        <div className="scanner__scanline" />
      </div>
      <dl className="scanner__coords">
        <div>
          <dt>LAT</dt>
          <dd>{latitude !== '' ? lat.toFixed(4) : '—'}</dd>
        </div>
        <div>
          <dt>LNG</dt>
          <dd>{longitude !== '' ? lng.toFixed(4) : '—'}</dd>
        </div>
      </dl>
    </div>
  );
}
