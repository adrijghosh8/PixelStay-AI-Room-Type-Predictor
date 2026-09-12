import { useMemo } from 'react';
import { mulberry32 } from '../hooks/useSeededRandom';
import { useParallax } from '../hooks/useParallax';
import '../styles/pixelCity.css';

const VIEW_W = 1600;

function generateSkyline({ seed, count, xStart, xEnd, minH, maxH, minW, maxW, baseY }) {
  const rand = mulberry32(seed);
  const buildings = [];
  let x = xStart;
  while (x < xEnd) {
    const width = minW + rand() * (maxW - minW);
    const height = minH + rand() * (maxH - minH);
    const hasAntenna = rand() > 0.75;
    const cols = Math.max(2, Math.floor(width / 14));
    const rows = Math.max(3, Math.floor(height / 16));
    const windows = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (rand() > 0.4) continue; // sparse lit windows
        windows.push({
          cx: c,
          cy: r,
          warm: rand() > 0.45,
        });
      }
    }
    buildings.push({ x, width, height, cols, rows, windows, hasAntenna, y: baseY - height });
    x += width + 3 + rand() * 10;
  }
  return buildings;
}

function Building({ b, colorDark, colorMid, windowSize = 6, gap = 8 }) {
  return (
    <g transform={`translate(${b.x}, ${b.y})`}>
      <rect width={b.width} height={b.height} fill={colorDark} />
      <rect width={b.width} height={b.height} fill={colorMid} opacity="0.25" />
      {b.hasAntenna && (
        <rect x={b.width / 2 - 1} y={-18} width="2" height="18" fill={colorDark} />
      )}
      {b.windows.map((w, i) => (
        <rect
          key={i}
          x={6 + w.cx * gap}
          y={8 + w.cy * gap}
          width={windowSize}
          height={windowSize}
          className={w.warm ? 'pc-window pc-window--warm' : 'pc-window pc-window--cyan'}
          style={{ animationDelay: `${(i % 7) * 0.9}s` }}
        />
      ))}
    </g>
  );
}

function Crane({ x, y, flip }) {
  return (
    <g transform={`translate(${x}, ${y}) ${flip ? 'scale(-1,1)' : ''}`} opacity="0.85">
      <rect x="-2" y="-90" width="4" height="90" fill="#8a5a3c" />
      <rect x="-2" y="-92" width="90" height="4" fill="#8a5a3c" />
      <rect x="-2" y="-92" width="4" height="14" fill="#8a5a3c" />
      <line x1="86" y1="-88" x2="4" y2="-60" stroke="#8a5a3c" strokeWidth="2" />
      <rect x="82" y="-60" width="3" height="26" fill="#5b3d29" />
    </g>
  );
}

function StarField({ count, seed }) {
  const stars = useMemo(() => {
    const rand = mulberry32(seed);
    return Array.from({ length: count }, () => ({
      x: rand() * 100,
      y: rand() * 55,
      size: rand() > 0.85 ? 2 : 1,
      delay: rand() * 4,
    }));
  }, [count, seed]);

  return (
    <svg className="pc-layer pc-stars" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      {stars.map((s, i) => (
        <rect
          key={i}
          x={s.x}
          y={s.y}
          width={s.size * 0.15}
          height={s.size * 0.15}
          fill="#fdfaf0"
          className="pc-twinkle"
          style={{ animationDelay: `${s.delay}s` }}
        />
      ))}
    </svg>
  );
}

export default function PixelCityBackground({ children }) {
  const parallaxRef = useParallax();

  const farSkyline = useMemo(
    () =>
      generateSkyline({
        seed: 11,
        xStart: -20,
        xEnd: VIEW_W + 20,
        minH: 90,
        maxH: 220,
        minW: 40,
        maxW: 90,
        baseY: 520,
      }),
    []
  );

  const midSkyline = useMemo(
    () =>
      generateSkyline({
        seed: 42,
        xStart: -20,
        xEnd: VIEW_W + 20,
        minH: 140,
        maxH: 300,
        minW: 60,
        maxW: 130,
        baseY: 560,
      }),
    []
  );

  return (
    <div className="pc-root" ref={parallaxRef}>
      <div className="pc-layer pc-sky" aria-hidden="true" />
      <StarField count={90} seed={7} />

      <div className="pc-layer pc-clouds" aria-hidden="true">
        <span className="pc-cloud pc-cloud--1" />
        <span className="pc-cloud pc-cloud--2" />
        <span className="pc-cloud pc-cloud--3" />
      </div>

      <svg
        className="pc-layer pc-far"
        viewBox={`0 0 ${VIEW_W} 560`}
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
      >
        {farSkyline.map((b, i) => (
          <Building key={i} b={b} colorDark="#182849" colorMid="#101a30" windowSize={4} gap={12} />
        ))}
      </svg>

      <svg
        className="pc-layer pc-mid"
        viewBox={`0 0 ${VIEW_W} 560`}
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
      >
        {midSkyline.map((b, i) => (
          <Building key={i} b={b} colorDark="#5c2e1c" colorMid="#c1502e" windowSize={6} gap={15} />
        ))}
        <Crane x={220} y={560 - 300} />
        <Crane x={1240} y={560 - 260} flip />
      </svg>

      <div className="pc-layer pc-water" aria-hidden="true">
        <div className="pc-water__shimmer" />
        <svg className="pc-boat" viewBox="0 0 32 14" aria-hidden="true">
          <rect x="2" y="6" width="28" height="5" fill="#7c3720" />
          <rect x="0" y="9" width="32" height="3" fill="#c1502e" />
          <rect x="14" y="0" width="2" height="6" fill="#3a2a1e" />
          <rect x="16" y="1" width="8" height="4" fill="#ffc65c" opacity="0.85" />
        </svg>
      </div>

      <div className="pc-vignette" aria-hidden="true" />

      <div className="pc-content">{children}</div>
    </div>
  );
}
