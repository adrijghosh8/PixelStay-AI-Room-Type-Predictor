import { useEffect, useState } from 'react';
import '../styles/loadingState.css';

const MESSAGES = [
  'SCANNING LISTING...',
  'ANALYZING FEATURES...',
  'RUNNING MODEL...',
  'CALCULATING RESULT...',
];

// Purely visual. These messages cycle on a timer while the single real
// POST /predict request is in flight — no extra network calls are made here.
export default function LoadingState() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 900);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="loading" role="status" aria-live="polite">
      <div className="loading__bar">
        <div className="loading__bar-fill" />
      </div>
      <p className="loading__message pixel-heading">{MESSAGES[index]}</p>
    </div>
  );
}
