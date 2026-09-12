import '../styles/predictButton.css';

export default function PredictButton({ onClick, disabled, loading }) {
  return (
    <button className="predict-btn" onClick={onClick} disabled={disabled || loading} type="submit">
      <span aria-hidden="true">⚡</span> {loading ? 'PREDICTING…' : 'PREDICT ROOM TYPE'}
    </button>
  );
}
