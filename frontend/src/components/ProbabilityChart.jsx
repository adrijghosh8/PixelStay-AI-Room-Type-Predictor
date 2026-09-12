import { useEffect, useState } from 'react';
import '../styles/probabilityChart.css';

export default function ProbabilityChart({ rows }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(id);
  }, [rows]);

  const sorted = [...rows].sort((a, b) => b.probability - a.probability);

  return (
    <div className="prob-chart">
      {sorted.map((row) => {
        const pct = Math.round(row.probability * 100);
        return (
          <div className="prob-chart__row" key={row.key}>
            <div className="prob-chart__label">
              <span>{row.label}</span>
              <span className="prob-chart__pct">{pct}%</span>
            </div>
            <div className="prob-chart__track">
              <div
                className="prob-chart__fill"
                style={{
                  width: animated ? `${pct}%` : '0%',
                  background: row.color,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
