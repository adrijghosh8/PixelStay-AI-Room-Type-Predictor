import { getClassDisplay, zipProbabilities } from '../data/classLabels';
import ProbabilityChart from './ProbabilityChart';
import '../styles/predictionResult.css';

export default function PredictionResult({ result }) {
  const top = getClassDisplay(result.predicted_room_type);
  const rows = zipProbabilities(result.Probability);
  const topProb = rows.find((r) => r.key === top.key);
  const confidencePct = topProb ? Math.round(topProb.probability * 100) : null;

  return (
    <div className="result pixel-border" role="status">
      <p className="result__header pixel-heading">Prediction Complete</p>

      <div className="result__hero">
        <span className="result__type">{top.label}</span>
        {confidencePct !== null && (
          <span className="result__confidence">
            AI Confidence <strong>{confidencePct}%</strong>
          </span>
        )}
      </div>

      <div className="result__chart">
        <ProbabilityChart rows={rows} />
      </div>
    </div>
  );
}
