import { PREDICT_ENDPOINT } from './api';

export class PredictionError extends Error {
  constructor(kind, message) {
    super(message);
    this.kind = kind; // 'network' | 'validation' | 'server' | 'malformed' | 'timeout'
  }
}

const TIMEOUT_MS = 15000;

// Calls the real FastAPI backend. No mock/simulated prediction logic lives
// here or anywhere else in the app — this is the single place a prediction
// is produced, and it always comes from the trained model via the network.
export async function requestPrediction(payload) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response;
  try {
    response = await fetch(PREDICT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      throw new PredictionError('timeout', 'The model took too long to respond.');
    }
    throw new PredictionError('network', 'Could not reach the prediction server.');
  }
  clearTimeout(timer);

  if (response.status === 422) {
    throw new PredictionError('validation', 'The server rejected the listing details.');
  }
  if (!response.ok) {
    throw new PredictionError('server', `The server returned an error (${response.status}).`);
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new PredictionError('malformed', 'The server response could not be read.');
  }

  if (
    !data ||
    typeof data.predicted_room_type !== 'string' ||
    !Array.isArray(data.Probability)
  ) {
    throw new PredictionError('malformed', 'The server response was missing expected fields.');
  }

  return data;
}
